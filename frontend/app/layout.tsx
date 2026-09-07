import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SystemDesign Lab',
  description: 'Build it, run it, break it, and understand system design.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
