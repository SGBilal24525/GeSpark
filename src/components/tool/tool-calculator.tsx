
'use client';

import type { Tool } from '@/lib/tools';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { Skeleton } from '../ui/skeleton';

const LoadingComponent = () => (
    <div className="mx-auto max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div>
                <Skeleton className="h-[400px] w-full" />
            </div>
            <div className="sticky top-24">
                <Skeleton className="h-[400px] w-full" />
            </div>
        </div>
    </div>
);

// Map slugs to dynamically imported components
const toolComponentMap: Record<string, ReturnType<typeof dynamic>> = {
  'age-calculator': dynamic(() => import('./calculators/AgeCalculator').then(mod => mod.AgeCalculator), { loading: () => <LoadingComponent /> }),
  'adsense-earning-calculator': dynamic(() => import('./calculators/AdsenseEarningCalculator').then(mod => mod.AdsenseEarningCalculator), { loading: () => <LoadingComponent /> }),
  'bmi-calculator': dynamic(() => import('./calculators/BmiCalculator').then(mod => mod.BmiCalculator), { loading: () => <LoadingComponent /> }),
  'body-surface-area-calculator': dynamic(() => import('./calculators/BodySurfaceAreaCalculator').then(mod => mod.BodySurfaceAreaCalculator), { loading: () => <LoadingComponent /> }),
  'loan-calculator': dynamic(() => import('./calculators/MortgageCalculator').then(mod => mod.MortgageCalculator), { loading: () => <LoadingComponent /> }),
  'percentage-calculator': dynamic(() => import('./calculators/PercentageCalculator').then(mod => mod.PercentageCalculator), { loading: () => <LoadingComponent /> }),
  'time-calculator': dynamic(() => import('./calculators/TimeCalculator').then(mod => mod.TimeCalculator), { loading: () => <LoadingComponent /> }),
  'tip-calculator': dynamic(() => import('./calculators/TipCalculator').then(mod => mod.TipCalculator), { loading: () => <LoadingComponent /> }),
  'freelance-rate-calculator': dynamic(() => import('./calculators/FreelanceRateCalculator').then(mod => mod.FreelanceRateCalculator), { loading: () => <LoadingComponent /> }),
  'discount-calculator': dynamic(() => import('./calculators/DiscountCalculator').then(mod => mod.DiscountCalculator), { loading: () => <LoadingComponent /> }),
  'calorie-calculator': dynamic(() => import('./calculators/CalorieCalculator').then(mod => mod.CalorieCalculator), { loading: () => <LoadingComponent /> }),
  'salary-calculator': dynamic(() => import('./calculators/SalaryCalculator').then(mod => mod.SalaryCalculator), { loading: () => <LoadingComponent /> }),
  'saving-goal-calculator': dynamic(() => import('./calculators/SavingGoalCalculator').then(mod => mod.SavingGoalCalculator), { loading: () => <LoadingComponent /> }),
  'compound-interest-calculator': dynamic(() => import('./calculators/CompoundInterestCalculator').then(mod => mod.CompoundInterestCalculator), { loading: () => <LoadingComponent /> }),
  'tax-calculator': dynamic(() => import('./calculators/TaxCalculator').then(mod => mod.TaxCalculator), { loading: () => <LoadingComponent /> }),
  'tax-saving-calculator': dynamic(() => import('./calculators/TaxSavingCalculator').then(mod => mod.TaxSavingCalculator), { loading: () => <LoadingComponent /> }),
  'profit-margin-calculator': dynamic(() => import('./calculators/ProfitMarginCalculator').then(mod => mod.ProfitMarginCalculator), { loading: () => <LoadingComponent /> }),
  'gpa-calculator': dynamic(() => import('./calculators/GpaCalculator').then(mod => mod.GpaCalculator), { loading: () => <LoadingComponent /> }),
  'water-intake-calculator': dynamic(() => import('./calculators/WaterIntakeCalculator').then(mod => mod.WaterIntakeCalculator), { loading: () => <LoadingComponent /> }),
  'electricity-bill-calculator': dynamic(() => import('./calculators/ElectricityBillCalculator').then(mod => mod.ElectricityBillCalculator), { loading: () => <LoadingComponent /> }),
  'currency-converter': dynamic(() => import('./calculators/CurrencyConverter').then(mod => mod.CurrencyConverter), { loading: () => <LoadingComponent /> }),
  'length-converter': dynamic(() => import('./calculators/LengthConverter').then(mod => mod.LengthConverter), { loading: () => <LoadingComponent /> }),
  'weight-converter': dynamic(() => import('./calculators/WeightConverter').then(mod => mod.WeightConverter), { loading: () => <LoadingComponent /> }),
  'data-converter': dynamic(() => import('./calculators/DataConverter').then(mod => mod.DataConverter), { loading: () => <LoadingComponent /> }),
  'color-converter': dynamic(() => import('./calculators/ColorConverter').then(mod => mod.ColorConverter), { loading: () => <LoadingComponent /> }),
  'date-format-converter': dynamic(() => import('./calculators/DateFormatConverter').then(mod => mod.DateFormatConverter), { loading: () => <LoadingComponent /> }),
  'code-converter': dynamic(() => import('./calculators/CodeConverter').then(mod => mod.CodeConverter), { loading: () => <LoadingComponent /> }),
  'text-case-converter': dynamic(() => import('./calculators/TextCaseConverter').then(mod => mod.TextCaseConverter), { loading: () => <LoadingComponent /> }),
  'grammar-checker': dynamic(() => import('./calculators/GrammarChecker').then(mod => mod.GrammarChecker), { loading: () => <LoadingComponent /> }),
  'language-translator': dynamic(() => import('./calculators/LanguageTranslator').then(mod => mod.LanguageTranslator), { loading: () => <LoadingComponent /> }),
  'emoji-converter': dynamic(() => import('./calculators/EmojiConverter').then(mod => mod.EmojiConverter), { loading: () => <LoadingComponent /> }),
  'ai-hashtag-generator': dynamic(() => import('./calculators/HashtagGenerator').then(mod => mod.HashtagGenerator), { loading: () => <LoadingComponent /> }),
  'ai-story-generator': dynamic(() => import('./calculators/StoryGenerator').then(mod => mod.StoryGenerator), { loading: () => <LoadingComponent /> }),
};

export function ToolCalculator({ tool }: { tool: Tool }) {
  const ToolComponent = useMemo(() => toolComponentMap[tool.slug] || null, [tool.slug]);

  if (ToolComponent) {
    return <ToolComponent tool={tool} />;
  }

  return (
    <div className="text-center text-muted-foreground py-12">
      Calculator not found for &quot;{tool.name}&quot;.
    </div>
  );
}
