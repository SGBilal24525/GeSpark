
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Activity, Scale, Heart } from "lucide-react";
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "BMI Calculator — Understand Your Body Mass Index and Ideal Weight",
  description: "A comprehensive guide to understanding BMI, how it's calculated, and what it means for your health. Learn about ideal weight ranges and how to interpret your results with our AI-powered tool.",
  openGraph: {
    title: "BMI Calculator — Understand Your Body Mass Index and Ideal Weight",
    description: "A deep dive into the science behind BMI and how to use our smart calculator for personalized health insights.",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "BMI Calculator — Understand Your Body Mass Index and Ideal Weight",
    description: "A deep dive into the science behind BMI and how to use our smart calculator for personalized health insights.",
  },
};

const AdSlotPlaceholder = () => (
    <div className="my-12 flex h-full min-h-[100px] items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-card py-8 text-center text-gray-400 dark:border-gray-700">
      <p className="font-medium">Advertisement / Sponsor Space</p>
    </div>
  );

export default function BmiBlogPost() {
  return (
    <div className="bg-white dark:bg-background">
      <article className="prose prose-lg dark:prose-invert mx-auto px-4 py-16 sm:px-6 lg:px-8 max-w-4xl">
        <header className="mb-12 text-center">
          <p className="mb-2 text-base font-semibold uppercase tracking-wider text-primary">Health & Wellness Guide</p>
          <h1 className="font-headline text-4xl font-extrabold tracking-tight sm:text-5xl">BMI Calculator — Understand Your Body Mass Index and Ideal Weight</h1>
          <p className="mt-4 text-xl text-muted-foreground">
            BMI is one of the simplest yet most powerful ways to measure your body’s health balance. Our AI-powered BMI Calculator helps you find your BMI instantly and gives personalized health insights.
          </p>
        </header>

        <section className="mt-16">
          <h2 className="font-headline text-3xl font-bold">What is BMI and Why Does It Matter?</h2>
          <p>
            Body Mass Index (BMI) is a measure that uses your height and weight to work out if your weight is healthy. It provides a simple estimate of body fat, and is a widely used screening tool for identifying potential weight problems in adults. A balanced BMI is often associated with better health outcomes.
          </p>
          <Card className="mt-6 not-prose">
            <CardContent className="p-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left font-semibold">BMI Range</th>
                    <th className="py-2 text-left font-semibold">Classification</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b"><td className="py-2">&lt;18.5</td><td className="py-2">Underweight</td></tr>
                  <tr className="border-b"><td className="py-2">18.5 – 24.9</td><td className="py-2">Normal Weight</td></tr>
                  <tr className="border-b"><td className="py-2">25 – 29.9</td><td className="py-2">Overweight</td></tr>
                  <tr className="border-b"><td className="py-2">30 – 34.9</td><td className="py-2">Obese</td></tr>
                  <tr><td className="py-2">≥35</td><td className="py-2">Extremely Obese</td></tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </section>
        
        <AdSlotPlaceholder />

        <section className="mt-16">
          <h2 className="font-headline text-3xl font-bold">How Our Calculator Works</h2>
          <p>Our system instantly computes BMI using the global standard formula. If you use pounds or feet/inches, our calculator automatically converts your values to metric for accuracy.</p>
          <div className="bg-muted p-4 rounded-lg mt-4">
            <code className="font-mono text-sm">BMI = weight(kg) / height(m)²</code>
            <br />
            <code className="font-mono text-sm">BMI = 703 × weight(lb) / height(in)²</code>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="font-headline text-3xl font-bold">AI-Based Health Insights</h2>
          <p>
            Once your BMI is calculated, our Personal AI Health Engine provides a unique recommendation based on your results. This personal touch makes our tool not just mathematical, but intelligently human.
          </p>
          <Card className="mt-6 not-prose bg-primary/10 dark:bg-primary/20">
              <CardContent className="p-6">
                  <blockquote className="border-l-4 border-primary pl-4 italic text-primary-foreground/80">
                      “Your BMI is 27.3 — slightly above the healthy range. A balanced diet and mild activity can help you reduce it to 24.”
                  </blockquote>
              </CardContent>
          </Card>
        </section>

        <section className="mt-16">
            <h2 className="font-headline text-3xl font-bold">Ideal Weight Range & Visualization</h2>
            <p>Your ideal weight is not a single number, but a healthy range. Our calculator automatically displays your target weight range, so you know exactly what to aim for. The graphical scale helps you visualize where your BMI lies and how close you are to the ideal zone.</p>
        </section>
        
        <section className="mt-16">
            <h2 className="font-headline text-3xl font-bold">Design and Accessibility</h2>
            <ul className="list-disc pl-5 space-y-2 mt-4">
                <li><span className="font-semibold">Responsive:</span> Works perfectly on desktop, tablet, and mobile.</li>
                <li><span className="font-semibold">Accessible:</span> ARIA-compliant for screen readers and full keyboard navigation.</li>
                <li><span className="font-semibold">Clean:</span> High-contrast colors and soft shadows for readability.</li>
            </ul>
        </section>

        <section className="mt-16">
            <h2 className="font-headline text-3xl font-bold">Privacy-First AI</h2>
            <p>We use our own in-house AI engine. No third-party APIs are called, and no personal data is ever stored. All calculations run securely in your browser.</p>
        </section>


        <section className="mt-16 text-center bg-primary/10 dark:bg-primary/20 p-8 rounded-2xl">
          <h2 className="font-headline text-3xl font-bold">Take the First Step Towards a Healthier You.</h2>
          <p className="mt-4 text-xl">Accurate, Private, and Insightful.</p>
          <Button asChild size="lg" className="mt-6 rounded-full">
            <Link href="/tools/bmi-calculator">
              Calculate Your BMI Now <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </section>

      </article>
    </div>
  );
}
