'use server';

/**
 * @fileOverview An AI agent to convert code from one language to another and explain the differences.
 *
 * - convertCode - A function that handles the code conversion.
 * - ConvertCodeInput - The input type for the convertCode function.
 * - ConvertCodeOutput - The return type for the convertCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ConvertCodeInputSchema = z.object({
    sourceCode: z.string().describe('The source code to be converted.'),
    sourceLanguage: z.string().describe('The programming language of the source code.'),
    targetLanguage: z.string().describe('The programming language to convert the code to.'),
});
export type ConvertCodeInput = z.infer<typeof ConvertCodeInputSchema>;

const ConvertCodeOutputSchema = z.object({
    convertedCode: z.string().describe('The resulting code in the target language.'),
    syntaxComparison: z.string().describe('A markdown table comparing the key syntax differences for the converted concepts.'),
    explanation: z.string().describe('A simple, educational explanation of why the syntax changed, suitable for a beginner.'),
});
export type ConvertCodeOutput = z.infer<typeof ConvertCodeOutputSchema>;

export async function convertCode(input: ConvertCodeInput): Promise<ConvertCodeOutput> {
  return convertCodeFlow(input);
}


const prompt = ai.definePrompt({
    name: 'convertCodePrompt',
    input: {schema: ConvertCodeInputSchema},
    output: {schema: ConvertCodeOutputSchema},
    prompt: `You are an expert programmer and a friendly teacher. Your task is to convert a code snippet from a source language to a target language and explain the key differences in a way that is easy for a beginner to understand.

    Source Language: {{{sourceLanguage}}}
    Target Language: {{{targetLanguage}}}
    Source Code:
    '''
    {{{sourceCode}}}
    '''
    
    1.  **Convert the code:** Translate the source code into the target language, ensuring the logic remains identical.
    2.  **Create a Syntax Comparison Table:** Generate a markdown table that compares the syntax for the core concepts used in the code snippet. For example, how to declare a variable, print to console, or write a loop in each language.
    3.  **Provide a Simple Explanation:** Write a short, simple explanation (2-3 sentences) about the most significant changes, like why 'print()' became 'console.log()' or how variable declarations differ.
    
    Your entire output must be a single, valid JSON object that adheres to the output schema.
    `,
});

const convertCodeFlow = ai.defineFlow(
  {
    name: 'convertCodeFlow',
    inputSchema: ConvertCodeInputSchema,
    outputSchema: ConvertCodeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
