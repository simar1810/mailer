import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

const zohoUser = process.env.ZOHO_EMAIL_USER;
const zohoPass = process.env.ZOHO_EMAIL_PASS;
const zohoHost = process.env.ZOHO_SMTP_HOST || 'smtp.zoho.com';

let transporterInstance: Transporter | null = null;

if (zohoUser && zohoPass) {
  transporterInstance = nodemailer.createTransport({
    host: zohoHost,
    port: 465, // SSL
    secure: true, // true for 465
    auth: {
      user: zohoUser,
      pass: zohoPass,
    },
  });
} else {
  console.warn(
    "Zoho Mail credentials (ZOHO_EMAIL_USER, ZOHO_EMAIL_PASS) are not set in environment variables. Email sending will be disabled."
  );
}

export interface MailOptions {
  to: string; 
  subject: string;
  textBody?: string; 
  htmlBody?: string; 
}

export const sendMail = async (mailOptions: MailOptions) => {
  if (!transporterInstance) {
    return { success: false, error: "Email service is not configured. Missing Zoho credentials." };
  }
  if (!zohoUser) {
     return { success: false, error: "Sender email (ZOHO_EMAIL_USER) is not configured." };
  }

  const options = {
    from: `"Rajan Bookings" <${zohoUser}>`,
    to: mailOptions.to,
    subject: mailOptions.subject,
    text: mailOptions.textBody,
    html: mailOptions.htmlBody,
  };

  try {
    const info = await transporterInstance.sendMail(options);
    console.log('Message sent: %s', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { success: false, error: `Failed to send email: ${errorMessage}` };
  }
};
