
'use server';

/**
 * @fileOverview An AI agent to translate text between languages and provide educational explanations.
 *
 * - translateText - A function that handles the translation process.
 * - TranslateTextInput - The input type for the translateText function.
 * - TranslateTextOutput - The return type for the translateText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateTextInputSchema = z.object({
  sourceText: z.string().describe('The text to be translated.'),
  sourceLanguage: z.string().describe('The source language of the text (e.g., "English"). "Auto-detect" is a valid value.'),
  targetLanguage: z.string().describe('The target language for the translation (e.g., "French").'),
});
export type TranslateTextInput = z.infer<typeof TranslateTextInputSchema>;

const TranslateTextOutputSchema = z.object({
    translatedText: z.string().describe('The translated text in the target language.'),
    explanation: z.string().describe('A simple, educational explanation of the translation, including notes on grammar, tone, and context.'),
});
export type TranslateTextOutput = z.infer<typeof TranslateTextOutputSchema>;

export async function translateText(input: TranslateTextInput): Promise<TranslateTextOutput> {
  return languageTranslatorFlow(input);
}


const prompt = ai.definePrompt({
    name: 'languageTranslatorPrompt',
    input: {schema: TranslateTextInputSchema},
    output: {schema: TranslateTextOutputSchema},
    prompt: `You are an expert linguist and a friendly teacher. Your task is to translate a piece of text and then explain the nuances of the translation.

    Source Language: {{{sourceLanguage}}}
    Target Language: {{{targetLanguage}}}
    Text to Translate:
    '''
    {{{sourceText}}}
    '''
    
    1.  **Translate the Text:** Provide an accurate and natural-sounding translation of the source text into the target language.
    2.  **Provide an Explanation:** Write a short, simple, and educational explanation about the translation. Focus on:
        *   **Context and Tone:** How the meaning or feeling might change between languages.
        *   **Grammar Notes:** Point out one interesting grammatical difference (e.g., word order, gendered nouns).
        *   **Alternative Phrases:** Suggest one or two other ways to say the same thing.

    Your entire output must be a single, valid JSON object that adheres to the output schema.
    `,
});

const languageTranslatorFlow = ai.defineFlow(
  {
    name: 'languageTranslatorFlow',
    inputSchema: TranslateTextInputSchema,
    outputSchema: TranslateTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
