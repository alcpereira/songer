import Link from 'next/link';

export default function Navbar() {
    return (
        <nav
            className="flex items-center justify-between w-full py-4 px-8 px
-24"
        >
            <div>
                <Link href="/" className="text-2xl font-bold">
                    Songer
                </Link>
            </div>
            <div className="flex items-center gap-8">
                <Link href="/login" className="text-m font-bold">
                    Login
                </Link>
                <Link href="/add" className="text-m font-bold">
                    Add a song
                </Link>
            </div>
        </nav>
    );
}
