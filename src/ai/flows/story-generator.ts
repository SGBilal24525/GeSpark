
'use server';

/**
 * @fileOverview An AI agent to generate a short story from a prompt.
 * This is a placeholder for the Voice-to-Text functionality.
 *
 * - generateStory - A function that handles story generation.
 * - GenerateStoryInput - The input type for the generateStory function.
 * - GenerateStoryOutput - The return type for the generateStory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStoryInputSchema = z.object({
  prompt: z.string().describe('The prompt or topic for the story.'),
});
export type GenerateStoryInput = z.infer<typeof GenerateStoryInputSchema>;

const GenerateStoryOutputSchema = z.object({
  story: z.string().describe('The generated story text.'),
});
export type GenerateStoryOutput = z.infer<typeof GenerateStoryOutputSchema>;

export async function generateStory(input: GenerateStoryInput): Promise<GenerateStoryOutput> {
  return storyGeneratorFlow(input);
}


const prompt = ai.definePrompt({
    name: 'storyGeneratorPrompt',
    input: {schema: GenerateStoryInputSchema},
    output: {schema: GenerateStoryOutputSchema},
    prompt: `You are a creative storyteller. Based on the following prompt, write a short, engaging story (about 150 words).

    Prompt:
    '''
    {{{prompt}}}
    '''
    `,
});

const storyGeneratorFlow = ai.defineFlow(
  {
    name: 'storyGeneratorFlow',
    inputSchema: GenerateStoryInputSchema,
    outputSchema: GenerateStoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
