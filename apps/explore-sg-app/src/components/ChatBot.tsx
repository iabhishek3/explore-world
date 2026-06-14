import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  options?: Option[];
  itinerary?: ItineraryDay[];
}

interface Option {
  label: string;
  value: string;
  icon?: string;
}

interface ItineraryDay {
  day: number;
  title: string;
  activities: { time: string; place: string; description: string; tag?: string }[];
}

const PREBUILT_ITINERARIES: Record<string, ItineraryDay[]> = {
  'family-3': [
    {
      day: 1, title: 'Family Fun & Wonder',
      activities: [
        { time: '9:00 AM', place: 'Gardens by the Bay', description: 'Cloud Forest & Flower Dome — kids love the indoor waterfall', tag: 'Nature' },
        { time: '12:30 PM', place: 'Satay by the Bay', description: 'Affordable hawker food with Marina Bay views', tag: 'Food' },
        { time: '2:30 PM', place: 'Marina Bay Sands SkyPark', description: 'Observation deck with panoramic city views', tag: 'Iconic' },
        { time: '5:00 PM', place: 'Spectra Light Show', description: 'Free water & light show at Marina Bay (8pm & 9pm)', tag: 'Free' },
      ]
    },
    {
      day: 2, title: 'Wildlife & Adventure',
      activities: [
        { time: '9:00 AM', place: 'Singapore Zoo', description: 'Open-concept zoo — Breakfast with Orangutans is a must', tag: 'Wildlife' },
        { time: '1:00 PM', place: 'River Wonders', description: 'Giant panda exhibit & Amazon river ride', tag: 'Wildlife' },
        { time: '4:00 PM', place: 'Orchard Road', description: 'Shopping break at ION Orchard, kid-friendly food court', tag: 'Shopping' },
        { time: '7:30 PM', place: 'Night Safari', description: "World's first nocturnal zoo — tram ride through habitats", tag: 'Wildlife' },
      ]
    },
    {
      day: 3, title: 'Culture & Play',
      activities: [
        { time: '9:30 AM', place: 'Sentosa Island', description: 'Universal Studios or S.E.A. Aquarium — pick one!', tag: 'Theme Park' },
        { time: '1:00 PM', place: 'Malaysian Food Street', description: 'Themed food court on Sentosa with local favorites', tag: 'Food' },
        { time: '3:00 PM', place: 'Palawan Beach', description: 'Southernmost point of continental Asia, shallow water for kids', tag: 'Beach' },
        { time: '6:00 PM', place: 'Chinatown', description: 'Walk through heritage shophouses, grab dessert at Mei Heong Yuen', tag: 'Culture' },
      ]
    }
  ],
  'couple-4': [
    {
      day: 1, title: 'Iconic Singapore',
      activities: [
        { time: '10:00 AM', place: 'Marina Bay Sands', description: 'Infinity pool (hotel guests) or SkyPark observation deck', tag: 'Iconic' },
        { time: '12:00 PM', place: 'CE LA VI', description: 'Rooftop lunch with stunning 57th-floor views', tag: 'Dining' },
        { time: '3:00 PM', place: 'Gardens by the Bay', description: 'Supertree Grove & OCBC Skyway for couples photos', tag: 'Nature' },
        { time: '7:30 PM', place: 'Lau Pa Sat', description: 'Victorian-era hawker centre, satay street comes alive at night', tag: 'Food' },
      ]
    },
    {
      day: 2, title: 'Culture & Cocktails',
      activities: [
        { time: '10:00 AM', place: 'Tiong Bahru', description: 'Hipster neighborhood — specialty coffee & indie bookshops', tag: 'Culture' },
        { time: '1:00 PM', place: 'National Gallery', description: "World's largest collection of Southeast Asian art", tag: 'Art' },
        { time: '4:00 PM', place: 'Haji Lane', description: 'Colorful street art, boutique shopping in Kampong Glam', tag: 'Shopping' },
        { time: '8:00 PM', place: 'Atlas Bar', description: "Art Deco gin palace — one of world's best bars", tag: 'Nightlife' },
      ]
    },
    {
      day: 3, title: 'Nature & Relaxation',
      activities: [
        { time: '8:00 AM', place: 'MacRitchie TreeTop Walk', description: '250m suspension bridge through primary rainforest', tag: 'Nature' },
        { time: '12:00 PM', place: 'Dempsey Hill', description: 'Brunch at colonial-era bungalow restaurants', tag: 'Dining' },
        { time: '3:00 PM', place: 'Pulau Ubin', description: 'Rustic island escape — rent bikes, explore wetlands', tag: 'Adventure' },
        { time: '7:30 PM', place: 'Boat Quay', description: 'Riverside dinner with views of the lit-up skyline', tag: 'Dining' },
      ]
    },
    {
      day: 4, title: 'Sentosa & Sunset',
      activities: [
        { time: '10:00 AM', place: 'Sentosa Cove', description: 'Yacht marina walk & brunch at Quayside Isle', tag: 'Luxury' },
        { time: '1:00 PM', place: 'Tanjong Beach Club', description: 'Beach club vibes, pool & cocktails', tag: 'Beach' },
        { time: '5:00 PM', place: 'Siloso Beach', description: "Golden hour walk on Singapore's best sunset beach", tag: 'Beach' },
        { time: '8:00 PM', place: 'Clarke Quay', description: 'Final night out — riverside bars & live music', tag: 'Nightlife' },
      ]
    }
  ],
  'solo-2': [
    {
      day: 1, title: 'Street Food & Streets',
      activities: [
        { time: '9:00 AM', place: 'Tiong Bahru Market', description: 'Chwee kueh & kopi — breakfast like a local', tag: 'Food' },
        { time: '11:00 AM', place: 'Chinatown Heritage Centre', description: 'Immersive history of early immigrants', tag: 'Culture' },
        { time: '2:00 PM', place: 'Maxwell Food Centre', description: 'Tian Tian chicken rice — Michelin-approved hawker', tag: 'Food' },
        { time: '4:00 PM', place: 'Ann Siang Hill', description: 'Hidden rooftop bars & street art', tag: 'Explore' },
        { time: '8:00 PM', place: 'Lantern at Fullerton Bay', description: 'Rooftop cocktail with Marina Bay panorama', tag: 'Nightlife' },
      ]
    },
    {
      day: 2, title: 'Hidden Gems',
      activities: [
        { time: '8:30 AM', place: 'Henderson Waves', description: 'Stunning architectural bridge — Southern Ridges trail', tag: 'Nature' },
        { time: '11:00 AM', place: 'Labrador Nature Reserve', description: 'WWII relics along a secret coastal trail', tag: 'History' },
        { time: '1:00 PM', place: 'Vivo City', description: 'Waterfront mall, rooftop sky garden with harbor views', tag: 'Shopping' },
        { time: '4:00 PM', place: 'Kampong Glam', description: 'Sultan Mosque, perfume shops, Turkish lamps', tag: 'Culture' },
        { time: '7:00 PM', place: 'Tekka Centre', description: 'Best Indian food in Little India — biryani & roti prata', tag: 'Food' },
      ]
    }
  ]
};

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState<string>('greeting');
  const [preferences, setPreferences] = useState({ days: '', type: '', interests: '' });
  const [showWelcome, setShowWelcome] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  function addAssistantMessage(msg: Partial<Message>) {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'assistant', ...msg } as Message]);
    }, 700 + Math.random() * 400);
  }

  function addUserMessage(content: string) {
    setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'user', content }]);
  }

  function handleOptionClick(option: Option) {
    setShowWelcome(false);
    addUserMessage(option.label);

    if (step === 'greeting') {
      if (option.value === 'itinerary') {
        setStep('days');
        addAssistantMessage({
          content: "How many days are you spending in Singapore?",
          options: [
            { label: '2 days', value: '2' },
            { label: '3 days', value: '3' },
            { label: '4 days', value: '4' },
            { label: '5+ days', value: '5' },
          ]
        });
      } else if (option.value === 'question') {
        setStep('greeting');
        addAssistantMessage({
          content: "What would you like to know?",
          options: [
            { label: 'Best food spots', value: 'q-food' },
            { label: 'Getting around', value: 'q-transport' },
            { label: 'Best time to visit', value: 'q-weather' },
            { label: 'Budget breakdown', value: 'q-budget' },
          ]
        });
      } else if (option.value === 'popular') {
        setStep('greeting');
        addAssistantMessage({
          content: "Our most-saved itineraries:",
          options: [
            { label: 'Family — 3 days', value: 'show-family-3' },
            { label: 'Couple — 4 days', value: 'show-couple-4' },
            { label: 'Solo — 2 days', value: 'show-solo-2' },
          ]
        });
      } else if (option.value === 'q-food') {
        addAssistantMessage({
          content: "Singapore is a food paradise. The must-try list:\n\n**Hainanese Chicken Rice** — Tian Tian at Maxwell, from $5\n**Chilli Crab** — Jumbo Seafood, Clarke Quay\n**Laksa** — 328 Katong Laksa, rich coconut broth\n**Kaya Toast** — Ya Kun, the local breakfast\n**Satay** — Lau Pa Sat after 7pm\n\nHawker centres are the move — cheap, Michelin-starred, and where locals actually eat.",
          options: [
            { label: 'Plan my trip', value: 'itinerary' },
            { label: 'Another question', value: 'question' },
          ]
        });
      } else if (option.value === 'q-transport') {
        addAssistantMessage({
          content: "Getting around is easy and cheap:\n\n**MRT** — covers everything, $1-3 per trip\n**Grab** — like Uber, great for groups\n**Bus** — tap with any contactless card\n**Walking** — most areas are very walkable\n\nPro tip: just tap your Visa/Mastercard on MRT turnstiles. No need for a separate card.",
          options: [
            { label: 'Plan my trip', value: 'itinerary' },
            { label: 'Another question', value: 'question' },
          ]
        });
      } else if (option.value === 'q-weather') {
        addAssistantMessage({
          content: "Tropical year-round, 28-32C. No bad time to visit.\n\n**Dec-Feb** — slightly wetter, cooler evenings\n**Jun-Aug** — fewer crowds, Great Sale season\n**Sep-Nov** — driest months\n\nAlways carry an umbrella. Showers are short but intense. Everything is air-conditioned anyway.",
          options: [
            { label: 'Plan my trip', value: 'itinerary' },
            { label: 'Another question', value: 'question' },
          ]
        });
      } else if (option.value === 'q-budget') {
        addAssistantMessage({
          content: "Daily budget breakdown:\n\n**Backpacker** $50-80 — hawker food, MRT, hostels\n**Mid-range** $150-250 — mix of hawker + restaurants, taxis\n**Luxury** $400+ — fine dining, private tours, 5-star stays\n\nBiggest savings: eat at hawker centres ($3-5/meal) and use free attractions — Gardens outdoor areas, Merlion Park, Botanic Gardens, all light shows.",
          options: [
            { label: 'Plan my trip', value: 'itinerary' },
            { label: 'Another question', value: 'question' },
          ]
        });
      } else if (option.value.startsWith('show-')) {
        const key = option.value.replace('show-', '');
        const itinerary = PREBUILT_ITINERARIES[key];
        if (itinerary) {
          addAssistantMessage({ content: "Here you go:", itinerary });
        }
      }
    } else if (step === 'days') {
      setPreferences(p => ({ ...p, days: option.value }));
      setStep('type');
      addAssistantMessage({
        content: "Who's coming?",
        options: [
          { label: 'Just me', value: 'solo' },
          { label: 'With partner', value: 'couple' },
          { label: 'Family', value: 'family' },
          { label: 'Friends', value: 'friends' },
        ]
      });
    } else if (step === 'type') {
      setPreferences(p => ({ ...p, type: option.value }));
      setStep('interests');
      addAssistantMessage({
        content: "What's the vibe?",
        options: [
          { label: 'Food & Culture', value: 'food-culture' },
          { label: 'Nature & Adventure', value: 'nature' },
          { label: 'Shopping & Nightlife', value: 'shopping' },
          { label: 'A bit of everything', value: 'mixed' },
        ]
      });
    } else if (step === 'interests') {
      setPreferences(p => ({ ...p, interests: option.value }));
      setStep('generating');
      addAssistantMessage({ content: "Building your itinerary..." });
      setTimeout(() => {
        const key = preferences.type === 'family' ? 'family-3' :
                    preferences.type === 'couple' ? 'couple-4' : 'solo-2';
        const itinerary = PREBUILT_ITINERARIES[key] || PREBUILT_ITINERARIES['family-3'];
        setStep('result');
        addAssistantMessage({
          content: `Your ${preferences.days}-day plan:`,
          itinerary: itinerary.slice(0, parseInt(preferences.days) || 3)
        });
      }, 1200);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!inputValue.trim()) return;
    setShowWelcome(false);
    addUserMessage(inputValue);
    const query = inputValue.toLowerCase();
    setInputValue('');

    if (query.includes('food') || query.includes('eat') || query.includes('restaurant')) {
      handleOptionClick({ label: inputValue, value: 'q-food' });
    } else if (query.includes('transport') || query.includes('mrt') || query.includes('get around')) {
      handleOptionClick({ label: inputValue, value: 'q-transport' });
    } else if (query.includes('weather') || query.includes('when') || query.includes('time to visit')) {
      handleOptionClick({ label: inputValue, value: 'q-weather' });
    } else if (query.includes('budget') || query.includes('cheap') || query.includes('cost') || query.includes('money')) {
      handleOptionClick({ label: inputValue, value: 'q-budget' });
    } else if (query.includes('itinerary') || query.includes('plan') || query.includes('trip') || query.includes('days')) {
      handleOptionClick({ label: inputValue, value: 'itinerary' });
    } else {
      addAssistantMessage({
        content: "I can help with that. Here's what I know best:",
        options: [
          { label: 'Plan my trip', value: 'itinerary' },
          { label: 'Food spots', value: 'q-food' },
          { label: 'Getting around', value: 'q-transport' },
          { label: 'Budget tips', value: 'q-budget' },
        ]
      });
    }
    setStep('greeting');
  }

  const tagColors: Record<string, string> = {
    'Nature': 'bg-emerald-950 text-emerald-400 border-emerald-800/40',
    'Food': 'bg-orange-950 text-orange-400 border-orange-800/40',
    'Iconic': 'bg-violet-950 text-violet-400 border-violet-800/40',
    'Free': 'bg-green-950 text-green-400 border-green-800/40',
    'Wildlife': 'bg-amber-950 text-amber-400 border-amber-800/40',
    'Shopping': 'bg-pink-950 text-pink-400 border-pink-800/40',
    'Theme Park': 'bg-red-950 text-red-400 border-red-800/40',
    'Beach': 'bg-cyan-950 text-cyan-400 border-cyan-800/40',
    'Culture': 'bg-indigo-950 text-indigo-400 border-indigo-800/40',
    'Dining': 'bg-rose-950 text-rose-400 border-rose-800/40',
    'Art': 'bg-fuchsia-950 text-fuchsia-400 border-fuchsia-800/40',
    'Nightlife': 'bg-purple-950 text-purple-400 border-purple-800/40',
    'Explore': 'bg-teal-950 text-teal-400 border-teal-800/40',
    'Adventure': 'bg-sky-950 text-sky-400 border-sky-800/40',
    'Luxury': 'bg-yellow-950 text-yellow-400 border-yellow-800/40',
    'History': 'bg-stone-900 text-stone-400 border-stone-700/40',
  };

  return (
    <div className="flex flex-col h-screen bg-[#09090b] text-white">
      {/* Minimal Header */}
      <header className="shrink-0 h-14 flex items-center px-5 border-b border-zinc-800/60">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-gradient-to-b from-red-500 to-red-600 flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">SG</span>
          </div>
          <span className="text-[14px] font-medium text-zinc-200 tracking-tight">Explore Singapore</span>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto overscroll-contain">
        <div className="max-w-2xl mx-auto px-5 py-8">

          {/* Welcome State */}
          {showWelcome && messages.length === 0 && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-red-500 to-red-600 flex items-center justify-center mb-6 shadow-lg shadow-red-500/20">
                <span className="text-[16px] font-bold text-white">SG</span>
              </div>
              <h2 className="text-[22px] font-semibold text-zinc-100 mb-2 tracking-tight">Plan your Singapore trip</h2>
              <p className="text-[14px] text-zinc-500 mb-8 max-w-sm">AI-powered itinerary builder. Tell me your preferences and I'll handle the rest.</p>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  { label: 'Build my itinerary', value: 'itinerary' },
                  { label: 'Ask a question', value: 'question' },
                  { label: 'Popular plans', value: 'popular' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => handleOptionClick(opt)}
                    className="text-[13px] px-4 py-2.5 rounded-lg bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700/80 hover:text-zinc-100 border border-zinc-700/50 transition-all duration-150 cursor-pointer"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="space-y-5">
            {messages.map((msg) => (
              <div key={msg.id} style={{ animation: 'fade-in 0.25s ease-out forwards', opacity: 0 }}>
                {msg.role === 'user' ? (
                  <div className="flex justify-end">
                    <div className="max-w-[75%] text-[14px] text-zinc-100 bg-zinc-800 rounded-2xl rounded-br-sm px-4 py-2.5">
                      {msg.content}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div
                      className="text-[14px] text-zinc-300 leading-[1.7]"
                      dangerouslySetInnerHTML={{ __html: formatMarkdown(msg.content) }}
                    />

                    {msg.options && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {msg.options.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => handleOptionClick(opt)}
                            className="text-[13px] px-3 py-1.5 rounded-lg bg-zinc-800/70 text-zinc-400 hover:bg-zinc-700/80 hover:text-zinc-200 border border-zinc-700/40 transition-all duration-150 cursor-pointer"
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}

                    {msg.itinerary && (
                      <div className="space-y-3 pt-2">
                        {msg.itinerary.map((day) => (
                          <div key={day.day} className="rounded-xl border border-zinc-800 overflow-hidden bg-zinc-900/50">
                            <div className="px-4 py-2.5 border-b border-zinc-800/60 flex items-baseline gap-2">
                              <span className="text-[11px] font-semibold text-red-400 uppercase tracking-widest">Day {day.day}</span>
                              <span className="text-[13px] font-medium text-zinc-300">{day.title}</span>
                            </div>
                            <div className="divide-y divide-zinc-800/40">
                              {day.activities.map((act, i) => (
                                <div key={i} className="px-4 py-2.5 flex gap-3 items-start">
                                  <span className="text-[11px] text-zinc-600 font-mono w-[56px] shrink-0 pt-px">{act.time}</span>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <span className="text-[13px] font-medium text-zinc-200">{act.place}</span>
                                      {act.tag && (
                                        <span className={`text-[9px] uppercase tracking-wider px-1.5 py-px rounded border font-medium ${tagColors[act.tag] || 'bg-zinc-800 text-zinc-500 border-zinc-700'}`}>
                                          {act.tag}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[12px] text-zinc-500 mt-0.5 leading-relaxed">{act.description}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                        <div className="flex gap-1.5 pt-1">
                          <button
                            onClick={() => { setStep('greeting'); handleOptionClick({ label: 'Rebuild', value: 'itinerary' }); }}
                            className="text-[12px] px-3 py-1.5 rounded-lg bg-zinc-800/70 text-zinc-400 hover:text-zinc-200 border border-zinc-700/40 transition-all cursor-pointer"
                          >
                            Regenerate
                          </button>
                          <button
                            onClick={() => { setStep('greeting'); handleOptionClick({ label: 'Question', value: 'question' }); }}
                            className="text-[12px] px-3 py-1.5 rounded-lg bg-zinc-800/70 text-zinc-400 hover:text-zinc-200 border border-zinc-700/40 transition-all cursor-pointer"
                          >
                            Ask a question
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 py-2" style={{ animation: 'fade-in 0.2s ease-out' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" style={{ animation: 'typing 1.2s infinite 0s' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" style={{ animation: 'typing 1.2s infinite 0.15s' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" style={{ animation: 'typing 1.2s infinite 0.3s' }} />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </main>

      {/* Input Bar */}
      <footer className="shrink-0 border-t border-zinc-800/60 bg-[#09090b]">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-5 py-3">
          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 focus-within:border-zinc-600 transition-colors duration-150">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Message..."
              className="flex-1 bg-transparent text-[14px] text-zinc-200 placeholder:text-zinc-600 outline-none"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="text-zinc-500 hover:text-zinc-200 disabled:text-zinc-800 transition-colors cursor-pointer disabled:cursor-default"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </div>
        </form>
      </footer>
    </div>
  );
}

function formatMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-zinc-100 font-medium">$1</strong>')
    .replace(/\n/g, '<br/>');
}
