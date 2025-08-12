export const userVerifyTemplate =(userName:string,companyName:string,link:string,supportEmail:string):string=>{
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email Address</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background: #ffffff;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding: 10px 0;
        }
        .logo {
            max-width: 150px;
            height: auto;
        }
        .content {
            padding: 20px;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #007BFF;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            padding: 10px;
            font-size: 12px;
            color: #777777;
        }
        .expiry-note {
            font-size: 14px;
            color: #777777;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <!-- Replace with your logo or brand name -->
            <img src="https://yourcompany.com/logo.png" alt="Company Logo" class="logo">
            <h1>Verify Your Email Address</h1>
        </div>
        <div class="content">
            <p>Hi ${userName},</p>
            <p>Thank you for signing up with <strong>${companyName}</strong>! To complete your registration and access your account, please verify your email address by clicking the button below:</p>
            
            <div style="text-align: center;">
                <a href="${link}" class="button">Verify Email Address</a>
            </div>
            
            <p class="expiry-note">This link will expire in <strong>[X] hours</strong>. If you did not request this, please ignore this email or contact our support team.</p>
            
            <p>Need help? Contact us at <a href="mailto:${supportEmail}">${supportEmail}</a>.</p>
            
            <p>Best regards,<br>${companyName}</p>
        </div>
        <div class="footer">
            <p>&copy; 2025 ${companyName}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>

    `
}