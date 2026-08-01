import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { input_text, prompt } = await req.json();

    const response = await fetch('https://api.assemblyai.com/lemur/v3/generate/task', {
      method: 'POST',
      headers: {
        'Authorization': '2b006c626fb5411f88d52d56a78ded8b',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input_text,
        prompt,
        final_model: "anthropic/claude-3-5-sonnet"
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AssemblyAI API Error:", errorText);
      return NextResponse.json({ error: 'AssemblyAI API Error' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("AssemblyAI Route Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
