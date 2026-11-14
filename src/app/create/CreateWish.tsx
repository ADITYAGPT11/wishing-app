"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { encodeWish, LIMITS, normalizeWish, THEME_LIST, THEMES, type ThemeId } from "@/lib/wish";

const inputClass =
  "w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-white placeholder:text-white/40 outline-none transition focus:border-amber-200/70 focus:bg-white/10";

export function CreateWish() {
  const [theme, setTheme] = useState<ThemeId>("birthday");
  const [to, setTo] = useState("");
  const [from, setFrom] = useState("");
  const [messageIndex, setMessageIndex] = useState(0);
  const [message, setMessage] = useState(THEMES.birthday.messages[0]);
  const [createdId, setCreatedId] = useState("");
  const [copiedId, setCopiedId] = useState("");

  const wish = useMemo(
    () => normalizeWish({ theme, to: to || "Your friend", message, from }),
    [theme, to, message, from],
  );

  // Debounce the live preview so the iframe doesn't reload on every keystroke.
  const [previewId, setPreviewId] = useState(() => (wish ? encodeWish(wish) : ""));
  useEffect(() => {
    const id = window.setTimeout(() => setPreviewId(wish ? encodeWish(wish) : ""), 500);
    return () => window.clearTimeout(id);
  }, [wish]);

  // A created link only stays visible while the form still matches it,
  // so any edit asks the user to create a fresh link.
  const finalWish = useMemo(() => normalizeWish({ theme, to, message, from }), [theme, to, message, from]);
  const currentId = finalWish ? encodeWish(finalWish) : "";
  const link = createdId && createdId === currentId ? `${window.location.origin}/w/${createdId}` : "";
  const copied = copiedId !== "" && copiedId === createdId;

  const chooseTheme = (id: ThemeId) => {
    setTheme(id);
    setMessageIndex(0);
    setMessage(THEMES[id].messages[0]);
  };

  const suggestMessage = () => {
    const list = THEMES[theme].messages;
    const next = (messageIndex + 1) % list.length;
    setMessageIndex(next);
    setMessage(list[next]);
  };

  const createLink = () => {
    if (currentId) setCreatedId(currentId);
  };

  const shareText = `${to.trim() || "Hey"}, I made something special for you 🎁`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopiedId(createdId);
    } catch {
      setCopiedId("");
    }
  };

  const nativeShare = async () => {
    try {
      await navigator.share({ title: shareText, text: shareText, url: link });
    } catch {
      // User closed the share sheet.
    }
  };

  const canShare = typeof navigator !== "undefined" && "share" in navigator;

  return (
    <main className="flex-1 bg-[radial-gradient(120%_70%_at_50%_0%,#3b0764_0%,#1e0b3a_45%,#12082b_100%)] text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-8 sm:py-12 lg:grid-cols-[1fr_380px]">
        <section>
          <Link href="/" className="text-sm text-white/60 hover:text-white">
            ← Home
          </Link>
          <h1 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">Create a wish</h1>
          <p className="mt-2 text-white/70">Pick a design, personalise it, then share the link.</p>

          <h2 className="mt-8 text-sm font-semibold uppercase tracking-wider text-white/60">1. Choose a design</h2>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:max-w-md">
            {THEME_LIST.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => chooseTheme(t.id)}
                className={`rounded-2xl border p-1.5 text-left transition ${
                  theme === t.id ? "border-amber-200 ring-2 ring-amber-200/40" : "border-white/15 hover:border-white/40"
                }`}
              >
                <div className="flex h-24 items-center justify-center rounded-xl text-4xl" style={{ background: t.swatch }}>
                  {t.emoji}
                </div>
                <p className="px-1.5 pb-1 pt-2 text-sm font-semibold">{t.label}</p>
              </button>
            ))}
          </div>

          <h2 className="mt-8 text-sm font-semibold uppercase tracking-wider text-white/60">2. Personalise</h2>
          <div className="mt-3 grid gap-4 sm:max-w-xl">
            <label className="grid gap-1.5">
              <span className="text-sm text-white/80">Their name</span>
              <input
                className={inputClass}
                value={to}
                maxLength={LIMITS.to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="e.g. Riya or रिया"
              />
            </label>
            <label className="grid gap-1.5">
              <span className="flex items-center justify-between text-sm text-white/80">
                Message
                <button type="button" onClick={suggestMessage} className="text-xs text-amber-200 hover:underline">
                  Suggest another ↻
                </button>
              </span>
              <textarea
                className={`${inputClass} min-h-28 resize-y`}
                value={message}
                maxLength={LIMITS.message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <span className="text-right text-xs text-white/40">
                {message.length}/{LIMITS.message}
              </span>
            </label>
            <label className="grid gap-1.5">
              <span className="text-sm text-white/80">From (optional)</span>
              <input
                className={inputClass}
                value={from}
                maxLength={LIMITS.from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="Your name"
              />
            </label>
          </div>

          <h2 className="mt-8 text-sm font-semibold uppercase tracking-wider text-white/60">3. Share</h2>
          <div className="mt-3 sm:max-w-xl">
            {!link ? (
              <button
                type="button"
                onClick={createLink}
                disabled={!to.trim()}
                className="rounded-full bg-amber-200 px-6 py-3 font-semibold text-[#2a0a2e] transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {to.trim() ? "Create link 🎁" : "Add their name to continue"}
              </button>
            ) : (
              <div className="grid gap-3 rounded-2xl border border-white/15 bg-white/5 p-4">
                <p className="break-all rounded-lg bg-black/30 px-3 py-2 font-mono text-xs text-white/80">{link}</p>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`${shareText}\n${link}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-[#06260f] hover:brightness-110"
                  >
                    Send on WhatsApp
                  </a>
                  <button type="button" onClick={copy} className="rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold hover:bg-white/10">
                    {copied ? "Copied ✓" : "Copy link"}
                  </button>
                  {canShare && (
                    <button type="button" onClick={nativeShare} className="rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold hover:bg-white/10">
                      More apps…
                    </button>
                  )}
                  <a href={link} target="_blank" rel="noopener noreferrer" className="rounded-full px-3 py-2.5 text-sm text-white/70 underline-offset-4 hover:underline">
                    Open it
                  </a>
                </div>
              </div>
            )}
          </div>
        </section>

        <aside className="lg:sticky lg:top-8 lg:self-start">
          <p className="mb-3 text-center text-sm text-white/60">Live preview: tap the gift</p>
          <div className="mx-auto w-[300px] rounded-[2.2rem] border-[6px] border-white/15 bg-black p-1 shadow-2xl shadow-black/50">
            <div className="h-[600px] overflow-hidden rounded-[1.7rem]">
              {previewId && <iframe key={previewId} src={`/w/${previewId}`} title="Wish preview" className="h-full w-full border-0" />}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
