import localFont from 'next/font/local';
import './globals.css';
import { frame } from './lib/utils';
import FrameProvider from './components/frame-provider';

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
    title: "Icebreaker Feeds",
    description: 'Credentialed feeds',
    other: {
      "fc:frame": JSON.stringify(frame),
    }
  }
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
        <FrameProvider>
          {children}
        </FrameProvider>
      </body>
    </html>
  );
}
