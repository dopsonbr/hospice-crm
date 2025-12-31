import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HospicePro CRM',
  description: 'Sales CRM for hospice facility management software',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
