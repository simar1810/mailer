'use server';
import { sendMail, type MailOptions as NodemailerMailOptions } from '@/lib/nodemailer';

interface SendEmailParams {
  recipient: string;
  subject: string;
  textBody?: string;
  htmlBody?: string;
}

export async function sendEmailAction(params: SendEmailParams): Promise<{ success: boolean; message?: string; error?: string }> {
  const mailOptions: NodemailerMailOptions = {
    to: params.recipient,
    subject: params.subject,
    textBody: params.textBody,
    htmlBody: params.htmlBody,
  };

  const result = await sendMail(mailOptions);

  if (result.success) {
    return { success: true, message: `Email sent successfully to ${params.recipient}. Message ID: ${result.messageId}` };
  } else {
    return { success: false, error: result.error || "An unknown error occurred while sending the email." };
  }
}
