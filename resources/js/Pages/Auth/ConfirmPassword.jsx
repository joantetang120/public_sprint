import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Zap, Lock, ArrowRight, Shield, Eye, EyeOff, Users, Rocket, Star } from 'lucide-react';
import { useState } from 'react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Confirm your password - PublicSprint" />
            
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
                        <div className="w-12 h-12 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-sm">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <span className="text-2xl font-bold text-white block leading-none">PublicSprint</span>
                            <span className="text-sm text-white/90">Build in public</span>
                        </div>
                    </Link>

                    {/* Content */}
                    <div className="relative">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h1 className="text-4xl font-bold text-white mb-6 leading-tight">
                                Security check
                                <br />
                                required 🛡️
                            </h1>
                            <p className="text-lg text-white/90 leading-relaxed mb-8">
                                For your security, please confirm your password to continue.
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

                {/* Right Side - Form */}
                <div className="flex-1 flex items-center justify-center p-6 sm:p-8 bg-gray-50">
                    <div className="w-full max-w-md">
                        {/* Mobile Logo */}
                        <Link href="/" className="lg:hidden flex items-center space-x-3 mb-8 justify-center">
                            <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center shadow-sm">
                                <Zap className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-bold text-gray-900 leading-none">PublicSprint</span>
                                <span className="text-xs text-green-600 font-medium">Build in public</span>
                            </div>
                        </Link>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center"
                        >
                            {/* Security Icon */}
                            <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-green-100 flex items-center justify-center">
                                <Shield className="w-8 h-8 text-green-600" />
                            </div>

                            <h2 className="text-2xl font-bold text-gray-900 mb-3">
                                Confirm your password
                            </h2>
                            <p className="text-gray-600 mb-8 leading-relaxed">
                                For security purposes, please confirm your password to continue.
                            </p>

                            <form onSubmit={submit} className="space-y-6 text-left">
                                <div>
                                    <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-3">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            autoComplete="current-password"
                                            autoFocus
                                            required
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

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="group w-full px-6 py-4 bg-green-500 text-white rounded-lg font-semibold text-base hover:bg-green-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-sm hover:shadow-md"
                                >
                                    <span>{processing ? 'Confirming...' : 'Confirm and continue'}</span>
                                    {!processing && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                                </button>
                            </form>

                            {/* Security Notice */}
                            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex items-start space-x-3">
                                    <Shield className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                    <div className="text-left">
                                        <p className="text-sm font-medium text-gray-900 mb-1">Security notice</p>
                                        <p className="text-xs text-gray-600">
                                            This extra step helps protect your account and community data.
                                        </p>
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