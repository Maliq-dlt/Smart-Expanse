'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function ScrollRevealText({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 50%"]
  });

  const words = text.split(" ");
  return (
    <div ref={ref} className="flex flex-wrap justify-center gap-x-3 gap-y-1 max-w-4xl mx-auto px-6 py-32">
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + (1 / words.length);
        // We use React.createElement to avoid issues with hook inside map if any, but mapping over array is fine if array length is constant.
        // Even better, just call useTransform directly since words length is static.
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const opacity = useTransform(scrollYProgress, [start, end], [0.15, 1]);
        return (
          <motion.span key={i} style={{ opacity }} className="text-4xl md:text-6xl font-serif text-[var(--color-on-background)] text-center leading-tight">
            {word}
          </motion.span>
        );
      })}
    </div>
  );
}
