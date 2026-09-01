
'use server';

/**
 * @fileOverview An AI agent to generate social media hashtags from text.
 *
 * - generateHashtags - A function that handles the hashtag generation process.
 * - GenerateHashtagsInput - The input type for the generateHashtags function.
 * - GenerateHashtagsOutput - The return type for the generateHashtags function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateHashtagsInputSchema = z.object({
  text: z.string().describe('The social media post content or topic to generate hashtags for.'),
});
export type GenerateHashtagsInput = z.infer<typeof GenerateHashtagsInputSchema>;

const GenerateHashtagsOutputSchema = z.object({
  hashtags: z.array(z.string()).describe('An array of 20-30 relevant hashtags, including a mix of popular and niche tags.'),
  explanation: z.string().describe('A simple, educational explanation of how the AI analyzed the text and chose the hashtags based on keywords, tone, and context.'),
});
export type GenerateHashtagsOutput = z.infer<typeof GenerateHashtagsOutputSchema>;

export async function generateHashtags(input: GenerateHashtagsInput): Promise<GenerateHashtagsOutput> {
  return hashtagGeneratorFlow(input);
}


const prompt = ai.definePrompt({
    name: 'hashtagGeneratorPrompt',
    input: {schema: GenerateHashtagsInputSchema},
    output: {schema: GenerateHashtagsOutputSchema},
    prompt: `You are an expert social media strategist. Your task is to generate a set of relevant and effective hashtags for a given piece of text, and then explain your strategy.

    Analyze the following text:
    '''
    {{{text}}}
    '''
    
    1.  **Generate Hashtags:** Create a list of 20-30 hashtags. The list should include:
        *   **Broad/Popular Tags:** 5-7 high-traffic hashtags to maximize reach.
        *   **Niche Tags:** 10-15 specific hashtags relevant to the topic to target a dedicated audience.
        *   **Contextual/Emotional Tags:** 5-8 hashtags that reflect the tone or feeling of the post.

    2.  **Provide an Explanation:** Write a short, simple explanation of your process. Mention the key topics or emotions you identified in the text and how you chose a mix of popular and niche tags to balance reach and engagement.

    Your entire output must be a single, valid JSON object that adheres to the output schema.
    `,
});

const hashtagGeneratorFlow = ai.defineFlow(
  {
    name: 'hashtagGeneratorFlow',
    inputSchema: GenerateHashtagsInputSchema,
    outputSchema: GenerateHashtagsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
