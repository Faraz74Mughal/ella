export const getVerificationEmailTemplate = (name: string, url: string): string => {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
      <div style="background-color: #4A90E2; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">Confirm Your Email</h1>
      </div>
      <div style="padding: 30px; color: #333; line-height: 1.6;">
        <p>Hello <strong>${name}</strong>,</p>
        <p>Thank you for joining our platform. Before you can start using your account, we need to verify your email address.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${url}" style="background-color: #4A90E2; color: white; padding: 14px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Verify My Account</a>
        </div>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #888; font-size: 13px;">${url}</p>
        <p><em>This link expires in 24 hours.</em></p>
      </div>
      <div style="background-color: #f9f9f9; padding: 15px; text-align: center; font-size: 12px; color: #aaa;">
        © 2026 Your Platform. All rights reserved.
      </div>
    </div>
  `;
};

export const getResetPasswordTemplate = (url: string): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
      <h2 style="color: #D0021B;">Password Reset Request</h2>
      <p>We received a request to reset your password. Click the link below to choose a new one:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${url}" style="background-color: #D0021B; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px;">Reset My Password</a>
      </div>
      <p>If you did not request this, please ignore this email.</p>
    </div>
  `;
};