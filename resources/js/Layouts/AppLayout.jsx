import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Home, Compass, PlusCircle, Bell, User, Menu, X, 
    Sun, Moon, Zap, TrendingUp, Users 
} from 'lucide-react';

export default function AppLayout({ children }) {
    const { auth } = usePage().props;
    const [darkMode, setDarkMode] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);

    useEffect(() => {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            setDarkMode(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        if (!darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    const navigation = [
        { name: 'Home', href: '/dashboard', icon: Home },
        { name: 'Discover', href: '/discover', icon: Compass },
        { name: 'Sprints', href: '/sprints', icon: TrendingUp },
        { name: 'Profile', href: `/profile/${auth?.user?.id}`, icon: User },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-950">
            {/* Header */}
            <motion.header 
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="sticky top-0 z-50 glass-card border-b"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-2 group">
                            <img 
                                src="/logo/log2.png" 
                                alt="PublicSprint Logo" 
                                className="h-24 w-auto"
                            />
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-1">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            ))}
                        </nav>

                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                            {/* Create Sprint Button */}
                            <Link
                                href="/sprints/create"
                                className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-xl font-semibold btn-hover"
                            >
                                <PlusCircle className="w-5 h-5" />
                                <span>Create Sprint</span>
                            </Link>

                            {/* Notifications */}
                            <button
                                onClick={() => setNotificationsOpen(!notificationsOpen)}
                                className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-800"
                            >
                                <Bell className="w-6 h-6" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>

                            {/* Dark Mode Toggle */}
                            <button
                                onClick={toggleDarkMode}
                                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-800"
                            >
                                {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                            </button>

                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-800"
                            >
                                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
                            className="md:hidden border-t border-gray-200 dark:border-dark-800"
                        >
                            <div className="px-4 py-4 space-y-2">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-800"
                                    >
                                        <item.icon className="w-5 h-5" />
                                        <span className="font-medium">{item.name}</span>
                                    </Link>
                                ))}
                                <Link
                                    href="/sprints/create"
                                    className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-xl font-semibold"
                                >
                                    <PlusCircle className="w-5 h-5" />
                                    <span>Create Sprint</span>
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
                href="/sprints/create"
                className="sm:hidden fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-full shadow-2xl flex items-center justify-center btn-hover z-40"
            >
                <PlusCircle className="w-7 h-7" />
            </Link>
        </div>
    );
}
