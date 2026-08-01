'use client';

import { useState, useEffect } from 'react';
import Chat from '@/components/Chat';
import { Bot, MapPin, Home as HomeIcon, Layout, Building2, Trees, TreePine, Map, CheckCircle2, ChevronRight, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{name: string, img: string} | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Header */}
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 bg-white ${scrolled ? 'shadow-md py-3' : 'border-b border-gray-100 py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="relative w-32 h-12 md:w-40 md:h-14">
            <Image src="/logo.jfif" alt="Mista Infra Logo" fill className="object-contain object-left mix-blend-multiply contrast-[1.1]" priority />
          </div>
          <nav className="hidden md:flex flex-1 justify-center space-x-10">
            <a href="#overview" className="text-sm font-semibold tracking-wide text-gray-600 hover:text-[#e31837] uppercase">Overview</a>
            <a href="#amenities" className="text-sm font-semibold tracking-wide text-gray-600 hover:text-[#e31837] uppercase">Amenities</a>
            <a href="#floor-plans" className="text-sm font-semibold tracking-wide text-gray-600 hover:text-[#e31837] uppercase">Floor Plans</a>
            <a href="#location" className="text-sm font-semibold tracking-wide text-gray-600 hover:text-[#e31837] uppercase">Location</a>
          </nav>
          <div>
            <button 
              onClick={() => setIsChatOpen(true)}
              className="flex items-center gap-2 bg-[#e31837] text-white px-5 py-2.5 rounded-full font-medium shadow-md shadow-red-500/20 hover:bg-[#c41530] transition-colors"
            >
              <Bot size={18} />
              <span className="hidden sm:inline">Ask Mista AI</span>
            </button>
          </div>
        </div>
      </header>

      <main className="pb-24">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden min-h-[90vh] flex items-center bg-[#0a0a0a]" style={{ marginTop: '76px' }}>
          <Image
            src="/hero2.jpg"
            alt="Mista Sri City View"
            fill
            className="object-contain object-right lg:object-center absolute inset-0 z-0"
            referrerPolicy="no-referrer"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent z-10" />
          
          <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-3xl"
            >
              <div className="inline-block bg-[#e31837] text-white font-bold tracking-wider px-4 py-1.5 mb-6 text-sm rounded shadow-lg">
                BUDIGERE CROSS
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white leading-[1.1] tracking-tight mb-6">
                MISTA <span className="text-[#e31837] italic font-light">SRI CITY</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 font-light mb-10 max-w-2xl leading-relaxed">
                The Tallest Skyscraper in the <span className="font-medium text-white block mt-2 text-2xl md:text-3xl">Manhattan of Bangalore</span>
              </p>
              
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-xl mb-8 max-w-xl">
                <div className="flex items-start gap-4">
                  <div className="bg-[#e31837] p-3 rounded-full shrink-0">
                    <Sparkles className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-1">Meet Your Personal Real Estate Concierge</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Don&apos;t just browse—converse. Talk to Mista AI instantly to discover floor plans, discuss pricing details, discover luxury amenities, or effortlessly schedule a private site visit.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => setIsChatOpen(true)}
                  className="group relative flex items-center justify-center gap-3 bg-[#e31837] text-white px-8 py-4 rounded font-bold text-lg hover:bg-[#c41530] transition-all overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 -skew-x-12 -ml-16 group-hover:animate-shine"></div>
                  <Bot size={24} className="relative z-10" />
                  <span className="relative z-10">Talk to Mista AI</span>
                </button>
                <a href="#overview" className="flex items-center justify-center gap-2 bg-transparent border border-white/40 text-white px-8 py-4 rounded font-bold text-lg hover:bg-white/10 transition-all">
                  Explore Project
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Overview Section */}
        <section id="overview" className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <h2 className="text-4xl md:text-5xl font-serif tracking-tight text-gray-900">
                  Redefining <span className="italic font-light text-[#e31837]">Luxury Living</span>
                </h2>
                <div className="w-20 h-1 bg-[#e31837]"></div>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Mista Sri City is an idea pioneered by Mista Infra, for the development of fully self-sufficient Townships. 
                  Experience zero kilometer travel for all your daily needs.
                </p>
                <ul className="space-y-4">
                  {[
                    "52 Floors of Skyscraper Residences",
                    "Mixed Use project comprising Retail Spaces, Poly-clinic, Serviced Apartments",
                    "Burj Khalifa-like LED Façade Display",
                    "Panoramic Lake-view from your balcony"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-[#e31837]">
                        <CheckCircle2 size={16} />
                      </div>
                      <span className="text-gray-700 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
              <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl flex bg-white/50 items-center justify-center">
                 <Image
                  src="/facade.jpg"
                  alt="Mista Sri City Facade"
                  width={800}
                  height={1000}
                  className="w-full h-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Amenities Section */}
        <section id="amenities" className="py-24 bg-white text-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">Elevate Your Living Experience</h2>
            <p className="text-gray-500 max-w-2xl mx-auto mb-16 text-lg">Thoughtfully curated amenities that cater to every need.</p>
            
            <div className="grid md:grid-cols-3 gap-8 text-left">
              {[
                { title: "Clubhouse on 52nd Floor", icon: Building2, desc: "Live the high life with panoramic views.", img: "/clubhouse.jpg" },
                { title: "Multipurpose Hall & Retail", icon: Layout, desc: "Everything you need under one roof.", img: "/multipurpose.jpg" },
                { title: "Smart Home Features", icon: HomeIcon, desc: "Voice enabled switches and digital locks.", img: "/smarthome.jpg" },
                { title: "Camping & Barbeque", icon: TreePine, desc: "Connect with nature in 30,000 sqft open space.", img: "/outdoor.jpg" },
                { title: "Maze Garden", icon: Trees, desc: "Beautifully landscaped interactive gardens.", img: "/garden.jpg" },
                { title: "Elevated Jogging Track", icon: Map, desc: "Stay fit while enjoying the serene environment.", img: "/track.jpg" },
              ].map((amenity, i) => {
                const IconComponent = amenity.icon;
                return (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group relative overflow-hidden bg-gray-50"
                  >
                    <div className="h-64 relative overflow-hidden">
                      <Image
                        src={amenity.img}
                        alt={amenity.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      <div className="absolute bottom-6 left-6 right-6 text-white">
                         <IconComponent size={24} className="mb-3 text-[#e31837]" />
                         <h3 className="text-xl font-bold mb-1">{amenity.title}</h3>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Floor Plans Section */}
        <section id="floor-plans" className="py-24 bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold tracking-tight mb-4">Thoughtfully Designed Configurations</h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-lg">Homes customized for new-age needs. Non-intrusive work & study spaces.</p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: "Arka", type: "2 BHK", area: "1325 - 1335 Sq.ft", facing: "North East", img: "/arka.jpg" },
                { name: "Ira", type: "2 BHK", area: "950 - 1010 Sq.ft", facing: "North East", img: "/ira.jpg" },
                { name: "Tara", type: "2.5 BHK", area: "1480 - 1515 Sq.ft", facing: "North East", img: "/tara.jpg" },
                { name: "Mira", type: "3 BHK", area: "1510 - 1530 Sq.ft", facing: "North East", img: "/mira.jpg" },
                { name: "Siya", type: "3.5 BHK", area: "1685 - 1770 Sq.ft", facing: "North East", img: "/siya.jpg" },
              ].map((plan, i) => (
                <div key={i} onClick={() => setSelectedPlan({ name: plan.name, img: plan.img })} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-colors flex flex-col group cursor-pointer">
                  <div className="relative h-48 w-full bg-white group-hover:scale-[1.02] transition-transform duration-500">
                    <Image src={plan.img} alt={`${plan.name} Floor Plan`} fill className="object-contain p-4 mix-blend-multiply" />
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="text-[#e31837] font-serif italic text-2xl mb-1">{plan.name}</div>
                    <div className="text-3xl font-black mb-6">{plan.type}</div>
                    <div className="space-y-3 text-gray-300 mt-auto">
                      <div className="flex justify-between border-b border-white/10 pb-2">
                        <span className="text-gray-500">S.B.U.A</span>
                        <span className="font-medium">{plan.area}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/10 pb-2">
                        <span className="text-gray-500">Facing</span>
                        <span className="font-medium">{plan.facing}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Location Section */}
        <section id="location" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1 relative h-[500px] bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                <Image
                  src="/map.jpg"
                  alt="Location Map Placeholder"
                  fill
                  className="object-cover opacity-80 mix-blend-multiply"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-white/90 backdrop-blur p-4 rounded-xl shadow-xl flex items-center gap-3">
                    <MapPin className="text-[#e31837]" size={24} />
                    <div className="font-bold text-gray-900">Budigere Cross, Bangalore</div>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2 space-y-8">
                <h2 className="text-4xl font-bold tracking-tight text-gray-900">
                  Heart of Budigere Cross
                </h2>
                <div className="w-20 h-1 bg-[#e31837]"></div>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Exceptional connectivity to Bangalore&apos;s key destinations while maintaining a serene environment away from the city&apos;s hustle and bustle.
                </p>
                <div className="grid sm:grid-cols-2 gap-6">
                  {[
                    { label: "Airport", time: "30 Min" },
                    { label: "ITPL", time: "18 Min" },
                    { label: "Indira Nagar", time: "28 Min" },
                    { label: "Whitefield Metro", time: "12 Min" },
                    { label: "STRR", time: "5 Min" },
                    { label: "Orion Mall", time: "3 Min" },
                  ].map((loc, i) => (
                    <div key={i} className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
                      <MapPin className="text-[#e31837] shrink-0" size={20} />
                      <div>
                        <div className="font-bold text-gray-900">{loc.label}</div>
                        <div className="text-sm text-[#e31837] font-medium">{loc.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-red-50 border border-red-100 p-6 rounded-lg mt-8">
                  <h4 className="font-bold text-[#e31837] mb-2">Upcoming Connectivity</h4>
                  <ul className="text-gray-700 space-y-2 text-sm">
                    <li>• Phase 3 Metro - 2 Min</li>
                    <li>• Peripheral Ring Road - 5 Min</li>
                    <li>• Elevated Corridor - 2 Min</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-950 text-white py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="relative w-32 h-12 grayscale opacity-80 hover:grayscale-0 transition-all">
            <Image src="/logo.jfif" alt="Mista Infra Logo" fill className="object-contain object-left md:object-center" />
          </div>
          <div className="flex gap-8 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
          <div className="text-sm text-gray-500">
             © {new Date().getFullYear()} Mista Infra. RERA NO: PRM/KA/RERA/1251/446/PR/080125/007360
          </div>
        </div>
      </footer>

      {/* Floating Mista AI Button */}
      <AnimatePresence>
        {!isChatOpen && (
          <motion.div
             initial={{ opacity: 0, y: 50, scale: 0.9 }}
             animate={{ opacity: 1, y: 0, scale: 1 }}
             exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
             className="fixed bottom-8 right-8 z-50 flex items-center group cursor-pointer"
             onClick={() => setIsChatOpen(true)}
          >
             <div className="absolute right-full mr-4 bg-white text-gray-900 px-5 py-3.5 rounded-xl shadow-xl border border-gray-100 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity translate-x-4 sm:group-hover:translate-x-0 duration-300 pointer-events-none whitespace-nowrap min-w-[220px]">
                <div className="font-bold text-sm tracking-wide mb-1 text-[#e31837]">MISTA AI ASSISTANT</div>
                <div className="text-xs text-gray-500 font-medium">Have questions? We&apos;re here 24/7.</div>
             </div>
             
             <div className="bg-gradient-to-r from-[#e31837] to-[#b6132c] w-16 h-16 rounded-full flex items-center justify-center shadow-2xl shadow-red-500/40 relative transform hover:scale-110 transition-transform">
               {/* Pulsing rings */}
               <div className="absolute inset-0 rounded-full border-2 border-[#e31837] animate-ping opacity-30"></div>
               <Bot size={32} className="text-white relative z-10" />
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Modal Overlay */}
      <AnimatePresence>
        {isChatOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsChatOpen(false)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg mx-auto z-10"
            >
              <div className="absolute right-4 top-4 z-20">
                <button 
                  onClick={() => setIsChatOpen(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full p-2 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <Chat mode="customer" onBack={() => setIsChatOpen(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floor Plan Image Modal */}
      <AnimatePresence>
        {selectedPlan && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPlan(null)}
              className="absolute inset-0 bg-gray-950/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col z-10"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white z-20 shrink-0">
                <h3 className="text-xl font-bold font-serif text-[#e31837] italic">{selectedPlan.name} <span className="text-gray-900 not-italic font-sans">- Floor Plan</span></h3>
                <button 
                  onClick={() => setSelectedPlan(null)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full p-2 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="relative flex-1 bg-gray-50 min-h-[50vh] sm:min-h-[70vh]">
                <Image 
                  src={selectedPlan.img} 
                  alt={`${selectedPlan.name} Floor Plan Full Size`} 
                  fill 
                  className="object-contain p-4" 
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

