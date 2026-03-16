import '@fontsource/bodoni-moda';
import { VT323 } from 'next/font/google';
import "./globals.css";

const vt323 = VT323({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-mono-retro',
});

export const metadata = {
  title: "Logan Patterson",
  description: "Software Engineer",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={vt323.variable}>
      <body>{children}</body>
    </html>
  );
}