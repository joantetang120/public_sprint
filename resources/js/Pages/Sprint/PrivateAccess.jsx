import { Head, Link } from '@inertiajs/react';
import { LockClosedIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '@/Contexts/LanguageContext';

export default function PrivateAccess({ sprint, isAuthenticated }) {
    const { tl } = useLanguage();

    return (
        <>
            <Head title={tl('Private Sprint')} />

            <div className="flex min-h-screen items-center justify-center bg-[#f5f1e8] px-4">
                <div className="w-full max-w-md">
                    <div className="overflow-hidden rounded-[28px] border border-stone-200 bg-white shadow-xl">

                        {/* Header bar */}
                        <div className="bg-[linear-gradient(135deg,#0f2318,#173327,#2f6b4f)] px-8 py-10 text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                                <LockClosedIcon className="h-8 w-8 text-white" />
                            </div>
                            <h1 className="mt-5 text-2xl font-black text-white">{tl('Private Sprint')}</h1>
                            <p className="mt-2 text-sm text-emerald-100/70">
                                {sprint.title}
                            </p>
                        </div>

                        {/* Body */}
                        <div className="px-8 py-8 text-center">
                            {isAuthenticated ? (
                                <>
                                    <p className="text-base font-semibold text-stone-800">
                                        {tl('You need an invite to access this sprint.')}
                                    </p>
                                    <p className="mt-2 text-sm leading-6 text-stone-500">
                                        {tl("Ask the sprint creator to share their invite link with you. Once you open it, you'll be added automatically.")}
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p className="text-base font-semibold text-stone-800">
                                        {tl('This sprint is private.')}
                                    </p>
                                    <p className="mt-2 text-sm leading-6 text-stone-500">
                                        {tl('Sign in first, then open the invite link you received to join.')}
                                    </p>
                                    <Link
                                        href={route('login')}
                                        className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-emerald-950 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-900"
                                    >
                                        {tl('Sign in')}
                                    </Link>
                                </>
                            )}

                            <Link
                                href={route('discover')}
                                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-stone-500 transition hover:text-stone-800"
                            >
                                <ArrowLeftIcon className="h-4 w-4" />
                                {tl('Browse public sprints')}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
