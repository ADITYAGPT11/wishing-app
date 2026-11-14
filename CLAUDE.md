@AGENTS.md

# Project context: Wishing App

Working name (change it in `src/lib/config.ts`). India-first, also for NRIs and global users.

## Vision

A **family occasion calendar** that remembers every birthday, anniversary, festival and tithi date, and turns each one into a beautiful wish or an RSVP invite in about a minute. People share it as a WhatsApp link, and guests need **no app, no signup and see no ads**.

The edge is **memory + timing + Indian calendar** (tithi birthdays, regional festivals, weddings with several functions), not templates alone. RSVP and generic AI greetings are already free elsewhere (WhatsApp Events, Apple Invites, Meta AI).

## Core user flow

1. Sign up with **Google** (one tap).
2. **My calendar**: festivals are pre-filled; the user adds friends' birthdays, anniversaries and optional tithi dates, and gets a nudge before each one.
3. **Send a wish**: pick the friend, swipe through live design previews, add name, message and optionally a photo, then create a link.
4. **Share** on WhatsApp, by copying the link or through the phone's share sheet. Optionally schedule it for 12:00 AM; the app pushes a reminder with the link ready to send, because free WhatsApp links can't send automatically.
5. **The friend opens the link** (the wow moment): a teaser, then tap a gift, then a reveal with confetti or fireworks, a parallax scene that follows phone tilt, the name animating in, and a message card. Then "Send love back", Replay, and "Make one for someone you love" (the growth loop).

## Hard constraints

- **Free tools only**: free tiers, open source, our own assets. The only paid tool is Claude.
- **Performance**: wish pages must run smoothly on a ~₹10k Android phone. Use CSS/SVG/canvas only, add no animation libraries without a reason, and target under about 1 MB per page.
- Respect `prefers-reduced-motion`.
- Wish links must be unguessable. Guests never need an account.
- Never show ads to guests.

## Planned free stack

| Layer | Choice | Gotchas |
|---|---|---|
| Framework | Next.js 16 (App Router, Cache Components) + React 19 + Tailwind v4 | Read `node_modules/next/dist/docs/` before using Next APIs (see AGENTS.md) |
| Hosting | Cloudflare Workers (free) | 10 ms CPU per request, so pre-render OG images. Avoid Vercel Hobby for anything commercial (its terms forbid it) |
| DB + auth | Supabase Free (Postgres, Google login, Edge Functions, pg_cron) | Projects **pause after 1 week of inactivity**, so keep one pinged |
| Media | Cloudflare R2 (10 GB, free egress) | |
| Email | Resend (3,000/month, **100/day**) + Brevo (300/day) | Needs a verified domain |
| Push | Self-sent Web Push (VAPID) | iPhone: only after "Add to Home Screen" (iOS 16.4+) |
| Calendar | `.ics` files, Google/Outlook links, per-user `webcal://` feed | No Google Calendar API, so no OAuth verification |
| Sharing | `wa.me/?text=` + Web Share API | OG image 1200×630, under ~300 KB |
| Tithi / festivals | **astronomy-engine (MIT)** + a curated yearly festival JSON | **Do not use Swiss Ephemeris, drik-panchanga or PyJHora** (AGPL) |
| Paid later, only if needed | WhatsApp Cloud API (~₹0.115 per utility message), phone OTP | Never in the free core |

## Current state (as of 2026-11-14)

- Done: wish link prototype at `/w/[id]` with **Birthday Night** and **Diwali Glow** themes, a create page at `/create` with a live phone preview and share, and the landing page.
- A wish is currently **encoded in the link** (base64url JSON, see `src/lib/wish.ts`). This gets replaced by Supabase rows with short ids.
- Not set up yet: Supabase, Cloudflare deploy, a domain, CI.

## Code map

- `src/lib/wish.ts`: wish model, `THEMES`, limits, encode/decode, demo wishes, `splitGraphemes` (keeps Indic names intact).
- `src/components/wish/WishExperience.tsx`: stages `closed → opening → open`.
- `src/components/wish/scenes/*Scene.tsx`: one file per theme, built from `.layer` divs with `depth()` for parallax.
- `src/components/wish/useParallax.ts`: tilt, mouse and idle drift written to `--px`/`--py` CSS variables. iOS tilt permission is requested inside the tap.
- `src/components/wish/Confetti.tsx`: canvas confetti, fireworks and hearts through an imperative `burst()`.
- `src/components/wish/wish.css`: all wish-page styles and keyframes, with theme colours under `[data-theme]`.

### Adding a theme

1. Add it to `THEMES` in `src/lib/wish.ts`.
2. Create `scenes/<Name>Scene.tsx`.
3. Add its colours in `wish.css` under `.wish-root[data-theme="<id>"]`.
4. Render it in `WishExperience.tsx`.

## Assets policy

- Scenes are **original SVG/CSS written in code**: light, sharp at any size, and fully ours.
- **AI-generated assets** (backgrounds, photo-style art, music) are allowed only from generators whose terms permit **commercial use**. Record each asset's source and licence. AI output isn't copyrightable in the US, so competitors can copy it.
- Free libraries (Unsplash, Pixabay, unDraw, LottieFiles) forbid building a template library or competing service from their content. Only use them composed into finished designs, never as a raw gallery.
- OpenMoji is CC BY-SA, which means share-alike. Prefer Twemoji (CC BY).
- **Never use** Bollywood or film songs, brand logos, or deity artwork we didn't create or license.

## Monetisation (the core stays free)

1. Wedding / multi-function pack (~₹499–1,999): sub-events, per-function guest lists and RSVP.
2. Paid WhatsApp automation add-on.
3. USD pricing for NRIs.
4. Festive gifting affiliates (FNP/IGP ~7%).
5. Later: sponsored festive templates, team birthdays for businesses.

Avoid ads on guest pages. Avoid pooling group-gift money, because RBI payment aggregator rules apply.

## Roadmap

1. Google sign-in + Supabase, with short wish ids.
2. Personal calendar: birthdays, anniversaries, curated festivals, reminders by push and email.
3. OG preview images per theme; "opened" and "love back" notifications to the sender.
4. More themes: Holi, Raksha Bandhan, Eid, anniversary, Christmas, New Year.
5. Photo upload, then music.
6. Event invites with RSVP, then the multi-function wedding pack.
7. Tithi birthdays (beta, with visible edge-case notes).
8. Deploy to Cloudflare.

## Research

`docs/research/market-research.md` holds the full report: competitors, market size, gaps, free-tier limits and licence traps. The raw notes are in `docs/research/notes/`. The weakest evidence is user pain points (no Reddit or user quotes found), so validate them with real families.

## Commands

```bash
npm run dev     # http://localhost:3000 (demos: /w/demo-birthday, /w/demo-diwali)
npm run lint
npm run build
```

## Working conventions

- Run `npm run lint` and `npm run build` before committing.
- Check UI changes in the browser at mobile size (375×812).
- Work on a feature branch and merge into `main` through a PR.
