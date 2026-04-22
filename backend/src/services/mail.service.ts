import nodemailer from "nodemailer";
import { ApiError } from "../utils/ApiError";

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
}

export class MailService {
  private static transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  static async send(options: SendMailOptions) {

    try {
      const info = await this.transporter.sendMail({
        from: `"EduPlatform Support" <${process.env.EMAIL_USER}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
      });
      return info;
    } catch (error) {
      console.error("Email Service Error:", error);
      throw new ApiError(500, "Failed to send email. Please try again later.");
    }
  }
}
