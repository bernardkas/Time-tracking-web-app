import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`;

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? '',
    to: email,
    subject: `Confirm your email`,
    html: `
  <div style="background-color: #f9f9f9; padding: 40px; font-family: Arial, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
      <div style="background-color: #4CAF50; color: white; text-align: center; padding: 20px;">
        <h1 style="margin: 0; font-size: 24px;">Confirm your email</h1>
      </div>
      <div style="padding: 20px; text-align: center;">
        <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
          Click <a href=" <strong>${confirmLink}</strong>">here</a> to confirm email.
        </p>
      </div>
    </div>
  </div>
`,
  });
};

export const sendPasswordEmail = async (email: string, token: string) => {
  const resetLink = `http://localhost:3000/auth/new-password?token=${token}`;
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? '',
    to: email,
    subject: `Reset your password`,
    html: `
  <div style="background-color: #f9f9f9; padding: 40px; font-family: Arial, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
      <div style="background-color: #4CAF50; color: white; text-align: center; padding: 20px;">
        <h1 style="margin: 0; font-size: 24px;">Reset your password</h1>
      </div>
      <div style="padding: 20px; text-align: center;">
        <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
          Click <a href=" <strong>${resetLink}</strong>">here</a> to reset password.
        </p>
      </div>
    </div>
  </div>
`,
  });
};
