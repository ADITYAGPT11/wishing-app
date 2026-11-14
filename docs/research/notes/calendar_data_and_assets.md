# Calendar/Festival Data and Free Creative Assets (Licensing) for an Indian Wishes + Event-Invite Web App

Research date: 2026-11-14. Scope: (A) tithi/panchang computation libraries, tithi-birthday logic, festival-date data sources and APIs, Hijri/Saka calendar support in JS; (B) free illustration/icon/animation/font/photo/music sources, AI-asset copyright, religious imagery. Every item below was either checked against a primary page this session or is filed under Gaps as "prior knowledge, not re-verified".

---

## A1. Open-source libraries for tithi / nakshatra / lunar month / sunrise-based panchang (licences + accuracy caveats)

### Takeaway
The most complete panchang libraries (drik-panchanga, PyJHora) are **AGPL-3.0** and sit on **Swiss Ephemeris**, which is itself dual-licensed AGPL / paid Professional (700 CHF unlimited). For a closed-source web service that is a copyleft trap. The clean route is the **MIT-licensed astronomy-engine** (JS/Python/C/C#/Kotlin, ±1 arcminute), with your own tithi/masa logic on top. **jyotisha** (MIT) and **mhah-panchang** (MPL-2.0, a weak file-level copyleft) are the permissive alternatives, but check their dependencies.

### Cited Findings
**Swiss Ephemeris (the core trap)**
- Developers must choose between "a) GNU Affero General Public License (AGPL)" and "b) Swiss Ephemeris Professional License". Under AGPL the developer must place the "whole software project under the AGPL or a compatible license". The choice must be made before distributing software or before "any public service using the developed software is activated". The professional-licence document is "version 2026-09", and since May 2026 the ephemeris is based on JPL DE441. — [Astrodienst Swiss Ephemeris info](https://www.astro.com/swisseph/swephinfo_e.htm)
- Professional Edition: **unlimited licence 700.00 CHF**, converted to EUR/USD at current rates. "Only the license is sold, based on a signed license contract which you should email to order@astro.com." — [Astrodienst price page](https://www.astro.com/swisseph/swephprice_e.htm)
- The npm `swisseph` binding (v0.5.17, repo github.com/mivion/swisseph) has **no `license` field** in its npm metadata. The underlying Swiss Ephemeris licence still applies regardless. — [npm registry metadata](https://registry.npmjs.org/swisseph/latest)

**drik-panchanga (Python)**
- Licence: "GNU Affero GPL version 3 (or later)". Depends on **pyswisseph** (Python interface to Swiss Ephemeris). Computes tithi, nakshatra, yoga, karana, vaara with end times, plus sunrise/sunset/moonrise/moonset. Amanta (Amavasyanta) is the default month type. Purnimanta and adhika masa are not documented. Accuracy is limited by Swiss Ephemeris and the input lat/long; "good" from 5000 BCE to 5000 CE. Dates before 1582 need proleptic Gregorian. The repo has only 29 commits. — [GitHub webresh/drik-panchanga](https://github.com/webresh/drik-panchanga)

**PyJHora (Python)**
- Licence: **AGPL-3.0-or-later**. Depends on pyswisseph (plus PyQt6 for the GUI). Computes all five panchanga elements with end times. `tithi()` returns adhik tithi when present. `lunar_month_date` supports **both Amanta and Purnimanta**. `vedic_date` includes Adhik/Nija maasa flags. Ships a **multilingual festival CSV** with `get_festivals_of_the_day` / `get_festivals_between_the_dates`. Latest version 5.0.0, released Nov 8, 2026. — [PyPI PyJHora](https://pypi.org/project/PyJHora/)

**astronomy-engine (cosinekitty)**
- **MIT licence**. Available for C, C#, JavaScript, Python and Kotlin/JVM. "Accurate to within ±1 arcminute", with unit tests against NOVAS C 3.1 and JPL Horizons. Finds new/quarter/full moon and "any point between them, expressed in degrees of ecliptic longitude". "Calculates rise, set, and culmination times of Sun, Moon, and planets." — [GitHub cosinekitty/astronomy](https://github.com/cosinekitty/astronomy)

**jyotisha (sanskrit-coders / jyotisham org)**
- Repo lists an **MIT license** (LICENSE.txt). It is described as "Python tools for the astronomical / astrological vedAnga of Hindus" and mentions "example calendars". The repo page does not list its dependencies or festival database. — [GitHub jyotisham/jyotisha](https://github.com/jyotisham/jyotisha)

**mhah-panchang (npm)**
- Licence **MPL-2.0**, v1.2.0. Computes Tithi, Nakshatra, Karna, Yoga, Raasi and Ayanamsa, and "can also predict Masa (Hindu month) and Ritu". No runtime dependencies (pure TS build via tsdx). — [npm registry metadata](https://registry.npmjs.org/mhah-panchang/latest)

### Inferences
- **AGPL trap explained:** AGPL §13 requires offering source code to users who interact with the software over a network. Because Astrodienst explicitly ties the licence choice to activating a "public service", running drik-panchanga, PyJHora or swisseph bindings on a server for a public closed-source app would oblige you to release the **whole** app's source under AGPL. The alternative is buying the 700 CHF Professional licence, which covers Swiss Ephemeris only. PyJHora and drik-panchanga are separately AGPL, so a Swiss Ephemeris licence does **not** cure their copyleft. You would still have to rewrite or relicense that code.
- **Workarounds:**
  - (1) Run an AGPL tool **offline** to pre-generate a static JSON table of tithi/masa/festival dates for 2025–2035 and ship only the data. Computed astronomical facts are generally not copyrightable. This is a commonly argued position, not verified legal advice; get a lawyer's view.
  - (2) Write your own panchang on astronomy-engine (MIT):
    - tithi = floor(((λMoon − λSun) mod 360) / 12) + 1
    - nakshatra = floor(sidereal λMoon / 13°20′)
    - sidereal longitude = tropical longitude − Lahiri ayanamsa
    - the masa is named from the sidereal sign the Sun is in at the preceding new moon (amanta)
    - "tithi of the day" is the tithi prevailing at local **sunrise**, which astronomy-engine provides.
- ±1 arcminute accuracy is adequate for tithi boundaries. The Moon–Sun elongation changes ~12° per day, so 1′ is about 2 minutes of time. A date can still flip when a tithi ends within a few minutes of sunrise.
- MPL-2.0 (mhah-panchang) is file-level copyleft. You can use it in a closed-source app, but modifications to its own files must be published. It is low risk for a web app.
- Key accuracy caveats for the app:
  - **Location dependence:** sunrise-based tithi can differ between, e.g., Kolkata and Mumbai, or between India and the diaspora. Store the user's city or timezone.
  - **Amanta vs purnimanta:** month names for the krishna paksha differ by one month between South/West India (amanta) and North India (purnimanta).
  - **Adhika masa:** an extra lunar month occurs roughly every 32.5 months. Festivals and tithi birthdays are normally observed in the **nija** (regular) month, not the adhika one.
  - **Kshaya tithi:** a tithi that does not prevail at any sunrise.
  - **Vriddhi tithi:** a tithi that prevails at two sunrises.

### Gaps
- PyJHora's GitHub repository and LICENSE file were not opened directly. The licence comes from PyPI metadata.
- jyotisha's dependencies were not confirmed (whether it uses Swiss Ephemeris or skyfield/astropy). If it uses pyswisseph, the Swiss Ephemeris AGPL issue reappears despite jyotisha being MIT.
- The mhah-panchang npm page returned 403. Its algorithmic accuracy, which ayanamsa it uses, how it handles amanta vs purnimanta, and its download counts were not verified.
- Not researched: "panchang" npm packages beyond mhah-panchang, and the commercial Swiss Ephemeris licence PDF (secont_e_2609.pdf) wording about SaaS. The Astrodienst page did not say explicitly whether "SaaS" or "closed-source" triggers the licence beyond the "public service" phrase.

---

## A2. Computing a "tithi birthday" each year (and edge cases)

### Takeaway
No source fetched this session documents a canonical algorithm. The approach below is an engineering inference from standard panchang definitions, which the libraries above implement. PyJHora's lunar-month and next/previous-month functions are the closest ready-made building blocks, but they are AGPL.

### Cited Findings
- PyJHora exposes `lunar_month_date` (Amanta/Purnimanta), next/previous lunar month and year functions, and Adhik/Nija maasa flags in `vedic_date`. These are the primitives needed to locate the same (masa, paksha, tithi) in a later year. — [PyPI PyJHora](https://pypi.org/project/PyJHora/)
- astronomy-engine can search for the moment the Moon reaches any ecliptic-longitude offset from the Sun ("any point between them, expressed in degrees of ecliptic longitude") and computes sunrise. That is enough to find tithi start and end moments and the tithi at sunrise. — [GitHub cosinekitty/astronomy](https://github.com/cosinekitty/astronomy)

### Inferences
Proposed algorithm:
1. At birth, record the birth location (lat/long/timezone). Compute the **tithi prevailing at local sunrise** on the birth date (1–30, where 1–15 are shukla and 16–30 krishna), the **amanta masa** (name from the Sun's sidereal rashi at the preceding new moon), and whether that month was adhika.
2. For year Y, find the new moon that begins the same-named **nija** masa. If that masa is adhika in year Y, skip to the following nija month, which is the conventional practice.
3. Within that lunation, find the civil day whose **sunrise tithi** equals the target, using the user's *current* city.

Edge cases:
- **Kshaya tithi:** the target tithi starts and ends between two sunrises. The common convention picks the day on which the tithi *ends* or *was current*. Show the date with a note.
- **Vriddhi tithi:** the target prevails at two consecutive sunrises. Conventionally the first day is used.
- **Born in an adhika masa:** celebrate in the adhika month when one exists that year, otherwise in the nija month of the same name.
- **Purnimanta users (North India):** compute internally in amanta, then relabel the krishna-paksha month names for display.
- **Born before or after sunrise:** the panchang "day" runs sunrise to sunrise. Someone born at 03:00 belongs to the *previous* civil date's tithi.
- **Diaspora:** using the current-location sunrise vs the birthplace sunrise can shift the date by a day. Make it a user setting.
- **Solar-calendar communities:** Tamil/Malayali/Bengali/Odia users often use solar-month + nakshatra (janma nakshatra) birthdays instead, so offer nakshatra-based birthdays as an option.

### Gaps
- No authoritative published spec (e.g., from a Dharmashastra/panchang-maker source) on kshaya/vriddhi tie-breaking for birthdays was retrieved. The conventions above should be validated against a trusted panchang such as Drik Panchang before launch.

---

## A3. Festival-date data: free APIs, datasets, regional festivals, paid panchang APIs

### Takeaway
No fully free, licence-clean API covers Indian regional and religious festivals well. Calendarific's free tier is tiny (500 calls/month, attribution required). Prokerala's free tier (5,000 credits/month) suits panchang. PyJHora bundles a festival CSV but it is AGPL. The practical answer is to **pre-compute and curate a yearly festival JSON yourself** (a few hundred rows a year) and cache it, with Islamic dates flagged "subject to moon sighting".

### Cited Findings
- **Calendarific pricing:**

  | Plan | Price | Calls/month | Attribution |
  |---|---|---|---|
  | Free | $0 | 500 | Required |
  | Starter | $12/mo or $100/yr | 10,000 | Not required |
  | Business | $500/yr | 50,000 | Not required |
  | Enterprise | $4,000/yr | 50,000,000 | Not required |

  The free tier has "limited historical and upcoming data" and is single-language. The FAQ says the data includes "national holidays, local observances, religious holidays". The page does not mention India-specific coverage or whether the free tier allows commercial use. — [Calendarific pricing](https://calendarific.com/pricing)
- **Prokerala Astrology API pricing (INR, excl. GST):**

  | Plan | Price | Credits/month | Rate limit |
  |---|---|---|---|
  | Free | ₹0 | 5,000 | 5 req/min |
  | Ruby | ₹999/mo (list ₹1,999) | 100,000 | 60 req/min |
  | Emerald | ₹2,499/mo | 350,000 | 120 req/min |
  | Sapphire | ₹4,999/mo | 1,000,000 | 300 req/min |
  | Enterprise | Contact sales | Custom | Custom |

  An add-on of 100,000 credits (3-month validity) costs ₹2,500. Daily Panchang covers "Panchang, auspicious timings, Choghadiya, Yogas". Calendars include Amanta, Purnimanta and Vikram Samvat. The page names no festival endpoint, and does not state commercial-use or attribution terms for the free plan. — [Prokerala API pricing](https://api.prokerala.com/pricing)
- **PyJHora** includes a multilingual festival CSV and festival-query functions. Usable as a reference dataset, but AGPL-3.0-or-later. — [PyPI PyJHora](https://pypi.org/project/PyJHora/)
- **Nager.Date:** `date.nager.at/Country/IN` now 301-redirects to `nagerholidays.com/Country/IN`, which returned **HTTP 404**. India coverage could not be confirmed, and the 404 suggests India is not supported. — [date.nager.at/Country/IN](https://date.nager.at/Country/IN) → [nagerholidays.com/Country/IN](https://nagerholidays.com/Country/IN)

### Inferences
- With 500 calls/month, Calendarific's free tier works only if you fetch India's full-year list once per year or quarter and cache it server-side. Mandatory attribution makes it awkward for a polished consumer app. Starter ($12/mo) removes attribution.
- Recommended data strategy:
  1. Compute tithi-based Hindu festivals yourself from rules. Examples (amanta month names):
     - Ganesh Chaturthi: Bhadrapada shukla 4.
     - Karva Chauth: Kartika krishna 4 purnimanta, which is Ashwin krishna 4 amanta.
     - Diwali (Lakshmi Puja): Kartika amavasya purnimanta, which is Ashwin amavasya amanta. The pradosh-kaal rule applies.
     - Durga Puja (Maha Saptami–Dashami): Ashwin shukla 7–10.
     - Chhath: Kartika shukla 6.
  2. Compute **solar** festivals from the Sun's sidereal ingress:
     - Makar Sankranti/Pongal ≈ Sun entering sidereal Capricorn (mid-January).
     - Bihu (Rongali) and Vishu/Puthandu/Baisakhi ≈ Mesha sankranti (mid-April).
     - **Onam** = Thiruvonam nakshatra in the Malayalam solar month Chingam.
  3. Cross-check each year against a trusted published panchang, and against India's central government holiday list for gazetted holidays.
- Islamic dates (Eid al-Fitr, Eid al-Adha, Muharram, Milad-un-Nabi) in India depend on **local moon sighting**. They can differ by a day from Saudi/Umm al-Qura and from computed calendars. Show them as "expected" and allow an admin override.
- Sikh dates (Gurpurabs) mostly follow lunar tithis, although the Nanakshahi calendar debate means some are fixed solar dates. Jain festivals (Mahavir Jayanti, Paryushan, Diwali/Nirvan) follow tithis. Christian dates (Christmas fixed; Easter/Good Friday via the computus) are easy to compute.

### Gaps
- Not verified this session:
  - the Google Calendar public "Holidays in India" feed (`en.indian#holiday@group.v.calendar.google.com`): its coverage, terms of use, and whether programmatic commercial reuse is allowed;
  - data.gov.in holiday-list datasets (existence and licence, likely the Government Open Data License – India);
  - other paid panchang APIs (Vedic Astro API, AstrologyAPI.com): free tiers and prices.
- Calendarific's India coverage depth (regional festivals such as Bihu and Chhath) was not confirmed.
- No CC0/MIT GitHub dataset of multi-religion Indian festival dates was identified this session.

---

## A4. Hijri and Indian (Saka) calendar support in JavaScript (Intl, Temporal, libraries)

### Takeaway
Browsers' `Intl` supports `indian` (the Saka national **solar** calendar) and several Islamic variants (`islamic-umalqura`, `islamic-civil`, `islamic-tbla`, `islamic-rgsa`, `islamic`). **No Hindu lunisolar calendar is available in Intl or CLDR**, so tithi/masa must come from your own code.

### Cited Findings
- `Intl.supportedValuesOf("calendar")` returns the supported calendar identifiers. MDN's `getCalendars()` example for `ar-EG` returns `["gregory","coptic","islamic","islamic-civil","islamic-tbla"]`. The full identifier list is documented on the `supportedValuesOf` page. — [MDN Intl.Locale.getCalendars](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale/getCalendars)

### Inferences
- The `indian` identifier is the Saka national calendar, which is solar. It does not give Hindu lunisolar dates. The fetched MDN page did not state this; it is from general CLDR knowledge.
- Use `islamic-umalqura` for display. It is Saudi-tabular-based and will sometimes be a day off Indian moon-sighting dates. Pair it with the admin override noted in A3.
- The Temporal API supports the same CLDR calendar identifiers via `Temporal.PlainDate.from({calendar: 'islamic-umalqura', ...})`. This is from prior knowledge; check runtime support in late-2026 browsers.

### Gaps
- The exact identifier list, the deprecation status of `islamic`/`islamic-rgsa` in recent ECMA-402/CLDR, and Temporal's shipping status per browser as of Nov 2026 were not verified. The MDN fetch did not include them.
- moment-hijri / hijri-converter libraries were not researched. moment-hijri is believed to be MIT, but this was not verified.

---

## B1. Illustrations, emoji and Indian-themed vector art

### Takeaway
**unDraw** allows commercial use without credit, but **forbids bundling its illustrations as the core of an app, in packs, or for AI training**. That makes it a risky fit for template libraries. **Freepik** (whose terms page now redirects to "Magnific") requires attribution on free use and bars content as the main element of resold apps or merchandise. For emoji, **Twemoji (CC BY 4.0)** is the safest. **OpenMoji is CC BY-SA 4.0** (ShareAlike), and **Noto Emoji** is split between OFL (fonts) and Apache-2.0 (images).

### Cited Findings
- **unDraw:**
  - Grant: "nonexclusive, worldwide copyright license to download, copy, modify, distribute". Usable "for noncommercial and commercial purposes", and "You do not need to ask permission from or provide credit".
  - Excludes the right to "distribute the assets in packs or otherwise" and to "compile assets, vectors or images from unDraw to replicate a similar or competing service".
  - Its summary says not to proceed if illustrations are central to what you build, e.g., if you "add them in an app".
  - "Explicitly prohibits the use of unDraw assets... for training, fine-tuning".

  — [unDraw license](https://undraw.co/license)
- **Freepik / Magnific:**
  - `freepikcompany.com/legal` → `freepik.com/legal/terms-of-use` → **`magnific.com/legal/terms-of-use`**, operator "Magnific AI, S.L.U.".
  - Free use is "conditioned upon any use by the User being duly attributed to the Website/Company". Only Premium/Plus/Pro removes attribution.
  - Daily download limits apply. Use as the **main element of apps, videogames, NFTs aimed to be resold** is prohibited unless the subscription allows it.
  - No reselling, sublicensing, or including content "in a database, stock product, or library".
  - Content with logos or identifiable people is editorial-only.
  - **Storyset** content is governed by separate Storyset Terms, and attribution-free use is a Premium benefit.

  — [Magnific (ex-Freepik) Terms of Use](https://www.magnific.com/legal/terms-of-use)
- **Emoji sets:**
  - **OpenMoji** graphics: CC BY-SA 4.0, credit line "All emojis designed by OpenMoji". ShareAlike applies to remixes. The code is LGPL-3.0. — [OpenMoji FAQ](https://openmoji.org/faq); [npm openmoji](https://www.npmjs.com/package/openmoji)
  - **Twemoji:** CC BY 4.0, no ShareAlike. **Noto Emoji:** fonts OFL 1.1, SVG/PNG assets reportedly Apache-2.0, so check the LICENSE in each repo folder. The sources for this were aggregators and partially conflicting. — [allsvgicons emoji collection](https://allsvgicons.com/collections/emoji/); [emojifyi OpenMoji glossary](https://emojifyi.com/glossary/openmoji/)

### Inferences
- unDraw's app clause ("add them in an app" while illustrations are central) means a wishes/invite **template** product built around unDraw art is a poor fit. Use unDraw only for incidental UI, such as empty states or onboarding.
- OpenMoji's ShareAlike means any modified emoji artwork you ship, e.g., recoloured inside card templates, must be released under CC BY-SA. Prefer Twemoji or Noto for embedding into user-generated cards.
- For Indian motifs (diya, rangoli, mandala, kalash, toran), the cleanest path is to commission or self-draw SVGs, or generate them with AI and then hand-edit. Per-icon licences vary on SVGRepo, and Wikimedia Commons files carry per-file licences (CC0, CC BY, CC BY-SA, PD) that must be recorded individually.

### Gaps
- Not verified this session:
  - **Open Peeps** and **Humaaans** (believed CC0 by Pablo Stanley);
  - **Blush** (believed free tier with limited sets/resolution and attribution, paid for full);
  - the **Storyset** terms (believed free with attribution);
  - **SVGRepo**'s per-icon licence display;
  - Wikimedia Commons CC0 diya/rangoli files.
- The Twemoji licence was not confirmed from the jdecked/twemoji fork's LICENSE file. The Noto Emoji SVG licence conflicts between sources.

---

## B2. Icons (Lucide, Phosphor, Tabler, Heroicons)

### Takeaway
All four are permissive (MIT/ISC) per general knowledge, but none of their LICENSE files was re-fetched this session.

### Cited Findings
- No primary licence pages were fetched for these this session.

### Inferences
- Permissive icon licences only require keeping the copyright/licence notice in distributed source. A web app's JS bundle should keep a third-party notices file.

### Gaps
- Not verified this session (prior knowledge):
  - **Lucide**: ISC (with some MIT-derived Feather icons);
  - **Phosphor**: MIT;
  - **Tabler Icons**: MIT;
  - **Heroicons**: MIT.

  Confirm against each repo's LICENSE before shipping.

---

## B3. Animations (LottieFiles, IconScout)

### Takeaway
Free LottieFiles animations use the **Lottie Simple License**. It allows commercial use with no attribution, but forbids compiling files to build a similar or competing service. A wishes app that offers a gallery of Lottie animations should modify them and use them within designed templates, not mirror the LottieFiles catalogue.

### Cited Findings
- **Lottie Simple License:**
  - "Permission is hereby granted, free of charge, to any person obtaining a copy of the public animation files" to download, reproduce, modify, publish and distribute, "including for commercial purposes".
  - "Use of Files without attributing the creator(s) of the Files is permitted."
  - Modifications "must also be expressly distributed" under the same licence, and you "may not purport to impose any additional or different terms".
  - "This license does not include the right to collect or compile Files from LottieFiles" to build a similar or competing service.

  — [LottieFiles license page](https://lottiefiles.com/page/license)

### Inferences
- The "same terms" requirement for distributed or modified files is ShareAlike-like. If users can download the raw .json animations from your app, those files must stay under the Lottie Simple License. That is harmless, but don't claim exclusive rights over them.

### Gaps
- IconScout's free-asset licence (believed to require attribution for free items) was not verified.

---

## B4. Fonts (Google Fonts / OFL, Indic scripts)

### Takeaway
SIL OFL 1.1 fonts, which include essentially all Google Fonts Indic families, can be bundled and self-hosted in a commercial app. Images and cards rendered with them are not encumbered. You just can't sell the font file by itself or reuse Reserved Font Names on modified versions.

### Cited Findings
- **OFL 1.1:**
  - Fonts "may be bundled, redistributed and/or sold with any software".
  - "Neither the Font Software nor any of its individual components... may be sold by itself."
  - Modified versions may not "use the Reserved Font Name(s) unless explicit written permission is granted".
  - Derivatives "must be distributed entirely under this license".
  - "The requirement for fonts to remain under this license does not apply to any document created using the Font Software."

  — [OFL official text](https://openfontlicense.org/open-font-license-official-text/)

### Inferences
- Generated card images or videos with text in Devanagari, Tamil, Bengali and other scripts are "documents created using the Font Software", so they are free of OFL obligations.

### Gaps
- The per-family licences (Noto Sans Devanagari, Mukta, Baloo 2, Hind, Tiro Devanagari, Yatra One, Rozha One) were not confirmed individually. The Google Fonts licence page for Noto Sans Devanagari did not render in the fetch. All are believed OFL from prior knowledge.

---

## B5. Stock photos (Unsplash, Pexels, Pixabay): can they be bundled as app templates?

### Takeaway
All three allow free commercial use without attribution. All three forbid **selling or distributing unaltered/standalone copies** and **compiling content to build a similar or competing service**. Bundling a stock photo **inside a designed template** (text, layout, overlays) is generally the "new creative work" case. Shipping a browsable library of raw stock photos as card backgrounds starts to look like a competing service or standalone redistribution. Pexels is the only one that explicitly names "templates you sell" as allowed.

### Cited Findings
- **Unsplash:**
  - Grant: "an irrevocable, nonexclusive, worldwide copyright license to download, copy, modify, distribute, perform, and use images... for free, including for commercial purposes, without permission from or attributing the photographer or Unsplash".
  - Restrictions: "Images cannot be sold without significant modification", and the licence "does not include the right to compile images from Unsplash to replicate a similar or competing service".
  - Templates and apps are not mentioned.

  — [Unsplash License](https://unsplash.com/license)
- **Pexels:**
  - "Attribution is not required". Modification is allowed. Online use covers sites, e-commerce, e-books and **"templates you sell"**.
  - Not allowed: "Don't sell unaltered copies", and "Don't redistribute or sell the photos and videos on other stock photo or wallpaper platforms".
  - Not allowed: use as a trademark or trade name.
  - Not allowed: identifiable people "in a bad light or in a way that is offensive", or implying endorsement.

  — [Pexels License](https://www.pexels.com/license/)
- **Pixabay** (Content License summary + Terms §5, §7A, §8):
  - Free use, no attribution, modification allowed.
  - "You cannot sell or distribute Content (either in digital or physical form) on a Standalone basis". "Standalone" means "no creative effort has been applied to the Content and it remains in substantially the same form". Combining is OK "so long as the combined effect is to make a 'new' creative work".
  - The standalone ban explicitly covers "image, audio, video, NFT or other digital file".
  - Prohibited: printing on merchandise for sale; trademark/logo content for commercial goods/services; use as a trade mark or business name.
  - Prohibited: you may not "use or compile any Content to replicate a similar or competing service". "Bulk, large-scale or systematic copying" is prohibited, and so is scraping "for machine learning purposes".

  — [Pixabay license summary](https://pixabay.com/service/license-summary/); [Pixabay Terms](https://pixabay.com/service/terms/)

### Inferences
- Safe pattern: curate a modest number of photos, composite them into designed templates (crop, overlay, typography, colour grade), and serve the **final composed template**, not a downloadable raw-photo gallery. Avoid letting users download the original photo file from your app, because that is standalone redistribution.
- Using the Unsplash or Pexels **APIs** to let users search photos live is a different regime with API-specific guidelines (e.g., Unsplash requires hotlinking and attribution via its API). This was not verified this session.
- Watch for **identifiable people** (model-release issues) and **visible brands** in festival photos. Pixabay and Pexels both warn about third-party rights.

### Gaps
- Unsplash/Pexels API guidelines, i.e., the attribution and hotlinking duties when using the APIs, were not fetched.
- None of the three licence pages explicitly addresses "templates in a free app". The conclusion above is an inference from the standalone and competing-service clauses.

---

## B6. Music (YouTube Audio Library, Pixabay Music, FMA, Incompetech, Uppbeat; Bollywood risk)

### Takeaway
Pixabay music falls under the same Pixabay Content License (no standalone redistribution). The **YouTube Audio Library is positioned for YouTube use only**: Google says it "can't give legal guidance... on issues with music that can occur off the platform". Do not rely on it for a web app. Bollywood or film songs require licences from the labels and collecting societies and should be avoided entirely.

### Cited Findings
- **YouTube Audio Library:**
  - The library is "found exclusively in YouTube Studio". "YouTube can't give legal guidance, including guidance on issues with music that can occur off the platform."
  - Creative Commons tracks require crediting "the artist in your video's description".
  - Audio Library tracks "won't be claimed by a rights holder through the Content ID system".

  — [YouTube Help: Audio Library](https://support.google.com/youtube/answer/3376882)
- **Pixabay:** "Audio" (music and sound effects) is Content under the Pixabay Content License. It cannot be sold or distributed "as... audio" on a standalone basis. Music in apps and Content ID are not addressed. — [Pixabay Terms](https://pixabay.com/service/terms/)

### Inferences
- Pixabay music as background audio in an exported greeting video, mixed with visuals, is the "new creative work" case. Offering raw track downloads is not. Pixabay tracks are sometimes Content-ID-registered by their artists, which can cause claims when users post exported videos to YouTube or Instagram. This is a known community complaint, but it was not verified this session.
- Bollywood/film songs: copyrights are held by labels (e.g., T-Series, Saregama, Sony, Zee). Public performance and communication rights are administered by IPRS (composition) and PPL/Novex (sound recordings). Letting users add film songs to invites creates direct and secondary infringement exposure. Restrict the app to a vetted royalty-free library, or license through a music API.

### Gaps
- Not verified this session:
  - **Free Music Archive** (per-track CC licences; many are NC, which bars commercial use);
  - **Incompetech/Kevin MacLeod** (believed CC BY 4.0 with required credit, or a paid no-attribution licence);
  - **Uppbeat** (free tier with credit, believed limited to social/YouTube creator use);
  - specific Indian festive instrumental royalty-free sources (shehnai, dhol, sitar loops).
- IPRS/PPL tariff or enforcement details for apps were not researched.

---

## B7. AI-generated assets: copyright status (US, India) and generator terms

### Takeaway
In the US, purely AI-generated images are **not copyrightable**, and prompts alone don't confer authorship (Copyright Office Part 2 report, Jan 29 2025). Human selection and arrangement, or substantial editing, can be protected. India has no settled position on AI outputs. DPIIT's Dec 2025 working paper (Part 1) addressed **training** (a proposed hybrid statutory licence with royalties), and Part 2 on outputs was pending. Practically, AI-made template art is cheap to make but **you can't stop competitors copying it**.

### Cited Findings
- The US Copyright Office Part 2 report (Jan 29, 2025) concludes that, given current technology, prompts alone do not provide sufficient human control to make users authors of AI outputs. Purely AI-generated material is not copyrightable. Protection may extend to human-authored inputs that are perceptible in the output, and to creative selection or arrangement. Assessment is case by case. — [Mondaq summary](https://www.mondaq.com/unitedstates/new-technology/1579264/copyright-office-releases-part-2-of-artificial-intelligence-report); [IPWatchdog](https://ipwatchdog.com/2025/01/29/part-two-copyright-office-ai-report-says-creative-prompting-doesnt-constitute-authorship/); [Hogan Lovells](https://www.hoganlovells.com/en/publications/us-copyright-office-issues-report-on-copyrightability-of-ai-assisted-and-generated-works) (secondary summaries; primary at copyright.gov/ai)
- **India DPIIT working paper (Part 1, Dec 8, 2025):**
  - Proposes a **hybrid model**: a blanket licence for AI developers to train on lawfully accessed content, with royalties due on commercial launch, rates set by a government committee, and collection through a central body (reported as "CRCAT").
  - Zero-price licence rejected. Only registered rights holders would receive royalties.
  - Nasscom dissented, favouring a TDM exception with opt-out. MeitY backed the hybrid model.
  - Consultation draft. Part 2, on copyright status of AI outputs, is to come.

  — [Storyboard18](https://www.storyboard18.com/digital/dpiit-releases-working-paper-on-copyright-and-ai-proposes-hybrid-licensing-model-85551.htm); [Free Press Journal](https://www.freepressjournal.in/tech/dpiit-releases-draft-policy-on-ai-copyright-proposes-hybrid-licensing-model); [Fox Mandal](https://foxmandal.in/news/ai-training-hybrid-model-of-statutory-licensing-on-the-anvil/)
- Several free asset sites now **ban use of their assets for AI training**: unDraw explicitly, and Pixabay prohibits scraping "for machine learning purposes". — [unDraw license](https://undraw.co/license); [Pixabay Terms](https://pixabay.com/service/terms/)

### Inferences
- If the app generates AI art per user (e.g., personalised greeting images), ownership of outputs is murky. The app's ToS should not promise users copyright in AI outputs, and should pass through the generator's terms.
- Don't feed unDraw, Pixabay or other "no-ML" assets into any fine-tuning or style-training pipeline.

### Gaps
- Not verified this session:
  - whether DPIIT Part 2 (AI outputs) has been published as of Nov 2026;
  - the status of the Indian ANI v. OpenAI litigation (Delhi HC).
- Terms of specific free generators (e.g., commercial-use rights on free tiers of image models) were not researched. Check each provider's current ToS.

---

## B8. Deity images, religious symbols and trademarks

### Takeaway
No primary legal source was retrieved this session. The risks are mainly (1) copyright in specific artworks or photos of deities and temples, (2) hurt-sentiment criminal provisions, and (3) trademarks and brand assets in festival imagery.

### Cited Findings
- Pixabay prohibits commercial use of content depicting trademarks or logos in relation to goods/services, and use "in any immoral or illegal way". — [Pixabay license summary](https://pixabay.com/service/license-summary/)
- Pexels: identifiable people may not appear "in a bad light or in a way that is offensive". Don't imply endorsement. — [Pexels License](https://www.pexels.com/license/)
- Magnific/Freepik: content with logos, recognisable products or identifiable people is editorial-only. — [Magnific Terms](https://www.magnific.com/legal/terms-of-use)

### Inferences
- Deities and symbols (Om, swastika, khanda, crescent, cross) are not copyrightable as concepts, but **specific depictions** are: calendar art, temple photographs, studio illustrations. Use self-commissioned or properly licensed art.
- India's penal provisions on outraging religious feelings (former IPC §295A, now carried into the Bharatiya Nyaya Sanhita, 2023) create content-moderation risk for user-generated cards: deity images on footwear-adjacent designs, mocking edits, and similar. This was not verified against statute text this session. Add moderation and reporting tools, and avoid placing deity images in templates where they might be cropped or defaced.
- Avoid real brand logos (Cadbury, Amul, festival sponsor marks) and celebrity images in templates.

### Gaps
- No primary statute or case-law source on BNS religious-offence provisions, or on any trademark registrations of religious symbols, was fetched. This needs a lawyer or a dedicated legal search.
