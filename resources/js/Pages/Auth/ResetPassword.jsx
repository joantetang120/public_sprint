import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowLeftIcon,
    ArrowRightIcon,
    EnvelopeIcon,
    EyeIcon,
    EyeSlashIcon,
    LockClosedIcon,
    ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import AuthSidePanel from '@/Components/AuthSidePanel';
import { useLanguage } from '@/Contexts/LanguageContext';

const inputClass = "w-full rounded-xl border border-stone-200 bg-stone-50 py-3.5 pl-11 pr-4 text-sm font-medium text-stone-900 placeholder:text-stone-400 transition focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 hover:border-stone-300";

export default function ResetPassword({ email = '', status = null }) {
    const { tl } = useLanguage();
    const { data, setData, post, processing, errors, reset } = useForm({
        email, code: '', password: '', password_confirmation: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm]   = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('password.store'), { onFinish: () => reset('code', 'password', 'password_confirmation') });
    };

    return (
        <>
            <Head title="Reset your password — PublicSprint" />

            <div className="flex min-h-screen bg-[#f5f1e8]">
                <AuthSidePanel
                    headline={tl('Almost back.')}
                    sub={tl('Enter your code and choose a new password.')}
                />

                <div className="flex flex-1 items-center justify-center px-5 py-12">
                    <div className="w-full max-w-md">
                        <Link href="/" className="mb-8 block lg:hidden">
                            <img src="/logo/log2.png" alt="PublicSprint" className="h-14 w-auto" />
                        </Link>

                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="rounded-[28px] border border-stone-200 bg-white p-8 shadow-sm"
                        >
                            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100">
                                <ShieldCheckIcon className="h-7 w-7 text-emerald-700" />
                            </div>

                            <div className="mb-8 text-center">
                                <h2 className="text-2xl font-black text-stone-900">{tl('Verify and reset')}</h2>
                                <p className="mt-2 text-sm text-stone-500">
                                    {tl('Enter the code we sent to your email, then choose your new password.')}
                                </p>
                            </div>

                            {status && (
                                <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
                                    {status}
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-4">
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

                                {/* Code */}
                                <div>
                                    <label htmlFor="code" className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-stone-500">
                                        {tl('Verification code')}
                                    </label>
                                    <div className="relative">
                                        <ShieldCheckIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                                        <input id="code" type="text" value={data.code}
                                            onChange={e => setData('code', e.target.value.replace(/\D/g, '').slice(0, 6))}
                                            inputMode="numeric" autoComplete="one-time-code" required
                                            className={inputClass + ' tracking-[0.3em]'} placeholder="000000" />
                                    </div>
                                    {errors.code && <p className="mt-1.5 text-xs text-red-600">{errors.code}</p>}
                                </div>

                                {/* New password */}
                                <div>
                                    <label htmlFor="password" className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-stone-500">
                                        {tl('New password')}
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
                                        {tl('Confirm new password')}
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
                                </div>

                                <button type="submit" disabled={processing}
                                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-950 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:opacity-50">
                                    {processing ? tl('Resetting…') : tl('Reset password')}
                                    {!processing && <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-0.5" />}
                                </button>

                                <Link href={route('password.request')}
                                    className="group flex items-center justify-center gap-2 text-sm font-semibold text-stone-500 transition hover:text-emerald-800">
                                    <ArrowLeftIcon className="h-4 w-4 transition group-hover:-translate-x-0.5" />
                                    {tl('Request another code')}
                                </Link>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    );
}
