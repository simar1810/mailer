'use server';
import { sendMail, type MailOptions as NodemailerMailOptions } from '@/lib/nodemailer';

interface SendEmailParams {
  recipient: string;
  subject: string;
  textBody?: string;
  htmlBody?: string;
}

function mailOptions(mail: string, params: SendEmailParams): NodemailerMailOptions {
  return {
    to: params.recipient,
    subject: params.subject,
    textBody: params.textBody,
    htmlBody: params.htmlBody,
  }
};

export async function sendEmailAction(params: SendEmailParams): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const promises = [];
    for (const mail of params.recipient.replace(/ /g, "").split(",")) {
      promises.push(sendMail(mailOptions(mail, params)))
    }
    const result = await Promise.all(promises);

    if (result[0].success) {
      return { success: true, message: `Email sent successfully to ${params.recipient}. Message ID: ${result[0].messageId}` };
    } else {
      return { success: false, error: result[0].error || "An unknown error occurred while sending the email." };
    }
  } catch (error) {
    return {
      success: false, error: error instanceof Error
        ? error.message
        : "An unknown error occurred while sending the email."
    };
  }
}
