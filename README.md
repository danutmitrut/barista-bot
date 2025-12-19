# ☕ Barista Bot - AI Chatbot pentru Vibe Coffee

> Chatbot conversațional inteligent pentru cafenea, construit cu Next.js 15, OpenAI GPT și TypeScript

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?logo=openai)

## 🌟 Features

- 🤖 **Conversații Natural Language** - Powered by OpenAI GPT-4o-mini
- ☕ **Cunoștințe Specializate** - Expert în cafea și produsele Vibe Coffee
- 💬 **Quick Replies Contextuale** - Butoane inteligente bazate pe conversație
- 📅 **Asistență Rezervări** - Ghidează utilizatorii către booking system
- 🎨 **UI Modern** - Design glassmorphism consistent cu brandul
- 📱 **Responsive** - Funcționează perfect pe mobile și desktop
- ⚡ **Real-time** - Răspunsuri rapide sub 2 secunde

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ instalat
- OpenAI API Key ([obține aici](https://platform.openai.com/api-keys))
- npm sau yarn

### Installation

```bash
# Install dependencies
npm install

# Setup OpenAI API key
# Editează .env.local și adaugă API key-ul tău

# Start development server
npm run dev
```

Deschide [http://localhost:3000](http://localhost:3000) și începe să vorbești cu bot-ul! ☕

**📖 Ghid complet OpenAI setup:** Vezi [SETUP_OPENAI.md](./SETUP_OPENAI.md)

## 📁 Structura Proiectului

```
barista-bot/
├── app/
│   ├── api/chat/         # OpenAI API endpoint
│   │   └── route.ts      # POST /api/chat handler
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Homepage cu demo
├── components/
│   └── ChatWidget.tsx    # Chat UI component (floating widget)
├── lib/
│   └── knowledge-base.ts # Baza de cunoștințe Vibe Coffee
├── .env.local            # Environment variables (API keys)
└── README.md             # Acest fișier
```

## 🧠 Baza de Cunoștințe

Bot-ul cunoaște:
- ✅ **30 produse** din meniu (cafea + patiserie)
- ✅ **Prețuri și ingrediente** pentru fiecare produs
- ✅ **Cunoștințe despre cafea** (tipuri boabe, metode preparare, fun facts)
- ✅ **Locație și program** (adresă, orar, contact)
- ✅ **Facilități** (WiFi, parcare, pet-friendly, etc.)
- ✅ **Politici** (rezervări, anulări, alergii)

Vezi toate detaliile în [lib/knowledge-base.ts](./lib/knowledge-base.ts)

## 💬 Exemple de Conversații

**Recomandări de cafea:**
```
User: "Vreau o cafea puternică"
Bot: "Perfect! ⚡ Am două opțiuni strong pentru tine:
     1. Espresso dublu (12 lei) - quick shot, intens
     2. Nitro Cold Brew (19 lei) - smooth, cafeine maximă

     Care te atrage mai mult?"
```

**Info despre produse:**
```
User: "Ce aveți vegan?"
Bot: "Super! 🌱 Avem multe opțiuni vegane:
     - Oat Milk Cappuccino (17 lei) - spumă ca la original!
     - Almond Milk Latte (18 lei) - ușor dulce
     - Cold Brew (16 lei) - 100% vegan

     Încerci ceva?"
```

**Asistență rezervări:**
```
User: "Fac o rezervare"
Bot: "Perfect! 📅 Te ajut rapid:
     1. Câte persoane sunteți?
     2. Ce zi preferați?
     3. Ce interval orar?

     Sau deschid direct formularul?"
```

## 🚀 Deployment

### Deploy pe Vercel (Recomandat)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Configurează environment variables în Vercel dashboard:
# - OPENAI_API_KEY
# - OPENAI_MODEL (opțional)
```

## 📚 Resurse

- **OpenAI Docs:** https://platform.openai.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Vibe Coffee Website:** https://vibe-website-rho.vercel.app

---

Built with ☕ for learning AI chatbots
