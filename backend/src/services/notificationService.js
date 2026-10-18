import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

let transporter = null;

function getTransporter() {
  if (!env.email.host || !env.email.user) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.email.host,
      port: env.email.port,
      auth: { user: env.email.user, pass: env.email.password },
    });
  }
  return transporter;
}

export async function sendInquiryNotification(inquiry) {
  const transport = getTransporter();
  if (!transport || !env.email.notifyTo) {
    return;
  }

  await transport.sendMail({
    from: env.email.from || env.email.user,
    to: env.email.notifyTo,
    subject: `New catering inquiry: ${inquiry.name} (${inquiry.eventType})`,
    text: [
      `Name: ${inquiry.name}`,
      `Phone: ${inquiry.phone}`,
      `Email: ${inquiry.email || '-'}`,
      `Event type: ${inquiry.eventType}`,
      `Event date: ${inquiry.eventDate || '-'}`,
      `Guest count: ${inquiry.guestCount || '-'}`,
      `Location: ${inquiry.location || '-'}`,
      `Budget: ${inquiry.budgetRange || '-'}`,
      `Message: ${inquiry.message || '-'}`,
    ].join('\n'),
  });
}
