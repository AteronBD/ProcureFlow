import "../globals.css";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ProcureFlow',
  description: 'Satınalma ve Tedarikçi Yönetim Sistemi',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
