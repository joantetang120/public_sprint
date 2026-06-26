import { Head, Link, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowRightIcon,
    ArrowRightOnRectangleIcon,
    CheckCircleIcon,
    EnvelopeIcon,
} from '@heroicons/react/24/outline';
import AuthSidePanel from '@/Components/AuthSidePanel';
import { useLanguage } from '@/Contexts/LanguageContext';

export default function VerifyEmail({ status }) {
    const { tl } = useLanguage();
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <>
            <Head title="Verify your email — PublicSprint" />

            <div className="flex min-h-screen bg-[#f5f1e8]">
                <AuthSidePanel
                    headline={tl('One last step.')}
                    sub={tl('Check your inbox to activate your account and start building.')}
                />

                <div className="flex flex-1 items-center justify-center px-5 py-12">
                    <div className="w-full max-w-md">
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="rounded-[28px] border border-stone-200 bg-white p-8 shadow-sm text-center"
                        >
                            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100">
                                <EnvelopeIcon className="h-7 w-7 text-emerald-700" />
                            </div>

                            <h2 className="mb-2 text-2xl font-black text-stone-900">{tl('Verify your email')}</h2>
                            <p className="mb-6 text-sm leading-7 text-stone-500">
                                {tl('We\'ve sent a verification link to your email address.')}
                            </p>

                            <div className="mb-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                                <p className="text-sm font-medium text-emerald-800">
                                    {tl('Check your inbox and click the link to activate your account.')}
                                </p>
                            </div>

                            <AnimatePresence>
                                {status === 'verification-link-sent' && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.96 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-left text-sm"
                                    >
                                        <CheckCircleIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
                                        <div>
                                            <p className="font-bold text-emerald-800">{tl('New link sent!')}</p>
                                            <p className="mt-0.5 text-xs text-emerald-700">{tl('We\'ve sent a fresh link to your email.')}</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <form onSubmit={submit} className="space-y-3">
                                <button type="submit" disabled={processing}
                                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-950 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:opacity-50">
                                    {processing ? tl('Resending…') : tl('Resend verification email')}
                                    {!processing && <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-0.5" />}
                                </button>

                                <Link
                                    href={route('logout')} method="post" as="button"
                                    className="group flex w-full items-center justify-center gap-2 rounded-xl border border-stone-200 px-6 py-3.5 text-sm font-semibold text-stone-600 transition hover:border-stone-300 hover:text-stone-800"
                                >
                                    <ArrowRightOnRectangleIcon className="h-4 w-4" />
                                    {tl('Sign out')}
                                </Link>
                            </form>

                            <div className="mt-6 rounded-2xl border border-stone-100 bg-stone-50 p-4 text-left">
                                <p className="text-xs text-stone-500">
                                    <span className="font-bold text-stone-700">{tl('Didn\'t receive the email?')}</span>{' '}
                                    {tl('Check your spam folder or resend the link.')}
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    );
}
