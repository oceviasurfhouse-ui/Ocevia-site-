'use client';

import { useState, useEffect, useRef } from 'react';

const ROOMS = [
  {
    name: 'Surf Loft',
    price: 90,
    desc: 'Cozy shared loft with ocean breeze, perfect for solo surfers.',
    img: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80',
  },
  {
    name: 'Ocean Suite',
    price: 150,
    desc: 'Private suite with panoramic sea views and king-size bed.',
    img: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&q=80',
  },
  {
    name: 'Villa',
    price: 250,
    desc: 'Exclusive private villa with terrace, pool access and butler service.',
    img: 'https://images.unsplash.com/photo-1613977257365-aaae5a9817ff?w=600&q=80',
  },
];

export default function Home() {
  const [form, setForm] = useState({ name: '', email: '', room: 'Surf Loft', days: '' });
  const [bookingState, setBookingState] = useState({ msg: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ count: 0, revenue: 0, bookings: [] });
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hey! 👋 I\'m the OCEVIA assistant. Ask me about rooms, surf lessons, or anything else!' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const selectedRoom = ROOMS.find(r => r.name === form.room);
  const estimatedPrice = form.days && selectedRoom ? Number(form.days) * selectedRoom.price : 0;

  useEffect(() => { loadStats(); }, []);
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

  async function handleBook() {
    if (!form.name || !form.email || !form.days) {
      setBookingState({ msg: 'Please fill in all fields.', type: 'error' });
      return;
    }
    if (Number(form.days) < 1) {
      setBookingState({ msg: 'Minimum stay is 1 night.', type: 'error' });
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
        setBookingState({ msg: `✔ Booked! Total: €${estimatedPrice}. We'll confirm via email.`, type: 'success' });
        setForm({ name: '', email: '', room: 'Surf Loft', days: '' });
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
      {/* NAV */}
      <nav>
        <div className="nav-logo">🌊 OCEVIA PRO</div>
        <div className="nav-links">
          <a href="#rooms">Rooms</a>
          <a href="#booking">Book</a>
          <a href="#dashboard">Dashboard</a>
          <a href="#booking" className="nav-cta">Book Now</a>
        </div>
      </nav>

      {/* HERO */}
      <div className="hero">
        <div className="hero-content">
          <div className="hero-badge">Taghazout • Imsouan • Tamraghte</div>
          <h1>Surf Experience<br />Morocco</h1>
          <p>Where the ocean becomes your home</p>
          <div className="hero-btns">
            <a href="#booking" className="btn btn-primary">Book Your Stay</a>
            <a href="#rooms" className="btn btn-outline">View Rooms</a>
          </div>
        </div>
      </div>

      {/* ROOMS */}
      <section id="rooms">
        <div className="section-label">Accommodation</div>
        <h2 className="section-title">Choose Your Room</h2>
        <p className="section-sub">From cozy surf lofts to private villas — find the perfect space for your Morocco adventure.</p>
        <div className="rooms-grid">
          {ROOMS.map(room => (
            <div className="room-card" key={room.name}>
              <img className="room-img" src={room.img} alt={room.name} />
              <div className="room-body">
                <div className="room-name">{room.name}</div>
                <div className="room-desc">{room.desc}</div>
                <div className="room-price">€{room.price}<span>/night</span></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BOOKING */}
      <section id="booking">
        <div className="section-label">Reservations</div>
        <h2 className="section-title">Book Your Stay</h2>
        <p className="section-sub">Fill in the form and we'll confirm your reservation within 24 hours.</p>
        <div className="booking-card">
          <div className="form-group">
            <label>Full Name</label>
            <input
              placeholder="Your name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Room Type</label>
            <select value={form.room} onChange={e => setForm({ ...form, room: e.target.value })}>
              {ROOMS.map(r => (
                <option key={r.name} value={r.name}>{r.name} — €{r.price}/night</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Number of Nights</label>
            <input
              type="number"
              min="1"
              placeholder="e.g. 7"
              value={form.days}
              onChange={e => setForm({ ...form, days: e.target.value })}
            />
          </div>
          {estimatedPrice > 0 && (
            <div style={{ textAlign: 'center', marginBottom: '16px', color: '#7ec8ff', fontWeight: 600, fontSize: '1rem' }}>
              Estimated total: <span style={{ color: '#fff', fontSize: '1.3rem' }}>€{estimatedPrice}</span>
            </div>
          )}
          <button
            className="btn btn-primary"
            style={{ width: '100%', borderRadius: '12px' }}
            onClick={handleBook}
            disabled={loading}
          >
            {loading ? 'Confirming…' : 'Confirm Booking'}
          </button>
          {bookingState.msg && (
            <div className={`booking-result ${bookingState.type}`}>{bookingState.msg}</div>
          )}
          <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: 'var(--muted)' }}>
            Or book instantly via{' '}
            <a href="https://wa.me/212672978539" target="_blank" rel="noopener noreferrer" style={{ color: '#4ade80', fontWeight: 600 }}>
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* DASHBOARD */}
      <section id="dashboard">
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
        </div>
        <div className="bookings-table">
          {stats.bookings && stats.bookings.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
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
                    <td>{b.room}</td>
                    <td>{b.days}</td>
                    <td>€{b.price}</td>
                    <td>{new Date(b.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">No bookings yet. Be the first to book! 🏄</div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <p style={{ marginBottom: '8px' }}>🌊 OCEVIA Surf House — Taghazout, Morocco</p>
        <p>
          <a href="https://wa.me/212672978539" target="_blank" rel="noopener noreferrer">WhatsApp: +212 672 978 539</a>
          {' · '}
          <a href="mailto:info@ocevia.com">info@ocevia.com</a>
        </p>
        <p style={{ marginTop: '16px', fontSize: '0.8rem', opacity: 0.5 }}>© {new Date().getFullYear()} OCEVIA Surf House. All rights reserved.</p>
      </footer>

      {/* CHAT */}
      <div className="chat-bubble">
        {chatOpen && (
          <div className="chat-window">
            <div className="chat-header">
              <div className="chat-header-dot"></div>
              <div>
                <div className="chat-header-text">OCEVIA Assistant</div>
                <div className="chat-header-sub">Usually replies instantly</div>
              </div>
            </div>
            <div className="chat-messages">
              {messages.map((m, i) => (
                <div key={i} className={`msg ${m.role === 'ai' ? 'msg-ai' : 'msg-user'}`}>
                  {m.text}
                </div>
              ))}
              {chatLoading && (
                <div className="msg msg-ai" style={{ opacity: 0.6 }}>Typing…</div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="chat-input-row">
              <input
                className="chat-input"
                placeholder="Ask anything…"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendChat()}
              />
              <button className="chat-send" onClick={sendChat}>➤</button>
            </div>
          </div>
        )}
        <button className="chat-toggle" onClick={() => setChatOpen(o => !o)}>
          {chatOpen ? '✕' : '💬'}
        </button>
      </div>
    </>
  );
}
