'use server';
/**
 * @fileOverview Explains the FLAMES result with a personalized interpretation.
 *
 * - explainFlamesResult - A function that explains the FLAMES result.
 * - ExplainFlamesResultInput - The input type for the explainFlamesResult function.
 * - ExplainFlamesResultOutput - The return type for the explainFlamesResult function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainFlamesResultInputSchema = z.object({
  name1: z.string().describe('The first name entered by the user.'),
  name2: z.string().describe('The second name entered by the user.'),
  flamesResult: z
    .enum(['Friends', 'Love', 'Affection', 'Marriage', 'Enemy', 'Siblings', 'Fling'])
    .describe('The FLAMES result calculated for the two names.'),
});
export type ExplainFlamesResultInput = z.infer<
  typeof ExplainFlamesResultInputSchema
>;

const ExplainFlamesResultOutputSchema = z.object({
  explanation: z
    .string()
    .describe(
      'A fun, lighthearted explanation of the FLAMES result, personalized based on the names.'
    ),
});
export type ExplainFlamesResultOutput = z.infer<
  typeof ExplainFlamesResultOutputSchema
>;

export async function explainFlamesResult(
  input: ExplainFlamesResultInput
): Promise<ExplainFlamesResultOutput> {
  return explainFlamesResultFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainFlamesResultPrompt',
  input: {schema: ExplainFlamesResultInputSchema},
  output: {schema: ExplainFlamesResultOutputSchema},
  prompt: `You are a relationship guru who provides explanations of FLAMES results. Your explanations can be fun and lighthearted, but if the result is negative (like 'Enemy'), you may be blunt, direct, or even a little harsh if appropriate. Don't sugarcoat negative outcomes, but always be clear and honest.

  The possible FLAMES results are: Friends, Love, Affection, Marriage, Enemy, Siblings, and Fling. 'Fling' means a short-term, passionate, but not lasting relationship.

  Based on the names {{name1}} and {{name2}}, and the FLAMES result of {{flamesResult}}, provide a personalized explanation of what this means for their relationship. Adjust your tone to match the result: playful for positive results, and more direct or harsh for negative ones. Be clear about what 'Fling' means if it is the result.
  `,
});

const explainFlamesResultFlow = ai.defineFlow(
  {
    name: 'explainFlamesResultFlow',
    inputSchema: ExplainFlamesResultInputSchema,
    outputSchema: ExplainFlamesResultOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
