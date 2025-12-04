import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Zap, Mail, Lock, ArrowRight, Eye, EyeOff, CheckCircle2, Users, Rocket, Star } from 'lucide-react';
import { useState } from 'react';

export default function Login({ status, canResetPassword, stats }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const formatNumber = (num) => {
        if (num >= 1000) {
            return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
        }
        return num.toString();
    };

    return (
        <>
            <Head title="Sign in to PublicSprint" />
            
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
                            className="h-28 w-auto"
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
                                Welcome back to
                                <br />
                                the community! 👋
                            </h1>
                            <p className="text-lg text-white/90 leading-relaxed mb-8">
                                Continue building amazing projects with support from fellow makers.
                            </p>
                            
                            {/* Community Stats */}
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { value: formatNumber(stats?.activeBuilders || 0), label: 'Active Builders', icon: Users },
                                    { value: formatNumber(stats?.projectsShipped || 0), label: 'Projects Shipped', icon: Rocket },
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

                {/* Right Side - Form */}
                <div className="flex-1 flex items-center justify-center p-6 sm:p-8 bg-gray-50">
                    <div className="w-full max-w-md">
                        {/* Mobile Logo */}
                        <Link href="/" className="lg:hidden flex items-center space-x-3 mb-8 justify-center">
                            <img 
                                src="/logo/logoWhite-removebg-preview.png" 
                                alt="PublicSprint Logo" 
                                className="h-28 w-auto"
                            />
                        </Link>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-xl p-8 shadow-sm border border-gray-200"
                        >
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    Welcome back
                                </h2>
                                <p className="text-gray-600">
                                    Don't have an account?{' '}
                                    <Link 
                                        href={route('register')} 
                                        className="text-green-600 font-semibold hover:underline transition-colors"
                                    >
                                        Join the community
                                    </Link>
                                </p>
                            </div>

                            {status && (
                                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                                    {status}
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-6">
                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-3">
                                        Email address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            autoComplete="username"
                                            autoFocus
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none text-gray-900 placeholder-gray-500 font-medium transition-all hover:border-gray-300"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                                    )}
                                </div>

                                {/* Password */}
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <label htmlFor="password" className="block text-sm font-semibold text-gray-900">
                                            Password
                                        </label>
                                        {canResetPassword && (
                                            <Link
                                                href={route('password.request')}
                                                className="text-sm text-green-600 font-medium hover:underline transition-colors"
                                            >
                                                Forgot password?
                                            </Link>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            autoComplete="current-password"
                                            className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none text-gray-900 placeholder-gray-500 font-medium transition-all hover:border-gray-300"
                                            placeholder="Enter your password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                                    )}
                                </div>

                                {/* Remember Me */}
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-600 font-medium">
                                        Remember me
                                    </span>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="group w-full px-6 py-4 bg-green-500 text-white rounded-lg font-semibold text-base hover:bg-green-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-sm hover:shadow-md"
                                >
                                    <span>{processing ? 'Signing in...' : 'Sign in to PublicSprint'}</span>
                                    {!processing && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                                </button>
                            </form>

                            {/* Community Trust Indicators */}
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <div className="text-center mb-4">
                                    <p className="text-sm text-gray-600 font-medium">
                                        Join 2,000+ builders shipping projects
                                    </p>
                                </div>
                                <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                                    <div className="flex items-center space-x-1">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        <span>Free forever</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        <span>Secure</span>
                                    </div>
                                </div>
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