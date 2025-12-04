import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Zap, Mail, ArrowRight, CheckCircle2, LogOut, Users, Rocket, Star } from 'lucide-react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <>
            <Head title="Verify your email - PublicSprint" />
            
            <div className="min-h-screen flex bg-white">
                {/* Left Side - Community Branding */}
                <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-500 to-green-600 p-12 flex-col justify-between relative overflow-hidden">
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0" style={{ 
                            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', 
                            backgroundSize: '50px 50px' 
                        }} />
                    </div>

                    {/* Animated background elements */}
                    <div className="absolute top-20 -left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

                    {/* Logo */}
                    <Link href="/" className="relative flex items-center space-x-3 group">
                        <img 
                            src="/logo/logoWhite-removebg-preview.png" 
                            alt="PublicSprint Logo" 
                            className="h-16 w-auto"
                        />
                    </Link>

                    {/* Content */}
                    <div className="relative">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h1 className="text-4xl font-bold text-white mb-6 leading-tight">
                                Welcome to the
                                <br />
                                community! 🎉
                            </h1>
                            <p className="text-lg text-white/90 leading-relaxed mb-8">
                                Just one quick step to start building with fellow makers.
                            </p>
                            
                            {/* Community Stats */}
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { value: '2,847', label: 'Active Builders', icon: Users },
                                    { value: '890+', label: 'Projects Shipped', icon: Rocket },
                                    { value: '4.9★', label: 'Community Rating', icon: Star },
                                ].map((stat, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 + (i * 0.1) }}
                                        className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
                                    >
                                        <stat.icon className="w-5 h-5 text-white mb-2" />
                                        <div className="text-lg font-bold text-white mb-1">{stat.value}</div>
                                        <div className="text-xs text-white/80">{stat.label}</div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Footer */}
                    <div className="relative text-white/80 text-sm">
                        © 2024 PublicSprint. Built for makers, by makers.
                    </div>
                </div>

                {/* Right Side - Content */}
                <div className="flex-1 flex items-center justify-center p-6 sm:p-8 bg-gray-50">
                    <div className="w-full max-w-md">
                        {/* Mobile Logo */}
                        <Link href="/" className="lg:hidden flex items-center space-x-3 mb-8 justify-center">
                            <img 
                                src="/logo/logoWhite-removebg-preview.png" 
                                alt="PublicSprint Logo" 
                                className="h-16 w-auto"
                            />
                        </Link>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center"
                        >
                            {/* Email Icon */}
                            <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-green-100 flex items-center justify-center">
                                <Mail className="w-8 h-8 text-green-600" />
                            </div>

                            <h2 className="text-2xl font-bold text-gray-900 mb-3">
                                Verify your email
                            </h2>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                Welcome to PublicSprint! We've sent a verification link to your email address to activate your account.
                            </p>

                            <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
                                <p className="text-sm text-blue-800 font-medium">
                                    Check your inbox and click the verification link to start building with the community.
                                </p>
                            </div>

                            {status === 'verification-link-sent' && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-3"
                                >
                                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <div className="text-left">
                                        <p className="text-green-700 text-sm font-medium mb-1">New link sent!</p>
                                        <p className="text-green-600 text-xs">
                                            We've sent a fresh verification link to your email address.
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            <form onSubmit={submit} className="space-y-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="group w-full px-6 py-4 bg-green-500 text-white rounded-lg font-semibold text-base hover:bg-green-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-sm hover:shadow-md"
                                >
                                    <span>{processing ? 'Sending...' : 'Resend verification email'}</span>
                                    {!processing && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                                </button>

                                <div className="pt-4 border-t border-gray-200">
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="flex items-center justify-center space-x-2 w-full px-6 py-3 text-gray-600 hover:text-gray-900 font-semibold transition-colors group"
                                    >
                                        <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                        <span>Sign out</span>
                                    </Link>
                                </div>
                            </form>

                            {/* Help Text */}
                            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <p className="text-xs text-gray-600 text-left">
                                    <strong>Didn't receive the email?</strong> Check your spam folder or make sure you entered the correct email address. The verification link will expire in 24 hours.
                                </p>
                            </div>
                        </motion.div>

                        {/* Mobile Community Stats */}
                        <div className="lg:hidden mt-8 grid grid-cols-3 gap-4">
                            {[
                                { value: '2.8k', label: 'Builders' },
                                { value: '890+', label: 'Shipped' },
                                { value: '4.9★', label: 'Rating' },
                            ].map((stat, i) => (
                                <div key={i} className="bg-white rounded-lg p-4 text-center border border-gray-200">
                                    <div className="text-lg font-bold text-gray-900 mb-1">{stat.value}</div>
                                    <div className="text-xs text-gray-600">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}