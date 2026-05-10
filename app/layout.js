import './globals.css';

export const metadata = {
  title: "OCEVIA Surf House — Taghazout, Morocco",
  description: "Premium surf house accommodation in Taghazout. Surf lessons, ocean views, and unforgettable experiences.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
