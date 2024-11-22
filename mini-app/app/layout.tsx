import localFont from 'next/font/local';
import './globals.css';
import { BASE_URL } from './lib/utils';
import { fetchMetadata } from "frames.js/next";

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

 
export async function generateMetadata() {
  return {
    title: "Icebreaker Feed",
    description: 'Credentialed feeds',
    other: {
      ...(await fetchMetadata(
        new URL(
          "/frames",
          BASE_URL
        )
      )),
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
