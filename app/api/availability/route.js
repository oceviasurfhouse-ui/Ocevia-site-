import { query, initDb } from '../../../lib/db';

export async function GET() {
  try {
    await initDb();
    const result = await query('SELECT checkin, days FROM bookings WHERE checkin IS NOT NULL');
    const bookedRanges = result.rows
      .filter(b => b.checkin)
      .map(b => {
        const start = new Date(b.checkin);
        const dates = [];
        for (let i = 0; i < Number(b.days); i++) {
          const d = new Date(start);
          d.setDate(d.getDate() + i);
          dates.push(d.toISOString().split('T')[0]);
        }
        return dates;
      })
      .flat();
    return Response.json({ bookedDates: [...new Set(bookedRanges)] });
  } catch (err) {
    return Response.json({ bookedDates: [] });
  }
}
