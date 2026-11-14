"use client";

import { useCallback, useEffect, useRef, type RefObject } from "react";

type OrientationEventWithPermission = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<"granted" | "denied">;
};

const clamp = (n: number) => Math.max(-1, Math.min(1, n));

// Writes --px / --py (-1..1) on the scene element every frame.
// Inputs: phone tilt, mouse position, or a gentle idle drift when nothing moves.
export function useParallax(ref: RefObject<HTMLElement | null>) {
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const lastInput = useRef(-Infinity);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onPointer = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      target.current = {
        x: (event.clientX / window.innerWidth - 0.5) * 2,
        y: (event.clientY / window.innerHeight - 0.5) * 2,
      };
      lastInput.current = performance.now();
    };

    const onOrientation = (event: DeviceOrientationEvent) => {
      if (event.gamma == null || event.beta == null) return;
      target.current = { x: clamp(event.gamma / 25), y: clamp((event.beta - 45) / 25) };
      lastInput.current = performance.now();
    };

    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("deviceorientation", onOrientation);

    let frame = 0;
    const tick = (time: number) => {
      const idle = time - lastInput.current > 2500;
      const tx = idle ? Math.sin(time / 2600) * 0.35 : target.current.x;
      const ty = idle ? Math.cos(time / 3400) * 0.25 : target.current.y;
      current.current.x += (tx - current.current.x) * 0.06;
      current.current.y += (ty - current.current.y) * 0.06;
      el.style.setProperty("--px", current.current.x.toFixed(4));
      el.style.setProperty("--py", current.current.y.toFixed(4));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("deviceorientation", onOrientation);
    };
  }, [ref]);

  // iPhone needs explicit permission for tilt, and only inside a tap handler.
  const enableTilt = useCallback(() => {
    const OrientationEvent = (typeof window !== "undefined" ? window.DeviceOrientationEvent : undefined) as
      | OrientationEventWithPermission
      | undefined;
    if (OrientationEvent?.requestPermission) {
      OrientationEvent.requestPermission().catch(() => {});
    }
  }, []);

  return { enableTilt };
}
