import { useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    CalendarDaysIcon,
    ChartBarIcon,
    FireIcon,
    StarIcon,
    TrophyIcon,
} from '@heroicons/react/24/outline';
import { parseSprintReport } from '@/lib/sprintReport';

function Avatar({ user, size = 'md' }) {
    const dim = size === 'lg' ? 'h-16 w-16 text-xl' : 'h-10 w-10 text-sm';
    if (user?.avatar) {
        return <img src={user.avatar} alt={user.name} className={`${dim} rounded-full object-cover`} />;
    }
    return (
        <div className={`${dim} flex items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-800`}>
            {user?.name?.[0]?.toUpperCase() ?? '?'}
        </div>
    );
}

function MetricCard({ label, value, icon: Icon }) {
    return (
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                {Icon && <Icon className="h-4 w-4" />}
                {label}
            </div>
            <div className="mt-3 text-2xl font-black text-stone-900">{value ?? '—'}</div>
        </div>
    );
}

function shareToTwitter(report, sprint, user, shareUrl) {
    const tweet = report?.formats?.twitter
        || `Just wrapped a ${sprint.duration_days}-day sprint: "${sprint.title}" #BuildInPublic #PublicSprint`;
    const full = tweet + '\n\n' + shareUrl;
    window.open(
        'https://twitter.com/intent/tweet?text=' + encodeURIComponent(full),
        '_blank',
        'noopener,noreferrer',
    );
}

function shareToLinkedIn(shareUrl) {
    window.open(
        'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(shareUrl),
        '_blank',
        'noopener,noreferrer',
    );
}

export default function PublicSummary({ sprint, user, aiSummary, shareToken }) {
    const report = useMemo(() => parseSprintReport(aiSummary, sprint), [aiSummary, sprint]);
    const shareUrl = typeof window !== 'undefined'
        ? window.location.origin + '/share/' + shareToken
        : '/share/' + shareToken;

    if (!report) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-stone-50">
                <p className="text-stone-500">Summary not available.</p>
            </div>
        );
    }

    const metrics = [
        { label: 'Duration',  value: sprint.duration_days + ' days',       icon: CalendarDaysIcon },
        { label: 'Updates',   value: report.metrics.updates_posted,         icon: ChartBarIcon },
        { label: 'Score',     value: report.metrics.score,                  icon: StarIcon },
        { label: 'Reactions', value: report.metrics.reactions_received,     icon: FireIcon },
        { label: 'Rank',      value: report.metrics.rank_label,             icon: TrophyIcon },
    ];

    return (
        <>
            <Head>
                <title>{report.headline} · PublicSprint</title>
                <meta name="description" content={report.preview} />
                <meta property="og:title" content={report.headline} />
                <meta property="og:description" content={report.preview} />
                <meta property="og:type" content="article" />
            </Head>

            <div className="min-h-screen bg-[#f5f1e8]">
                {/* Nav */}
                <header className="sticky top-0 z-20 border-b border-stone-200 bg-white/80 backdrop-blur-sm">
                    <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4">
                        <Link href="/" className="text-lg font-black tracking-tight text-emerald-900">
                            PublicSprint
                        </Link>
                        <Link
                            href="/register"
                            className="rounded-xl bg-emerald-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-900"
                        >
                            Start your sprint →
                        </Link>
                    </div>
                </header>

                <main className="mx-auto max-w-4xl px-5 py-12 space-y-8">
                    {/* Hero card */}
                    <motion.section
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden rounded-[28px] shadow-lg"
                    >
                        <div className="bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.16),_transparent_32%),linear-gradient(135deg,#173327,#2f6b4f)] px-8 py-10">
                            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-50">
                                Sprint Report
                            </div>
                            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                                {report.headline}
                            </h1>
                            <p className="mt-3 text-sm leading-6 text-emerald-50/80 sm:text-base">
                                {report.subheadline}
                            </p>

                            {/* Author */}
                            <div className="mt-8 flex items-center gap-4">
                                <Avatar user={user} size="lg" />
                                <div>
                                    <div className="font-bold text-white">{user.name}</div>
                                    {user.bio && (
                                        <p className="mt-1 text-sm text-emerald-50/70 line-clamp-1">{user.bio}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Share bar */}
                        <div className="flex flex-wrap items-center gap-3 bg-white px-8 py-5 border-t border-stone-100">
                            <span className="text-sm font-semibold text-stone-500">Share this report:</span>
                            <button
                                onClick={() => shareToTwitter(report, sprint, user, shareUrl)}
                                className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-800"
                            >
                                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" /></svg>
                                Post on X
                            </button>
                            <button
                                onClick={() => shareToLinkedIn(shareUrl)}
                                className="inline-flex items-center gap-2 rounded-xl bg-[#0077B5] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#006097]"
                            >
                                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                                Share on LinkedIn
                            </button>
                            <button
                                onClick={() => navigator.clipboard?.writeText(shareUrl)}
                                className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
                            >
                                Copy link
                            </button>
                        </div>
                    </motion.section>

                    {/* Metrics */}
                    <motion.section
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: 0.05 }}
                        className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5"
                    >
                        {metrics.map(({ label, value, icon }) => (
                            <MetricCard key={label} label={label} value={value} icon={icon} />
                        ))}
                    </motion.section>

                    {/* Overview */}
                    <motion.section
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: 0.1 }}
                        className="rounded-[26px] border border-stone-200 bg-white p-7 shadow-sm"
                    >
                        <h2 className="text-xs font-black uppercase tracking-[0.24em] text-emerald-800">Overview</h2>
                        <p className="mt-4 text-base leading-8 text-stone-700">{report.summary}</p>
                    </motion.section>

                    {/* Accomplishments + Lessons */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: 0.15 }}
                        className="grid gap-6 lg:grid-cols-2"
                    >
                        {report.accomplishments?.length > 0 && (
                            <section className="rounded-[26px] border border-stone-200 bg-white p-7 shadow-sm">
                                <h2 className="text-xs font-black uppercase tracking-[0.24em] text-emerald-800">Accomplishments</h2>
                                <div className="mt-5 space-y-4">
                                    {report.accomplishments.map((item, i) => (
                                        <div key={item} className="flex gap-4">
                                            <div className="mt-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-800">
                                                {i + 1}
                                            </div>
                                            <p className="text-sm leading-7 text-stone-700">{item}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {report.lessons?.length > 0 && (
                            <section className="rounded-[26px] border border-stone-200 bg-white p-7 shadow-sm">
                                <h2 className="text-xs font-black uppercase tracking-[0.24em] text-emerald-800">Lessons</h2>
                                <div className="mt-5 space-y-4">
                                    {report.lessons.map((item) => (
                                        <div key={item} className="rounded-2xl bg-stone-100 p-4 text-sm leading-7 text-stone-700">
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </motion.div>

                    {/* Timeline */}
                    {report.timeline?.length > 0 && (
                        <motion.section
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25, delay: 0.2 }}
                            className="rounded-[26px] border border-stone-200 bg-white p-7 shadow-sm"
                        >
                            <h2 className="text-xs font-black uppercase tracking-[0.24em] text-emerald-800">Timeline</h2>
                            <div className="mt-5 space-y-5">
                                {report.timeline.map((item) => (
                                    <div key={`${item.title}-${item.day_number}`} className="rounded-2xl border border-stone-200 p-5">
                                        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                                            {item.title} · Day {item.day_number}
                                        </div>
                                        <p className="mt-3 text-sm leading-7 text-stone-700">{item.summary}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.section>
                    )}

                    {/* Gallery */}
                    {report.gallery?.length > 0 && (
                        <motion.section
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25, delay: 0.25 }}
                            className="rounded-[26px] border border-stone-200 bg-white p-7 shadow-sm"
                        >
                            <h2 className="text-xs font-black uppercase tracking-[0.24em] text-emerald-800">Gallery</h2>
                            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                {report.gallery.map((item) => (
                                    <figure key={`${item.url}-${item.position}`} className="overflow-hidden rounded-2xl border border-stone-200">
                                        <div className="aspect-[4/3] overflow-hidden bg-stone-200">
                                            <img src={item.url} alt={item.caption || 'Sprint image'} className="h-full w-full object-cover" />
                                        </div>
                                        <figcaption className="p-3 text-xs text-stone-500">{item.caption}</figcaption>
                                    </figure>
                                ))}
                            </div>
                        </motion.section>
                    )}

                    {/* CTA */}
                    <motion.section
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: 0.3 }}
                        className="overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#173327,#2f6b4f)] px-8 py-12 text-center shadow-lg"
                    >
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-50">
                            Build in public
                        </div>
                        <h2 className="mt-5 text-3xl font-black text-white">
                            Ready to start your own sprint?
                        </h2>
                        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-emerald-50/80">
                            Join {user.name} and thousands of builders shipping in public. Pick a goal, set a duration, and show your progress every day.
                        </p>
                        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                            <Link
                                href="/register"
                                className="rounded-2xl bg-white px-6 py-4 text-sm font-bold text-emerald-950 transition hover:bg-stone-100"
                            >
                                Start for free →
                            </Link>
                            <Link
                                href="/discover"
                                className="rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-sm font-semibold text-white transition hover:bg-white/20"
                            >
                                Browse sprints
                            </Link>
                        </div>
                    </motion.section>
                </main>

                <footer className="border-t border-stone-200 bg-white py-8 text-center">
                    <p className="text-sm text-stone-500">
                        Made with{' '}
                        <Link href="/" className="font-semibold text-emerald-800 hover:underline">
                            PublicSprint
                        </Link>
                        {' '}— build in public, together.
                    </p>
                </footer>
            </div>
        </>
    );
}
