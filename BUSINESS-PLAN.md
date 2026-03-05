# KagajAI — Business Plan

> AI-powered government document generation platform for Nepal.
> Built by Surya & Jarvis. Started 2026-03-05.

## 1. Problem

Nepal's government processes require dozens of document types across departments (IRD, OCR, Ward Office, banks, IP office). Citizens and businesses waste hours figuring out formats, requirements, and Nepali legal language. Ekagajpatra solved this with static form wizards — but they're still just fancy templates.

## 2. Our Edge: AI-Native

| Ekagajpatra (Incumbent) | KagajAI (Us) |
|---|---|
| Static form wizard | Conversational AI — "tell me what you need" |
| Manual field-by-field entry | Upload existing docs → AI extracts & pre-fills |
| Fixed templates only | AI adapts language, tone, formality |
| No validation | AI checks for errors, missing fields, inconsistencies |
| One language at a time | Real-time English ↔ Nepali translation |
| Pay per document | Freemium + subscription (undercut on price) |

## 3. Target Segments (Prioritized)

| Segment | Why They Pay | Volume | Priority |
|---|---|---|---|
| **Entrepreneurs/Startups** | Company registration, compliance — high urgency, willing to pay | Medium | **Phase 1** |
| **Law firms/CAs** | Repeat users, bulk documents, time = money | Low count, high revenue | **Phase 1** |
| **General citizens** | Rent agreements, ward office docs — price sensitive | High volume | **Phase 2** |

## 4. Revenue Model

**Freemium + Subscription** (undercuts Ekagajpatra's pay-per-doc):

| Tier | Price | Includes |
|---|---|---|
| **Free** | NPR 0 | 3 documents/month, basic templates, watermarked preview |
| **Pro** | NPR 299/month | Unlimited documents, AI auto-fill, no watermarks |
| **Business** | NPR 999/month | Everything + bulk generation, team accounts, priority support |
| **Pay-per-doc** | NPR 10–500 | For one-off users who won't subscribe |

## 5. MVP Scope (Phase 1 — 6-8 weeks)

### Core Features
- 15-20 highest-demand templates (company registration, PAN, rent agreement, board minutes, share transfer)
- AI conversational form-filling (chatbot-style, not form fields)
- English ↔ Nepali real-time translation
- Document preview + PDF download
- eSewa / Khalti payment integration
- User accounts, document history

### AI Features (Differentiator)
- "Describe what you need in plain language" → AI picks the right template
- Upload existing document → AI extracts data, pre-fills new template
- Smart validation — flags missing fields, inconsistencies
- Auto-suggest corrections

### Skip for MVP
- Mobile app (responsive web is enough)
- Law firm bulk tools (Phase 2)
- Ward office / citizen docs (Phase 2)

## 6. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | Next.js + Tailwind | Fast, SEO-friendly, good Nepali font support |
| Backend | Laravel or Next.js API routes | Surya's strength in Laravel |
| AI | Claude API (Haiku for speed, Sonnet for complex docs) | Best for structured generation, multilingual |
| Database | PostgreSQL | Reliable, free |
| Payments | eSewa SDK, Khalti SDK | Nepal's dominant payment methods |
| PDF | Puppeteer or wkhtmltopdf | HTML → PDF generation |
| Hosting | DigitalOcean or Hetzner | Cheap, reliable, ~$10-20/month |
| Auth | Laravel Sanctum or NextAuth | Simple, proven |

### AI Cost Estimate
- Haiku for form-filling: ~$0.001 per document generation
- Sonnet for complex validation: ~$0.01 per document
- At 1,000 docs/month: ~$5-10/month in AI costs

## 7. Go-to-Market Strategy

### Phase 1 — Launch (Month 1-2)
- Free tier with 15 templates — let people try it
- SEO: Target "company registration Nepal", "rent agreement format Nepal", "PAN registration form"
- YouTube: 5-10 short tutorials showing AI auto-fill vs manual filling
- Facebook/TikTok: Nepal's primary social platforms — short demo videos

### Phase 2 — Growth (Month 3-6)
- Referral program (give 5 free docs, get 5)
- Partner with CA firms — offer Business tier free for 3 months
- Blog content: "How to register a company in Nepal (step-by-step)" — SEO play
- Add citizen documents (ward office, property) — volume play

### Phase 3 — Moat (Month 6-12)
- Mobile app
- API for law firms / accounting software integration
- Document tracking (status updates from government departments)
- Community-contributed templates

## 8. Competitive Analysis

### Ekagajpatra's Weaknesses to Exploit
- Static wizards — no intelligence, no validation
- Pay-per-doc pricing — expensive for repeat users
- No AI — no auto-fill, no smart suggestions
- Limited language flexibility — fixed templates, not adaptive

### Ekagajpatra's Strengths to Respect
- First mover — brand recognition, government awards
- Existing template library — breadth of coverage
- Mobile app — reach advantage
- They know the legal formats — accuracy matters

**Our strategy:** Don't compete on template count. Compete on **experience** — AI makes it effortless.

## 9. Unit Economics

| Metric | Estimate |
|---|---|
| Hosting + infra | ~$20/month |
| AI API costs | ~$5-10/month (at 1,000 docs) |
| Payment gateway fees | ~2-3% per transaction |
| Domain + misc | ~$10/month |
| **Total fixed cost** | **~$40/month** |
| **Break-even** | **~15 Pro subscribers** |

## 10. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Legal accuracy | Partner with 1 CA/lawyer to validate top 15 templates. Disclaimer on all docs. |
| Ekagajpatra copies AI features | Our AI is the product, not a feature. They'd need to rebuild their stack. |
| Low willingness to pay | Freemium + low pricing. NPR 299/month is accessible. |
| Government format changes | Template versioning system. Monitor gazette for updates. |
| AI hallucination in legal docs | Structured generation (fill slots, not free-text). Human-validated templates. |
