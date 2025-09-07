'use client';
import { motion, type MotionProps } from 'framer-motion';
import { PropsWithChildren } from 'react';

type FadeInProps = PropsWithChildren & MotionProps & { delay?: number };

export default function FadeIn({ children, delay = 0, ...rest }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
