import { query, initDb } from '../../../lib/db';
import { sendEmail, bookingEmailHtml } from '../../../lib/mail';

export async function POST(req) {
  try {
    await initDb();
    await query(`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS checkin TEXT`);
    const { name, email, room, days, price, checkin } = await req.json();
    const result = await query(
      'INSERT INTO bookings (name, email, room, days, price, checkin) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, email, room, days, price, checkin || null]
    );
    sendEmail({
      subject: `🌊 New Booking: ${name} — ${room} (€${price})`,
      html: bookingEmailHtml({ name, email, room, days, price, checkin }),
      text: `New OCEVIA booking!\nName: ${name}\nEmail: ${email}\nRoom: ${room}\nNights: ${days}\nTotal: €${price}${checkin ? `\nArrival: ${checkin}` : ''}`,
    });
    return Response.json({ success: true, booking: result.rows[0] });
  } catch (err) {
    console.error(err);
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await initDb();
    const result = await query('SELECT * FROM bookings ORDER BY created_at DESC');
    const total = result.rows.reduce((sum, b) => sum + Number(b.price), 0);
    return Response.json({ bookings: result.rows, count: result.rows.length, revenue: total });
  } catch (err) {
    console.error(err);
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
