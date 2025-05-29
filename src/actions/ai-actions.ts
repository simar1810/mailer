'use server';
import { generateEmailContent, type EmailContentInput, type EmailContentOutput } from '@/ai/flows/email-content-generator';
import { optimizeHtml, type OptimizeHtmlInput, type OptimizeHtmlOutput } from '@/ai/flows/html-optimizer';

export async function generateEmailContentAction(input: EmailContentInput): Promise<EmailContentOutput | { error: string }> {
  try {
    const result = await generateEmailContent(input);
    return result;
  } catch (error) {
    console.error("Error in generateEmailContentAction:", error);
    return { error: error instanceof Error ? error.message : "Failed to generate email content." };
  }
}

export async function optimizeHtmlAction(input: OptimizeHtmlInput): Promise<OptimizeHtmlOutput | { error: string }> {
  try {
    const result = await optimizeHtml(input);
    return result;
  } catch (error) {
    console.error("Error in optimizeHtmlAction:", error);
    return { error: error instanceof Error ? error.message : "Failed to optimize HTML." };
  }
}
