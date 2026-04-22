import nodemailer from 'nodemailer';

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
}

export const sendEmail = async (options: EmailOptions) => {
  // 1. Create a transporter
  // For Gmail, you'd use service: 'gmail'
  // For development, we use Mailtrap/Ethereal settings
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // 2. Define email options
  const mailOptions = {
    from: '"Support Team" <support@yourapp.com>',
    to: options.email,
    subject: options.subject,
    html: options.message, // Use HTML for professional emails
  };

  // 3. Send the email
  await transporter.sendMail(mailOptions);
};