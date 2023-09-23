import './globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { getServerSession } from 'next-auth';

import Navbar from '@/components/nav/Navbar';
import SessionProvider from '@/components/providers/SessionProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Find good songs',
    description: 'Blip Band'
};

import { cn } from '@/lib/utils';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession();
    return (
        <html lang="en" className="dark">
            <body className={cn(inter.className, 'min-h-screen flex flex-col')}>
                <SessionProvider session={session}>
                    <Navbar />
                    {children}
                </SessionProvider>
            </body>
        </html>
    );
}
