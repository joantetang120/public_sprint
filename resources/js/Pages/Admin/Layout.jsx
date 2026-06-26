import { Link, usePage } from '@inertiajs/react';
import {
    ArrowLeftOnRectangleIcon,
    ArrowTopRightOnSquareIcon,
    BoltIcon,
    ChartBarIcon,
    HomeIcon,
    RocketLaunchIcon,
    UsersIcon,
} from '@heroicons/react/24/outline';

const NAV = [
    { label: 'Overview',  href: '/'+window.__adminPath, icon: HomeIcon },
    { label: 'Users',     href: '/'+window.__adminPath+'/users', icon: UsersIcon },
    { label: 'Sprints',   href: '/'+window.__adminPath+'/sprints', icon: RocketLaunchIcon },
    { label: 'Activity',  href: '/'+window.__adminPath+'/activity', icon: BoltIcon },
];

export default function AdminLayout({ children, title }) {
    const { url } = usePage();

    return (
        <div className="flex min-h-screen bg-stone-50 font-sans">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 z-40 flex w-56 flex-col bg-[#0c1f12]">
                <div className="flex h-16 items-center gap-2 border-b border-white/10 px-5">
                    <img src="/logo/log2.png" alt="PS" className="h-10 w-auto" />
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Admin</span>
                </div>

                <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
                    {NAV.map(({ label, href, icon: Icon }) => {
                        const active = url === href || (href !== '/'+window.__adminPath && url.startsWith(href));
                        return (
                            <Link key={label} href={href}
                                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                                    active
                                        ? 'bg-emerald-700/30 text-emerald-300'
                                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                                }`}>
                                <Icon className="h-4 w-4 flex-shrink-0" />
                                {label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="border-t border-white/10 p-3 space-y-1">
                    <Link href="/dashboard"
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-white/60 transition hover:bg-white/5 hover:text-white">
                        <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                        Back to app
                    </Link>
                </div>
            </aside>

            {/* Main */}
            <div className="ml-56 flex-1">
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-stone-200 bg-white px-8">
                    <h1 className="text-base font-black text-stone-900">{title}</h1>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-semibold text-stone-500">Live</span>
                    </div>
                </header>
                <main className="p-8">{children}</main>
            </div>
        </div>
    );
}
