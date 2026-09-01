
'use server';

/**
 * @fileOverview An AI agent to check grammar, fix punctuation, and explain the corrections.
 *
 * - checkGrammar - A function that handles the grammar correction process.
 * - GrammarCheckInput - The input type for the checkGrammar function.
 * - GrammarCheckOutput - The return type for the checkGrammar function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GrammarCheckInputSchema = z.object({
  text: z.string().describe('The text to be checked for grammar and punctuation errors.'),
});
export type GrammarCheckInput = z.infer<typeof GrammarCheckInputSchema>;

const ErrorDetailSchema = z.object({
    errorType: z.string().describe('The type of error, e.g., "Grammar", "Punctuation", "Clarity".'),
    original: z.string().describe('The original text snippet with the error.'),
    suggestedFix: z.string().describe('The suggested corrected text snippet.'),
    explanation: z.string().describe('A simple, educational explanation of why the correction was made.'),
});

const GrammarCheckOutputSchema = z.object({
    correctedText: z.string().describe('The full text with all corrections applied.'),
    errors: z.array(ErrorDetailSchema).describe('A breakdown of each error found and its correction.'),
});
export type GrammarCheckOutput = z.infer<typeof GrammarCheckOutputSchema>;

export async function checkGrammar(input: GrammarCheckInput): Promise<GrammarCheckOutput> {
  return grammarCheckFlow(input);
}


const prompt = ai.definePrompt({
    name: 'grammarCheckPrompt',
    input: {schema: GrammarCheckInputSchema},
    output: {schema: GrammarCheckOutputSchema},
    prompt: `You are an expert English teacher. Your task is to analyze the provided text, correct any grammar, spelling, punctuation, or clarity errors, and explain the corrections in a simple, easy-to-understand way.

    Analyze the following text:
    '''
    {{{text}}}
    '''
    
    1.  **Correct the Text:** Rewrite the entire text with all necessary corrections applied.
    2.  **Breakdown Errors:** For each error you find, create a detailed breakdown. Classify the error type (Grammar, Punctuation, Spelling, Clarity), show the original snippet, the suggested fix, and provide a very simple, school-level explanation for the change.

    Your entire output must be a single, valid JSON object that adheres to the output schema.
    `,
});

const grammarCheckFlow = ai.defineFlow(
  {
    name: 'grammarCheckFlow',
    inputSchema: GrammarCheckInputSchema,
    outputSchema: GrammarCheckOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
