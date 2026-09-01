import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Sparkles, Lock, Smartphone } from 'lucide-react';

const features = [
  {
    icon: <Sparkles className="h-8 w-8 text-primary" />,
    title: 'Fast & Accurate',
    description: 'Get instant, reliable results every time.',
  },
  {
    icon: <Lock className="h-8 w-8 text-primary" />,
    title: 'Private & Secure',
    description: 'We never store or share your data.',
  },
  {
    icon: <Smartphone className="h-8 w-8 text-primary" />,
    title: 'Fully Responsive',
    description: 'Use seamlessly on mobile, tablet, and desktop.',
  },
];

export function WhyChooseUs() {
  return (
    <section id="features" className="bg-indigo-50 dark:bg-primary/5 py-20 px-8">
      <div className="container mx-auto">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
            Why Choose GeSpark?
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="transform-gpu rounded-2xl text-center shadow-md transition-all hover:-translate-y-2 hover:shadow-xl">
              <CardHeader className="p-8">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 dark:bg-primary/10">
                  {feature.icon}
                </div>
                <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
                <CardDescription className="pt-2 text-base">{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}