
'use server';

/**
 * @fileOverview An AI agent to convert between emojis and text.
 *
 * - convertEmoji - A function that handles the emoji conversion.
 * - EmojiConverterInput - The input type for the convertEmoji function.
 * - EmojiConverterOutput - The return type for the convertEmoji function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EmojiConverterInputSchema = z.object({
  text: z.string().describe('The text or emojis to be converted.'),
  mode: z.enum(['toEmoji', 'toText']).describe('The direction of conversion.'),
});
export type EmojiConverterInput = z.infer<typeof EmojiConverterInputSchema>;

const EmojiConverterOutputSchema = z.object({
  convertedText: z.string().describe('The resulting emojis or text.'),
  explanation: z.string().describe('A simple, educational explanation of the conversion.'),
});
export type EmojiConverterOutput = z.infer<typeof EmojiConverterOutputSchema>;

export async function convertEmoji(input: EmojiConverterInput): Promise<EmojiConverterOutput> {
  return emojiConverterFlow(input);
}


const prompt = ai.definePrompt({
  name: 'emojiConverterPrompt',
  input: {schema: EmojiConverterInputSchema},
  output: {schema: EmojiConverterOutputSchema},
  prompt: `You are an expert in emojis and human emotion. Your task is to convert text to emojis or emojis to text based on the provided mode.

    Mode: {{{mode}}}
    Input:
    '''
    {{{text}}}
    '''
    
    1.  **Perform the Conversion:**
        *   If the mode is 'toEmoji', analyze the emotional tone and context of the text and provide a short sequence of relevant emojis that capture the feeling.
        *   If the mode is 'toText', analyze the provided emojis and describe their collective meaning and emotional tone in a short, natural-sounding sentence.

    2.  **Provide an Explanation:**
        *   If 'toEmoji', explain *why* you chose those emojis based on the text's emotion (e.g., "The phrase 'I'm so happy' conveys strong joy, so I chose a beaming face and a party popper emoji to match that high energy.").
        *   If 'toText', explain the meaning of the emojis (e.g., "The 😂 emoji, 'Face with Tears of Joy', is used for intense laughter. The ❤️ emoji represents love or strong affection.").

    Your entire output must be a single, valid JSON object that adheres to the output schema.
    `,
});

const emojiConverterFlow = ai.defineFlow(
  {
    name: 'emojiConverterFlow',
    inputSchema: EmojiConverterInputSchema,
    outputSchema: EmojiConverterOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
