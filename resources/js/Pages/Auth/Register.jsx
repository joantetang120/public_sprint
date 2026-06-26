import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowRightIcon,
    CheckCircleIcon,
    EnvelopeIcon,
    EyeIcon,
    EyeSlashIcon,
    LockClosedIcon,
    UserIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import AuthSidePanel from '@/Components/AuthSidePanel';
import { useLanguage } from '@/Contexts/LanguageContext';

const GoogleIcon = () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#EA4335" d="M12 10.2v3.9h5.4c-.2 1.3-1.6 3.9-5.4 3.9-3.2 0-5.9-2.7-5.9-6s2.7-6 5.9-6c1.8 0 3.1.8 3.8 1.4l2.6-2.5C16.8 3.4 14.6 2.5 12 2.5 6.8 2.5 2.5 6.8 2.5 12S6.8 21.5 12 21.5c6.9 0 9.2-4.8 9.2-7.3 0-.5 0-.8-.1-1.2H12Z" />
        <path fill="#34A853" d="M3.6 7.4l3.2 2.3C7.7 7.8 9.7 6.4 12 6.4c1.8 0 3.1.8 3.8 1.4l2.6-2.5C16.8 3.4 14.6 2.5 12 2.5c-3.6 0-6.7 2-8.4 4.9Z" />
        <path fill="#FBBC05" d="M2.5 12c0 1.6.4 3.2 1.1 4.6l3.7-2.8c-.2-.5-.3-1.1-.3-1.8s.1-1.2.3-1.8L3.6 7.4C2.9 8.8 2.5 10.4 2.5 12Z" />
        <path fill="#4285F4" d="M12 21.5c2.5 0 4.7-.8 6.2-2.3l-3-2.4c-.8.6-1.9 1.1-3.2 1.1-3.7 0-5.2-2.5-5.4-3.8l-3.7 2.8c1.7 3 4.8 4.6 8.1 4.6Z" />
    </svg>
);

const inputClass = "w-full rounded-xl border border-stone-200 bg-stone-50 py-3.5 pl-11 pr-4 text-sm font-medium text-stone-900 placeholder:text-stone-400 transition focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 hover:border-stone-300";

export default function Register() {
    const { props } = usePage();
    const { tl } = useLanguage();
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '', email: '', password: '', password_confirmation: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm]   = useState(false);
    const googleError = props.errors?.google;

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), { onFinish: () => reset('password', 'password_confirmation') });
    };

    return (
        <>
            <Head title={tl('Join PublicSprint')} />

            <div className="flex min-h-screen bg-[#f5f1e8]">
                <AuthSidePanel
                    headline={tl('Document the process.')}
                    sub={tl('Join builders writing their story in public — before they become famous.')}
                />

                {/* Right — form */}
                <div className="flex flex-1 items-center justify-center px-5 py-12">
                    <div className="w-full max-w-md">
                        <div className="mb-6 flex items-center justify-between">
                            <Link href="/" className="lg:hidden">
                                <img src="/logo/log2.png" alt="PublicSprint" className="h-14 w-auto" />
                            </Link>
                            <div className="ml-auto">
                                <LanguageSwitcher compact />
                            </div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="rounded-[28px] border border-stone-200 bg-white p-8 shadow-sm"
                        >
                            <div className="mb-8 text-center">
                                <h2 className="text-2xl font-black text-stone-900">{tl('Join the community')}</h2>
                                <p className="mt-2 text-sm text-stone-500">
                                    {tl('Already have an account?')}{' '}
                                    <Link href={route('login')} className="font-semibold text-emerald-700 transition hover:text-emerald-900">
                                        {tl('Sign in')}
                                    </Link>
                                </p>
                            </div>

                            {googleError && (
                                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                                    {googleError}
                                </div>
                            )}

                            {/* Google */}
                            <a
                                href={route('auth.google.redirect')}
                                className="mb-6 flex w-full items-center justify-center gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-700 transition hover:border-stone-300 hover:bg-stone-50"
                            >
                                <GoogleIcon />
                                {tl('Continue with Google')}
                            </a>

                            <div className="mb-6 flex items-center gap-3">
                                <div className="h-px flex-1 bg-stone-200" />
                                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">{tl('or create an account with email')}</span>
                                <div className="h-px flex-1 bg-stone-200" />
                            </div>

                            <form onSubmit={submit} className="space-y-4">
                                {/* Name */}
                                <div>
                                    <label htmlFor="name" className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-stone-500">
                                        {tl('Full name')}
                                    </label>
                                    <div className="relative">
                                        <UserIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                                        <input id="name" type="text" value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            autoComplete="name" autoFocus required
                                            className={inputClass} placeholder="John Doe" />
                                    </div>
                                    {errors.name && <p className="mt-1.5 text-xs text-red-600">{errors.name}</p>}
                                </div>

                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-stone-500">
                                        {tl('Email address')}
                                    </label>
                                    <div className="relative">
                                        <EnvelopeIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                                        <input id="email" type="email" value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            autoComplete="username" required
                                            className={inputClass} placeholder="you@example.com" />
                                    </div>
                                    {errors.email && <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>}
                                </div>

                                {/* Password */}
                                <div>
                                    <label htmlFor="password" className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-stone-500">
                                        {tl('Password')}
                                    </label>
                                    <div className="relative">
                                        <LockClosedIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                                        <input id="password" type={showPassword ? 'text' : 'password'} value={data.password}
                                            onChange={e => setData('password', e.target.value)}
                                            autoComplete="new-password" required
                                            className={inputClass + ' pr-11'} placeholder="••••••••" />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 transition hover:text-stone-600">
                                            {showPassword ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    {errors.password && <p className="mt-1.5 text-xs text-red-600">{errors.password}</p>}
                                </div>

                                {/* Confirm */}
                                <div>
                                    <label htmlFor="password_confirmation" className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-stone-500">
                                        {tl('Confirm password')}
                                    </label>
                                    <div className="relative">
                                        <LockClosedIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                                        <input id="password_confirmation" type={showConfirm ? 'text' : 'password'} value={data.password_confirmation}
                                            onChange={e => setData('password_confirmation', e.target.value)}
                                            autoComplete="new-password" required
                                            className={inputClass + ' pr-11'} placeholder="••••••••" />
                                        <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 transition hover:text-stone-600">
                                            {showConfirm ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    {errors.password_confirmation && <p className="mt-1.5 text-xs text-red-600">{errors.password_confirmation}</p>}
                                </div>

                                {/* Terms */}
                                <p className="text-center text-xs text-stone-500">
                                    {tl('By creating an account, you agree to our')}{' '}
                                    <Link href="/terms" className="font-semibold text-emerald-700 hover:underline">{tl('Terms of Service')}</Link>
                                    {' '}{tl('and')}{' '}
                                    <Link href="/privacy" className="font-semibold text-emerald-700 hover:underline">{tl('Privacy Policy')}</Link>
                                </p>

                                {/* Submit */}
                                <button type="submit" disabled={processing}
                                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-950 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:opacity-50">
                                    {processing ? tl('Creating account…') : tl('Join PublicSprint')}
                                    {!processing && <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-0.5" />}
                                </button>
                            </form>

                            <div className="mt-6 flex items-center justify-center gap-5 border-t border-stone-100 pt-6">
                                {[tl('Free forever'), tl('No credit card')].map(l => (
                                    <span key={l} className="flex items-center gap-1.5 text-xs text-stone-400">
                                        <CheckCircleIcon className="h-3.5 w-3.5 text-emerald-600" />{l}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    );
}
