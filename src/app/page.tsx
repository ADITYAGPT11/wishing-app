import Link from "next/link";
import { APP_NAME } from "@/lib/config";

const FEATURES = [
  {
    emoji: "🎁",
    title: "Wishes that wow",
    text: "A gift box opens, confetti flies and their name lights up, with a scene that moves as they tilt their phone.",
    status: "Live",
  },
  {
    emoji: "📅",
    title: "A calendar that remembers",
    text: "Birthdays, anniversaries, festivals and tithi dates, with a nudge before each one.",
    status: "Next",
  },
  {
    emoji: "💌",
    title: "Invites with RSVP",
    text: "Share on WhatsApp. Guests reply in one tap, with no app and no signup.",
    status: "Soon",
  },
];

export default function Home() {
  return (
    <main className="relative flex-1 overflow-hidden bg-[radial-gradient(120%_70%_at_50%_0%,#4c1d95_0%,#2e1065_45%,#12082b_100%)] text-white">
      <div className="mx-auto flex max-w-5xl flex-col items-center px-4 pb-20 pt-16 text-center sm:pt-24">
        <p className="rounded-full border border-white/20 bg-white/5 px-4 py-1 text-sm text-white/80">{APP_NAME} · early preview</p>
        <h1 className="mt-6 font-display text-4xl font-extrabold leading-tight sm:text-6xl">
          Make someone feel <span className="bg-gradient-to-r from-amber-200 via-pink-300 to-violet-300 bg-clip-text text-transparent">extra special</span>
        </h1>
        <p className="mt-5 max-w-xl text-lg text-white/75">
          Pick a design, add their name, and send a link that opens into a little celebration made just for them.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/create" className="rounded-full bg-amber-200 px-6 py-3 font-semibold text-[#2a0a2e] transition hover:bg-amber-100">
            Create a wish ✨
          </Link>
          <Link href="/w/demo-birthday" className="rounded-full border border-white/30 px-6 py-3 font-semibold transition hover:bg-white/10">
            Birthday demo 🎂
          </Link>
          <Link href="/w/demo-diwali" className="rounded-full border border-white/30 px-6 py-3 font-semibold transition hover:bg-white/10">
            Diwali demo 🪔
          </Link>
        </div>

        <div className="mt-16 grid w-full gap-4 text-left sm:grid-cols-3">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur">
              <div className="flex items-center justify-between">
                <span className="text-3xl">{feature.emoji}</span>
                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-white/70">{feature.status}</span>
              </div>
              <h2 className="mt-3 text-lg font-semibold">{feature.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-white/70">{feature.text}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
