import type { Metadata } from 'next';
import './globals.scss';

export const metadata: Metadata = {
  title: '메모앱(Firebase)',
  description: 'Next.js + Firebase 메모앱',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='ko'>
      <body>{children}</body>
    </html>
  );
}
