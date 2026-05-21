import { useEffect, useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Bars3Icon,
    BellAlertIcon,
    BoltIcon,
    ChatBubbleOvalLeftEllipsisIcon,
    Cog6ToothIcon,
    HomeIcon,
    MagnifyingGlassIcon,
    MapIcon,
    PlusIcon,
    RocketLaunchIcon,
    UserCircleIcon,
    UserPlusIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import UserAvatar from '@/Components/UserAvatar';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import { useLanguage } from '@/Contexts/LanguageContext';
import { routeKey } from '@/lib/routeKey';

export default function PublicSprintLayout({ children }) {
    const page = usePage();
    const { auth } = page.props;
    const { url } = page;
    const { t, tl } = useLanguage();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!auth.user) {
            return undefined;
        }

        const fetchNotifications = async () => {
            try {
                const response = await fetch(route('notifications.unread'));
                const data = await response.json();
                setUnreadCount(data.count);
            } catch (error) {
                console.error('Failed to fetch notifications:', error);
            }
        };

        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [auth.user]);

    const navigation = [
        { name: t('common.home'), href: route('dashboard'), icon: HomeIcon, match: '/dashboard' },
        { name: t('common.discover'), href: route('discover'), icon: MapIcon, match: '/discover' },
        { name: t('common.sprints'), href: route('sprints.index'), icon: MapIcon, match: '/sprints' },
        { name: t('common.profile'), href: auth.user ? route('users.show', routeKey(auth.user)) : route('login'), icon: UserCircleIcon, match: '/users' },
        ...(auth.user ? [{ name: t('common.settings'), href: route('settings.index'), icon: Cog6ToothIcon, match: '/settings' }] : []),
    ];

    const isActive = (item) => {
        if (!url) {
            return false;
        }

        return item.match === '/sprints'
            ? url.startsWith('/sprints')
            : url.startsWith(item.match);
    };

    const activityNotes = [
        tl('Daily check-ins'),
        tl('Shared progress'),
        tl('Live accountability'),
    ];

    return (
        <div className="ps-app-shell">
            <motion.header
                initial={{ y: -18, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="ps-topbar"
            >
                <div className="mx-auto flex h-[74px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link href="/" className="group flex items-center gap-3">
                        <span className="relative grid h-11 w-11 place-items-center overflow-hidden rounded-lg bg-[#17211d]">
                            <img src="/logo/minilogowhite.jpg" alt="PublicSprint" className="h-8 w-8 object-contain" />
                            <span className="absolute bottom-1 right-1 ps-live-dot" />
                        </span>
                        <span className="hidden sm:block">
                            <span className="block font-display text-lg font-black leading-none text-[#17211d]">PublicSprint</span>
                            <span className="block text-[11px] font-black uppercase tracking-[0.16em] text-[#66736d]">
                                {tl('ship in public')}
                            </span>
                        </span>
                    </Link>

                    <nav className="hidden items-center gap-1 md:flex">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`ps-nav-link ${isActive(item) ? 'ps-nav-link-active' : ''}`}
                            >
                                <item.icon className="h-5 w-5" />
                                <span>{item.name}</span>
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-2">
                        <LanguageSwitcher compact className="hidden md:flex" />

                        <Link
                            href={route('search.index')}
                            className="grid h-10 w-10 place-items-center rounded-full border border-black/10 bg-white/70 text-[#17211d] transition hover:bg-[#b7f34a]"
                            title={tl('Search')}
                        >
                            <MagnifyingGlassIcon className="h-5 w-5" />
                        </Link>

                        <Link href={route('sprints.create')} className="ps-command-button hidden sm:inline-flex">
                            <PlusIcon className="h-5 w-5" />
                            <span>{t('nav.createSprint')}</span>
                        </Link>

                        {auth.user && (
                            <button
                                onClick={() => router.visit(route('notifications.index'))}
                                className="relative grid h-10 w-10 place-items-center rounded-full border border-black/10 bg-white/70 text-[#17211d] transition hover:bg-[#b7f34a]"
                                title={tl('Notifications')}
                            >
                                <BellAlertIcon className="h-5 w-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#ff8066] px-1 text-[10px] font-black text-white">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </button>
                        )}

                        {auth.user ? (
                            <Link href={route('users.show', routeKey(auth.user))} className="rounded-full border border-black/10 bg-white/75 p-1 transition hover:bg-white">
                                <UserAvatar user={auth.user} className="h-8 w-8" />
                            </Link>
                        ) : (
                            <div className="hidden items-center gap-2 sm:flex">
                                <Link href={route('login')} className="ps-nav-link">
                                    {t('common.login')}
                                </Link>
                                <Link href={route('register')} className="ps-command-button">
                                    {t('common.register')}
                                </Link>
                            </div>
                        )}

                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="grid h-10 w-10 place-items-center rounded-full border border-black/10 bg-white/70 text-[#17211d] md:hidden"
                        >
                            {mobileMenuOpen ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="border-t border-black/10 bg-[#fbfaf5]"
                        >
                            <div className="space-y-2 px-4 py-4">
                                <LanguageSwitcher />
                                <Link
                                    href={route('search.index')}
                                    className="flex items-center gap-3 rounded-lg px-4 py-3 font-bold text-[#66736d]"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <MagnifyingGlassIcon className="h-5 w-5" />
                                    <span>{tl('Search')}</span>
                                </Link>
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center gap-3 rounded-lg px-4 py-3 font-bold ${isActive(item) ? 'bg-[#b7f34a]/45 text-[#17211d]' : 'text-[#66736d]'}`}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <item.icon className="h-5 w-5" />
                                        <span>{item.name}</span>
                                    </Link>
                                ))}
                                <Link
                                    href={route('sprints.create')}
                                    className="ps-command-button flex w-full"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <PlusIcon className="h-5 w-5" />
                                    <span>{t('nav.createSprint')}</span>
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.header>

            <div className="ps-mini-feed">
                <div className="space-y-2">
                    {activityNotes.map((note, index) => (
                        <motion.div
                            key={note}
                            initial={{ opacity: 0, x: 16 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.12 * index }}
                            className="ps-mini-feed-card flex items-center gap-2"
                        >
                            {index === 0 && <BoltIcon className="h-4 w-4 text-[#d8604c]" />}
                            {index === 1 && <ChatBubbleOvalLeftEllipsisIcon className="h-4 w-4 text-[#267f5e]" />}
                            {index === 2 && <UserPlusIcon className="h-4 w-4 text-[#3a78c2]" />}
                            <span>{note}</span>
                        </motion.div>
                    ))}
                </div>
            </div>

            <main className="ps-page">
                {children}
            </main>

            <Link
                href={route('sprints.create')}
                className="ps-command-button fixed bottom-5 right-5 z-40 h-14 w-14 rounded-full p-0 sm:hidden"
                title={t('nav.createSprint')}
            >
                <RocketLaunchIcon className="h-6 w-6" />
            </Link>

            <footer className="mt-14 border-t border-black/10 bg-white/60">
                <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-7 text-sm font-bold text-[#66736d] sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
                    <div className="flex items-center gap-3">
                        <img src="/logo/minilogogreen.jpg" alt="PublicSprint" className="h-9 w-9 rounded-lg object-cover" />
                        <span>PublicSprint © 2026</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                        <Link href="/about" className="hover:text-[#17211d]">{tl('About')}</Link>
                        <Link href="/privacy" className="hover:text-[#17211d]">{tl('Privacy')}</Link>
                        <Link href="/terms" className="hover:text-[#17211d]">{tl('Terms')}</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
