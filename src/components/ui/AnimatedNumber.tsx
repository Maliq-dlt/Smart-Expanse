'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';
import { useFinanceStore } from '@/store/useFinanceStore';

interface AnimatedNumberProps {
  value: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  duration?: number;
}

export default function AnimatedNumber({
  value,
  className = '',
  prefix = '',
  suffix = '',
  duration = 1500,
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    duration: duration,
    bounce: 0,
  });
  const [hasAnimated, setHasAnimated] = useState(false);
  const { isPrivacyMode } = useFinanceStore();

  // Initial animation on view
  useEffect(() => {
    if (isInView && !hasAnimated) {
      motionValue.set(value);
      setHasAnimated(true);
    }
  }, [isInView, value, motionValue, hasAnimated]);

  // Re-animate when value changes (e.g. after a transaction)
  useEffect(() => {
    if (hasAnimated) {
      motionValue.set(value);
    }
  }, [value, motionValue, hasAnimated]);

  useEffect(() => {
    return springValue.on('change', (latest) => {
      if (ref.current) {
        if (isPrivacyMode) {
          ref.current.textContent = `${prefix}••••••${suffix}`;
        } else {
          ref.current.textContent = `${prefix}${Intl.NumberFormat('id-ID').format(Math.round(latest))}${suffix}`;
        }
      }
    });
  }, [springValue, prefix, suffix, isPrivacyMode]);

  // Handle immediate change when toggling privacy mode
  useEffect(() => {
    if (ref.current) {
      if (isPrivacyMode) {
        ref.current.textContent = `${prefix}••••••${suffix}`;
      } else {
        ref.current.textContent = `${prefix}${Intl.NumberFormat('id-ID').format(Math.round(springValue.get()))}${suffix}`;
      }
    }
  }, [isPrivacyMode, prefix, suffix, springValue]);

  return <span ref={ref} className={className} />;
}
