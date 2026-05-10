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
  { name: 'Tom R.', country: '🇬🇧 UK', stars: 5, text: "Best surf trip I've ever had. The team is so welcoming, the food is incredible, and the waves are perfect every day." },
  { name: 'Lena K.', country: '🇩🇪 Germany', stars: 5, text: 'OCEVIA exceeded every expectation. The villa is total luxury, and the surf trips to secret spots were unforgettable.' },
  { name: 'Carlos M.', country: '🇪🇸 Spain', stars: 5, text: 'Came for a week, stayed for three. The vibe here is unmatched — incredible waves, great people, and the best tagine of my life.' },
  { name: 'Emma P.', country: '🇳🇱 Netherlands', stars: 5, text: 'Perfect mix of adventure and relaxation. The yoga deck at sunset is something I will never forget. Highly recommend the Villa!' },
  { name: 'Jake W.', country: '🇦🇺 Australia', stars: 5, text: 'Taghazout is world-class and OCEVIA is the best base for it. The sunrise sessions alone are worth the trip.' },
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
  { q: 'Do I need surfing experience to come?', a: "Not at all! We welcome complete beginners. Our instructors will have you standing on a board on your first day." },
  { q: 'How do I get from Agadir airport to OCEVIA?', a: 'We offer complimentary airport transfers from Agadir Al Massira Airport (AGA). Just let us know your flight details when booking.' },
  { q: 'Is there WiFi at the surf house?', a: 'Yes, we have high-speed WiFi throughout — perfect for digital nomads who want to work between surf sessions.' },
];

const SURF_SPOTS = [
  { name: 'Hash Point', level: 'Advanced', dist: '2 min walk', desc: 'World-famous right-hand point break. Best Oct–Apr.' },
  { name: 'Anchor Point', level: 'Expert', dist: '5 min drive', desc: 'Morocco\'s most iconic wave. Long, powerful rights.' },
  { name: 'Panoramas', level: 'Beginner', dist: '8 min drive', desc: 'Gentle beach break. Perfect for learning to surf.' },
];

function MiniCalendar({ bookedDates, onSelect, selected }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = viewDate.toLocaleString('en', { month: 'long', year: 'numeric' });

  const cells = [];
  for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  function isoDate(d) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }

  return (
    <div className="mini-cal">
      <div className="cal-nav">
        <button onClick={() => setViewDate(new Date(year, month - 1, 1))}>‹</button>
        <span>{monthName}</span>
        <button onClick={() => setViewDate(new Date(year, month + 1, 1))}>›</button>
      </div>
      <div className="cal-grid">
        {['Mo','Tu','We','Th','Fr','Sa','Su'].map(d => <div key={d} className="cal-head">{d}</div>)}
        {cells.map((d, i) => {
          if (!d) return <div key={`e-${i}`} />;
          const iso = isoDate(d);
          const isBooked = bookedDates.includes(iso);
          const isPast = new Date(iso) < today;
          const isSelected = selected === iso;
          return (
            <button
              key={iso}
              className={`cal-day${isBooked ? ' booked' : ''}${isPast ? ' past' : ''}${isSelected ? ' selected' : ''}`}
              disabled={isBooked || isPast}
              onClick={() => onSelect(iso)}
            >
              {d}
            </button>
          );
        })}
      </div>
      <div className="cal-legend">
        <span><span className="dot dot-free" />Available</span>
        <span><span className="dot dot-booked" />Booked</span>
        {selected && <span><span className="dot dot-sel" />Selected</span>}
      </div>
    </div>
  );
}

export default function Home() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', room: 'Surf Loft', days: '', checkin: '' });
  const [bookingState, setBookingState] = useState({ msg: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ count: 0, revenue: 0, bookings: [] });
  const [bookedDates, setBookedDates] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hey! 👋 I'm the OCEVIA assistant. Ask me about rooms, surf lessons, location or anything!" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [faqOpen, setFaqOpen] = useState(null);
  const [navScrolled, setNavScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('form');
  const messagesEndRef = useRef(null);

  const selectedRoom = ROOMS.find(r => r.name === form.room);
  const estimatedPrice = form.days && selectedRoom ? Number(form.days) * selectedRoom.price : 0;

  useEffect(() => {
    loadStats();
    fetch('/api/availability').then(r => r.json()).then(d => setBookedDates(d.bookedDates || []));
  }, []);
  useEffect(() => {
    const fn = () => setNavScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
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
      setBookingState({ msg: 'Please fill in name, email and number of nights.', type: 'error' });
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
        setBookingState({ msg: `✔ Booking confirmed! Total: €${estimatedPrice}. You'll hear from us within 24h.`, type: 'success' });
        setForm({ name: '', email: '', phone: '', room: 'Surf Loft', days: '', checkin: '' });
        loadStats();
        fetch('/api/availability').then(r => r.json()).then(d => setBookedDates(d.bookedDates || []));
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
      <nav style={{ background: navScrolled ? 'rgba(10,10,15,0.97)' : 'rgba(10,10,15,0.3)', transition: 'background 0.3s' }}>
        <div className="nav-logo">🌊 OCEVIA</div>
        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#rooms">Rooms</a>
          <a href="#experiences">Experiences</a>
          <a href="#gallery">Gallery</a>
          <a href="#spots">Surf Spots</a>
          <a href="#booking" className="nav-cta">Book Now</a>
        </div>
        <a href="https://wa.me/212672978539" target="_blank" rel="noopener noreferrer" className="whatsapp-nav">
          📱 WhatsApp
        </a>
      </nav>

      {/* ── HERO ── */}
      <div className="hero">
        <div className="hero-content">
          <div className="hero-badge">Taghazout · Morocco · Atlantic Coast</div>
          <h1>Surf.<br />Rest.<br />Repeat.</h1>
          <p>Where the ocean becomes your home. World-class waves, authentic Moroccan hospitality, unforgettable sunsets.</p>
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
          <div className="hero-stat-divider" />
          <div className="hero-stat"><span>€90</span>From / night</div>
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
              <span className="tag">📶 Fast WiFi</span>
              <span className="tag">✈️ Airport Pickup</span>
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
                  <a href="#booking" className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '0.85rem' }}
                    onClick={() => setForm(f => ({ ...f, room: room.name }))}>
                    Book
                  </a>
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

      {/* ── SURF SPOTS ── */}
      <section id="spots" style={{ background: '#080b10' }}>
        <div className="section-label">Nearby Breaks</div>
        <h2 className="section-title">World-Class Surf Spots</h2>
        <p className="section-sub">OCEVIA sits at the heart of Morocco's surf coast — 3 legendary breaks on your doorstep.</p>
        <div className="spots-grid">
          {SURF_SPOTS.map(s => (
            <div className="spot-card" key={s.name}>
              <div className="spot-header">
                <div>
                  <div className="spot-name">{s.name}</div>
                  <div className="spot-dist">📍 {s.dist}</div>
                </div>
                <div className={`spot-level level-${s.level.toLowerCase()}`}>{s.level}</div>
              </div>
              <div className="spot-desc">{s.desc}</div>
            </div>
          ))}
        </div>

        {/* MAP EMBED */}
        <div className="map-wrap">
          <div className="section-label" style={{ marginBottom: '16px' }}>Find Us</div>
          <h3 style={{ textAlign: 'center', marginBottom: '24px', fontSize: '1.4rem', fontWeight: 800 }}>Taghazout, Morocco</h3>
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3438.9!2d-9.7107!3d30.5433!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdb3b6e9f8a8f0c1%3A0x1234!2sTaghazout%2C%20Morocco!5e0!3m2!1sen!2s!4v1"
              width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
              referrerPolicy="no-referrer-when-downgrade" title="OCEVIA Location"
            />
          </div>
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <a href="https://maps.google.com/?q=Taghazout,Morocco" target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ fontSize: '0.88rem', padding: '10px 22px' }}>
              Open in Google Maps ↗
            </a>
          </div>
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section id="gallery">
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
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="ig-btn">
            📸 Follow us on Instagram @oceviasurfhouse
          </a>
        </div>
      </section>

      {/* ── BOOKING ── */}
      <section id="booking" className="booking-section">
        <div className="booking-inner">
          <div className="booking-info">
            <div className="section-label">Reservations</div>
            <h2 className="section-title" style={{ textAlign: 'left' }}>Book Your Stay</h2>
            <p style={{ color: 'var(--muted)', marginBottom: '28px', lineHeight: 1.7 }}>Fill in the form and we'll confirm within 24 hours — or reach us instantly on WhatsApp.</p>
            <div className="booking-perks">
              <div className="perk">✔ Free cancellation 48h before arrival</div>
              <div className="perk">✔ Complimentary airport transfer from Agadir</div>
              <div className="perk">✔ Breakfast included in all rooms</div>
              <div className="perk">✔ Surf gear storage & rinse station</div>
              <div className="perk">✔ Email confirmation sent instantly</div>
            </div>
            <a href="https://wa.me/212672978539" target="_blank" rel="noopener noreferrer" className="wa-btn">
              📱 Book on WhatsApp — +212 672 978 539
            </a>
          </div>

          <div className="booking-card">
            <div className="booking-tabs">
              <button className={activeTab === 'form' ? 'tab active' : 'tab'} onClick={() => setActiveTab('form')}>📋 Details</button>
              <button className={activeTab === 'cal' ? 'tab active' : 'tab'} onClick={() => setActiveTab('cal')}>📅 Availability</button>
            </div>

            {activeTab === 'cal' ? (
              <div>
                <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginBottom: '16px', textAlign: 'center' }}>
                  Select your arrival date — red dates are already booked.
                </p>
                <MiniCalendar
                  bookedDates={bookedDates}
                  selected={form.checkin}
                  onSelect={iso => { setForm(f => ({ ...f, checkin: iso })); setActiveTab('form'); }}
                />
              </div>
            ) : (
              <form onSubmit={handleBook}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                  </div>
                </div>
                <div className="form-group">
                  <label>WhatsApp / Phone (optional)</label>
                  <input placeholder="+1 234 567 890" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
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
                  <label>
                    Arrival Date
                    <button type="button" className="cal-link" onClick={() => setActiveTab('cal')}>📅 Check availability</button>
                  </label>
                  <input type="date" value={form.checkin} min={new Date().toISOString().split('T')[0]} onChange={e => setForm({ ...form, checkin: e.target.value })} />
                </div>
                {estimatedPrice > 0 && (
                  <div className="price-estimate">
                    <div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--muted)', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>Estimated Total</div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>{form.days} nights × €{selectedRoom?.price}</div>
                    </div>
                    <div className="price-big">€{estimatedPrice}</div>
                  </div>
                )}
                <button type="submit" className="btn btn-primary" style={{ width: '100%', borderRadius: '12px', padding: '16px', fontSize: '1rem' }} disabled={loading}>
                  {loading ? 'Confirming…' : 'Confirm Booking →'}
                </button>
                {bookingState.msg && (
                  <div className={`booking-result ${bookingState.type}`}>{bookingState.msg}</div>
                )}
              </form>
            )}
          </div>
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
                  <th>Name</th><th>Email</th><th>Room</th><th>Nights</th><th>Arrival</th><th>Total</th><th>Booked</th>
                </tr>
              </thead>
              <tbody>
                {stats.bookings.map(b => (
                  <tr key={b.id}>
                    <td style={{ fontWeight: 700 }}>{b.name}</td>
                    <td style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{b.email}</td>
                    <td>{b.room}</td>
                    <td>{b.days}</td>
                    <td style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{b.checkin || '—'}</td>
                    <td style={{ color: 'var(--blue)', fontWeight: 700 }}>€{b.price}</td>
                    <td style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>{new Date(b.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">No bookings yet. Be the first to book! 🏄</div>
          )}
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact">
        <div className="section-label">Get In Touch</div>
        <h2 className="section-title">Contact Us</h2>
        <p className="section-sub">We're always happy to answer questions and help you plan the perfect surf trip.</p>
        <div className="contact-grid">
          <a href="https://wa.me/212672978539" target="_blank" rel="noopener noreferrer" className="contact-card">
            <div className="contact-icon" style={{ background: 'rgba(74,222,128,0.1)', color: '#4ade80' }}>📱</div>
            <div className="contact-label">WhatsApp</div>
            <div className="contact-val">+212 672 978 539</div>
            <div className="contact-hint">Fastest reply · usually &lt; 1 hour</div>
          </a>
          <a href="mailto:info@ocevia.ma" className="contact-card">
            <div className="contact-icon" style={{ background: 'rgba(30,144,255,0.1)', color: 'var(--blue)' }}>✉️</div>
            <div className="contact-label">Email</div>
            <div className="contact-val">info@ocevia.ma</div>
            <div className="contact-hint">Reply within 24 hours</div>
          </a>
          <a href="https://maps.google.com/?q=Taghazout,Morocco" target="_blank" rel="noopener noreferrer" className="contact-card">
            <div className="contact-icon" style={{ background: 'rgba(251,191,36,0.1)', color: '#fbbf24' }}>📍</div>
            <div className="contact-label">Location</div>
            <div className="contact-val">Taghazout, Morocco</div>
            <div className="contact-hint">30 min from Agadir Airport</div>
          </a>
          <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="contact-card">
            <div className="contact-icon" style={{ background: 'rgba(236,72,153,0.1)', color: '#ec4899' }}>📸</div>
            <div className="contact-label">Instagram</div>
            <div className="contact-val">@oceviasurfhouse</div>
            <div className="contact-hint">Daily surf & lifestyle content</div>
          </a>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer>
        <div className="footer-top">
          <div className="footer-brand">
            <div style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '10px' }}>🌊 OCEVIA</div>
            <p style={{ color: 'var(--muted)', fontSize: '0.88rem', maxWidth: '240px', lineHeight: 1.7 }}>
              The ultimate surf house experience on Morocco's Atlantic coast. Taghazout, Morocco.
            </p>
            <div className="social-links">
              <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">📸</a>
              <a href="https://wa.me/212672978539" target="_blank" rel="noopener noreferrer">📱</a>
              <a href="mailto:info@ocevia.ma">✉️</a>
            </div>
          </div>
          <div className="footer-col">
            <div className="footer-col-title">Navigate</div>
            <a href="#about">About</a>
            <a href="#rooms">Rooms</a>
            <a href="#experiences">Experiences</a>
            <a href="#gallery">Gallery</a>
            <a href="#spots">Surf Spots</a>
          </div>
          <div className="footer-col">
            <div className="footer-col-title">Book</div>
            <a href="#booking">Reserve a Room</a>
            <a href="#faq">FAQ</a>
            <a href="https://wa.me/212672978539" target="_blank" rel="noopener noreferrer">WhatsApp Booking</a>
            <a href="#dashboard">Dashboard</a>
          </div>
          <div className="footer-col">
            <div className="footer-col-title">Contact</div>
            <a href="tel:+212672978539">+212 672 978 539</a>
            <a href="mailto:info@ocevia.ma">info@ocevia.ma</a>
            <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Taghazout, Agadir 80022<br />Morocco 🇲🇦</span>
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
