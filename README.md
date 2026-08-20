# Spa Review Reply Drafts

**POC**: Paste spa Google reviews, get professional reply drafts instantly.

## What This Does

A simple single-page app where spa managers can:
1. Paste one or more Google reviews (separated by blank lines or `---`)
2. Optionally add spa name and voice notes (e.g., "warm, short, no corporate")
3. Click "Draft Replies" to generate professional responses
4. Copy each draft with one click

**Try a Sample** button loads 3 fake reviews (1-star, 3-star, 5-star) for immediate testing.

## What This Does NOT Do

- ❌ No scraping Google, Maps, or TripAdvisor
- ❌ No Google Business Profile OAuth or posting replies
- ❌ No finding spas or cold outreach
- ❌ No user accounts, billing, or teams

## Setup

### Install Dependencies

```bash
npm install
```

### Add OpenAI API Key (Optional)

The app works without an API key using deterministic template-based replies. For AI-generated drafts:

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Add your OpenAI API key:
   ```
   OPENAI_API_KEY=sk-your-key-here
   ```

Get your key from: https://platform.openai.com/api-keys

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/YOUR_REPO)

1. Push this repo to GitHub
2. Import to Vercel
3. Add `OPENAI_API_KEY` as an environment variable (optional)
4. Deploy

Or use the Vercel CLI:

```bash
npm install -g vercel
vercel
```

## Draft Reply Rules

The AI/templates follow these rules:
- Write as a spa manager, not a corporate press office
- Keep replies short (2-3 sentences)
- Thank the reviewer
- If something went wrong, offer to make it right without admitting legal fault
  - ❌ Never: "sorry you were injured", "we were negligent"
  - ✅ Good: "we'd like the opportunity to make this right"
- Do NOT invent facts not mentioned in the review
- Do NOT offer refunds unless the review asked about money
- Match the guest's language if the review is not in English

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **AI**: OpenAI API (optional, with fallback templates)
- **Deployment**: Vercel

## Project Structure

```
├── app/
│   ├── api/
│   │   └── draft-replies/
│   │       └── route.ts          # API endpoint for generating drafts
│   ├── globals.css               # Tailwind styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main UI
├── .env.example                  # Environment variables template
├── package.json
└── README.md
```

## License

MIT
