
import { notFound } from 'next/navigation';
import { tools } from '@/lib/tools';
import { getToolBySlug } from '@/lib/utils';
import { Breadcrumbs } from '@/components/tool/breadcrumbs';
import { ToolHero } from '@/components/tool/tool-hero';
import { ToolCalculator } from '@/components/tool/tool-calculator';
import { RelatedTools } from '@/components/tool/related-tools';
import { Faq } from '@/components/tool/faq';
import { AnimatedSection } from '@/components/animated-section';
import type { Metadata } from 'next';
import Script from 'next/script';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Lightbulb } from 'lucide-react';
import { AiInsightDisplay } from '@/components/tool/ai-insight-display';
import { FormulaCard } from '@/components/tool/formula-card';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const tool = getToolBySlug(params.slug);
  if (!tool) {
    return {
      title: 'Tool Not Found',
    };
  }

  let title = `${tool.name} | GeSpark`;
  let description = `Use the ${tool.name} on GeSpark. ${tool.description}`;

  if (tool.slug === 'age-calculator') {
    title = 'Age Calculator — Calculate Your Exact Age in Seconds';
    description = 'Find your exact age in years, months, weeks, days, hours, minutes, and seconds with our professional AI-powered Age Calculator.';
  } else if (tool.slug === 'bmi-calculator') {
    title = 'BMI Calculator – Check Your Body Mass Index Online';
    description = 'Find your BMI and health category instantly with our AI-powered calculator.';
  } else if (tool.slug === 'loan-calculator') {
    title = 'Loan Calculator – Find Monthly Payment, Interest & Total Cost';
    description = 'Plan your loans smartly and understand how interest works with our powerful loan calculator.';
  } else if (tool.slug === 'percentage-calculator') {
    title = 'Percentage Calculator — Find %, Increase/Decrease & Value';
    description = 'Quick percentage math for discounts, growth, and comparisons.';
  } else if (tool.slug === 'tip-calculator') {
    title = 'Tip Calculator — Split Bills & Calculate Tips Quickly';
    description = 'Fast tip split for dining, rides, and services.';
  } else if (tool.slug === 'freelance-rate-calculator') {
    title = 'Freelance Rate Calculator — Hourly & Project Rates';
    description = 'Set your income goal, working hours, and get a recommended rate.';
  } else if (tool.slug === 'discount-calculator') {
    title = 'Discount Calculator — Find Final Price & Savings';
    description = 'Quickly calculate discount price, savings, and savings percentage.';
  } else if (tool.slug === 'calorie-calculator') {
    title = 'Calorie Calculator — BMR, Maintenance, Lose & Gain Calories';
    description = 'Accurate daily calorie estimate based on WHO / Mifflin-St Jeor standards.';
  } else if (tool.slug === 'salary-calculator') {
    title = 'Salary Calculator — Gross to Net (Take-Home) Salary';
    description = 'Calculate taxes, deductions & final take-home salary quickly.';
  } else if (tool.slug === 'saving-goal-calculator') {
    title = 'Saving Goal Calculator — How much to save weekly/monthly?';
    description = 'Plan your savings, with interest/return options and timeline.';
  } else if (tool.slug === 'compound-interest-calculator') {
    title = 'Compound Interest Calculator — Future Value & Growth Schedule';
    description = 'Calculate compound interest for various frequencies and contributions.';
  } else if (tool.slug === 'tax-calculator') {
    title = 'Tax Calculator — Compute Tax, Net Income & Slab Breakdown';
    description = 'Enter income, deductions & region to get tax liability instantly.';
  } else if (tool.slug === 'profit-margin-calculator') {
    title = 'Profit Margin Calculator — Know Your Profit & Margin (%)';
    description = 'Calculate gross profit, margin, markup, and break-even price quickly.';
  } else if (tool.slug === 'water-intake-calculator') {
    title = 'Water Intake Calculator — Daily Hydration Plan';
    description = 'Calculate daily water need based on weight, activity & climate.';
  } else if (tool.slug === 'gpa-calculator') {
    title = 'GPA Calculator — Calculate GPA & CGPA Online';
    description = 'Calculate your GPA easily, with grade scale support for A+, A, B+, etc.';
  } else if (tool.slug === 'currency-converter') {
    title = 'Currency Converter — Real-Time Exchange Rate & Conversion Tool';
    description = 'Fast, accurate, and AI-powered currency conversion with live rate updates.';
  } else if (tool.slug === 'adsense-earning-calculator') {
    title = 'AdSense Earning Calculator — Estimate Website & YouTube Revenue (2025)';
    description = 'Estimate your AdSense income from page views, CTR, and CPC easily.';
  }


  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    }
  };
}

export default function ToolPage({ params }: { params: { slug: string } }) {
  const tool = getToolBySlug(params.slug);

  if (!tool) {
    notFound();
  }

  const relatedTools = tools
    .filter((t) => t.category === tool.category && t.slug !== tool.slug)
    .slice(0, 3);
  
  const isAgeCalculator = tool.slug === 'age-calculator';
  const isBmiCalculator = tool.slug === 'bmi-calculator';
  const isLoanCalculator = tool.slug === 'loan-calculator' || tool.slug === 'emi-calculator';
  const isPercentageCalculator = tool.slug === 'percentage-calculator';
  const isAdsenseCalculator = tool.slug === 'adsense-earning-calculator';

  const ageSchema = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Age Calculator",
      "applicationCategory": "Utility",
      "operatingSystem": "Web",
      "description": "Calculate your exact age in years, months, weeks, days, hours, minutes, and seconds with our personal AI engine.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    };
  
  const bmiSchema = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "BMI Calculator",
      "applicationCategory": "HealthApplication",
      "operatingSystem": "Web",
      "description": "Calculate your BMI instantly and get AI-based health advice using our advanced BMI Calculator.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
  };

  const adsenseSchema = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "AdSense Earning Calculator",
      "applicationCategory": "FinanceTool",
      "operatingSystem": "Web",
      "description": "Estimate your potential AdSense revenue based on your website or YouTube channel’s traffic metrics.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
  };

  const loanFaqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [{
      "@type": "Question",
      "name": "How does the loan calculator formula work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The loan calculator uses the standard EMI formula to determine your fixed monthly payment. It takes into account the loan amount (principal), the annual interest rate, and the loan term to calculate a payment that ensures the loan is fully paid off, including interest, over the specified period."
      }
    }]
  };
  
  const percentageSchema = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Percentage Calculator",
      "applicationCategory": "Utility",
      "operatingSystem": "Web",
      "description": "A versatile percentage calculator for various calculations like finding percentages, calculating increases/decreases, and more.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
  };

  return (
    <div className="bg-gradient-to-b from-indigo-50/50 via-white to-indigo-50/50 dark:from-indigo-900/10 dark:via-background dark:to-indigo-900/10">
       {isAgeCalculator && (
         <Script
          id="tool-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ageSchema) }}
        />
       )}
       {isBmiCalculator && (
         <Script
          id="tool-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(bmiSchema) }}
        />
       )}
        {isAdsenseCalculator && (
            <Script
            id="tool-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(adsenseSchema) }}
            />
        )}
       {isLoanCalculator && (
         <Script
          id="tool-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(loanFaqSchema) }}
        />
       )}
       {isPercentageCalculator && (
         <Script
          id="tool-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(percentageSchema) }}
        />
       )}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs tool={tool} />
        <ToolHero tool={tool} />

        <div className="mx-auto mt-12 grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-1">
          <main>
            <AnimatedSection>
              <ToolCalculator tool={tool} />
            </AnimatedSection>
            
            {tool.blogSlug && (
                 <AnimatedSection>
                     <section id="blog-section" className="mx-auto max-w-4xl py-16">
                        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <CardHeader>
                                <CardTitle className="font-headline text-3xl">Learn More About the {tool.name}</CardTitle>
                                 <CardDescription className="pt-2 text-muted-foreground">A deep dive into the technology and use cases for this tool.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                 <Button asChild variant="link" className="p-0 text-primary">
                                    <Link href={`/blog/${tool.blogSlug}`}>Read The Full Guide <ArrowRight className="ml-2 h-4 w-4" /></Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </section>
                </AnimatedSection>
            )}

            {tool.formula && !isAdsenseCalculator && (
              <AnimatedSection>
                <section className="mx-auto max-w-2xl py-12">
                  <FormulaCard formula={tool.formula} />
                </section>
              </AnimatedSection>
            )}
          </main>
        </div>

        {!isAdsenseCalculator && (
          <AnimatedSection>
            <section className="mx-auto max-w-2xl py-12">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                    <Lightbulb className="h-6 w-6 text-yellow-400" />
                    How The Formula Works
                  </CardTitle>
                  <CardDescription>An AI-powered explanation of the math behind the {tool.name}.</CardDescription>
                </CardHeader>
                <CardContent>
                  <AiInsightDisplay toolName={tool.name} />
                </CardContent>
              </Card>
            </section>
          </AnimatedSection>
        )}

        <AnimatedSection>
          <RelatedTools relatedTools={relatedTools} />
        </AnimatedSection>

        <AnimatedSection>
          <Faq tool={tool} />
        </AnimatedSection>

      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return tools.map((tool) => ({
    slug: tool.slug,
  }));
}
