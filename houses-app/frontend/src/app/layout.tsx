import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Houses - Neurodivergent-Friendly Dating',
  description: 'A dating app designed for neurodivergent individuals, featuring house-based matching and AI-powered quest guidance.',
  keywords: ['dating', 'neurodivergent', 'ADHD', 'autism', 'relationships'],
  authors: [{ name: 'Houses Team' }],
  openGraph: {
    title: 'Houses - Neurodivergent-Friendly Dating',
    description: 'Find meaningful connections through music, shared interests, and understanding.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}