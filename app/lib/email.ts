import { Resend } from 'resend';

let _resend: Resend | null = null;
function getResend() {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
const FROM    = process.env.RESEND_FROM_EMAIL ?? 'Landie <noreply@landie.app>';

function emailShell(body: string) {
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"/>
<title>Landie</title></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.07);">
        <tr><td style="background:linear-gradient(135deg,#1e3a5f 0%,#1d4ed8 100%);padding:36px 40px;text-align:center;">
          <div style="display:inline-block;background:rgba(255,255,255,0.15);border-radius:12px;padding:10px 20px;">
            <span style="color:#fff;font-size:22px;font-weight:800;">🏠 Landie</span>
          </div>
        </td></tr>
        <tr><td style="padding:36px 40px 28px;">${body}</td></tr>
        <tr><td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:18px 40px;text-align:center;">
          <p style="margin:0;font-size:12px;color:#9ca3af;">© ${new Date().getFullYear()} Landie. All rights reserved.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

const btn = (href: string, label: string) =>
  `<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:8px 0 24px;">
    <a href="${href}" style="display:inline-block;background:#1d4ed8;color:#fff;font-size:15px;font-weight:600;text-decoration:none;padding:14px 36px;border-radius:10px;">${label}</a>
  </td></tr></table>`;

const expiry = () =>
  `<div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:14px 18px;margin-bottom:20px;">
    <p style="margin:0;font-size:13px;color:#6b7280;">⏰ This link expires in <strong style="color:#374151;">24 hours</strong>. If you didn't sign up for Landie, ignore this email.</p>
  </div>`;

const fallback = (href: string) =>
  `<p style="margin:8px 0 0;font-size:12px;color:#9ca3af;">Link not working? Copy this into your browser:<br/>
    <a href="${href}" style="color:#1d4ed8;word-break:break-all;">${href}</a></p>`;

export async function sendTenantVerificationEmail(toEmail: string, toName: string, token: string) {
  const url = `${APP_URL}/api/verify-email?token=${token}`;
  const first = toName.split(' ')[0];
  await getResend().emails.send({
    from: FROM, to: toEmail, subject: 'Verify your Landie account',
    html: emailShell(`
      <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827;">Welcome, ${first}! 👋</h1>
      <p style="margin:0 0 22px;font-size:15px;color:#6b7280;line-height:1.6;">Click below to verify your email and activate your account.</p>
      ${btn(url, 'Verify Email Address')}${expiry()}${fallback(url)}
    `),
  });
}

export async function sendLandlordOnboardingEmail(toEmail: string, toName: string, token: string) {
  const url = `${APP_URL}/onboarding?token=${token}`;
  const first = toName.split(' ')[0];
  await getResend().emails.send({
    from: FROM, to: toEmail, subject: 'Complete your Landie landlord profile',
    html: emailShell(`
      <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827;">One more step, ${first} 🏢</h1>
      <p style="margin:0 0 10px;font-size:15px;color:#6b7280;line-height:1.6;">Thanks for signing up as a landlord on Landie.</p>
      <p style="margin:0 0 22px;font-size:15px;color:#6b7280;line-height:1.6;">Complete your profile so our team can review and approve your account.</p>
      ${btn(url, 'Complete My Profile →')}
      <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;padding:14px 18px;margin-bottom:20px;">
        <p style="margin:0;font-size:13px;color:#1e40af;">ℹ️ After completing your profile your account will be reviewed. You'll be notified once approved.</p>
      </div>
      ${expiry()}${fallback(url)}
    `),
  });
}
