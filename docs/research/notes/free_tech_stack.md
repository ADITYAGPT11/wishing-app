# Free Tech Stack for a Wishes + Event-Invite + RSVP + Reminder PWA (as of 2026-11-14)

Research date: 2026-11-14. Numbers marked "verified" were read from the official page during this session (page "last_updated" date given where shown). Items marked "UNVERIFIED (prior knowledge)" were not re-checked this session and are listed under Gaps; the report writer should present them as approximate.

## Hosting / frontend: which free host, with what limits and commercial-use terms?

### Takeaway
Vercel Hobby is generous (100 GB transfer, 1M function invocations/month), but it is meant for personal, non-commercial use, and its cron is limited to once per day with ±59 min precision. Cloudflare Workers/Pages Free (100k requests/day, 5 cron triggers, free R2 egress) is the strongest choice that allows commercial use. Netlify Free moved to a 300-credit/month hard cap, roughly 15 GB of bandwidth if nothing else is used.

### Cited Findings
- **Vercel Hobby allotments** (docs page last_updated 2026-11-12): Fast Data Transfer first 100 GB; Fast Origin Transfer first 10 GB; CDN requests first 1,000,000; Active CPU 4 CPU-hrs; Provisioned Memory 360 GB-hrs; Function Invocations first 1,000,000; Image Transformations first 5,000; Image Cache Reads first 300,000; Image Cache Writes first 100,000; Web Analytics 50,000 events/month; 200 projects; max function duration 300s; 100 deployments/day; runtime logs kept 1 hour; Blob storage available — [Vercel Hobby Plan docs](https://vercel.com/docs/plans/hobby)
- **Vercel Hobby overage:** "In most cases, if you exceed your usage limits on the Hobby plan, you will have to wait until 30 days have passed before you can use the feature again." — [Vercel Hobby Plan docs](https://vercel.com/docs/plans/hobby)
- **Vercel fair-use table** (last_updated 2026-11-12) confirms the Hobby figures: 100 GB FDT, 1,000,000 invocations, 10 GB FOT, 4 hours Active CPU, 360 GB-hrs, 5K image transformations/month — [Vercel Fair Use Guidelines](https://vercel.com/docs/limits/fair-use-guidelines)
- **Vercel CLI upload limit:** 100 MB of source for Hobby (1 GB on Pro). Hobby cannot connect to Git repos owned by Git organizations — [Vercel Limits](https://vercel.com/docs/limits) (last_updated 2026-09-16)
- **Vercel non-commercial clause:** the fetched Hobby and fair-use doc pages did not show the exact "non-commercial personal use only" wording in the extracted text. Both pages point to the [Terms of Service fair-use section](https://vercel.com/legal/terms#fair-use) for acceptable use — [Vercel Fair Use Guidelines](https://vercel.com/docs/limits/fair-use-guidelines). See Gaps.
- **Cloudflare Workers Free:** "100,000/day" requests (reset at midnight UTC; Error 1027 beyond that); CPU time "10 ms" per HTTP request and per Cron Trigger; memory 128 MB; subrequests 50/request; **Cron Triggers: 5 per account**; static assets 20,000 files per Worker version and 25 MiB max per file — [Cloudflare Workers limits](https://developers.cloudflare.com/workers/platform/limits/)
- **Netlify Free:** "The Free plan includes 300 credits/month with a hard limit and no auto recharge option." Credit costs: Production deployment = 15 credits; web bandwidth 1 GB = 20 credits; functions compute 1 GB-hour = 10 credits (covers serverless, scheduled, and background functions); web requests 2 credits per 10,000. Deploy previews, branch deploys, and failed deploys are not metered — [Netlify credit-based plans docs](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/); [Netlify pricing](https://www.netlify.com/pricing/)

### Inferences
- Netlify math: 300 credits is about 15 GB of bandwidth with no deploys, or 20 production deploys and nothing else. Frequent production deploys eat the budget quickly (10 deploys = 150 credits), so Netlify Free fits a solo developer who ships often less well than Vercel or Cloudflare.
- For a project that may later charge money (premium templates, ads), Cloudflare Workers/Pages avoids Vercel's non-commercial restriction. The 10 ms CPU limit per request on Free is tight for server-side OG-image rendering (Satori/resvg). Pre-generating images or using `@vercel/og` on Vercel may be easier.
- Vercel Hobby is fine for an MVP or personal launch. Plan on Vercel Pro (US$20/developer seat/month per the Hobby docs page) or a move to Cloudflare once there is revenue.

### Gaps
- Exact current Vercel ToS wording on "non-commercial personal use" was not extracted this session. From prior knowledge, the ToS says Hobby is limited to non-commercial personal use, and Vercel's docs have defined commercial use to include charging for the site, ads, or sponsorships. Verify at vercel.com/legal/terms.
- Netlify: what happens when the 300 credits run out (sites paused until the next cycle?) and whether commercial use is allowed on Free were not stated on the fetched pages.
- Cloudflare Pages-specific free limits (UNVERIFIED, prior knowledge: 500 builds/month, unlimited static bandwidth/requests, Pages Functions count toward Workers' 100k/day) — not re-verified. Cloudflare has been steering new projects toward Workers with static assets.
- GitHub Pages (UNVERIFIED, prior knowledge: 1 GB site size, soft 100 GB/month bandwidth, 10 builds/hour, static only, ToS discourages using it mainly for commercial transactions) — not verified.
- Render free web services (UNVERIFIED, prior knowledge: spin down after 15 min idle, 750 instance-hours/month; free Postgres expires after ~30 days) — not verified.

## Database / auth / storage: which free backend, and what are the gotchas?

### Takeaway
Supabase Free (500 MB DB, 1 GB storage, 50k MAU, 5 GB egress, 2 active projects) is the most complete free backend for this app. Its main gotcha is that projects pause after 1 week of inactivity. Firebase Spark has a generous Firestore and Auth tier, but Cloud Storage, Cloud Functions, and phone-auth SMS all need the Blaze (card-on-file) plan.

### Cited Findings
- **Supabase Free:** database 500 MB per project; file storage 1 GB; 50,000 MAU; egress 5 GB plus 5 GB cached egress; Edge Function invocations 500,000; Realtime 200 concurrent peak connections and 2 million messages/month (max message 256 KB); "Limit of 2 active projects"; "Free projects are paused after 1 week of inactivity." Advanced phone MFA is not on Free. Free includes Auth Hooks for sending custom email/SMS — [Supabase pricing](https://supabase.com/pricing)
- **Supabase Cron:** "Every Job can run SQL snippets or database functions with zero network latency or make an HTTP request, such as invoking a Supabase Edge Function". Jobs "can run anywhere from every second to once a year" — [Supabase Cron docs](https://supabase.com/docs/guides/cron). The page does not state plan availability (see Gaps).
- **Firebase Spark (no-cost)**, Firestore Standard: 1 GiB stored; 10 GiB/month egress; 50K reads/day; 20K writes/day; 20K deletes/day. Firestore Enterprise: 40K write units/day, 50K read units/day. Auth: 50K MAUs (SAML/OIDC 50 MAUs). Hosting: 10 GB storage, 360 MB/day transfer. FCM: "No-cost" — [Firebase pricing](https://firebase.google.com/pricing)
- **Firebase Spark exclusions:** Cloud Storage, Cloud Functions, and phone-auth SMS are all marked "Not applicable" for Spark on the pricing page, so they need Blaze — [Firebase pricing](https://firebase.google.com/pricing). Localized pricing pages show a no-cost tier for `*.firebasestorage.app` buckets of "up to 5 GB-months", and multiple buckets need Blaze. Column alignment in those snippets was ambiguous — [Firebase pricing (localized)](https://firebase.google.com/pricing?hl=id)
- Blaze upgrade may come with US$300 free Google Cloud credit if eligible — [Firebase pricing (localized)](https://firebase.google.com/pricing?hl=id)
- **Cloudflare R2:** 10 GB-month storage/month free; 1 million Class A ops/month; 10 million Class B ops/month; **egress free**. Free tier applies only to Standard storage, not Infrequent Access — [Cloudflare R2 pricing](https://developers.cloudflare.com/r2/pricing/)
- **Cloudinary Free:** 25 credits/month, where 1 credit ≈ 1,000 transformations, 1 GB storage, or 1 GB bandwidth; up to 3 users — third-party summaries: [apiframe.ai](https://apiframe.ai/blog/cloudinary-pricing), [toolradar](https://toolradar.com/tools/cloudinary/pricing); Cloudinary's own [billing docs](https://cloudinary.com/documentation/billing_and_plans) were not fetched.
- **ImageKit Free:** about 20 GB bandwidth/month. Storage figures conflict: 20 GB per [agentdeals.dev](https://agentdeals.dev/cloudinary-vs-imagekit), 3 GB DAM storage per [freetier.co](https://freetier.co/compare/cloudinary-vs-imagekitio) and a Cloudinary-authored comparison ([Cloudinary](https://cloudinary.com/guides/alternative/imagekit-alternative), a competitor source).

### Inferences
- The Supabase pause risk is real for a seasonal "occasions" app. Low-traffic weeks can pause the project, and that breaks reminder crons and guest RSVP links. A pg_cron job that only runs inside the database may not count as "activity." A common workaround is an external ping, for example a GitHub Actions schedule that queries the API every few days. Upgrading to Pro (prior knowledge: US$25/month, unverified) removes pausing.
- Media plan: keep user-uploaded photos and video in R2 (free egress), or in Supabase Storage at small scale. Use Cloudinary or ImageKit only if on-the-fly transforms are needed. 5 GB of Supabase egress runs out quickly if wish pages embed full-size photos or videos.
- Firebase is attractive for FCM and Auth, but needing Blaze for Storage and Functions means a card on file and the risk of surprise bills. Supabase or Cloudflare (D1 + R2 + Workers) keeps a project at zero without a card, though R2 card requirements are unverified.

### Gaps
- Whether Supabase Cron (pg_cron/pg_net) is enabled on the Free plan was not stated on the docs page fetched. From prior knowledge it is available on all plans; verify.
- Appwrite Cloud Free (UNVERIFIED, prior knowledge: roughly 75k MAU, 2 GB storage, 5 GB bandwidth, projects paused after inactivity), Neon Free (prior knowledge: 0.5 GB storage per project, scale-to-zero compute hours), Turso Free (prior knowledge: ~5 GB storage, 500M row reads/month), and Cloudflare D1 Free (prior knowledge: 5 GB total storage, 5M rows read/day, 100k rows written/day) — none of these were re-verified this session.
- PocketBase: open-source (MIT), single Go binary with SQLite, auth, and file storage. Free software, but it needs a host with a persistent disk (a VPS or Fly.io; free hosting options are limited). Not verified this session.
- Whether R2 requires a payment method to activate is not stated on the pricing page. From prior knowledge, Cloudflare requires a card to enable R2; verify.
- Firebase Storage history: from prior knowledge, Google announced that since 30 Oct 2024 new default buckets need Blaze, and that from Oct 2025 (later extended to Feb 2026) Spark projects lose access to legacy `*.appspot.com` buckets unless upgraded. The English pricing page fetched now shows Storage as "Not applicable" on Spark, which is consistent, but the exact dates were not re-verified.

## Auth options: phone OTP in India, Google sign-in, magic links, guest RSVP

### Takeaway
Phone OTP is never truly free. Firebase phone auth needs Blaze, with roughly US$0.06–0.07 per India SMS according to third parties. Supabase phone auth needs your own SMS provider (Twilio, MSG91, etc.), where Indian domestic OTP SMS runs about ₹0.18–0.45. For a free MVP, use Google sign-in plus email magic links for hosts, and login-free guest RSVP through signed per-guest links.

### Cited Findings
- Firebase phone-auth SMS is "Not applicable" on Spark, so Blaze is required — [Firebase pricing](https://firebase.google.com/pricing). One source says phone auth has required a Cloud Billing account since Sept 2024 — [Logto blog](https://blog.logto.io/firebase-authentication-pricing)
- Firebase/Identity Platform India SMS rate per third parties: about $0.07/SMS per [Authgear](https://www.authgear.com/post/best-otp-service-providers/), about $0.06 (~₹5) per OTP per [productgrowth.in](https://productgrowth.in/numbers/sms-otp-cost-india/). Google's official table ([Identity Platform pricing](https://cloud.google.com/identity-platform/pricing)) did not render in fetch. One search summary attributed "first ten SMS per day not billed" to Google's page, which conflicts with Logto (no SMS allowance on Spark) — unresolved.
- Indian domestic OTP providers: ₹0.10–₹0.45 per delivered SMS in 2026; MSG91 about ₹0.18–0.25; Twilio India about ₹0.45 — [productgrowth.in](https://productgrowth.in/numbers/sms-otp-cost-india/)
- Firebase Phone Number Verification (PNV) is an SIM/carrier-based alternative to SMS (launched May 2026 per search summary). It needs a billing account for production, the SIM-less test mode needs none, and "Billing only occurs when a phone number is successfully returned". India is not among the 15 listed regions — [Firebase PNV pricing](https://firebase.google.com/docs/phone-number-verification/pricing)
- Supabase Free includes Auth Hooks for "sending custom email/SMS"; advanced phone MFA is not on Free — [Supabase pricing](https://supabase.com/pricing)
- Supabase Auth Free covers 50,000 MAU; Firebase Spark Auth covers 50K MAU — [Supabase pricing](https://supabase.com/pricing); [Firebase pricing](https://firebase.google.com/pricing)

### Inferences
- Firebase SMS at about ₹5 per OTP is 10–25x the cost of Indian aggregators. If phone login is needed, Supabase Auth plus an Auth Hook or SMS provider through MSG91 costs about ₹0.2 per OTP. Note that Indian commercial SMS also needs DLT template registration (not verified this session).
- Guest RSVP without login: generate a random, unguessable token per invite or guest (`/e/{eventId}?g={token}`), store RSVPs against it, and optionally collect a name and phone or email without verification. This costs nothing and removes friction, which matters because invitees arrive from WhatsApp.
- Google sign-in and email magic links are free on Supabase and Firebase within MAU limits. Magic-link volume counts against the email provider's quota (see Email).

### Gaps
- Official per-country Firebase/Identity Platform SMS price for India (+91) could not be read from Google's page. Third-party figures ($0.06–0.07) need confirmation.
- DLT registration requirements and costs for Indian OTP SMS not researched.

## Email: free transactional email options and deliverability

### Takeaway
Resend Free (3,000/month, 100/day, 3 domains) has the best developer experience. Brevo Free (300/day, about 9,000/month, shared between marketing and transactional, with Brevo branding) gives more daily volume. Either way you need your own domain with SPF/DKIM/DMARC for decent deliverability.

### Cited Findings
- **Resend Free:** 3,000 transactional emails/month; "The Free plan is limited to 100 emails per day"; 3 domains; 30-day data retention; marketing 1,000 contacts/month — [Resend pricing](https://resend.com/pricing)
- **Brevo Free:** 300 emails/day (about 9,000/month), shared across marketing and transactional, with Brevo branding. Contact caps conflict: 100,000 per some sources, "unlimited" per others. Cheapest paid tier is Starter at about $9/month for 5,000 emails — third-party: [dreamlit.ai](https://dreamlit.ai/blog/brevo-review), [sender.net](https://www.sender.net/reviews/brevo/pricing/free-plan), [dev.to](https://dev.to/techsifted/brevo-pricing-2026-every-plan-explained-with-the-hidden-costs-4oe3). The official [Brevo pricing](https://www.brevo.com/pricing/) page did not render in fetch.
- **OneSignal Free** also includes 10,000 email sends/month — [OneSignal pricing](https://onesignal.com/pricing)

### Inferences
- Reminder emails for a few hundred events per day fit inside Resend's 100/day cap only at small scale. Combining Resend (100/day) and Brevo (300/day) gives about 400/day free. A burst of invites (one host emailing 150 guests) could hit Resend's daily cap in one go, so use WhatsApp share links for invites and email mainly for reminders.
- Deliverability: send from a subdomain you own (for example `mail.yourapp.in`), set SPF, DKIM, and DMARC, and avoid Gmail-SMTP-from-app setups. A domain is effectively mandatory, since Resend requires a verified domain to send to arbitrary recipients (prior knowledge).

### Gaps
- Mailjet Free (UNVERIFIED, prior knowledge: 200/day, 6,000/month), Postmark developer tier (prior knowledge: 100 emails/month), Amazon SES (pay-as-you-go, about $0.10 per 1,000; the 12-month free tier changed in 2025), and Gmail SMTP limits (prior knowledge: about 500/day for consumer Gmail, 2,000/day for Workspace) — not verified this session.

## Push notifications: Web Push, iOS requirements, FCM, OneSignal

### Takeaway
Standard Web Push with VAPID keys is free and self-sent. iOS and iPadOS support it from 16.4, but only for web apps added to the Home Screen with a standalone or fullscreen manifest, and the permission prompt must follow a user gesture. FCM is free. OneSignal Free allows up to 10,000 web-push subscribers per send.

### Cited Findings
- iOS/iPadOS 16.4+ adds Web Push "to Home Screen web apps". The app must be added to the Home Screen. Manifest "display member set to standalone or fullscreen". Permission must be requested "in response to direct user interaction". It uses the Push API, Notifications API, and Service Workers. "You do not need to be a member of the Apple Developer Program". If you restrict push endpoints, allow `*.push.apple.com`. The Badging API is supported — [WebKit blog: Web Push for Web Apps on iOS and iPadOS](https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/)
- FCM is "No-cost" on Firebase's pricing page — [Firebase pricing](https://firebase.google.com/pricing)
- OneSignal Free: web push "Max 10,000 subscribers per send"; mobile push for up to 1,000 MAU; 10,000 email sends/month; 3 active journeys — [OneSignal pricing](https://onesignal.com/pricing)

### Inferences
- Self-sending Web Push (the `web-push` npm library plus VAPID keys, triggered from a Supabase Edge Function or Cloudflare Worker cron) costs nothing and avoids vendor limits. Store subscriptions in the database.
- For India, most users are on Android Chrome, where push works without installation. iPhone users must "Add to Home Screen" first, so the app needs an install-prompt or coach-mark flow. Email or WhatsApp-link fallbacks matter for iOS guests.

### Gaps
- iOS-specific delivery quirks (silent-push restrictions, subscriptions lost if the user deletes the home-screen app) were not researched further.

## Scheduled jobs for reminders

### Takeaway
Supabase Cron (pg_cron, down to every second) or Cloudflare Cron Triggers (5 per account on Free) are the best free schedulers. Vercel Hobby cron only runs once per day with ±59 min precision. GitHub Actions schedule allows every 5 minutes at best, can be delayed or dropped, and is disabled after 60 days of inactivity in public repos.

### Cited Findings
- **Vercel Hobby cron:** 100 cron jobs per project; minimum interval "Once per day"; precision "Per-hour (±59 min)". More frequent expressions "will fail deployment". Vercel Cron Jobs are labelled a legacy feature being migrated to "Schedules" — [Vercel Cron usage & pricing](https://vercel.com/docs/cron-jobs/usage-and-pricing) (last_updated 2026-07-15)
- **Cloudflare Workers Free:** 5 Cron Triggers per account, 10 ms CPU per Cron Trigger invocation — [Cloudflare Workers limits](https://developers.cloudflare.com/workers/platform/limits/)
- **Supabase Cron:** runs SQL, database functions, or HTTP requests (for example to Edge Functions), "from every second to once a year" — [Supabase Cron docs](https://supabase.com/docs/guides/cron)
- **GitHub Actions schedule:** "The shortest interval you can run scheduled workflows is once every 5 minutes"; it "can be delayed during periods of high loads… High load times include the start of every hour… some queued jobs may be dropped"; "In a public repository, scheduled workflows are automatically disabled when no repository activity has occurred in 60 days." — [GitHub Docs: events that trigger workflows](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows)
- Netlify scheduled functions consume credits (functions compute 1 GB-hr = 10 credits) — [Netlify credit-based plans](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/)

### Inferences
- Recommended pattern: one pg_cron job every 5–15 minutes calls an Edge Function that selects due reminders (`remind_at <= now() AND sent = false`), sends push and email, and marks them sent. Alternatively, a single Cloudflare Worker cron at `*/5 * * * *` does the same against the database. Avoid relying on Vercel Hobby cron for time-of-day reminders.
- The 10 ms CPU limit on Cloudflare Free covers a lightweight query-and-dispatch loop (I/O wait doesn't count), but not heavy work per run.

### Gaps
- Supabase Cron availability on Free was not explicitly confirmed (see the database section).

## Calendar: .ics, Add-to-Calendar links, subscribable feeds, Google Calendar API

### Takeaway
All "add to calendar" features can be built for free without any API: generate `.ics` files (for example with the `ics` npm package), deep links to Google Calendar and Outlook, and a per-user `webcal://` ICS feed for "my occasions". Avoid the Google Calendar API, which needs OAuth consent-screen verification for sensitive scopes.

### Cited Findings
- No official pages were fetched for this layer this session. See Gaps.

### Inferences
- (Prior knowledge, UNVERIFIED this session) Google Calendar template URL: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=TITLE&dates=YYYYMMDDTHHMMSSZ/YYYYMMDDTHHMMSSZ&details=...&location=...`. Outlook.com: `https://outlook.live.com/calendar/0/deeplink/compose?subject=...&startdt=ISO&enddt=ISO&body=...&location=...` (`outlook.office.com` for work accounts). Apple and others: serve an `.ics` with `Content-Type: text/calendar`.
- A subscribable feed (`webcal://yourapp.in/cal/{secretToken}.ics`) generated by an edge function gives each user a live "birthdays and anniversaries" calendar with yearly `RRULE:FREQ=YEARLY`. Google Calendar refreshes subscribed feeds slowly (often 12–24h+, prior knowledge), so don't depend on it for timely reminders.

### Gaps
- The `ics` npm package's current version and license (prior knowledge: ISC, maintained by adamgibbons) and the Google Calendar API quotas and verification rules were not verified this session.

## WhatsApp sharing: free links, OG previews, and the paid Business Platform

### Takeaway
Sharing via `wa.me/?text=` links and the Web Share API is free and is the main viral channel. Good previews need an og:image of about 1200x630 under ~300 KB. Automated sending through the WhatsApp Business Platform (Cloud API) is paid per delivered template message. India list rates are about ₹0.8631 for marketing and ₹0.115 for utility/authentication (vendor-reported). Since 1 Oct 2026 Meta also charges for service and in-window utility messages beyond 1,000 free service messages per month.

### Cited Findings
- **Meta pricing model:** per-message since July 1, 2025 ("Meta charges on a per-message basis"), billed only for delivered messages, with rates by category and recipient country. Template categories: Marketing, Utility, Authentication. Non-template: Service and Meta Business Agent (added July 1, 2026), only inside the 24-hour customer service window — [Meta: Pricing on the WhatsApp Business Platform](https://developers.facebook.com/docs/whatsapp/pricing)
- **2026 changes (Meta page):** Jan 1 2026, India marketing rate "Higher"; Apr 1, India authentication-international higher; **Oct 1 2026, Meta resumed charging for service messages and in-window utility messages**, with 1,000 free service messages per business phone number per month (no rollover). India INR billing localization launched Jan 1 2026, and eligible customers must migrate to INR by Dec 31, 2026. Messages in the free-entry-point window after Click-to-WhatsApp ads are not charged — [Meta pricing docs](https://developers.facebook.com/docs/whatsapp/pricing)
- **India INR rates (vendor-reported; Meta's rate card is a linked CSV/PDF, not checked):** Marketing ₹0.8631 (up from ₹0.7846 on Jan 1 2026); Utility ₹0.1150; Authentication ₹0.1150; Authentication-international ₹2.4971 (Oct 1 2026 card). Utility and authentication have volume tiers stepping down to about ₹0.0874. Rates exclude GST and BSP fees — [baat.ai](https://baat.ai/blog/whatsapp-api-pricing-india), [instantdm.com](https://instantdm.com/blog/whatsapp-business-api-pricing-2026-india-october-update), [chatmaxima](https://chatmaxima.com/whatsapp-api-pricing/india/). Older blogs list utility at ₹0.35 (pre-2026; disregard).
- **OG image for WhatsApp:** commonly reported limit of about 300 KB, beyond which the thumbnail is dropped; recommended 1200x630 (1.91:1); older minimum 300x200. No official WhatsApp spec was found — [andrewbaker.ninja (2026)](https://andrewbaker.ninja/2026/03/05/fix-thumbnail-previews-on-whatsapp-linkedin-x-guide/), [krumzi](https://www.krumzi.com/blog/open-graph-image-sizes-for-social-media-the-complete-2026-guide), [Flarum discussion](https://discuss.flarum.org/d/39207-whatsapp-embed)

### Inferences
- MVP: a "Share on WhatsApp" button using `https://wa.me/?text=<urlencoded message + link>` (or `api.whatsapp.com/send?text=`), with `navigator.share()` first on mobile. Each event or wish page gets a dynamic OG image, made with `@vercel/og` (Satori), Satori+resvg on Workers, or pre-rendered to R2. Output JPEG under ~300 KB at 1200x630, served over HTTPS with absolute og:image URLs.
- Automated WhatsApp reminders through the Cloud API would cost about ₹0.115 per utility message (reminders and RSVP confirmations should qualify as utility). That's ₹115 per 1,000 reminders plus GST and any BSP markup: cheap, but not free, and it needs Meta business verification and approved templates. Keep it as a paid upgrade.

### Gaps
- Meta's official India INR rate card (CSV/PDF) was not opened. INR figures are from vendor blogs that agree with each other.
- Exact WhatsApp OG image limits are not officially documented. The ~300 KB figure is empirical.

## Domain: cost of .in/.com and free subdomains

### Takeaway
No domain prices were verified this session. From prior knowledge, a `.in` costs roughly ₹500–900 in year one at Indian registrars, and `.com` roughly US$10–11 at cost (Cloudflare Registrar). Free subdomains come with each host: `*.vercel.app`, `*.pages.dev` / `*.workers.dev`, `*.netlify.app`, `*.github.io`.

### Cited Findings
- Vercel Hobby allows 50 domains per project. The free first-year domain offer applies only to paid Pro teams — [Vercel Hobby docs](https://vercel.com/docs/plans/hobby)

### Inferences
- A custom domain (about ₹800–1,000/year) is the one cost worth paying early. It is needed for email deliverability (SPF/DKIM), looks more trustworthy in WhatsApp previews, and lets you move hosts later.

### Gaps
- Registrar prices for .in and .com (Cloudflare Registrar at-cost pricing; renewal vs first-year promo pricing at GoDaddy, Hostinger, Namecheap) were not verified. Free subdomain services such as is-a.dev and eu.org were not researched.

## Frameworks, animation, and video export

### Takeaway
GSAP is now 100% free, including formerly paid plugins (SplitText, MorphSVG), for commercial use. The license bars building no-code animation tools that compete with Webflow. Remotion is free for organizations of up to 3 people, and a company license is needed from 4. Framework choice (Next.js, SvelteKit, or Astro) was not researched in depth this session.

### Cited Findings
- GSAP: "Webflow makes GSAP 100% free"; GSAP 3.13 notes say "the entire GSAP toolset is FREE, even for commercial use!" Formerly members-only plugins like SplitText and MorphSVG are included. The standard "No Charge" license prohibits use in tools that let users build visual animations without code and compete with Webflow's visual animation building — [Webflow blog](https://webflow.com/blog/gsap-becomes-free), [GSAP 3.13 blog](https://gsap.com/blog/3-13/), [GSAP standard license](https://gsap.com/community/standard-license/), [Pinegrow forum](https://forum.pinegrow.com/t/gsap-has-been-acquired-by-webflow/9906)
- Remotion: free for "an organization or team of individuals with up to 3 people". There is "no difference between the Free License and Company License when it comes to commercial usage". 4+ people need a Company License (third parties cite about $25/month per seat; verify) — [Remotion license FAQ](https://www.remotion.dev/docs/license/faq), [Remotion LICENSE](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md), [autoae.online](https://autoae.online/blog/is-remotion-free)

### Inferences
- For a "wish card" with animated, shareable output: animate in the browser with GSAP or Framer Motion (Motion) plus canvas-confetti or tsParticles and Lottie. Export images with `html-to-image`. For video, use MediaRecorder on a canvas (free, native) or ffmpeg.wasm (slow on low-end Android; a large ~25–30 MB core, prior knowledge). Remotion is a fit only for server-side or Lambda rendering and is free while the team is 3 or fewer.
- A user-facing "animation builder" probably counts as end users composing animations, not a no-code animation-tool product, but it sits close to GSAP's prohibited-use clause. Read the license or use Motion or anime.js to be safe.

### Gaps
- Next.js vs SvelteKit vs Astro PWA support (next-pwa/Serwist, @vite-pwa/sveltekit, @vite-pwa/astro), Framer Motion/Motion license (prior knowledge: MIT), Lottie-web (MIT), canvas-confetti (ISC), tsParticles (MIT), ffmpeg.wasm (MIT wrapper; core LGPL/GPL depending on build), and Satori/@vercel/og (MPL-2.0) — license details not verified this session.

## Analytics / monitoring

### Takeaway
No free-tier analytics or monitoring numbers were verified this session. The PostHog pricing page did not render, and Sentry and Umami were not fetched. Vercel Hobby includes Web Analytics with 50,000 events/month.

### Cited Findings
- Vercel Hobby: Web Analytics 50,000 events/month included (collection pauses after a grace period and resumes after 7 days); Speed Insights 10,000 events over 30 days — [Vercel Hobby docs](https://vercel.com/docs/plans/hobby)

### Inferences
- (Prior knowledge, UNVERIFIED) PostHog Cloud free: about 1M product-analytics events/month, 5k session replays, 1M feature-flag requests, 100k error exceptions, no card required. Sentry Developer (free): 1 user, about 5k errors/month. Umami: free self-hosted (MIT), and Umami Cloud has a free Hobby tier (about 100k events/month). Cloudflare Web Analytics is free. Verify before quoting.

### Gaps
- PostHog, Sentry, and Umami current free-tier numbers need verification from their official pricing pages.

---

### Recommended free stack for a solo developer (synthesis of the above)
- **Frontend/PWA:** SvelteKit or Next.js. Host on Cloudflare Workers/Pages (commercial OK, 100k req/day) or Vercel Hobby (100 GB, 1M invocations; non-commercial only).
- **Backend:** Supabase Free (Postgres + Auth + Storage + Edge Functions + Cron). Mitigate the 1-week-inactivity pause with an external ping, or upgrade once there is traction.
- **Media:** Cloudflare R2 (10 GB, free egress) for uploads. Pre-render OG images to R2 under 300 KB.
- **Auth:** Google OAuth plus email magic link for hosts. Token links for guest RSVP with no login. Defer phone OTP (paid: about ₹0.2 via MSG91 vs about ₹5 via Firebase).
- **Reminders:** Supabase pg_cron every 5–15 min, calling an Edge Function that sends VAPID Web Push (free) plus email via Resend (100/day) or Brevo (300/day).
- **Calendar:** `ics` npm, Google and Outlook deep links, a per-user webcal feed.
- **Sharing:** wa.me links plus the Web Share API. The WhatsApp Cloud API is a paid upgrade at about ₹0.115 per utility message.
- **Analytics:** PostHog free or Umami (verify limits).
- **Only unavoidable cost:** a domain, about ₹500–1,000/year (unverified).
