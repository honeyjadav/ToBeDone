// Reusable base wrapper — gives every email the same header, footer, and styling
const baseTemplate = ({ title, bodyHtml }) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f5f7; font-family: 'Segoe UI', Arial, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f5f7; padding:40px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.06);">
            <!-- Header -->
            <tr>
              <td style="background-color:#4f46e5; padding:24px 32px;">
                <span style="color:#ffffff; font-size:20px; font-weight:600;">ToBeDone</span>
              </td>
            </tr>
            <!-- Body -->
            <tr>
              <td style="padding:32px;">
                ${bodyHtml}
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="padding:20px 32px; background-color:#fafafa; border-top:1px solid #eee;">
                <p style="margin:0; font-size:12px; color:#9ca3af;">
                  If you didn't request this, you can safely ignore this email.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

// OTP verification email
export const otpEmailTemplate = ({ name, otp, expiryMinutes }) =>
  baseTemplate({
    title: "Verify your email",
    bodyHtml: `
      <p style="margin:0 0 16px; font-size:15px; color:#111827;">Hi ${name},</p>
      <p style="margin:0 0 24px; font-size:15px; color:#374151;">
        Use the verification code below to confirm your email address.
      </p>
      <div style="text-align:center; margin:32px 0;">
        <span style="display:inline-block; padding:14px 28px; font-size:32px; font-weight:700; letter-spacing:8px; color:#4f46e5; background-color:#eef2ff; border-radius:8px;">
          ${otp}
        </span>
      </div>
      <p style="margin:0; font-size:14px; color:#6b7280;">
        This code expires in <strong>${expiryMinutes} minutes</strong>.
      </p>
    `,
  });

// Login success email
export const loginSuccessEmailTemplate = ({ name, loginTime }) =>
  baseTemplate({
    title: "Successfully signed in to ToBeDone",
    bodyHtml: `
      <p style="margin:0 0 16px; font-size:15px; color:#111827;">Hi ${name},</p>
      <p style="margin:0 0 24px; font-size:15px; color:#374151;">
        Your account was successfully verified and you are now signed in.
      </p>
      <p style="margin:0 0 16px; font-size:14px; color:#6b7280;">
        Login time: <strong>${loginTime}</strong>
      </p>
      <p style="margin:0; font-size:14px; color:#6b7280;">
        If this wasn't you, please contact support immediately or revoke active sessions from your account.
      </p>
    `,
  });

// Workspace invite email (bonus — same pattern, reused for your invite feature)
export const inviteEmailTemplate = ({ workspaceName, inviterName, inviteLink, role }) =>
  baseTemplate({
    title: `You're invited to join ${workspaceName}`,
    bodyHtml: `
      <p style="margin:0 0 16px; font-size:15px; color:#111827;">Hi,</p>
      <p style="margin:0 0 24px; font-size:15px; color:#374151;">
        <strong>${inviterName}</strong> has invited you to join
        <strong>${workspaceName}</strong> as a <strong>${role}</strong>.
      </p>
      <div style="text-align:center; margin:32px 0;">
        <a href="${inviteLink}" style="display:inline-block; padding:14px 32px; font-size:15px; font-weight:600; color:#ffffff; background-color:#4f46e5; border-radius:6px; text-decoration:none;">
          Accept Invite
        </a>
      </div>
      <p style="margin:0; font-size:13px; color:#9ca3af; word-break:break-all;">
        Or copy this link: ${inviteLink}
      </p>
    `,
  });