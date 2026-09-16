import { useEffect, useRef, useState } from 'react';

interface Props {
  to: number;
  duration?: number;        // milliseconds
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
}

/**
 * Animated number counter that triggers when scrolled into view.
 * Uses IntersectionObserver — fires once.
 */
export default function CountUp({
  to,
  duration = 1800,
  suffix = '',
  prefix = '',
  decimals = 0,
  className = '',
}: Props) {
  const [value, setValue] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const elRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!elRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasStarted) {
            setHasStarted(true);
            const startTime = performance.now();
            const startValue = 0;
            const tick = (now: number) => {
              const elapsed = now - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // ease-out cubic
              const eased = 1 - Math.pow(1 - progress, 3);
              setValue(startValue + (to - startValue) * eased);
              if (progress < 1) requestAnimationFrame(tick);
              else setValue(to);
            };
            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(elRef.current);
    return () => observer.disconnect();
  }, [to, duration, hasStarted]);

  const formatted = value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={elRef} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
