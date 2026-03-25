import './globals.css';
import type { Metadata } from 'next';
import AppShell from '@/components/AppShell';

export const metadata: Metadata = {
  title: 'Infact Access - Discover Grants, Fellowships & Scholarships',
  description: 'Find and apply to curated grants, fellowships, scholarships, and programs tailored to your goals.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
