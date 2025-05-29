// src/ai/flows/html-optimizer.ts
'use server';

/**
 * @fileOverview Optimizes HTML email templates for better rendering across different email clients.
 *
 * - optimizeHtml - A function that optimizes HTML email templates.
 * - OptimizeHtmlInput - The input type for the optimizeHtml function.
 * - OptimizeHtmlOutput - The return type for the optimizeHtml function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeHtmlInputSchema = z.object({
  htmlContent: z
    .string()
    .describe('The HTML content of the email template to be optimized.'),
});
export type OptimizeHtmlInput = z.infer<typeof OptimizeHtmlInputSchema>;

const OptimizeHtmlOutputSchema = z.object({
  optimizedHtml: z
    .string()
    .describe('The optimized HTML content for better email client rendering.'),
  optimizationSummary: z
    .string()
    .describe('A summary of the optimizations performed on the HTML content.'),
});
export type OptimizeHtmlOutput = z.infer<typeof OptimizeHtmlOutputSchema>;

export async function optimizeHtml(input: OptimizeHtmlInput): Promise<OptimizeHtmlOutput> {
  return optimizeHtmlFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeHtmlPrompt',
  input: {schema: OptimizeHtmlInputSchema},
  output: {schema: OptimizeHtmlOutputSchema},
  prompt: `You are an expert in optimizing HTML email templates for maximum compatibility across various email clients.

  Your goal is to take the provided HTML and optimize it for consistent rendering in different email environments.

  Considerations:
  - Inline CSS styles to avoid compatibility issues with certain email clients.
  - Remove or replace HTML elements known to cause rendering problems.
  - Ensure the HTML is responsive and adapts well to different screen sizes.
  - Minify the HTML to reduce its size without affecting its functionality.

  Instructions:
  1. Analyze the provided HTML content.
  2. Apply optimizations to enhance compatibility and rendering consistency.
  3. Provide an optimization summary explaining the changes made and their purpose.

  HTML Content:
  {{htmlContent}}
  `,
});

const optimizeHtmlFlow = ai.defineFlow(
  {
    name: 'optimizeHtmlFlow',
    inputSchema: OptimizeHtmlInputSchema,
    outputSchema: OptimizeHtmlOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
