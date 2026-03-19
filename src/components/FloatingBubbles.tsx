import { useMemo } from "react";

export default function FloatingBubbles() {
  const items = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        key: i,
        left: `${((i * 17 + 11) % 97)}%`,
        width: `${20 + (i * 5) % 60}px`,
        height: `${20 + (i * 7) % 60}px`,
        duration: `${10 + (i % 13)}s`,
        delay: `${(i * 0.7) % 10}s`,
        opacity: 0.15,
      })),
    []
  );

  return (
    <div className="floating-bubbles-root" aria-hidden>
      {items.map((bubble) => (
        <span
          key={bubble.key}
          className="floating-bubble"
          style={{
            left: bubble.left,
            width: bubble.width,
            height: bubble.height,
            animationDuration: bubble.duration,
            animationDelay: bubble.delay,
            opacity: bubble.opacity,
          }}
        />
      ))}
    </div>
  );
}
