'use client';

import React, { useEffect, useRef } from 'react';
import { useInView, animate } from 'framer-motion';

export default function CountUpNumber({ value, prefix = "", suffix = "" }: { value: number, prefix?: string, suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, value, {
      duration: 2,
      ease: "easeOut",
      onUpdate(val) {
        if (ref.current) {
          const formatted = prefix === "Rp " ? 
             Math.floor(val).toLocaleString('id-ID') : 
             Number.isInteger(value) ? Math.floor(val).toString() : val.toFixed(1);
          ref.current.textContent = `${prefix}${formatted}${suffix}`;
        }
      }
    });
    return () => controls.stop();
  }, [value, isInView, prefix, suffix]);

  return <span ref={ref}>{prefix}0{suffix}</span>;
}
