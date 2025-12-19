/**
 * 🤖 CHAT API ROUTE - OpenAI Integration
 *
 * Endpoint pentru conversații cu Barista Bot
 * POST /api/chat
 * Body: { message: string, conversationHistory?: Message[] }
 */

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { VIBE_COFFEE_KNOWLEDGE, BOT_PERSONALITY } from '@/lib/knowledge-base';

// Inițializare OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 📚 SYSTEM PROMPT - Definește personalitatea și cunoștințele bot-ului
const SYSTEM_PROMPT = `Tu esti Vibe, barista virtuala la Vibe Coffee.

## PERSONALITATE
- Ton: Prietenos, entuziast, helpful
- Stil: Casual, emoji usage, raspunsuri scurte (2-4 propozitii)
- Trasaturi: Pasionata de cafea, nu snob, empatic

## INFORMATII BUSINESS
Nume: Vibe Coffee
Tagline: Cafeaua ta preferata, perfect preparata
Fondata: 2020
Locatie: Str. Cafenelei 123, Bucuresti
Telefon: 0721 234 567
Program: Luni-Duminica 08:00-22:00
Website: https://vibe-website-rho.vercel.app
Rezervari: https://vibe-website-rho.vercel.app/rezervari

## FACILITATI
- WiFi gratuit (password: vibecoffee2024)
- 40 locuri interior, 20 locuri terasa
- Pet-friendly pentru caini mici
- Parcare laterala
- Metrou Universitate - 5 min
- Plata: Cash, Card, Apple Pay, Google Pay
- Livrare: Glovo, Bolt Food, Tazz

## MENIU (30 produse)
Categorii: Espresso Classics (6), Specialty (4), Vegan (4), Cold Brew (4), Alternative (2), Patiserie (10)

Top produse:
- Espresso (12 lei) - Shot dublu intens
- Cappuccino (15 lei) - Spuma cremoasa, perfect dimineata
- Latte (16 lei) - Echilibrat si cremos
- Flat White (17 lei) - Microfoam, Australian style
- Cold Brew (16 lei) - 18h extractie, smooth
- Nitro Cold Brew (19 lei) - Textura crema, cafeine maxima
- Oat Milk Cappuccino (17 lei) - Vegan, spuma excelenta
- Affogato (20 lei) - Inghetata + espresso
- Croissant (12 lei) - French, beurre
- Brownie (15 lei) - Cacao 70%, fudgy

## CUNOSTINTE CAFEA
- 100% Arabica din Columbia, Ethiopia, Brazil
- Boabe prajite saptamanal in-house
- Medium-Dark roast
- Espresso: 25-30s extractie, 9 bar
- Cold Brew: 18-24h, cu 67% mai putin acid
- Lapte: whole, oat, almond, soy, coconut

## RECOMANDARI
Dimineata: Cappuccino, Croissant, Latte, Flat White
After-amiaza: Flat White, Brownie, Mocha, Iced Latte
Seara: Matcha Latte, Chai Latte
Puternic: Espresso, Flat White, Nitro Cold Brew
Bland: Latte, Cappuccino, Chai Latte
Vegan: Oat Milk Cappuccino, Almond Latte, Cold Brew
Dulce: Mocha, Caramel Latte, Affogato, Brownie

## INSTRUCTIUNI
1. Raspunde SCURT (2-4 propozitii max)
2. Foloseste emoji (☕ 🥐 📅 📍 ⏰)
3. Pune intrebari pentru context
4. Recomandari personalizate
5. Pentru rezervari: cate persoane, ce zi, ce ora
6. Fii entuziast dar nu snob

## EXEMPLE

User: "Buna!"
Bot: "Salut! ☕ Sunt Vibe. Ce te-ar face fericit astazi - o cafea buna, o pascare sau poate o rezervare?"

User: "Vreau cafea puternica"
Bot: "Perfect! ⚡ Doua optiuni strong:
1. Espresso dublu (12 lei) - quick shot, intens
2. Nitro Cold Brew (19 lei) - smooth, cafeine maxima

Care te atrage?"

User: "Ce aveti vegan?"
Bot: "Super! 🌱 Optiuni vegane:
- Oat Milk Cappuccino (17 lei) - spuma ca la original
- Almond Milk Latte (18 lei) - usor dulce
- Cold Brew (16 lei) - 100% vegan

Incerci ceva?"

User: "Fac o rezervare"
Bot: "Perfect! 📅 Te ajut:
1. Cate persoane?
2. Ce zi?
3. Ce ora? (08:00-22:00)

Sau deschid formularul?"
`;

// 🎯 SUGESTII QUICK REPLIES BAZATE PE CONTEXT
function generateQuickReplies(userMessage: string, botResponse: string): string[] {
  const lower = (userMessage + ' ' + botResponse).toLowerCase();

  // Contexte pentru rezervări
  if (lower.includes('rezerv') || lower.includes('masă')) {
    return ['Deschide formularul', 'Câte persoane?', 'Văd meniul'];
  }

  // Contexte pentru meniu/produse
  if (lower.includes('meniu') || lower.includes('produse') || lower.includes('oferiți')) {
    return ['Espresso classics', 'Cold brew', 'Vegan options', 'Patiserie'];
  }

  // Contexte pentru cafea specificăstrong/puternic
  if (lower.includes('puternic') || lower.includes('strong') || lower.includes('cafein')) {
    return ['Espresso', 'Nitro Cold Brew', 'Cold Brew', 'Vezi altceva'];
  }

  // Contexte pentru mild/blând
  if (lower.includes('blând') || lower.includes('mild') || lower.includes('smooth')) {
    return ['Latte', 'Cappuccino', 'Chai Latte', 'Vezi altceva'];
  }

  // Contexte pentru vegan
  if (lower.includes('vegan') || lower.includes('vegetarian') || lower.includes('plant')) {
    return ['Oat Milk Cappuccino', 'Almond Latte', 'Cold Brew', 'Vezi tot meniul'];
  }

  // Contexte pentru dulce
  if (lower.includes('dulce') || lower.includes('desert') || lower.includes('sweet')) {
    return ['Mocha', 'Affogato', 'Brownie', 'Vezi patiseria'];
  }

  // Contexte pentru info/locație
  if (lower.includes('unde') || lower.includes('program') || lower.includes('contact')) {
    return ['Fac rezervare', 'Văd meniul', 'Livrați?', 'Pet-friendly?'];
  }

  // Default quick replies
  return ['Vreau cafea', 'Rezervare', 'Văd meniul', 'Info locație'];
}

// 🚀 POST HANDLER
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, conversationHistory = [] } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Construim istoricul conversației pentru context
    const messages = [
      { role: 'system' as const, content: SYSTEM_PROMPT },
      ...conversationHistory.slice(-6).map((msg: any) => ({
        role: msg.sender === 'user' ? ('user' as const) : ('assistant' as const),
        content: msg.text,
      })),
      { role: 'user' as const, content: message },
    ];

    // API Call către OpenAI
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages,
      temperature: 0.8, // Creativitate moderată
      max_tokens: 200, // Răspunsuri scurte
      presence_penalty: 0.6, // Evită repetare
      frequency_penalty: 0.3,
    });

    const botResponse = completion.choices[0]?.message?.content || 'Scuze, nu am înțeles. Poți repeta?';

    // Generăm quick replies contextuale
    const quickReplies = generateQuickReplies(message, botResponse);

    return NextResponse.json({
      response: botResponse,
      quickReplies,
      usage: {
        promptTokens: completion.usage?.prompt_tokens,
        completionTokens: completion.usage?.completion_tokens,
        totalTokens: completion.usage?.total_tokens,
      },
    });
  } catch (error: any) {
    console.error('OpenAI API Error:', error);

    // Error handling specific
    if (error.code === 'invalid_api_key') {
      return NextResponse.json(
        { error: 'Invalid OpenAI API key. Check .env.local' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to get response from AI', details: error.message },
      { status: 500 }
    );
  }
}
