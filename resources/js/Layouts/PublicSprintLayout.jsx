import { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Home, Compass, PlusCircle, Bell, User, Menu, X, 
    Zap, TrendingUp, MessageSquare, UserPlus, Search, Settings
} from 'lucide-react';
import UserAvatar from '@/Components/UserAvatar';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import { useLanguage } from '@/Contexts/LanguageContext';
import { routeKey } from '@/lib/routeKey';

export default function PublicSprintLayout({ children }) {
    const { auth } = usePage().props;
    const { t, tl } = useLanguage();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        // Fetch notifications if user is logged in
        if (auth.user) {
            fetchNotifications();
            // Poll for new notifications every 30 seconds
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [auth.user]);

    const fetchNotifications = async () => {
        try {
            const response = await fetch(route('notifications.unread'));
            const data = await response.json();
            setUnreadCount(data.count);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };

    const loadNotifications = async () => {
        try {
            const response = await fetch(route('notifications.index'));
            setShowNotifications(!showNotifications);
        } catch (error) {
            console.error('Failed to load notifications:', error);
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'new_follower':
                return <UserPlus className="w-5 h-5 text-green-600" />;
            case 'new_comment':
                return <MessageSquare className="w-5 h-5 text-blue-600" />;
            case 'new_reaction':
                return <Heart className="w-5 h-5 text-red-600" />;
            default:
                return <Bell className="w-5 h-5 text-gray-600" />;
        }
    };

    const navigation = [
        { name: t('common.home'), href: route('dashboard'), icon: Home },
        { name: t('common.discover'), href: route('discover'), icon: Compass },
        { name: t('common.sprints'), href: route('sprints.index'), icon: TrendingUp },
        { name: t('common.profile'), href: auth.user ? route('users.show', routeKey(auth.user)) : route('login'), icon: User },
        ...(auth.user ? [{ name: t('common.settings'), href: route('settings.index'), icon: Settings }] : []),
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <motion.header 
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-3 group">
                            <img 
                                src="/logo/log2.png" 
                                alt="PublicSprint Logo" 
                                className="h-20 w-auto"
                            />
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-1">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors font-medium"
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span>{item.name}</span>
                                </Link>
                            ))}
                        </nav>

                        {/* Actions */}
                        <div className="flex items-center space-x-3">
                            <LanguageSwitcher compact className="hidden md:flex" />

                            {/* Search Button */}
                            <Link
                                href={route('discover')}
                                className="p-2 rounded-lg text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors"
                            >
                                <Search className="w-5 h-5" />
                            </Link>

                            {/* Create Sprint Button */}
                            <Link
                                href={route('sprints.create')}
                                className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors shadow-sm hover:shadow-md"
                            >
                                <PlusCircle className="w-5 h-5" />
                                <span>{t('nav.createSprint')}</span>
                            </Link>

                            {/* Notifications */}
                            {auth.user && (
                                <div className="relative">
                                    <button
                                        onClick={() => router.visit(route('notifications.index'))}
                                        className="relative p-2 rounded-lg text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors"
                                    >
                                        <Bell className="w-5 h-5" />
                                        {unreadCount > 0 && (
                                            <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                                                {unreadCount > 9 ? '9+' : unreadCount}
                                            </span>
                                        )}
                                    </button>
                                </div>
                            )}

                            {/* User Avatar / Login */}
                            {auth.user ? (
                                <Link
                                    href={route('users.show', routeKey(auth.user))}
                                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <UserAvatar user={auth.user} className="w-8 h-8" />
                                </Link>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <Link
                                        href={route('login')}
                                        className="px-4 py-2 text-gray-700 hover:text-green-600 font-medium transition-colors"
                                    >
                                        {t('common.login')}
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors shadow-sm hover:shadow-md"
                                    >
                                        {t('common.register')}
                                    </Link>
                                </div>
                            )}

                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden p-2 rounded-lg text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors"
                            >
                                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden border-t border-gray-200 bg-white"
                        >
                            <div className="px-4 py-4 space-y-2">
                                <div className="px-1 pb-2">
                                    <LanguageSwitcher />
                                </div>
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors font-medium"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        <span>{item.name}</span>
                                    </Link>
                                ))}
                                <Link
                                    href={route('sprints.create')}
                                    className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <PlusCircle className="w-5 h-5" />
                                    <span>{t('nav.createSprint')}</span>
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>

            {/* Floating Action Button (Mobile) */}
            <Link
                href={route('sprints.create')}
                className="sm:hidden fixed bottom-6 right-6 w-14 h-14 bg-green-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-600 transition-colors z-40"
            >
                <PlusCircle className="w-6 h-6" />
            </Link>

            {/* Simple Footer */}
            <footer className="bg-white border-t border-gray-200 mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center space-x-3 mb-4 md:mb-0">
                            <img 
                                src="/logo/log2.png" 
                                alt="PublicSprint Logo" 
                                className="h-16 w-auto"
                            />
                        </div>
                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                            <Link href="/about" className="hover:text-green-600 transition-colors">{tl('About')}</Link>
                            <Link href="/privacy" className="hover:text-green-600 transition-colors">{tl('Privacy')}</Link>
                            <Link href="/terms" className="hover:text-green-600 transition-colors">{tl('Terms')}</Link>
                            <span>© 2024 PublicSprint</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
