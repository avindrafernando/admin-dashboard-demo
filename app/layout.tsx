import './globals.css';

import Link from 'next/link';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { Logo, SettingsIcon, UsersIcon } from '@/components/icons';
import { ThemeProvider } from '@/components/theme-provider';
import { ThemeToggle } from '@/components/theme-toggle';
import { User } from './user';
import { NavItem } from './nav-item';

const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans'
});

export const metadata = {
  title: 'Next.js App Router + NextAuth + Tailwind CSS',
  description:
    'A user admin dashboard configured with Next.js, Postgres, NextAuth, Tailwind CSS, TypeScript, and Prettier.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sans.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full font-sans">
        <ThemeProvider>
          <div className="grid min-h-screen w-full lg:grid-cols-[240px_1fr]">
            <div className="hidden border-r bg-card lg:block">
              <div className="flex h-full max-h-screen flex-col">
                <div className="flex h-14 items-center px-5">
                  <Link
                    className="flex items-center gap-2.5 text-sm font-semibold tracking-tight"
                    href="/"
                  >
                    <Logo />
                    <span>ACME</span>
                  </Link>
                </div>
                <div className="flex-1 overflow-auto px-3 py-2">
                  <nav className="grid gap-1">
                    <NavItem href="/">
                      <UsersIcon className="h-4 w-4" />
                      Users
                    </NavItem>
                    <NavItem href="/settings">
                      <SettingsIcon className="h-4 w-4" />
                      Settings
                    </NavItem>
                  </nav>
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <header className="flex h-14 items-center justify-between gap-4 border-b bg-card/80 px-4 backdrop-blur-sm sm:px-6">
                <div className="flex min-w-0 items-center gap-3 lg:hidden">
                  <Link
                    className="flex items-center gap-2.5 text-sm font-semibold tracking-tight"
                    href="/"
                  >
                    <Logo />
                    <span>ACME</span>
                  </Link>
                  <nav className="flex items-center gap-1">
                    <NavItem href="/">Users</NavItem>
                    <NavItem href="/settings">Settings</NavItem>
                  </nav>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <ThemeToggle />
                  <User />
                </div>
              </header>
              {children}
            </div>
          </div>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
