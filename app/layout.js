import "./globals.css";

export const metadata = {
  title: "Cashier Website For Transaction",
  description: "Aplikasi kasir sederhana berbasis Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
