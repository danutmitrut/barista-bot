# 🔑 Setup OpenAI API Key

## Pasul 1: Obține API Key

1. Mergi pe [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Loghează-te sau creează cont (cu Google/GitHub e rapid)
3. Click pe "Create new secret key"
4. Copiază cheia (o vezi o singură dată!)

## Pasul 2: Configurează în Proiect

1. Deschide fișierul `.env.local` din root folder
2. Înlocuiește `your-api-key-here` cu cheia ta:

```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
OPENAI_MODEL=gpt-4o-mini
```

## Pasul 3: Restart Server

```bash
# Oprește serverul (Ctrl+C)
# Pornește din nou
npm run dev
```

## Pasul 4: Testează

1. Deschide http://localhost:3000
2. Click pe butonul ☕
3. Scrie: "Bună! Vreau o cafea puternică"
4. Ar trebui să primești răspuns de la AI

## 🆓 Costuri

- **gpt-4o-mini**: ~$0.15 per 1M tokens input, ~$0.60 per 1M output
- **1 conversație** (10 mesaje): ~$0.002-0.005 (sub 1 ban!)
- **100 conversații/zi**: ~$0.50/zi (2.5 lei/zi)

## 💳 Billing

1. Mergi pe [https://platform.openai.com/settings/organization/billing/overview](https://platform.openai.com/settings/organization/billing/overview)
2. Adaugă metodă de plată (card)
3. Setează limit (recomand $5-10 pentru început)

## ⚠️ Securitate

- **NU** include `.env.local` în Git (e deja în .gitignore)
- **NU** share API key-ul public
- **NU** commit API key în cod
- Folosește environment variables mereu

## 🐛 Troubleshooting

### Error: "Invalid API key"
- Verifică că ai copiat corect cheia în `.env.local`
- Asigură-te că începe cu `sk-proj-` sau `sk-`
- Restart server după modificare

### Error: "Insufficient quota"
- Adaugă metodă de plată pe platform.openai.com
- Verifică limita de spending

### Error: "Rate limit exceeded"
- Prea multe request-uri rapid
- Așteaptă 1 minut sau upgrade planul

## 📖 Resurse

- OpenAI Platform: https://platform.openai.com
- Pricing: https://openai.com/api/pricing
- Docs: https://platform.openai.com/docs
