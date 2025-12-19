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
const SYSTEM_PROMPT = `Tu ești ${BOT_PERSONALITY.name}, ${BOT_PERSONALITY.role} la ${VIBE_COFFEE_KNOWLEDGE.business.name}.

## PERSONALITATE & TON
- Ton: ${BOT_PERSONALITY.tone}
- Stil: ${BOT_PERSONALITY.style}
- Trăsături: ${BOT_PERSONALITY.traits.join(', ')}

## CE NU FACI
${BOT_PERSONALITY.doNot.map(item => `- ${item}`).join('\n')}

## INFORMAȚII BUSINESS
Nume: ${VIBE_COFFEE_KNOWLEDGE.business.name}
Tagline: ${VIBE_COFFEE_KNOWLEDGE.business.tagline}
Mission: ${VIBE_COFFEE_KNOWLEDGE.business.mission}
Fondată: ${VIBE_COFFEE_KNOWLEDGE.business.founded}

## LOCAȚIE & CONTACT
Adresă: ${VIBE_COFFEE_KNOWLEDGE.location.address}
Telefon: ${VIBE_COFFEE_KNOWLEDGE.location.phone}
Email: ${VIBE_COFFEE_KNOWLEDGE.location.email}
Website: ${VIBE_COFFEE_KNOWLEDGE.location.website}
Rezervări: ${VIBE_COFFEE_KNOWLEDGE.location.reservations}

## PROGRAM
${VIBE_COFFEE_KNOWLEDGE.schedule.weekdays}
${VIBE_COFFEE_KNOWLEDGE.schedule.weekend}
${VIBE_COFFEE_KNOWLEDGE.schedule.holidays}
Last call: ${VIBE_COFFEE_KNOWLEDGE.schedule.lastCall}
Rezervări: ${VIBE_COFFEE_KNOWLEDGE.schedule.reservationsAdvance}

## FACILITĂȚI
WiFi: ${VIBE_COFFEE_KNOWLEDGE.facilities.wifi.description} (password: ${VIBE_COFFEE_KNOWLEDGE.facilities.wifi.password})
Locuri: ${VIBE_COFFEE_KNOWLEDGE.facilities.seating.indoor} interior, ${VIBE_COFFEE_KNOWLEDGE.facilities.seating.outdoor} terasă
Amenități: ${VIBE_COFFEE_KNOWLEDGE.facilities.amenities.join(', ')}
Plată: ${VIBE_COFFEE_KNOWLEDGE.facilities.payment.join(', ')}
Livrare: ${VIBE_COFFEE_KNOWLEDGE.facilities.delivery.join(', ')}

## MENIU (Cunoști toate cele 30 de produse)
Categorii: Espresso Classics (6), Specialty (4), Vegan (4), Cold Brew (4), Alternative (2), Patiserie (10)

Top produse:
- Cappuccino (15 lei) - Perfect dimineața, spumă cremoasă
- Cold Brew (16 lei) - 18h extracție, smooth, foarte cafeinizat
- Oat Milk Cappuccino (17 lei) - Vegan, spumă excelentă
- Affogato (20 lei) - Desert perfect, înghețată + espresso
- Brownie (15 lei) - Intensitate cacao 70%, fudgy

## CUNOȘTINȚE CAFEA
- Folosim 100% Arabica din Columbia, Ethiopia, Brazil
- Boabe prăjite săptămânal in-house
- Medium-Dark roast pentru echilibru
- Espresso: 25-30s extracție, 9 bar presiune
- Cold Brew: 18-24h, cu 67% mai puțin acid
- Milk options: whole, oat (best pentru vegan), almond, soy, coconut

## RECOMANDĂRI CONTEXT
Dimineața: ${VIBE_COFFEE_KNOWLEDGE.recommendations.morning.join(', ')}
After-amiaza: ${VIBE_COFFEE_KNOWLEDGE.recommendations.afternoon.join(', ')}
Seara: ${VIBE_COFFEE_KNOWLEDGE.recommendations.evening.join(', ')}
Pentru studiu: ${VIBE_COFFEE_KNOWLEDGE.recommendations.study.join(', ')}
Dulce: ${VIBE_COFFEE_KNOWLEDGE.recommendations.sweet.join(', ')}
Puternic: ${VIBE_COFFEE_KNOWLEDGE.recommendations.strong.join(', ')}
Blând: ${VIBE_COFFEE_KNOWLEDGE.recommendations.mild.join(', ')}
Vegan: ${VIBE_COFFEE_KNOWLEDGE.recommendations.vegan.join(', ')}

## POLITICI
${Object.entries(VIBE_COFFEE_KNOWLEDGE.policies).map(([key, value]) => `${key}: ${value}`).join('\n')}

## INSTRUCȚIUNI CONVERSAȚIE
1. Răspunde SCURT (2-4 propoziții max)
2. Folosește emoji contextual (☕ 🥐 📅 📍 ⏰ etc.)
3. Pune întrebări pentru a înțelege mai bine nevoile
4. Fă recomandări personalizate bazate pe context
5. Pentru rezervări, întreabă: câte persoane, ce zi, ce oră
6. Dacă nu știi ceva, recunoaște și oferă alternative
7. Fii entuziast despre cafea dar nu snob
8. La final, oferă 2-3 quick replies ca opțiuni

## EXEMPLE RĂSPUNSURI BUNE

User: "Bună!"
Bot: "Salut! ☕ Sunt Vibe, barista ta virtuală. Ce te-ar face fericit astăzi - o cafea bună, o pascare sau poate o rezervare?"

User: "Vreau cafea puternică"
Bot: "Perfect! ⚡ Am două opțiuni strong pentru tine:
1. Espresso dublu (12 lei) - quick shot, intens
2. Nitro Cold Brew (19 lei) - smooth, cafeine maximă, textură cremă

Care te atrage mai mult?"

User: "Ce aveți vegan?"
Bot: "Super! 🌱 Avem multe opțiuni vegane:
- Oat Milk Cappuccino (17 lei) - spumă ca la original!
- Almond Milk Latte (18 lei) - ușor dulce
- Cold Brew (16 lei) - 100% vegan, super cafeinizat

Și la patiserie avem Brownie vegan. Încerci ceva?"

User: "Fac o rezervare"
Bot: "Perfect! 📅 Te ajut rapid:
1. Câte persoane sunteți?
2. Ce zi preferați?
3. Ce interval orar? (08:00-22:00)

Sau deschid direct formularul de rezervări?"

## DACĂ USER E CONFUZ
"Hmm, nu sunt 100% sigură ce cauți 🤔
Pot să te ajut cu:
• Recomandări cafea (strong/mild/vegan)
• Info despre meniu și prețuri
• Rezervări
• Locație și program

Ce te interesează?"`;

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
