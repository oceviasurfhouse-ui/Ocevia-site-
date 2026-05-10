import { promisify } from 'node:util';
import { execFile } from 'node:child_process';

async function getAuthToken() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const { stdout } = await promisify(execFile)(
    'replit',
    ['identity', 'create', '--audience', `https://${hostname}`],
    { encoding: 'utf8' }
  );
  const replitToken = stdout.trim();
  if (!replitToken) throw new Error('Replit Identity Token not found');
  return { authToken: `Bearer ${replitToken}`, hostname };
}

export async function sendEmail({ subject, text, html }) {
  try {
    const { hostname, authToken } = await getAuthToken();
    const response = await fetch(`https://${hostname}/api/v2/mailer/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Replit-Authentication': authToken,
      },
      body: JSON.stringify({ subject, text, html }),
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to send email');
    }
    return await response.json();
  } catch (e) {
    console.error('Email send error:', e.message);
    return null;
  }
}

export function bookingEmailHtml({ name, email, room, days, price, checkin }) {
  const arrivalText = checkin ? `<p><strong>Arrival:</strong> ${checkin}</p>` : '';
  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:system-ui,sans-serif;color:#eef0f5">
  <div style="max-width:560px;margin:40px auto;background:#0f1219;border:1px solid #1a2035;border-radius:20px;overflow:hidden">
    <div style="background:linear-gradient(135deg,#1e90ff,#0066cc);padding:32px;text-align:center">
      <div style="font-size:2rem;margin-bottom:8px">🌊</div>
      <h1 style="margin:0;font-size:1.5rem;font-weight:900;color:#fff">New Booking — OCEVIA</h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:0.9rem">A new reservation has been confirmed</p>
    </div>
    <div style="padding:32px">
      <div style="background:#14192b;border:1px solid #1a2035;border-radius:14px;padding:24px;margin-bottom:24px">
        <h2 style="margin:0 0 16px;font-size:1rem;font-weight:800;color:#7ec8ff;text-transform:uppercase;letter-spacing:2px">Guest Details</h2>
        <p style="margin:0 0 8px"><strong>Name:</strong> ${name}</p>
        <p style="margin:0 0 8px"><strong>Email:</strong> ${email}</p>
        <p style="margin:0 0 8px"><strong>Room:</strong> ${room}</p>
        <p style="margin:0 0 8px"><strong>Nights:</strong> ${days}</p>
        ${arrivalText}
        <p style="margin:0"><strong>Total:</strong> <span style="color:#1e90ff;font-weight:900;font-size:1.2rem">€${price}</span></p>
      </div>
      <div style="text-align:center;margin-bottom:24px">
        <a href="https://wa.me/212672978539?text=Hi%20${encodeURIComponent(name)}%2C%20your%20OCEVIA%20booking%20is%20confirmed!" 
           style="display:inline-block;background:#4ade80;color:#000;font-weight:800;padding:14px 28px;border-radius:30px;text-decoration:none;font-size:0.9rem">
          📱 Reply via WhatsApp
        </a>
      </div>
      <p style="margin:0;color:#7a8499;font-size:0.8rem;text-align:center">OCEVIA Surf House · Taghazout, Morocco</p>
    </div>
  </div>
</body>
</html>`;
}
