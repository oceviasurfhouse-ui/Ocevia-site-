export const metadata = {
  title: "OCEVIA Surf House",
  description: "Surf House in Taghazout",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
