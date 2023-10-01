'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut, signIn } from 'next-auth/react';

export default function Navbar() {
    const { data: session } = useSession();

    return (
        <nav
            className="flex items-center justify-between w-full py-4 px-8 px
-24"
        >
            <div>
                <a className="text-2xl font-bold" href="/">
                    Songer
                </a>
            </div>
            <div>
                <ul className="flex items-center gap-8">
                    {session && (
                        <>
                            <li>
                                <Link href="/dashboard" className="text-m font-bold">
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link href="/add" className="text-m font-bold">
                                    Add a song
                                </Link>
                            </li>
                            <li className="flex items-center gap-2">
                                {session.user?.name && session.user?.image && (
                                    <Image
                                        src={session.user?.image}
                                        alt={session.user?.name}
                                        height={32}
                                        width={32}
                                        className="rounded-full"
                                        unoptimized
                                    />
                                )}
                                <span
                                    onClick={() => signOut()}
                                    className="text-m font-bold cursor-pointer"
                                >
                                    Logout
                                </span>
                            </li>
                        </>
                    )}
                    {!session && (
                        <li>
                            <span
                                onClick={() => signIn()}
                                className="text-m font-bold cursor-pointer"
                            >
                                Login
                            </span>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
}
