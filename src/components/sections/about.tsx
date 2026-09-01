import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function About() {
  return (
    <section id="about" className="overflow-hidden bg-gradient-to-b from-gray-50 to-white py-24 px-8 dark:from-gray-900/50 dark:to-background">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 items-center gap-x-16 gap-y-16 lg:grid-cols-2">
          <div>
            <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
              What is GeSpark?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              GeSpark combines all essential calculators and converters in one clean platform. No sign-ups, no intrusive ads—just accurate, instant results designed for everyone.
            </p>
            <div className="mt-10">
              <Button asChild size="lg" className="rounded-full">
                <Link href="/tools">Explore Tools</Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <Image
              src="https://picsum.photos/seed/about-gespark/600/500"
              alt="Vector illustration of interconnected calculator and converter icons"
              data-ai-hint="interconnected tools vector"
              width={600}
              height={500}
              className="rounded-2xl object-cover shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}