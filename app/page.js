'use client';

import { useState, useEffect, useRef } from 'react';

const ROOMS = [
  {
    name: 'Surf Loft',
    price: 90,
    desc: 'Cozy shared loft with ocean breeze, perfect for solo surfers and budget travellers.',
    features: ['Shared bathroom', 'Surf gear storage', 'Sea views', 'Breakfast included'],
    img: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80',
    badge: 'Most Popular',
  },
  {
    name: 'Ocean Suite',
    price: 150,
    desc: 'Private suite with panoramic sea views, king-size bed and ensuite bathroom.',
    features: ['Private bathroom', 'King bed', 'Ocean balcony', 'Breakfast & dinner'],
    img: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&q=80',
    badge: 'Best Value',
  },
  {
    name: 'Villa',
    price: 250,
    desc: 'Exclusive private villa with private terrace, plunge pool and butler service.',
    features: ['Private pool', 'Butler service', 'Full kitchen', 'All meals included'],
    img: 'https://images.unsplash.com/photo-1613977257365-aaae5a9817ff?w=600&q=80',
    badge: 'Luxury',
  },
];

const EXPERIENCES = [
  { icon: '🏄', title: 'Surf Lessons', desc: 'Daily beginner & intermediate lessons at 8am and 3pm with certified instructors.' },
  { icon: '🌅', title: 'Sunrise Sessions', desc: 'Early morning surf sessions to catch the best uncrowded waves at dawn.' },
  { icon: '🥘', title: 'Moroccan Kitchen', desc: 'Fresh tagines, couscous and Moroccan breakfast served every morning.' },
  { icon: '🧘', title: 'Yoga Deck', desc: 'Beachfront yoga sessions at sunset to recover and recharge after a surf day.' },
  { icon: '🚐', title: 'Surf Trips', desc: 'Daily van trips to secret spots along 50km of Atlantic coastline.' },
  { icon: '🎸', title: 'Rooftop Nights', desc: 'Live music, Moroccan mint tea and stargazing on our rooftop terrace.' },
];

const TESTIMONIALS = [
  { name: 'Sophie L.', country: '🇫🇷 France', stars: 5, text: 'Absolute dream place. The surf lessons were amazing and the Ocean Suite was stunning. Already planning my return trip!' },
  { name: 'Tom R.', country: '🇬🇧 UK', stars: 5, text: 'Best surf trip I\'ve ever had. The team is so welcoming, the food is incredible, and the waves are perfect every day.' },
  { name: 'Lena K.', country: '🇩🇪 Germany', stars: 5, text: 'OCEVIA exceeded every expectation. The villa is a total luxury, and the surf trips to secret spots were unforgettable.' },
];

const GALLERY = [
  'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600&q=80',
  'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=600&q=80',
  'https://images.unsplash.com/photo-1531722569936-825d4ebd65a1?w=600&q=80',
  'https://images.unsplash.com/photo-1484821582734-6692f7c4b3ef?w=600&q=80',
  'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=600&q=80',
  'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=600&q=80',
];

const FAQ_ITEMS = [
  { q: 'When is the best time to surf in Taghazout?', a: 'October to April brings the biggest Atlantic swells. May to September is perfect for beginners with smaller, consistent waves and warm weather.' },
  { q: 'Are surf lessons included in the room price?', a: 'Surf lessons are included in the Ocean Suite and Villa packages. Surf Loft guests can add lessons for €30/day.' },
  { q: 'What is the check-in and check-out time?', a: 'Check-in is from 2pm and check-out by 11am. Early check-in and late check-out are available on request, subject to availability.' },
  { q: 'Do I need surfing experience to come?', a: 'Not at all! We welcome complete beginners. Our instructors will have you standing on a board on your first day.' },
  { q: 'How do I get from Agadir airport to OCEVIA?', a: 'We offer complimentary airport transfers from Agadir Al Massira Airport (AGA). Just let us know your flight details when booking.' },
];

export default function Home() {
  const [form, setForm] = useState({ name: '', email: '', room: 'Surf Loft', days: '', checkin: '' });
  const [bookingState, setBookingState] = useState({ msg: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ count: 0, revenue: 0, bookings: [] });
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hey! 👋 I'm the OCEVIA assistant. Ask me about rooms, surf lessons, or anything else!" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [faqOpen, setFaqOpen] = useState(null);
  const [navScrolled, setNavScrolled] = useState(false);
  const messagesEndRef = useRef(null);

  const selectedRoom = ROOMS.find(r => r.name === form.room);
  const estimatedPrice = form.days && selectedRoom ? Number(form.days) * selectedRoom.price : 0;

  useEffect(() => { loadStats(); }, []);
  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    if (chatOpen) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, chatOpen]);

  async function loadStats() {
    try {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      setStats(data);
    } catch {}
  }

  async function handleBook(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.days) {
      setBookingState({ msg: 'Please fill in all fields.', type: 'error' });
      return;
    }
    setLoading(true);
    setBookingState({ msg: '', type: '' });
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, days: Number(form.days), price: estimatedPrice }),
      });
      const data = await res.json();
      if (data.success) {
        setBookingState({ msg: `✔ Booking confirmed! Total: €${estimatedPrice}. We'll reach out within 24 hours.`, type: 'success' });
        setForm({ name: '', email: '', room: 'Surf Loft', days: '', checkin: '' });
        loadStats();
      } else {
        setBookingState({ msg: 'Booking failed. Please try again.', type: 'error' });
      }
    } catch {
      setBookingState({ msg: 'Connection error. Please try again.', type: 'error' });
    }
    setLoading(false);
  }

  async function sendChat() {
    const msg = chatInput.trim();
    if (!msg || chatLoading) return;
    setChatInput('');
    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setChatLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, something went wrong. Try again!' }]);
    }
    setChatLoading(false);
  }

  return (
    <>
      {/* ── NAV ── */}
      <nav style={{ background: navScrolled ? 'rgba(10,10,10,0.95)' : 'rgba(10,10,10,0.4)', transition: 'background 0.3s' }}>
        <div className="nav-logo">🌊 OCEVIA</div>
        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#rooms">Rooms</a>
          <a href="#experiences">Experiences</a>
          <a href="#gallery">Gallery</a>
          <a href="#booking" className="nav-cta">Book Now</a>
        </div>
        <a href="https://wa.me/212672978539" target="_blank" rel="noopener noreferrer" className="whatsapp-nav">
          <span>📱</span> WhatsApp
        </a>
      </nav>

      {/* ── HERO ── */}
      <div className="hero">
        <div className="hero-content">
          <div className="hero-badge">Taghazout · Morocco · Atlantic Coast</div>
          <h1>Surf.<br />Rest.<br />Repeat.</h1>
          <p>Where the ocean becomes your home. World-class waves, authentic Moroccan hospitality, and unforgettable sunsets.</p>
          <div className="hero-btns">
            <a href="#booking" className="btn btn-primary">Book Your Stay</a>
            <a href="#rooms" className="btn btn-outline">Explore Rooms</a>
          </div>
        </div>
        <div className="hero-scroll">scroll ↓</div>
        <div className="hero-stats">
          <div className="hero-stat"><span>500+</span>Surfers Hosted</div>
          <div className="hero-stat-divider" />
          <div className="hero-stat"><span>4.9★</span>Average Rating</div>
          <div className="hero-stat-divider" />
          <div className="hero-stat"><span>3</span>Surf Spots</div>
        </div>
      </div>

      {/* ── ABOUT ── */}
      <section id="about" className="about-section">
        <div className="about-grid">
          <div className="about-img-col">
            <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&q=80" alt="Taghazout Beach" className="about-img-main" />
            <img src="https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&q=80" alt="Surf Lessons" className="about-img-small" />
          </div>
          <div className="about-text">
            <div className="section-label">Our Story</div>
            <h2 className="section-title" style={{ textAlign: 'left' }}>Born from a love of waves & Morocco</h2>
            <p className="about-p">OCEVIA Surf House started as a dream: create the perfect base for surfers who want to experience the magic of Taghazout without compromise. We combine world-class surf access with genuine Moroccan warmth.</p>
            <p className="about-p">Nestled between the village and the beach, our house puts you steps away from legendary breaks like Hash Point, Anchor Point and Panoramas — some of the most consistent waves in the world.</p>
            <div className="about-tags">
              <span className="tag">🏄 Daily Surf Lessons</span>
              <span className="tag">🥘 Moroccan Cuisine</span>
              <span className="tag">🌅 Ocean Views</span>
              <span className="tag">🚐 Surf Transfers</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── ROOMS ── */}
      <section id="rooms" style={{ background: '#080b10' }}>
        <div className="section-label">Accommodation</div>
        <h2 className="section-title">Choose Your Room</h2>
        <p className="section-sub">From cozy surf lofts to private villas — find the perfect space for your Morocco adventure.</p>
        <div className="rooms-grid">
          {ROOMS.map(room => (
            <div className="room-card" key={room.name}>
              <div className="room-img-wrap">
                <img className="room-img" src={room.img} alt={room.name} />
                <div className="room-badge">{room.badge}</div>
              </div>
              <div className="room-body">
                <div className="room-name">{room.name}</div>
                <div className="room-desc">{room.desc}</div>
                <ul className="room-features">
                  {room.features.map(f => <li key={f}>✓ {f}</li>)}
                </ul>
                <div className="room-footer">
                  <div className="room-price">€{room.price}<span>/night</span></div>
                  <a href="#booking" className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '0.85rem' }}>Book</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── EXPERIENCES ── */}
      <section id="experiences">
        <div className="section-label">What We Offer</div>
        <h2 className="section-title">The OCEVIA Experience</h2>
        <p className="section-sub">More than just a place to sleep — a full Atlantic surf lifestyle.</p>
        <div className="exp-grid">
          {EXPERIENCES.map(e => (
            <div className="exp-card" key={e.title}>
              <div className="exp-icon">{e.icon}</div>
              <div className="exp-title">{e.title}</div>
              <div className="exp-desc">{e.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section id="gallery" style={{ background: '#080b10', paddingBottom: '80px' }}>
        <div className="section-label">Gallery</div>
        <h2 className="section-title">Life at OCEVIA</h2>
        <p className="section-sub">Waves, sunsets, and smiles — every day at the surf house.</p>
        <div className="gallery-grid">
          {GALLERY.map((src, i) => (
            <div className="gallery-item" key={i}>
              <img src={src} alt={`Gallery ${i + 1}`} />
            </div>
          ))}
        </div>
      </section>

      {/* ── BOOKING ── */}
      <section id="booking" className="booking-section">
        <div className="booking-inner">
          <div className="booking-info">
            <div className="section-label">Reservations</div>
            <h2 className="section-title" style={{ textAlign: 'left' }}>Book Your Stay</h2>
            <p style={{ color: 'var(--muted)', marginBottom: '32px' }}>Fill in the form and we'll confirm within 24 hours. Or reach us instantly on WhatsApp.</p>
            <div className="booking-perks">
              <div className="perk">✔ Free cancellation 48h before arrival</div>
              <div className="perk">✔ Complimentary airport transfer</div>
              <div className="perk">✔ Breakfast included in all rooms</div>
              <div className="perk">✔ Surf gear storage & rinse station</div>
            </div>
            <a href="https://wa.me/212672978539" target="_blank" rel="noopener noreferrer" className="wa-btn">
              📱 Book on WhatsApp — +212 672 978 539
            </a>
          </div>
          <form className="booking-card" onSubmit={handleBook}>
            <div className="form-group">
              <label>Full Name</label>
              <input placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Room Type</label>
                <select value={form.room} onChange={e => setForm({ ...form, room: e.target.value })}>
                  {ROOMS.map(r => <option key={r.name} value={r.name}>{r.name} — €{r.price}/night</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Nights</label>
                <input type="number" min="1" placeholder="7" value={form.days} onChange={e => setForm({ ...form, days: e.target.value })} required />
              </div>
            </div>
            <div className="form-group">
              <label>Arrival Date</label>
              <input type="date" value={form.checkin} onChange={e => setForm({ ...form, checkin: e.target.value })} />
            </div>
            {estimatedPrice > 0 && (
              <div className="price-estimate">
                <span>Estimated Total</span>
                <span className="price-big">€{estimatedPrice}</span>
              </div>
            )}
            <button type="submit" className="btn btn-primary" style={{ width: '100%', borderRadius: '12px', padding: '16px' }} disabled={loading}>
              {loading ? 'Confirming…' : 'Confirm Booking →'}
            </button>
            {bookingState.msg && (
              <div className={`booking-result ${bookingState.type}`}>{bookingState.msg}</div>
            )}
          </form>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ background: '#080b10' }}>
        <div className="section-label">Reviews</div>
        <h2 className="section-title">What Guests Say</h2>
        <p className="section-sub">Over 500 surfers have called OCEVIA home. Here's what they think.</p>
        <div className="reviews-grid">
          {TESTIMONIALS.map(t => (
            <div className="review-card" key={t.name}>
              <div className="review-stars">{'★'.repeat(t.stars)}</div>
              <p className="review-text">"{t.text}"</p>
              <div className="review-author">
                <strong>{t.name}</strong>
                <span>{t.country}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq">
        <div className="section-label">FAQ</div>
        <h2 className="section-title">Common Questions</h2>
        <p className="section-sub">Everything you need to know before your trip.</p>
        <div className="faq-list">
          {FAQ_ITEMS.map((item, i) => (
            <div className="faq-item" key={i}>
              <button className="faq-q" onClick={() => setFaqOpen(faqOpen === i ? null : i)}>
                <span>{item.q}</span>
                <span className="faq-arrow">{faqOpen === i ? '−' : '+'}</span>
              </button>
              {faqOpen === i && <div className="faq-a">{item.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* ── DASHBOARD ── */}
      <section id="dashboard" style={{ background: '#080b10' }}>
        <div className="section-label">Live Stats</div>
        <h2 className="section-title">Booking Dashboard</h2>
        <p className="section-sub">Real-time overview of all reservations.</p>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Bookings</div>
            <div className="stat-value">{stats.count}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Revenue</div>
            <div className="stat-value">€{stats.revenue}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Avg. Stay</div>
            <div className="stat-value">
              {stats.count ? Math.round(stats.bookings.reduce((s, b) => s + Number(b.days), 0) / stats.count) : 0}
              <span style={{ fontSize: '1rem', color: 'var(--muted)' }}> nights</span>
            </div>
          </div>
        </div>
        <div className="bookings-table">
          {stats.bookings && stats.bookings.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Room</th>
                  <th>Nights</th>
                  <th>Total</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.bookings.map(b => (
                  <tr key={b.id}>
                    <td>{b.name}</td>
                    <td style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{b.email}</td>
                    <td>{b.room}</td>
                    <td>{b.days}</td>
                    <td style={{ color: 'var(--blue)', fontWeight: 700 }}>€{b.price}</td>
                    <td style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{new Date(b.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">No bookings yet. Be the first to book! 🏄</div>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer>
        <div className="footer-top">
          <div className="footer-brand">
            <div style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px' }}>🌊 OCEVIA</div>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', maxWidth: '260px' }}>The ultimate surf house experience on Morocco's Atlantic coast.</p>
          </div>
          <div className="footer-col">
            <div className="footer-col-title">Navigate</div>
            <a href="#about">About</a>
            <a href="#rooms">Rooms</a>
            <a href="#experiences">Experiences</a>
            <a href="#gallery">Gallery</a>
          </div>
          <div className="footer-col">
            <div className="footer-col-title">Book</div>
            <a href="#booking">Reserve a Room</a>
            <a href="#faq">FAQ</a>
            <a href="https://wa.me/212672978539" target="_blank" rel="noopener noreferrer">WhatsApp</a>
          </div>
          <div className="footer-col">
            <div className="footer-col-title">Contact</div>
            <a href="tel:+212672978539">+212 672 978 539</a>
            <a href="mailto:info@ocevia.ma">info@ocevia.ma</a>
            <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Taghazout, Agadir 80022<br />Morocco</span>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} OCEVIA Surf House. All rights reserved.</span>
          <span>Made with 🌊 in Taghazout</span>
        </div>
      </footer>

      {/* ── CHAT ── */}
      <div className="chat-bubble">
        {chatOpen && (
          <div className="chat-window">
            <div className="chat-header">
              <div className="chat-header-dot" />
              <div>
                <div className="chat-header-text">OCEVIA Assistant</div>
                <div className="chat-header-sub">Replies instantly 🤙</div>
              </div>
            </div>
            <div className="chat-messages">
              {messages.map((m, i) => (
                <div key={i} className={`msg ${m.role === 'ai' ? 'msg-ai' : 'msg-user'}`}>{m.text}</div>
              ))}
              {chatLoading && <div className="msg msg-ai" style={{ opacity: 0.6 }}>Typing…</div>}
              <div ref={messagesEndRef} />
            </div>
            <div className="chat-input-row">
              <input className="chat-input" placeholder="Ask anything…" value={chatInput}
                onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendChat()} />
              <button className="chat-send" onClick={sendChat}>➤</button>
            </div>
          </div>
        )}
        <button className="chat-toggle" onClick={() => setChatOpen(o => !o)}>{chatOpen ? '✕' : '💬'}</button>
      </div>
    </>
  );
}
