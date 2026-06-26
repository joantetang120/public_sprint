import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowLeftIcon,
    ArrowRightIcon,
    CheckCircleIcon,
    EnvelopeIcon,
} from '@heroicons/react/24/outline';
import AuthSidePanel from '@/Components/AuthSidePanel';
import { useLanguage } from '@/Contexts/LanguageContext';

const inputClass = "w-full rounded-xl border border-stone-200 bg-stone-50 py-3.5 pl-11 pr-4 text-sm font-medium text-stone-900 placeholder:text-stone-400 transition focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 hover:border-stone-300";

export default function ForgotPassword({ status }) {
    const { tl } = useLanguage();
    const { data, setData, post, processing, errors } = useForm({ email: '' });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <>
            <Head title="Reset your password — PublicSprint" />

            <div className="flex min-h-screen bg-[#f5f1e8]">
                <AuthSidePanel
                    headline={tl('No worries.')}
                    sub={tl('We\'ll send you a code. You\'ll be back in seconds.')}
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
                            <div className="mb-8 text-center">
                                <h2 className="text-2xl font-black text-stone-900">{tl('Reset your password')}</h2>
                                <p className="mt-2 text-sm text-stone-500">
                                    {tl('Enter your email and we\'ll send you a verification code.')}
                                </p>
                            </div>

                            {status && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.96 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
                                >
                                    <CheckCircleIcon className="mt-0.5 h-4 w-4 flex-shrink-0" />
                                    {status}
                                </motion.div>
                            )}

                            <form onSubmit={submit} className="space-y-5">
                                <div>
                                    <label htmlFor="email" className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-stone-500">
                                        {tl('Email address')}
                                    </label>
                                    <div className="relative">
                                        <EnvelopeIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                                        <input id="email" type="email" value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            autoComplete="username" autoFocus required
                                            className={inputClass} placeholder="you@example.com" />
                                    </div>
                                    {errors.email && <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>}
                                </div>

                                <button type="submit" disabled={processing}
                                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-950 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:opacity-50">
                                    {processing ? tl('Sending…') : tl('Send verification code')}
                                    {!processing && <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-0.5" />}
                                </button>

                                <Link href={route('login')}
                                    className="group flex items-center justify-center gap-2 text-sm font-semibold text-stone-500 transition hover:text-emerald-800">
                                    <ArrowLeftIcon className="h-4 w-4 transition group-hover:-translate-x-0.5" />
                                    {tl('Back to sign in')}
                                </Link>
                            </form>

                            <div className="mt-6 flex items-center justify-center gap-5 border-t border-stone-100 pt-6">
                                {[tl('Secure & private'), tl('6-digit code')].map(l => (
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
