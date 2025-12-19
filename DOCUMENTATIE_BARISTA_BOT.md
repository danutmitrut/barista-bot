# 🤖 Barista Bot - Documentație pentru Cursanți

## Despre Proiect

**Barista Bot** este un chatbot conversațional AI pentru Vibe Coffee, construit cu:
- **Next.js 15** - Framework React modern
- **OpenAI GPT-4o-mini** - AI pentru conversații naturale
- **TypeScript** - Siguranță tipurilor
- **Tailwind CSS** - Styling modern

**Live Demo:** https://barista-bot-pi.vercel.app
**GitHub:** https://github.com/danutmitrut/barista-bot

---

## Ce Face Aplicația?

Barista Bot este un asistent virtual pentru cafenea care:

✅ **Conversații Naturale** - Răspunde în limba română, friendly și helpful
✅ **Cunoștințe despre Cafea** - Știe despre toate cele 30 de produse din meniu
✅ **Recomandări Personalizate** - Sugerează cafea în funcție de preferințe
✅ **Asistență Rezervări** - Ghidează clienții către sistemul de rezervări
✅ **Quick Replies** - Butoane rapide pentru acțiuni comune (doar la început)

---

## Arhitectura Aplicației

```
barista-bot/
├── app/
│   ├── api/chat/         # API endpoint pentru OpenAI
│   │   └── route.ts      # POST /api/chat - conversații
│   ├── globals.css       # Stiluri globale
│   ├── layout.tsx        # Layout-ul aplicației
│   └── page.tsx          # Homepage cu demo
├── components/
│   └── ChatWidget.tsx    # Chat UI (floating widget)
├── lib/
│   └── knowledge-base.ts # Baza de cunoștințe (meniu, info)
├── .env.local            # API Keys (GITIGNORED!)
└── README.md
```

---

## Tehnologii Folosite

### 1. **Next.js 15** - Framework
- Server Components pentru performance
- API Routes pentru backend
- App Router pentru routing modern

### 2. **OpenAI GPT-4o-mini** - AI
- Model cost-efficient (~$0.002 per conversație)
- Conversații naturale în română
- Context awareness (ține minte istoricul)

### 3. **TypeScript** - Type Safety
- Previne erori la compile time
- Autocomplete în IDE
- Interfaces pentru Message, etc.

### 4. **Tailwind CSS** - Styling
- Utility-first CSS
- Responsive design
- Glassmorphism effects

---

## Componentele Principale

### 1. ChatWidget.tsx - UI-ul Chatbot-ului

**Ce Face:**
- Afișează fereastra de chat (floating button + chat window)
- Gestionează starea conversației (messages, input, typing)
- Face request-uri către API-ul OpenAI
- Afișează quick replies (doar la mesajul inițial)

**Concepte Importante:**

#### State Management cu useState
```typescript
const [messages, setMessages] = useState<Message[]>([...]);
const [inputValue, setInputValue] = useState('');
const [isTyping, setIsTyping] = useState(false);
```

**Ce înseamnă:**
- `messages` = lista tuturor mesajelor (user + bot)
- `inputValue` = textul tapat de user în input
- `isTyping` = dacă bot-ul "scrie" (pentru animație)

#### Auto-scroll cu useRef și useEffect
```typescript
const messagesEndRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
}, [messages]);
```

**Ce înseamnă:**
- `useRef` = referință la elementul DOM de la finalul listei
- `useEffect` = când se adaugă mesaje noi, scroll automat în jos
- `behavior: 'smooth'` = animație smooth (nu jump)

#### API Call către OpenAI
```typescript
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: messageText,
    conversationHistory: messages,
  }),
});

const data = await response.json();
```

**Ce înseamnă:**
- Trimite mesajul + istoricul conversației
- Primește răspunsul de la AI
- Adaugă răspunsul în lista de mesaje

---

### 2. app/api/chat/route.ts - Backend API

**Ce Face:**
- Primește mesajul de la user
- Construiește context-ul conversației
- Apelează OpenAI API cu system prompt
- Returnează răspunsul bot-ului

**System Prompt - Creierul Bot-ului:**
```typescript
const SYSTEM_PROMPT = `Tu esti Vibe, barista virtuala la Vibe Coffee.

## PERSONALITATE
- Ton: Prietenos, entuziast, helpful
- Stil: Casual, emoji usage, raspunsuri scurte (2-4 propozitii)

## INFORMATII BUSINESS
Nume: Vibe Coffee
Locatie: Str. Cafenelei 123, Bucuresti
Program: Luni-Duminica 08:00-22:00

## MENIU (30 produse)
- Espresso (12 lei) - Shot dublu intens
- Cappuccino (15 lei) - Spuma cremoasa
...
`;
```

**De ce e important:**
- System prompt = instrucțiunile pentru AI
- Definește PERSONALITATEA bot-ului
- Include toate CUNOȘTINȚELE (meniu, prețuri, locație)
- Setează STILUL de răspuns (scurt, emoji, prietenos)

**OpenAI API Call:**
```typescript
const completion = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [
    { role: 'system', content: SYSTEM_PROMPT },
    ...conversationHistory.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text,
    })),
    { role: 'user', content: message },
  ],
  temperature: 0.8,      // Creativitate moderată
  max_tokens: 200,       // Răspunsuri scurte
  presence_penalty: 0.6, // Evită repetare
});
```

**Parametri importanți:**
- `model` = care AI folosim (gpt-4o-mini = ieftin și rapid)
- `messages` = context complet (system + istoric + mesaj nou)
- `temperature` = 0.8 = echilibrat între predictibil și creativ
- `max_tokens` = 200 = răspunsuri scurte (2-4 propoziții)
- `presence_penalty` = 0.6 = evită să repete aceleași lucruri

---

### 3. lib/knowledge-base.ts - Baza de Cunoștințe

**Ce Face:**
- Stochează toate informațiile despre Vibe Coffee
- Meniu complet (30 produse cu prețuri și descrieri)
- Info business (locație, program, contact)
- Facilități (WiFi, parcare, pet-friendly)

**Structură:**
```typescript
export const VIBE_COFFEE_KNOWLEDGE = {
  business: {
    name: "Vibe Coffee",
    tagline: "Cafeaua ta preferată, perfect preparată",
    founded: 2020,
    location: "Str. Cafenelei 123, București",
    // ...
  },
  menu: {
    espressoClassics: [
      { name: "Espresso", price: 12, description: "..." },
      // ...
    ],
    // ...
  },
};
```

**De ce e separat:**
- **Organizare** - Tot ce știe bot-ul e într-un loc
- **Ușor de actualizat** - Modifici prețuri/produse fără să atingi codul
- **Refolosibil** - Poate fi importat în alte componente

---

## Flow-ul unei Conversații

```
1. USER deschide chat (click pe ☕)
   ↓
2. ChatWidget afișează mesaj de bun venit + quick replies
   ↓
3. USER scrie "Vreau cafea puternică"
   ↓
4. ChatWidget:
   - Adaugă mesajul user în state
   - Setează isTyping = true (animație "typing...")
   - Face POST request la /api/chat
   ↓
5. API Route:
   - Primește mesajul + conversationHistory
   - Construiește context pentru OpenAI (system + istoric + mesaj)
   - Apelează OpenAI API
   - Returnează răspunsul
   ↓
6. ChatWidget:
   - Primește răspunsul
   - Adaugă mesajul bot în state
   - Setează isTyping = false
   - Auto-scroll în jos
   ↓
7. USER vede răspunsul: "Perfect! ⚡ Doua optiuni strong: ..."
```

---

## Concepte Cheie pentru Cursanți

### 1. **Client vs Server Components**

**Client Component** (ChatWidget.tsx):
```typescript
'use client'; // <- IMPORTANT!

export default function ChatWidget() {
  const [messages, setMessages] = useState(...);
  // ^ useState = DOAR în client components!
}
```

**Când folosim Client Components:**
- Interactive UI (buttons, inputs)
- State management (useState)
- Event handlers (onClick, onChange)
- Browser APIs (localStorage, fetch din frontend)

**Server Component** (implicit în Next.js 15):
- Nu au `'use client'`
- Nu pot folosi useState, useEffect
- Rulează pe server (faster, SEO-friendly)

---

### 2. **Environment Variables - Securitate**

**BAD ❌:**
```typescript
const apiKey = "sk-proj-xxxxx"; // NICIODATĂ în cod!
```

**GOOD ✅:**
```typescript
// .env.local (GITIGNORED!)
OPENAI_API_KEY=sk-proj-xxxxx

// în cod:
const apiKey = process.env.OPENAI_API_KEY;
```

**De ce:**
- API Keys = SECRETE, costă bani
- Dacă push pe GitHub PUBLIC = oricine le vede
- `.env.local` e în `.gitignore` = NU merge pe GitHub

**În Vercel:**
- Environment Variables se setează manual în dashboard
- Settings → Environment Variables → Add
- `OPENAI_API_KEY` + valoarea

---

### 3. **TypeScript Interfaces**

```typescript
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  quickReplies?: string[]; // ? = optional
}
```

**Ce înseamnă:**
- `Message` = tipul de date pentru un mesaj
- `sender: 'user' | 'bot'` = poate fi DOAR 'user' sau 'bot'
- `quickReplies?: string[]` = opțional, array de string-uri
- TypeScript verifică că folosim corect (autocomplete + erori)

---

### 4. **API Routes în Next.js**

**Structură:**
```
app/api/chat/route.ts
```

**Devine automat:**
```
POST https://your-app.com/api/chat
```

**Handler:**
```typescript
export async function POST(request: NextRequest) {
  const body = await request.json();
  // procesează request
  return NextResponse.json({ response: "..." });
}
```

**De ce e util:**
- Backend și Frontend în același proiect
- Ascunde API Keys (nu ajung în frontend)
- Middleware, validare, error handling centralizat

---

## Styling cu Tailwind CSS

### Glassmorphism Effect
```typescript
className="bg-white/20 backdrop-blur-sm"
```

**Ce înseamnă:**
- `bg-white/20` = fundal alb, 20% opacity
- `backdrop-blur-sm` = blur pe ce e în spate
- Efect de "sticlă mată"

### Responsive Design
```typescript
className="text-5xl md:text-7xl"
```

**Ce înseamnă:**
- `text-5xl` = font 48px (mobile)
- `md:text-7xl` = font 72px pe ecrane medii+ (768px+)
- Mobile-first approach

### Hover & Transitions
```typescript
className="hover:scale-110 transition-all duration-300"
```

**Ce înseamnă:**
- `hover:scale-110` = crește 10% când mouse-ul e deasupra
- `transition-all` = animație smooth pentru toate proprietățile
- `duration-300` = 300ms animație

---

## Costuri OpenAI

### GPT-4o-mini Pricing (2025)
- **Input:** ~$0.15 per 1M tokens
- **Output:** ~$0.60 per 1M tokens

### Estimări Practice
- **1 conversație** (10 mesaje): ~$0.002-0.005 (~1-2 bani)
- **100 conversații/zi**: ~$0.50/zi (~2.5 lei/zi)
- **1000 conversații/lună**: ~$15/lună (~75 lei/lună)

### Optimizări pentru Cost
1. **max_tokens: 200** = răspunsuri scurte
2. **conversationHistory.slice(-6)** = doar ultimele 6 mesaje
3. **gpt-4o-mini** (NU gpt-4) = 10x mai ieftin

---

## Deployment pe Vercel

### Pași:
1. **Push pe GitHub:**
   ```bash
   git add .
   git commit -m "Barista Bot complete"
   git push
   ```

2. **Link cu Vercel:**
   ```bash
   vercel link
   ```

3. **Adaugă Environment Variables:**
   ```bash
   vercel env add OPENAI_API_KEY production
   # paste API key

   vercel env add OPENAI_MODEL production
   # gpt-4o-mini
   ```

4. **Deploy:**
   ```bash
   vercel --prod
   ```

5. **Verifică:**
   - Aplicația e LIVE
   - Testează conversația
   - Verifică că API key-ul funcționează

---

## Debugging & Troubleshooting

### 1. "Invalid API key"
**Cauză:** API key greșit sau lipsă

**Fix:**
```bash
# Verifică .env.local
cat .env.local

# Sau în Vercel:
vercel env ls

# Restart server după modificare
npm run dev
```

### 2. "Failed to get response"
**Cauză:** Request la OpenAI a eșuat

**Fix:**
- Verifică console-ul browser (F12 → Console)
- Verifică logs-urile Vercel (vercel logs)
- Verifică că ai credite pe cont OpenAI

### 3. Quick Replies apar peste tot
**Cauză:** Nu am eliminat quickReplies din răspunsurile API

**Fix:**
```typescript
// În ChatWidget.tsx, la botResponse:
const botResponse: Message = {
  id: Date.now().toString(),
  text: data.response,
  sender: 'bot',
  timestamp: new Date(),
  // NU mai adăugăm quickReplies aici!
};
```

### 4. Textul din input nu se vede
**Cauză:** Lipsește culoarea textului

**Fix:**
```typescript
className="... text-gray-900 placeholder:text-gray-400"
```

---

## Îmbunătățiri Posibile

### 1. **Persistent Chat History**
```typescript
// Salvează în localStorage
localStorage.setItem('chatHistory', JSON.stringify(messages));

// La load:
const savedMessages = localStorage.getItem('chatHistory');
if (savedMessages) {
  setMessages(JSON.parse(savedMessages));
}
```

### 2. **Typing Indicator Real**
```typescript
// În loc de isTyping simplu, afișează "Vibe is typing..."
{isTyping && (
  <div className="text-sm text-gray-500 italic">
    Vibe scrie...
  </div>
)}
```

### 3. **Link-uri Clickabile în Răspunsuri**
```typescript
// Detectează URL-uri în text și transformă-le în <a>
const linkifyText = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, '<a href="$1">$1</a>');
};
```

### 4. **Rate Limiting**
```typescript
// Limitează la 10 mesaje/minut
const MAX_MESSAGES_PER_MINUTE = 10;
// Track cu timestamp
```

### 5. **Feedback System**
```typescript
// Thumbs up/down pentru fiecare răspuns
<button onClick={() => handleFeedback('positive')}>👍</button>
<button onClick={() => handleFeedback('negative')}>👎</button>
```

---

## Exerciții pentru Cursanți

### Nivel Beginner
1. **Modifică culoarea chatbot-ului** de la teal (#14B8A6) la altă culoare
2. **Adaugă un emoji nou** în mesajul de bun venit
3. **Schimbă placeholder-ul** input-ului cu alt text

### Nivel Intermediate
1. **Adaugă un produs nou** în knowledge-base.ts și verifică că bot-ul îl cunoaște
2. **Modifică temperatura** OpenAI (0.8 → 0.5) și observă diferențele
3. **Adaugă un buton "Clear Chat"** care șterge toate mesajele

### Nivel Advanced
1. **Implementează persistent storage** cu localStorage
2. **Adaugă suport pentru imagini** în mesaje (Unsplash API)
3. **Creează un admin panel** pentru a vedea toate conversațiile
4. **Implementează rate limiting** pentru a preveni spam

---

## Resurse Utile

### Documentație Oficială
- **Next.js:** https://nextjs.org/docs
- **OpenAI API:** https://platform.openai.com/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **TypeScript:** https://www.typescriptlang.org/docs

### Tutoriale
- **OpenAI Pricing:** https://openai.com/api/pricing
- **Vercel Deployment:** https://vercel.com/docs
- **React Hooks:** https://react.dev/reference/react

### Tools
- **OpenAI Playground:** https://platform.openai.com/playground
- **Vercel Dashboard:** https://vercel.com/dashboard
- **GitHub:** https://github.com

---

## Concluzie

**Barista Bot** demonstrează cum să construiești un chatbot AI funcțional în ~3 ore:

✅ **Simple** - Doar 3 fișiere principale (ChatWidget, API route, knowledge-base)
✅ **Scalabil** - Poate fi extins cu features noi ușor
✅ **Cost-efficient** - ~2 bani per conversație cu gpt-4o-mini
✅ **Production-ready** - Deployed pe Vercel, funcționează perfect

**Key Takeaways pentru Cursanți:**
1. **OpenAI API** e ușor de integrat (un simplu POST request)
2. **System Prompts** sunt CRUCIALE pentru personalitate
3. **Environment Variables** = securitate (NICIODATĂ API keys în cod)
4. **TypeScript** ajută la debugging și development
5. **Next.js API Routes** = backend simplu în același proiect

**Next Steps:**
- Testați chatbot-ul LIVE: https://barista-bot-pi.vercel.app
- Explorați codul pe GitHub: https://github.com/danutmitrut/barista-bot
- Încercați să-l personalizați pentru propriul business

---

**Creat cu ☕ pentru Vibe Coding Course**
