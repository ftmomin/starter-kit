import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

export const FROM_EMAIL =
  process.env.EMAIL_FROM_ADDRESS || 'FAITH <noreply@yourdomain.com>';
