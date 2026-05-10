/* eslint-disable no-unused-vars */
const ROOM_PRICES = {
  'Surf Loft': 90,
  'Ocean Suite': 150,
  'Villa': 250,
};

const FAQ = [
  { q: /price|cost|how much|rate/i, a: 'Our rooms start from €90/night for the Surf Loft, €150 for the Ocean Suite, and €250 for the Villa. All include breakfast and surf gear access!' },
  { q: /surf|lesson|board|wave/i, a: 'We offer daily surf lessons at 8am and 3pm. Boards and wetsuits are included for all guests. Taghazout has some of the best waves in Morocco! 🌊' },
  { q: /locat|where|taghazout|morocco/i, a: 'OCEVIA Surf House is located in Taghazout, Morocco — a world-famous surf village on the Atlantic coast. We\'re just steps from the beach.' },
  { q: /book|reserv|availab/i, a: 'You can book directly through our booking form on this page! Fill in your name, email, room preference and number of nights, then confirm.' },
  { q: /breakfast|food|meal|eat/i, a: 'We serve a fresh Moroccan breakfast every morning. Local cafes and restaurants are also within walking distance.' },
  { q: /checkin|check.in|check.out|arrival/i, a: 'Check-in is from 2pm and check-out by 11am. Early check-in and late check-out can be arranged on request.' },
  { q: /wifi|internet|connect/i, a: 'Yes, we have high-speed WiFi throughout the property — perfect for digital nomads!' },
  { q: /cancel|refund/i, a: 'We offer free cancellation up to 48 hours before arrival. Please contact us via WhatsApp for any changes.' },
  { q: /whatsapp|contact|phone|call/i, a: 'Reach us anytime on WhatsApp: +212 672978539. We typically respond within an hour.' },
  { q: /hello|hi|hey|salut|bonjour/i, a: 'Hey! 👋 Welcome to OCEVIA Surf House. How can I help you today? Ask me about rooms, surfing, location, or booking!' },
];

export async function POST(req) {
  try {
    const { message } = await req.json();
    if (!message) return Response.json({ reply: 'Please send a message.' });

    for (const { q, a } of FAQ) {
      if (q.test(message)) {
        return Response.json({ reply: a });
      }
    }

    return Response.json({
      reply: "Great question! For personalised help, reach us on WhatsApp at +212 672978539. We're happy to assist with rooms, surfing, or anything else! 🤙"
    });
  } catch (err) {
    return Response.json({ reply: 'Sorry, something went wrong. Please try again.' }, { status: 500 });
  }
}
