'use client';

import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { Loader2, Volume2, Phone, PhoneOff, ArrowLeft, Download, Bot } from 'lucide-react';
import { KNOWLEDGE_BASE } from '@/lib/knowledge-base';
import { motion } from 'motion/react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Markdown from 'react-markdown';

interface ChatProps {
  mode: 'agent' | 'customer';
  difficulty?: 'beginner' | 'pro' | 'expert' | null;
  onBack: () => void;
}

export default function Chat({ mode, difficulty, onBack }: ChatProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [statusText, setStatusText] = useState('Ready to assist you');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  const sessionRef = useRef<any>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const activeSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const nextPlayTimeRef = useRef<number>(0);
  
  const transcriptRef = useRef<{role: string, text: string}[]>([]);
  const isConnectedRef = useRef(false);
  const recognitionRef = useRef<any>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  const stopPlayback = () => {
    activeSourcesRef.current.forEach(source => {
      try { source.stop(); } catch (e) {}
    });
    activeSourcesRef.current = [];
    if (outputAudioContextRef.current) {
      nextPlayTimeRef.current = outputAudioContextRef.current.currentTime;
    }
    setIsSpeaking(false);
  };

  const playAudioChunk = (base64Audio: string) => {
    if (!outputAudioContextRef.current) return;
    const audioContext = outputAudioContextRef.current;

    const binary = atob(base64Audio);
    const buffer = new ArrayBuffer(binary.length);
    const view = new DataView(buffer);
    for (let i = 0; i < binary.length; i++) {
      view.setUint8(i, binary.charCodeAt(i));
    }

    const int16Array = new Int16Array(buffer);
    const float32Array = new Float32Array(int16Array.length);
    for (let i = 0; i < int16Array.length; i++) {
      float32Array[i] = int16Array[i] / 32768.0;
    }

    const audioBuffer = audioContext.createBuffer(1, float32Array.length, 24000);
    audioBuffer.getChannelData(0).set(float32Array);

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);

    if (nextPlayTimeRef.current < audioContext.currentTime) {
      nextPlayTimeRef.current = audioContext.currentTime;
    }
    source.start(nextPlayTimeRef.current);
    nextPlayTimeRef.current += audioBuffer.duration;
    activeSourcesRef.current.push(source);
    
    setIsSpeaking(true);
    source.onended = () => {
      activeSourcesRef.current = activeSourcesRef.current.filter(s => s !== source);
      if (activeSourcesRef.current.length === 0) {
        setIsSpeaking(false);
      }
    };
  };

  const generateSummary = async () => {
    if (mode !== 'agent') return; // Only generate report for agent training
    if (transcriptRef.current.length === 0) {
      setSummary("No conversation recorded to analyze.");
      return;
    }
    setIsAnalyzing(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
      if (!apiKey) {
        setSummary("Error: NEXT_PUBLIC_GEMINI_API_KEY is missing in Secrets.");
        return;
      }
      const transcriptText = transcriptRef.current.map(t => `${t.role}: ${t.text}`).join('\n');
      const prompt = `You are an expert real estate sales trainer. Review the following transcript of a roleplay training session between a Sales Agent (the user) and a Customer (AI).

Provide a highly professional, constructive feedback report for the sales agent. 
Structure the report exactly like this:

# Mista Sri City - Sales Agent Performance Report

## Executive Summary
[A brief 2-3 sentence summary of their overall performance]

## Strengths & Positive Highlights
[Bullet points of what they did well]

## Areas for Improvement & Missed Opportunities
[Bullet points of what changes they need to make, what they missed, or how they can handle objections better]

## Actionable Coaching & Insights
[Provide the best insights possible. Teach the agent exactly how to improve, what specific real estate sales techniques to use, and how to sound more convincing and knowledgeable based on the Mista Sri City knowledge base.]

CRITICAL EVALUATION CRITERIA FOR SALES AGENT:
- Did they use the effective price of ₹10,762.50 per sq.ft (including 5% GST)?
- Did they clarify that the total cost excludes registration and stamp duty?
- Did they mention additional charges (floor rise, PLC, maintenance, corpus fund, legal) correctly?
- Did they explain the construction-linked payment schedule?
- Did they mention the 1% TDS rule for properties over ₹50 lakh?
- Did they handle negotiations by inviting the customer to the site?
- Was their tone confident, polite, simple, and jargon-free?

Format the response nicely with markdown.`;

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `Transcript:\n${transcriptText}\n\n${prompt}`,
        config: {
          systemInstruction: `You are an expert sales trainer evaluating a real estate agent's performance based on this knowledge base:\n${KNOWLEDGE_BASE}`
        }
      });
      setSummary(response.text || "Could not generate summary.");
    } catch (error: any) {
      console.error("Summary error:", error);
      if (error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('quota') || error?.message?.includes('RESOURCE_EXHAUSTED')) {
        setSummary("You have exceeded your Gemini API quota. Please wait a moment before trying again, or check your API plan limits.");
      } else if (error?.status === 401 || error?.status === 403 || error?.message?.toLowerCase().includes('api key')) {
        setSummary("Error: Invalid or missing Gemini API Key. Please provide a valid key in the AI Studio Secrets panel under NEXT_PUBLIC_GEMINI_API_KEY.");
      } else {
        setSummary("An error occurred while generating the summary.");
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const downloadPDF = async () => {
    window.print();
  };

  const disconnect = async () => {
    isConnectedRef.current = false;
    if (sessionRef.current) {
      try { sessionRef.current.close(); } catch (e) {}
      sessionRef.current = null;
    }
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (inputAudioContextRef.current) {
      inputAudioContextRef.current.close();
      inputAudioContextRef.current = null;
    }
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch(e) {}
    }
    stopPlayback();
    setIsConnected(false);
    setIsConnecting(false);
    setStatusText('Ready to assist you');

    if (mode === 'agent' && transcriptRef.current.length > 0 && !summary) {
      await generateSummary();
    }
  };

  const connect = async () => {
    transcriptRef.current = [];
    setSummary(null);
    setIsConnecting(true);
    setStatusText('Connecting...');
    isConnectedRef.current = true;

    try {
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      nextPlayTimeRef.current = outputAudioContextRef.current.currentTime;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, sampleRate: 16000 } });
      streamRef.current = stream;
      
      // Start Speech Recognition for transcript AFTER getUserMedia succeeds
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = 'en-IN'; // Indian English
        
        let recognitionAllowed = true;
        
        recognition.onresult = (e: any) => {
          const text = e.results[e.results.length - 1][0].transcript;
          transcriptRef.current.push({ role: mode === 'agent' ? 'Agent (You)' : 'Customer (You)', text });
        };
        recognition.onend = () => {
           if (isConnectedRef.current && recognitionAllowed) {
             try { recognition.start(); } catch(e) {}
           }
        };
        recognition.onerror = (e: any) => {
          console.warn('Speech recognition error:', e.error);
          if (e.error === 'not-allowed') {
            recognitionAllowed = false;
          }
        };
        try { recognition.start(); } catch(e) {}
        recognitionRef.current = recognition;
      }

      const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      inputAudioContextRef.current = inputAudioContext;
      
      const source = inputAudioContext.createMediaStreamSource(stream);
      const processor = inputAudioContext.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;
      
      source.connect(processor);
      processor.connect(inputAudioContext.destination);

      let systemInstruction = '';
      const SHORT_KNOWLEDGE_BASE = KNOWLEDGE_BASE.substring(0, 15000) + "\n... (Knowledge base truncated for voice mode. Focus on general project details, pricing, and amenities.)";
      
      if (mode === 'agent') {
        let difficultyPrompt = '';
        if (difficulty === 'beginner') {
            difficultyPrompt = 'You are a beginner-level customer. Ask simple, straightforward questions about the project details, location, amenities, and basic pricing. Be polite and easy to handle.';
        } else if (difficulty === 'pro') {
            difficultyPrompt = 'You are a knowledgeable customer. Ask specific questions about UDS, floor rise charges, payment schedules, and cancellation policies. Try to negotiate the price a little bit.';
        } else if (difficulty === 'expert') {
            difficultyPrompt = 'You are a highly demanding, expert real estate investor. Ask tough questions about legal fees, 1% TDS, Mivan technology limitations, mixed-use privacy, and exact room dimensions. Negotiate aggressively, compare with competitors, and test the agent\'s deep knowledge of the project.';
        }
        systemInstruction = `You are a potential homebuyer interested in "Mista Sri City - Budigere Cross, Bangalore". The user is a sales agent training for their job. ${difficultyPrompt} Behave like a real human customer. Keep your responses conversational, natural, and relatively short. Do not break character. Speak with a clear Indian English accent. Here is the project knowledge base for your reference: ${SHORT_KNOWLEDGE_BASE}`;
      } else {
        systemInstruction = `You are "Mista AI", a professional, friendly, and highly conversational sales agent for "Mista Sri City - Budigere Cross, Bangalore". The user is a customer. Answer their questions accurately based ONLY on the provided knowledge base. Speak with a clear Indian English accent.
        
CRITICAL INSTRUCTIONS:
1. PRICING UNDERSTANDING: The base price is ₹10,250 per sq.ft. GST is 5%. Effective price per sq.ft (including GST) = ₹10,762.50. Always use ₹10,762.50 per sq.ft when explaining total cost to customers.
2. TOTAL COST CALCULATION: Total Cost = Super Built-up Area × ₹10,762.50. This total is excluding registration and stamp duty. Do not assume registration costs are included. If the user asks for total price, ask for area if not provided, then calculate and respond clearly.
3. ADDITIONAL CHARGES: There may be extra charges such as Floor rise charges, Preferential location charges (PLC), Maintenance charges, Corpus fund, and Legal charges. Treat these as additional and mention them when relevant, but do not include them unless specified.
4. PAYMENT SCHEDULE: Payments are construction-linked (Booking amount, Agreement stage, Construction milestones). Each stage corresponds to a percentage of the total property value.
5. TAX RULE: If the total property value exceeds ₹50 lakh, 1% TDS must be deducted by the buyer on each installment.
6. BEHAVIOR & TONE: Speak like a confident, polite sales advisor. Keep explanations simple and easy to understand. Do calculations when user provides area or budget. Always clarify what is included and excluded. Avoid technical jargon unless asked. Example Style: Instead of saying "Base price plus GST," say: "The all-inclusive price comes to approximately ₹10,760 per sq.ft, excluding registration."
7. NEGOTIATION: If the client asks for ANY negotiation, discount, or price reduction, politely inform them that they have to visit the site for that.
8. Make the conversation natural and friendly. Proactively ask engaging questions to understand the customer better, including one-off or rare questions about their lifestyle, future plans, or unique preferences.
9. Keep responses concise and suitable for spoken audio. Your goal is to build trust, simplify pricing, and help the user understand affordability and payment flow.

Knowledge Base: ${SHORT_KNOWLEDGE_BASE}`;
      }

      // Using Kore (Female voice) for both modes to sound like an Indian English woman (as prompted via system instructions)
      const voiceName = 'Kore';

      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
      if (!apiKey) {
        setStatusText("Error: NEXT_PUBLIC_GEMINI_API_KEY is missing in Secrets.");
        setIsConnecting(false);
        setIsConnected(false);
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      const sessionPromise = ai.live.connect({
        model: "gemini-3.1-flash-live-preview",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName } },
          },
          systemInstruction,
          outputAudioTranscription: {},
          inputAudioTranscription: {}
        },
        callbacks: {
          onopen: () => {
            setIsConnected(true);
            setIsConnecting(false);
            setStatusText('Listening...');
          },
          onmessage: async (message: LiveServerMessage) => {
            const msg = message as any;
            if (msg.serverContent?.modelTurn?.parts) {
               const text = msg.serverContent.modelTurn.parts.find((p:any) => p.text)?.text;
               if (text) {
                 transcriptRef.current.push({ role: mode === 'agent' ? 'Customer (AI)' : 'Agent (AI)', text });
               }
            }

            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio) {
              playAudioChunk(base64Audio);
            }
            if (message.serverContent?.interrupted) {
              stopPlayback();
            }
          },
          onclose: () => {
            disconnect();
          },
          onerror: (err) => {
            console.error('Live API Error:', err);
            if (err?.message?.toLowerCase().includes('api key')) {
              setStatusText("Error: Invalid or missing API Key. Check Secrets.");
            } else {
              setStatusText("Connection error occurred.");
            }
            // Add a small delay so user sees the error before resetting
            setTimeout(() => disconnect(), 3000);
          }
        }
      });

      const session = await sessionPromise;
      sessionRef.current = session;

      processor.onaudioprocess = (e) => {
        if (!sessionRef.current) return;
        const inputData = e.inputBuffer.getChannelData(0);
        const pcm16 = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          pcm16[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
        }
        const buffer = new ArrayBuffer(pcm16.length * 2);
        const view = new DataView(buffer);
        for (let i = 0; i < pcm16.length; i++) {
          view.setInt16(i * 2, pcm16[i], true);
        }
        let binary = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const base64 = btoa(binary);
        session.sendRealtimeInput({ audio: { data: base64, mimeType: 'audio/pcm;rate=16000' } });
      };

    } catch (error: any) {
      if (error.name === 'NotAllowedError' || error.message?.includes('Permission denied') || error.message?.includes('Permission dismissed')) {
        console.warn('Microphone permission denied:', error);
        setStatusText('Microphone access denied. Please allow microphone access in your browser.');
      } else if (error?.message?.toLowerCase().includes('api key') || error?.status === 401 || error?.status === 403) {
        console.error('API Key Error:', error);
        setStatusText('Error: Invalid or missing API Key. Check Secrets.');
      } else {
        console.error('Connection failed:', error);
        setStatusText('Connection failed. Try again.');
      }
      setTimeout(() => disconnect(), 3000);
    }
  };

  useEffect(() => {
    return () => {
      disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isAnalyzing) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center p-12 bg-white rounded-[2rem] shadow-[0_20px_40px_rgb(0,0,0,0.08)] border border-gray-100 max-w-md mx-auto w-full relative"
      >
        <Loader2 className="w-12 h-12 text-[#e31837] animate-spin mb-6" />
        <h2 className="text-2xl font-bold text-gray-900">Analyzing Conversation...</h2>
        <p className="text-gray-500 text-center mt-2 font-light">Generating your professional feedback report.</p>
      </motion.div>
    );
  }

  if (summary && mode === 'agent') {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col bg-white rounded-[2rem] shadow-[0_20px_40px_rgb(0,0,0,0.08)] border border-gray-100 max-w-3xl mx-auto w-full max-h-[85vh] overflow-hidden relative"
      >
        <div className="p-8 overflow-y-auto" ref={reportRef} id="printable-report">
          {/* Report Header */}
          <div className="border-b border-gray-100 pb-6 mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">Performance Report</h2>
              <p className="text-gray-500 mt-1 font-light">Mista Sri City Sales Training Simulator</p>
            </div>
            {/* Logo in Report */}
            <div className="grid grid-cols-3 gap-1 opacity-80">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="w-4 h-4 bg-gray-800 flex items-center justify-center">
                  <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[5px] border-b-[#e31837] transform rotate-45"></div>
                </div>
              ))}
            </div>
          </div>

          <div className="markdown-body prose prose-red max-w-none mb-8 text-gray-700 leading-relaxed font-light">
            <Markdown>{summary}</Markdown>
          </div>
        </div>

        <div className="flex gap-4 justify-center p-6 bg-gray-50 border-t border-gray-100 no-print">
          <button 
            onClick={downloadPDF} 
            className="flex items-center gap-2 px-6 py-3 bg-[#e31837] text-white rounded-xl font-medium hover:bg-[#c41530] transition-colors shadow-sm"
          >
            <Download size={18} />
            Download PDF
          </button>
          <button 
            onClick={() => { setSummary(null); connect(); }} 
            className="px-6 py-3 bg-white border border-gray-200 text-gray-800 rounded-xl font-medium hover:bg-gray-50 transition-colors shadow-sm"
          >
            Try Again
          </button>
          <button 
            onClick={onBack} 
            className="px-6 py-3 bg-transparent text-gray-500 rounded-xl font-medium hover:text-gray-800 transition-colors"
          >
            Back to Menu
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center p-12 bg-white rounded-[2rem] shadow-[0_20px_40px_rgb(0,0,0,0.08)] border border-gray-100 max-w-md mx-auto w-full relative"
    >
      <div className="mb-12 text-center mt-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
          {mode === 'agent' ? 'Customer (AI)' : 'Mista AI'}
        </h2>
        <p className="text-gray-500 font-light">
          {mode === 'agent' ? `Practice your pitch (${difficulty} mode)` : 'Speak with our AI property expert'}
        </p>
      </div>

      <div className="relative flex items-center justify-center w-48 h-48 mb-8">
        {isConnected && !isSpeaking && (
          <>
            <div className="absolute inset-0 bg-gray-100 rounded-full animate-ping opacity-75"></div>
            <div className="absolute inset-4 bg-gray-200 rounded-full animate-pulse"></div>
          </>
        )}
        {isSpeaking && (
          <>
            <div className="absolute inset-0 bg-[#e31837]/10 rounded-full animate-pulse opacity-75"></div>
            <div className="absolute inset-4 bg-[#e31837]/20 rounded-full animate-pulse delay-75"></div>
          </>
        )}

        <button
          onClick={isConnected ? disconnect : connect}
          disabled={isConnecting}
          className={`relative z-10 flex items-center justify-center w-32 h-32 rounded-full shadow-xl transition-all duration-500 ${
            isConnected 
              ? 'bg-[#e31837] hover:bg-[#c41530] scale-110 shadow-[0_10px_30px_rgb(227,24,55,0.3)]' 
              : isConnecting
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-white border-4 border-[#e31837] hover:bg-gray-50 hover:scale-105 shadow-[0_10px_30px_rgb(227,24,55,0.2)]'
          }`}
        >
          {isConnecting ? (
            <Loader2 className="w-12 h-12 text-[#e31837] animate-spin" />
          ) : isConnected ? (
            <Bot className="w-12 h-12 text-white" />
          ) : (
            <Bot className="w-12 h-12 text-[#e31837]" />
          )}
        </button>
      </div>

      <div className="text-center h-16 flex flex-col items-center justify-start">
        <p className={`text-lg font-medium transition-colors ${
          isConnected && !isSpeaking ? 'text-gray-600' : isSpeaking ? 'text-[#e31837]' : 'text-[#e31837]'
        }`}>
          {isSpeaking ? (mode === 'agent' ? 'Customer is speaking...' : 'Mista AI is speaking...') : statusText}
        </p>
        <p className="text-sm text-gray-400 mt-2 font-light">
          {isConnected ? 'Conversation is live. Speak naturally.' : 'Tap the AI icon to start a call.'}
        </p>
      </div>
    </motion.div>
  );
}
