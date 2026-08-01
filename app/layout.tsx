import type {Metadata} from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: 'Mista Sri City | Building Cities of Tomorrow',
  description: 'Mista Sri City - Redefining luxury living. Talk to Mista AI to discover more.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} scroll-smooth`} suppressHydrationWarning>
      <body className="font-sans antialiased text-gray-800" suppressHydrationWarning>{children}</body>
    </html>
  );
}
