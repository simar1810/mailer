import { z } from 'zod';

export const ComposeEmailSchema = z.object({
  recipient: z.string().email({ message: "Invalid email address." }),
  subject: z.string().min(1, { message: "Subject is required." }),
  titlePrompt: z.string().min(1, { message: "Title/Prompt for AI is required." }),
  body: z.string().min(1, { message: "Body is required." }),
});

export type ComposeEmailFormValues = z.infer<typeof ComposeEmailSchema>;

export const UploadHtmlEmailSchema = z.object({
  recipient: z.string().email({ message: "Invalid email address." }),
  subject: z.string().min(1, { message: "Subject is required." }),
  htmlFile: z.custom<FileList>((val) => val instanceof FileList && val.length > 0, "HTML file is required.")
    .refine((files) => files?.[0]?.type === "text/html", "File must be an HTML document."),
});

export type UploadHtmlEmailFormValues = z.infer<typeof UploadHtmlEmailSchema>;
