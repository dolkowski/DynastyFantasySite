import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? 'Dynasty Fantasy HQ';

export const metadata: Metadata = {
  title: `${siteName} | League Central`,
  description: 'Fantasy football league dashboard with standings, matchups, team pages, and power rankings.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Header siteName={siteName} />
        <main className="container-shell">{children}</main>
      </body>
    </html>
  );
}
