import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowRightIcon,
    EyeIcon,
    EyeSlashIcon,
    LockClosedIcon,
    ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import AuthSidePanel from '@/Components/AuthSidePanel';
import { useLanguage } from '@/Contexts/LanguageContext';

const inputClass = "w-full rounded-xl border border-stone-200 bg-stone-50 py-3.5 pl-11 pr-11 text-sm font-medium text-stone-900 placeholder:text-stone-400 transition focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 hover:border-stone-300";

export default function ConfirmPassword() {
    const { tl } = useLanguage();
    const { data, setData, post, processing, errors, reset } = useForm({ password: '' });
    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('password.confirm'), { onFinish: () => reset('password') });
    };

    return (
        <>
            <Head title="Confirm password — PublicSprint" />

            <div className="flex min-h-screen bg-[#f5f1e8]">
                <AuthSidePanel
                    headline={tl('Security first.')}
                    sub={tl('We keep your data and your journey safe.')}
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
                                <ShieldCheckIcon className="h-7 w-7 text-emerald-700" />
                            </div>

                            <h2 className="mb-2 text-2xl font-black text-stone-900">{tl('Confirm your password')}</h2>
                            <p className="mb-8 text-sm text-stone-500">
                                {tl('For security purposes, please confirm your password to continue.')}
                            </p>

                            <form onSubmit={submit} className="space-y-5 text-left">
                                <div>
                                    <label htmlFor="password" className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-stone-500">
                                        {tl('Password')}
                                    </label>
                                    <div className="relative">
                                        <LockClosedIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                                        <input id="password" type={showPassword ? 'text' : 'password'} value={data.password}
                                            onChange={e => setData('password', e.target.value)}
                                            autoComplete="current-password" autoFocus required
                                            className={inputClass} placeholder="••••••••" />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 transition hover:text-stone-600">
                                            {showPassword ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    {errors.password && <p className="mt-1.5 text-xs text-red-600">{errors.password}</p>}
                                </div>

                                <button type="submit" disabled={processing}
                                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-950 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:opacity-50">
                                    {processing ? tl('Confirming…') : tl('Confirm and continue')}
                                    {!processing && <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-0.5" />}
                                </button>
                            </form>

                            <div className="mt-6 rounded-2xl border border-stone-100 bg-stone-50 p-4 text-left">
                                <div className="flex items-start gap-3">
                                    <ShieldCheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-700" />
                                    <div>
                                        <p className="text-xs font-bold text-stone-700">{tl('Security notice')}</p>
                                        <p className="mt-0.5 text-xs text-stone-500">{tl('This extra step helps protect your account.')}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    );
}
