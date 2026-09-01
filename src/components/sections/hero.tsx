'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { tools } from '@/lib/tools';
import { motion } from 'framer-motion';
import { Calculator, Ruler, Sparkles } from 'lucide-react';
import { Icon } from 'next/dist/lib/metadata/types/metadata-types';

const cardIcons = [Calculator, Ruler, Sparkles];

const FloatingIcon = ({ index }: { index: number }) => {
  const Icon = cardIcons[index % cardIcons.length];
  const duration = 6 + Math.random() * 6;
  const delay = Math.random() * 3;
  const yOffset = -15 - Math.random() * 15;

  const positions = [
    { top: '15%', left: '25%', rotate: -15 },
    { top: '40%', left: '85%', rotate: 10 },
    { top: '75%', left: '20%', rotate: 5 },
    { top: '5%', left: '70%', rotate: -5 },
    { top: '60%', left: '50%', rotate: 15 },
  ];

  const pos = positions[index % positions.length];

  return (
    <motion.div
      className="absolute rounded-2xl bg-card/80 backdrop-blur-sm p-4 shadow-lg"
      style={{ ...pos }}
      animate={{
        y: [0, yOffset, 0],
        rotate: [pos.rotate, pos.rotate - 10, pos.rotate],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    >
      <Icon className="h-8 w-8 text-primary" />
    </motion.div>
  );
};

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-gray-50 via-indigo-50 to-white dark:from-gray-900/50 dark:via-indigo-900/10 dark:to-background">
      <div className="container relative grid min-h-[90vh] items-center gap-8 px-8 py-24 md:grid-cols-2">
        <div className="space-y-6 text-center md:text-left">
          <h1 className="font-headline text-5xl font-extrabold leading-tight tracking-tighter md:text-6xl">
            All Your Calculators & Converters — In One Place.
          </h1>
          <p className="mx-auto max-w-md text-lg text-gray-600 dark:text-gray-300 md:mx-0">
            Fast, accurate, and beautifully simple online tools built for everyone.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center md:justify-start">
            <Button asChild size="lg" className="rounded-full">
              <Link href="/tools">Explore Tools</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full">
              <Link href="/features">Learn More</Link>
            </Button>
          </div>
        </div>
        <div className="relative hidden h-full min-h-[400px] md:block">
          {[...Array(4)].map((_, index) => (
            <FloatingIcon key={index} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}