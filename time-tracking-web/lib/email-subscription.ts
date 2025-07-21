import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const emailFirstSubscription = async (email: string) => {
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? '',
    to: email,
    subject: 'Welcome to Icuem Time Tracker! 🚀',
    html: `
      <div style="background-color: #f9f9f9; padding: 40px; font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
          <div style="background-color: #4CAF50; color: white; text-align: center; padding: 20px;">
            <h1 style="margin: 0; font-size: 24px;">Welcome to Icuem Time Tracker!</h1>
          </div>
          <div style="padding: 20px; text-align: center;">
            <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
              Hi there,
            </p>
            <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
              Thank you for subscribing to Icuem Time Tracker! We're thrilled to have you on board.
            </p>
            <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
              If you have any questions or need assistance, our team is always here to help.
            </p>
            <a href="https://icuem.com" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">
              Explore Your Dashboard
            </a>
            <p style="font-size: 16px; color: #333; margin-top: 20px;">
              We’re excited to be part of your journey!
            </p>
            <p style="font-size: 16px; color: #333; margin-top: 20px;">
              Best regards, <br />
              The Icuem Team
            </p>
          </div>
        </div>
      </div>
    `,
  });
};
