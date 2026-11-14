# Wishing App

Send a link that opens into a little celebration made just for one person: a gift box that pops open, confetti, their name lighting up, and a parallax scene that moves as they tilt their phone.

> Working name. Change it in `src/lib/config.ts` once the brand is decided.

## What works today (prototype)

- **Wish link experience** at `/w/<id>`: gift box → open animation → themed parallax scene (tilt on phones, mouse on desktop, gentle drift otherwise) → name animates in letter by letter (Hindi and other Indic scripts supported) → message card → "Send love back" hearts and Replay.
- **Two themes**: Birthday Night (balloons, bunting, cake) and Diwali Glow (string lights, lanterns, rangoli, diyas, fireworks).
- **Create page** at `/create`: pick a theme, add name, message and sender, see a live phone preview, then share via WhatsApp, copy link or the phone's share sheet.
- **WhatsApp teaser preview**: link title says "Name, you have a surprise 🎁" without spoiling the design.
- Respects "reduce motion", has no animation libraries, and keeps pages light for budget phones.
- Demo links: `/w/demo-birthday`, `/w/demo-diwali`.

For now a wish is stored **inside its link** (base64url JSON), so no database is needed yet.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Project layout

```
src/
  app/
    page.tsx              landing page
    create/               create-a-wish form + live preview
    w/[id]/page.tsx       the wish link page (metadata + loader)
  components/wish/
    WishExperience.tsx    stages: closed → opening → open
    scenes/               one file per theme (SVG/CSS parallax layers)
    Confetti.tsx          tiny canvas confetti / fireworks / hearts
    useParallax.ts        tilt + mouse + idle drift → CSS variables
    wish.css              all wish-page styles and animations
  lib/
    wish.ts               wish model, themes, link encoding
    config.ts             app name
docs/research/            market research report and notes
```

### Adding a theme

1. Add an entry to `THEMES` in `src/lib/wish.ts`.
2. Create `src/components/wish/scenes/<Name>Scene.tsx` built from `.layer` divs with a `depth()` value.
3. Add its colours under `.wish-root[data-theme="<id>"]` in `wish.css`, and render it in `WishExperience.tsx`.

## Free stack plan

| Layer | Choice | Notes |
|---|---|---|
| Hosting | Cloudflare (Workers) | Commercial use allowed on free tier |
| Database + Google login | Supabase Free | Pauses after 1 week of inactivity; keep it pinged |
| Email reminders | Resend / Brevo | Resend free = 100/day |
| Push | Web Push (VAPID) | iPhone only after "Add to Home Screen" |
| Calendar | `.ics` + Google/Outlook links | No Google API verification needed |
| Tithi / festivals | astronomy-engine (MIT) | Avoid AGPL Swiss Ephemeris libraries |

## Roadmap

- [x] Wish link prototype (birthday, Diwali)
- [ ] Google sign-in + Supabase; short wish ids instead of long links
- [ ] Personal calendar: birthdays, anniversaries, festivals, reminders
- [ ] Open-graph preview images per theme
- [ ] "Opened" + "love back" notifications to the sender
- [ ] More themes (Holi, Raksha Bandhan, Eid, anniversary, Christmas, New Year)
- [ ] Photo upload, music
- [ ] Event invites with RSVP
- [ ] Tithi birthdays (beta)
- [ ] Deploy to Cloudflare

## Asset policy

All art in the app is original code (SVG/CSS). AI-generated assets may be added later, but only from generators whose terms allow commercial use, with each asset's source recorded. No film songs, no brand logos, and no deity artwork we didn't create or license. See `docs/research/market-research.md` for the licence traps.
