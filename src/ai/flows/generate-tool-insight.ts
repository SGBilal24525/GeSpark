
'use server';

/**
 * @fileOverview An AI agent to generate educational insights for tools.
 *
 * - generateToolInsight - A function that generates a helpful insight for a given tool name.
 * - GenerateToolInsightInput - The input type for the generateToolInsight function.
 * - GenerateToolInsightOutput - The return type for the generateToolInsight function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateToolInsightInputSchema = z.object({
  toolName: z.string().describe('The name of the tool.'),
});
export type GenerateToolInsightInput = z.infer<typeof GenerateToolInsightInputSchema>;

const GenerateToolInsightOutputSchema = z.object({
  insight: z
    .string()
    .describe('A helpful, educational explanation of how the tool works, formatted in 2-3 short bullet points in markdown format.'),
});
export type GenerateToolInsightOutput = z.infer<typeof GenerateToolInsightOutputSchema>;

export async function generateToolInsight(
  input: GenerateToolInsightInput
): Promise<GenerateToolInsightOutput> {
  return generateToolInsightFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateToolInsightPrompt',
  input: { schema: GenerateToolInsightInputSchema },
  output: { schema: GenerateToolInsightOutputSchema },
  prompt: `You are a friendly and helpful teacher. Your goal is to explain the formula for the "{{toolName}}" in a way that a school student can easily understand.
Your response must be formatted as 2-3 short bullet points in markdown format.

Example for a "BMI Calculator":
* The BMI formula is like a health score that uses your height and weight.
* It calculates this score using the rule: weight (in kilograms) divided by your height (in meters) squared.
* This single number helps quickly tell if someone is in a healthy weight range for their height.

Example for an "EMI Calculator" or "Loan Calculator":
* A loan formula helps figure out the fixed amount you pay each month for a loan.
* It uses the loan amount, the interest rate (how much extra you pay), and the loan duration (how long you have to pay it back).
* This makes sure that by the end of the loan term, you have paid back the original amount plus all the interest.

Example for a "Freelance Rate Calculator":
* Think of your income goal as a big box of cookies you want to earn each month.
* We figure out how many hours you can actually work and get paid for.
* Then, we divide the cookie goal by your paid hours to find out how many cookies (money) you need to earn each hour.

Example for a "Discount Calculator":
* Imagine a toy costs a certain amount. A discount is like getting some money off that price.
* The formula takes the original price and subtracts the discount amount to find the final price you pay.
* If the discount is a percentage, we first find that percentage of the price and then subtract it.

Example for a "Calorie Calculator":
* Calories are your body’s fuel, like petrol for a car.
* Your body burns some fuel even when you're resting, which is called your BMR.
* The total fuel you need depends on your BMR and how active you are during the day.

Example for a "Salary Calculator":
* Think of your Gross Salary as all the money your company agrees to pay you.
* From this, the government takes a little bit as tax to help run the country.
* Whatever is left after tax and other small cuts is your Net Salary, the money you get to take home!

Example for a "Tax Calculator":
* Socho tumhara total paisa 1,200,000 rupay saal ka.
* Kuch cheezen nikalte hain (deductions), jaise 200,000.
* Bacha hua paise ko taxable kehte hain: 1,000,000.
* Har hisse (slab) par alag rate lagta hai. Pehle kuch hisse free ho sakte hain.
* Sab mila kar jo tax aata hai — wahi tumhara tax payable hai.
`,
});

const generateToolInsightFlow = ai.defineFlow(
  {
    name: 'generateToolInsightFlow',
    inputSchema: GenerateToolInsightInputSchema,
    outputSchema: GenerateToolInsightOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
