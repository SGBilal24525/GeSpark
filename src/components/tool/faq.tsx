import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { tools } from '@/lib/tools';

type FaqProps = {
  tool: (typeof tools)[number];
};

export function Faq({ tool }: FaqProps) {
    const faqs = [
        {
            question: `How accurate is the ${tool.name}?`,
            answer: `Our ${tool.name} is designed to provide results based on standard, widely accepted formulas. While we strive for accuracy, it should be used for informational purposes only and not as a substitute for professional advice.`
        },
        {
            question: "Can I use this on mobile?",
            answer: "Yes, GeSpark and all its tools are fully responsive and designed to work seamlessly on desktops, tablets, and mobile devices."
        },
        {
            question: "Is my data stored?",
            answer: "No, we do not store any personal data you enter into our calculators or converters. All calculations are performed in your browser, ensuring your privacy is protected."
        }
    ]

  return (
    <section className="mx-auto max-w-2xl py-12">
      <h2 className="mb-8 text-center font-headline text-2xl font-bold">
        Frequently Asked Questions
      </h2>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-semibold">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
            </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
