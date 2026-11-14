"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { splitGraphemes, THEMES, type Wish } from "@/lib/wish";
import { vars } from "./scene-utils";
import { Confetti, type ConfettiHandle } from "./Confetti";
import { GiftBox } from "./GiftBox";
import { BirthdayScene } from "./scenes/BirthdayScene";
import { DiwaliScene } from "./scenes/DiwaliScene";
import { useParallax } from "./useParallax";
import "./wish.css";

type Stage = "closed" | "opening" | "open";

export function WishExperience({ wish }: { wish: Wish }) {
  const theme = THEMES[wish.theme];
  const [stage, setStage] = useState<Stage>("closed");
  const [replayKey, setReplayKey] = useState(0);
  const [loveSent, setLoveSent] = useState(false);
  const sceneRef = useRef<HTMLDivElement>(null);
  const confettiRef = useRef<ConfettiHandle>(null);
  const openTimer = useRef<number | undefined>(undefined);
  const { enableTilt } = useParallax(sceneRef);

  const letters = splitGraphemes(wish.to);

  const open = useCallback(() => {
    if (stage !== "closed") return;
    enableTilt();
    setStage("opening");
    openTimer.current = window.setTimeout(() => {
      setStage("open");
      confettiRef.current?.burst("celebrate");
    }, 1000);
  }, [stage, enableTilt]);

  useEffect(() => () => window.clearTimeout(openTimer.current), []);

  // Diwali keeps the sky alive with a few fireworks after opening.
  useEffect(() => {
    if (stage !== "open" || wish.theme !== "diwali") return;
    let count = 0;
    const id = window.setInterval(() => {
      confettiRef.current?.burst("firework");
      count += 1;
      if (count >= 8) window.clearInterval(id);
    }, 2600);
    return () => window.clearInterval(id);
  }, [stage, wish.theme]);

  const replay = () => {
    setStage("closed");
    setLoveSent(false);
    setReplayKey((k) => k + 1);
  };

  const sendLove = () => {
    confettiRef.current?.burst("hearts");
    setLoveSent(true);
  };

  return (
    <main className="wish-root" data-theme={wish.theme} data-stage={stage}>
      <div ref={sceneRef} className="wish-scene" aria-hidden="true">
        {wish.theme === "birthday" ? <BirthdayScene /> : <DiwaliScene />}
      </div>

      <div className="flash" aria-hidden="true" />
      <Confetti ref={confettiRef} mode={wish.theme === "diwali" ? "sparks" : "confetti"} />

      {stage !== "open" && (
        <div className="gift-stage">
          <p className="gift-teaser">
            <span>{wish.to},</span> someone sent you a surprise
          </p>
          <button type="button" className="gift-button" onClick={open} aria-label="Open your surprise">
            <GiftBox />
          </button>
          <p className="gift-hint">Tap the gift to open</p>
        </div>
      )}

      {stage === "open" && (
        <section key={replayKey} className="wish-content" style={vars({ "--n": letters.length })}>
          <p className="wish-headline">
            {theme.headline} {theme.emoji}
          </p>
          <h1 className="wish-name" aria-label={wish.to}>
            {letters.map((char, i) => (
              <span key={i} aria-hidden="true" style={vars({ "--i": i })}>
                {char === " " ? " " : char}
              </span>
            ))}
          </h1>
          {(wish.message || wish.from) && (
            <div className="wish-card">
              {wish.message && <p>{wish.message}</p>}
              {wish.from && <p className="wish-from">— {wish.from}</p>}
            </div>
          )}
          <div className="wish-actions">
            <button type="button" className="pill pill-primary" onClick={sendLove} disabled={loveSent}>
              {loveSent ? "Love sent ❤️" : "Send love back ❤️"}
            </button>
            <button type="button" className="pill" onClick={replay}>
              Replay ↺
            </button>
          </div>
          <Link href="/create" className="make-own">
            ✨ Make one for someone you love
          </Link>
        </section>
      )}
    </main>
  );
}
