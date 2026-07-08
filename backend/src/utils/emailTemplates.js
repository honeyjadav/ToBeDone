export const verificationEmailTemplate = (userName, verificationLink) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #5B5FEF 0%, #7B61FF 100%); color: white; padding: 20px; border-radius: 8px; }
        .content { padding: 20px; background: #f9f9f9; margin: 20px 0; border-radius: 8px; }
        .button { display: inline-block; padding: 12px 30px; background: #5B5FEF; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { font-size: 12px; color: #666; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to ToBeDone!</h1>
        </div>
        <div class="content">
          <p>Hi ${userName},</p>
          <p>Thank you for signing up! Please verify your email address to get started.</p>
          <a href="${verificationLink}" class="button">Verify Email</a>
          <p>If you didn't create this account, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 ToBeDone. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const resetPasswordTemplate = (userName, resetLink) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #5B5FEF 0%, #7B61FF 100%); color: white; padding: 20px; border-radius: 8px; }
        .content { padding: 20px; background: #f9f9f9; margin: 20px 0; border-radius: 8px; }
        .button { display: inline-block; padding: 12px 30px; background: #EF4444; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { font-size: 12px; color: #666; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Reset Your Password</h1>
        </div>
        <div class="content">
          <p>Hi ${userName},</p>
          <p>We received a request to reset your password. Click the button below to set a new password.</p>
          <a href="${resetLink}" class="button">Reset Password</a>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 ToBeDone. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const welcomeEmailTemplate = (userName) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #5B5FEF 0%, #7B61FF 100%); color: white; padding: 20px; border-radius: 8px; }
        .content { padding: 20px; background: #f9f9f9; margin: 20px 0; border-radius: 8px; }
        .footer { font-size: 12px; color: #666; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to ToBeDone!</h1>
        </div>
        <div class="content">
          <p>Hi ${userName},</p>
          <p>Your account is now active. You can start collaborating with your team right away!</p>
          <p>Features available:</p>
          <ul>
            <li>Create and manage projects</li>
            <li>Track tasks with our kanban board</li>
            <li>Real-time team chat</li>
            <li>AI-powered digest summaries</li>
            <li>Workflow automation</li>
          </ul>
        </div>
        <div class="footer">
          <p>&copy; 2024 ToBeDone. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};