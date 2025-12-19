import ChatWidget from '@/components/ChatWidget';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* DEMO PAGE PENTRU CHATBOT */}
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          {/* HEADER */}
          <div className="text-center mb-16">
            <div className="inline-block mb-6">
              <span className="text-6xl">☕</span>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Barista Bot Demo
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Chatbot conversațional pentru Vibe Coffee - Asistent virtual inteligent
              pentru recomandări, rezervări și informații
            </p>
          </div>

          {/* FEATURES CARDS */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Conversație Naturală
              </h3>
              <p className="text-gray-600">
                Înțelege contextul și oferă răspunsuri personalizate
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="text-4xl mb-4">☕</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Recomandări Inteligente
              </h3>
              <p className="text-gray-600">
                Sugerează produse bazate pe preferințe și context
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Asistență Rezervări
              </h3>
              <p className="text-gray-600">
                Ajută rapid cu rezervări și răspunde la întrebări
              </p>
            </div>
          </div>

          {/* INSTRUCTIONS */}
          <div className="bg-gradient-to-r from-[#14B8A6] to-[#0D9488] rounded-3xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">👋 Cum funcționează?</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm">1</span>
                <span>Dă click pe butonul ☕ din colțul dreapta jos</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm">2</span>
                <span>Începe o conversație - întreabă despre meniu, rezervări sau locație</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm">3</span>
                <span>Folosește quick replies pentru răspunsuri rapide</span>
              </li>
            </ul>

            <div className="mt-6 p-4 bg-white/10 rounded-xl">
              <p className="font-semibold mb-2">💡 Încearcă să întrebi:</p>
              <p className="text-sm text-white/90">
                "Vreau o cafea puternică" • "Fac o rezervare pentru mâine" •
                "Ce produse vegane aveți?" • "Unde sunteți?"
              </p>
            </div>
          </div>

          {/* TECH STACK */}
          <div className="mt-16 text-center">
            <p className="text-gray-600 mb-4">Built with</p>
            <div className="flex justify-center gap-6 text-sm">
              <span className="px-4 py-2 bg-white rounded-full shadow">Next.js 15</span>
              <span className="px-4 py-2 bg-white rounded-full shadow">TypeScript</span>
              <span className="px-4 py-2 bg-white rounded-full shadow">Tailwind CSS</span>
              <span className="px-4 py-2 bg-white rounded-full shadow">OpenAI GPT (soon)</span>
            </div>
          </div>
        </div>
      </div>

      {/* CHATBOT WIDGET - Fixed bottom right */}
      <ChatWidget />
    </div>
  );
}
