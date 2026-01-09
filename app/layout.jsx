import '@fontsource/bodoni-moda';
import "./globals.css";

export const metadata = {
  title: "Logan Patterson",
  description: "Software Engineer",
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
} 