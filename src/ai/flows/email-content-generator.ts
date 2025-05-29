// EmailContentGenerator.ts
'use server';

/**
 * @fileOverview Generates email content (subject, title, body) from a prompt using Genkit.
 *
 * - generateEmailContent - A function that generates email content.
 * - EmailContentInput - The input type for the generateEmailContent function.
 * - EmailContentOutput - The return type for the generateEmailContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EmailContentInputSchema = z.object({
  prompt: z.string().describe('A prompt to generate email content from.'),
});
export type EmailContentInput = z.infer<typeof EmailContentInputSchema>;

const EmailContentOutputSchema = z.object({
  subject: z.string().describe('The subject of the email.'),
  title: z.string().describe('The title of the email.'),
  body: z.string().describe('The body of the email.'),
});
export type EmailContentOutput = z.infer<typeof EmailContentOutputSchema>;

export async function generateEmailContent(input: EmailContentInput): Promise<EmailContentOutput> {
  return generateEmailContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'emailContentPrompt',
  input: {schema: EmailContentInputSchema},
  output: {schema: EmailContentOutputSchema},
  prompt: `You are an AI email content generator. Generate the subject, title, and body of an email based on the following prompt:

Prompt: {{{prompt}}}

Subject: {{subject}}
Title: {{title}}
Body: {{body}}`,
});

const generateEmailContentFlow = ai.defineFlow(
  {
    name: 'generateEmailContentFlow',
    inputSchema: EmailContentInputSchema,
    outputSchema: EmailContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
