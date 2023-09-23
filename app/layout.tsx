import Navbar from '@/components/Navbar';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Find good songs',
    description: 'Blip Band'
};

import { cn } from '@/lib/utils';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="dark">
            <body className={cn(inter.className, 'min-h-screen flex flex-col')}>
                <Navbar />
                {children}
            </body>
        </html>
    );
}
