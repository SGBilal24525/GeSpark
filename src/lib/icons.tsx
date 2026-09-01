

import {
    Activity, Banknote, Calculator, Percent, Calendar, Tag, Utensils, Clock, Flame, Wallet, Droplet, Heart,
    Scale, Timer, TrendingUp, BookOpen, Home, Receipt, Coins, DollarSign, Ruler, Weight, Thermometer, Square,
    Beaker, Gauge, HardDrive, Server, Wind, Box, Bolt, FlaskRound, Compass, Hammer, MapPin, Battery, Briefcase,
    Landmark, Code, CaseSensitive, FileSignature, Palette, Languages, Smile, Hash, CalendarDays, Mic,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const BmiIcon = Activity;
export const LoanIcon = Home; // Changed from Banknote to Home for Mortgage
export const EmiIcon = Calculator;
export const PercentageIcon = Percent;
export const AgeIcon = Calendar;
export const DiscountIcon = Tag;
export const TipIcon = Utensils;
export const CalorieIcon = Flame;
export const SalaryIcon = Wallet;
export const WaterIntakeIcon = Droplet;
export const PregnancyDueDateIcon = Heart;
export const IdealWeightIcon = Scale;
export const CountdownTimerIcon = Timer;
export const CompoundInterestIcon = TrendingUp;
export const GpaIcon = BookOpen;
export const MortgageIcon = Home;
export const TaxIcon = Receipt;
export const ProfitMarginIcon = Coins;
export const BodyFatIcon = Scale;
export const FreelanceRateIcon = Briefcase;
export const SavingGoalIcon = Landmark;
export const ElectricityBillIcon = Bolt;
export const BodySurfaceAreaIcon = Heart;
export const CodeConverterIcon = Code;
export const TextCaseConverterIcon = CaseSensitive;
export const GrammarCheckerIcon = FileSignature;
export const ColorConverterIcon = Palette;
export const LanguageTranslatorIcon = Languages;
export const EmojiConverterIcon = Smile;
export const HashtagGeneratorIcon = Hash;
export const DateFormatConverterIcon = CalendarDays;
export const StoryGeneratorIcon = Mic;
export const AdsenseEarningIcon = DollarSign;

export const CurrencyIcon = DollarSign;
export const LengthIcon = Ruler;
export const WeightIcon = Weight;
export const TimeIcon = Clock;
export const DataIcon = HardDrive;


const iconMap: Record<string, LucideIcon | ((props: any) => JSX.Element)> = {
    'adsense-earning-calculator': AdsenseEarningIcon,
    'bmi-calculator': BmiIcon,
    'loan-calculator': LoanIcon,
    'emi-calculator': EmiIcon,
    'percentage-calculator': PercentageIcon,
    'age-calculator': AgeIcon,
    'discount-calculator': DiscountIcon,
    'tip-calculator': TipIcon,
    'calorie-calculator': CalorieIcon,
    'salary-calculator': SalaryIcon,
    'water-intake-calculator': WaterIntakeIcon,
    'pregnancy-due-date-calculator': PregnancyDueDateIcon,
    'ideal-weight-calculator': IdealWeightIcon,
    'countdown-timer': CountdownTimerIcon,
    'compound-interest-calculator': CompoundInterestIcon,
    'gpa-calculator': GpaIcon,
    'mortgage-calculator': MortgageIcon,
    'tax-calculator': TaxIcon,
    'tax-saving-calculator': TaxIcon,
    'profit-margin-calculator': ProfitMarginIcon,
    'body-fat-calculator': BodyFatIcon,
    'freelance-rate-calculator': FreelanceRateIcon,
    'saving-goal-calculator': SavingGoalIcon,
    'electricity-bill-calculator': ElectricityBillIcon,
    'body-surface-area-calculator': BodySurfaceAreaIcon,
    'currency-converter': CurrencyIcon,
    'length-converter': LengthIcon,
    'weight-converter': WeightIcon,
    'time-calculator': TimeIcon,
    'data-converter': DataIcon,
    'code-converter': CodeConverterIcon,
    'text-case-converter': TextCaseConverterIcon,
    'grammar-checker': GrammarCheckerIcon,
    'color-converter': ColorConverterIcon,
    'language-translator': LanguageTranslatorIcon,
    'emoji-converter': EmojiConverterIcon,
    'ai-hashtag-generator': HashtagGeneratorIcon,
    'date-format-converter': DateFormatConverterIcon,
    'ai-story-generator': StoryGeneratorIcon,
};

export function getIconForTool(slug: string): LucideIcon | ((props: any) => JSX.Element) {
    return iconMap[slug] || Calculator;
}
