import { useMemo, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowLeftIcon,
    ArrowPathIcon,
    BriefcaseIcon,
    CalendarDaysIcon,
    ChartBarIcon,
    CheckIcon,
    ClipboardDocumentIcon,
    DocumentArrowDownIcon,
    FireIcon,
    LinkIcon,
    PrinterIcon,
    RectangleGroupIcon,
    SparklesIcon,
    StarIcon,
    TrophyIcon,
} from '@heroicons/react/24/outline';
import { buildPrintableReportHtml, parseSprintReport } from '@/lib/sprintReport';
import { useLanguage } from '@/Contexts/LanguageContext';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function XIcon({ className }) {
    return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
        </svg>
    );
}

function LinkedInIcon({ className }) {
    return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
    );
}

function useCopy(resetMs = 1800) {
    const [copied, setCopied] = useState('');
    const copy = async (text, key) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(key);
            setTimeout(() => setCopied(''), resetMs);
        } catch {}
    };
    return [copied, copy];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function MetricPill({ label, value, icon: Icon }) {
    return (
        <div className="flex flex-col items-center gap-1 rounded-2xl bg-white/10 px-5 py-4 text-center backdrop-blur-sm">
            {Icon && <Icon className="h-5 w-5 text-emerald-300/80" />}
            <span className="text-2xl font-black text-white">{value ?? '—'}</span>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100/70">{label}</span>
        </div>
    );
}

function SectionCard({ title, accent = false, children }) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.28 }}
            className="rounded-[26px] border border-stone-200 bg-white p-7 shadow-sm"
        >
            {title && (
                <h2 className={`mb-5 text-xs font-black uppercase tracking-[0.26em] ${accent ? 'text-emerald-800' : 'text-stone-400'}`}>
                    {title}
                </h2>
            )}
            {children}
        </motion.section>
    );
}

function TimelineItem({ item, index, total, tl }) {
    const isFirst = index === 0;
    const isLast  = index === total - 1;
    return (
        <div className="flex gap-5">
            <div className="flex flex-col items-center">
                <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-2 font-bold text-sm ${isFirst || isLast ? 'border-emerald-700 bg-emerald-950 text-white' : 'border-stone-300 bg-white text-stone-600'}`}>
                    {index + 1}
                </div>
                {!isLast && <div className="mt-2 w-0.5 flex-1 bg-stone-200" />}
            </div>
            <div className={`pb-8 ${isLast ? 'pb-0' : ''}`}>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
                    {item.title} · {tl('Day {day}', { day: item.day_number })}
                </div>
                <p className="mt-2 text-sm leading-7 text-stone-700">{item.summary}</p>
            </div>
        </div>
    );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({ sprint, report, shareUrl, onRegenerate, isRegenerating, selectedStyle, onStyleChange, tl }) {
    const [copied, copy] = useCopy();

    const STYLES = [
        { value: 'professional', label: tl('Professional'),   desc: tl('Clean, LinkedIn-ready'),  icon: BriefcaseIcon },
        { value: 'casual',       label: tl('Builder Story'),  desc: tl('Warm and personal'),       icon: SparklesIcon  },
        { value: 'technical',    label: tl('Technical'),      desc: tl('Execution-focused'),       icon: RectangleGroupIcon },
    ];

    const printReport = () => {
        const w = window.open('', '_blank', 'width=1100,height=900');
        if (!w) return;
        w.document.open();
        w.document.write(buildPrintableReportHtml(report, sprint));
        w.document.close();
        w.focus();
        w.print();
    };

    const downloadMd = () => {
        const blob = new Blob([report.formats.portfolio], { type: 'text/markdown;charset=utf-8' });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href     = url;
        a.download = `${sprint.title.replace(/[^a-z0-9]/gi, '_')}_report.md`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-5">
            {/* Export */}
            <SectionCard title={tl('Export')}>
                <div className="space-y-2.5">
                    <button
                        onClick={() => copy(report.formats.linkedin, 'linkedin')}
                        className="flex w-full items-center justify-between rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
                    >
                        <span className="flex items-center gap-2.5"><ClipboardDocumentIcon className="h-4 w-4" />{tl('Copy LinkedIn post')}</span>
                        {copied === 'linkedin' && <CheckIcon className="h-4 w-4 text-emerald-600" />}
                    </button>
                    <button
                        onClick={() => copy(report.formats.twitter, 'twitter')}
                        className="flex w-full items-center justify-between rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
                    >
                        <span className="flex items-center gap-2.5"><XIcon className="h-4 w-4" />{tl('Copy X / Twitter')}</span>
                        {copied === 'twitter' && <CheckIcon className="h-4 w-4 text-emerald-600" />}
                    </button>
                    <button
                        onClick={downloadMd}
                        className="flex w-full items-center gap-2.5 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
                    >
                        <DocumentArrowDownIcon className="h-4 w-4" />{tl('Download Markdown')}
                    </button>
                    <button
                        onClick={printReport}
                        className="flex w-full items-center gap-2.5 rounded-xl bg-emerald-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900"
                    >
                        <PrinterIcon className="h-4 w-4" />{tl('Print / Save PDF')}
                    </button>
                </div>
            </SectionCard>

            {/* Share */}
            {shareUrl && (
                <SectionCard title={tl('Share')}>
                    <div className="space-y-2.5">
                        <button
                            onClick={() => copy(shareUrl, 'link')}
                            className="flex w-full items-center justify-between rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
                        >
                            <span className="flex items-center gap-2.5"><LinkIcon className="h-4 w-4" />{tl('Copy public link')}</span>
                            {copied === 'link' ? <CheckIcon className="h-4 w-4 text-emerald-600" /> : null}
                        </button>
                        <button
                            onClick={() => window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent((report.formats.twitter || '') + '\n\n' + shareUrl), '_blank', 'noopener,noreferrer')}
                            className="flex w-full items-center gap-2.5 rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
                        >
                            <XIcon className="h-4 w-4" />{tl('Post on X')}
                        </button>
                        <button
                            onClick={() => window.open('https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(shareUrl), '_blank', 'noopener,noreferrer')}
                            className="flex w-full items-center gap-2.5 rounded-xl bg-[#0077B5] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#006097]"
                        >
                            <LinkedInIcon className="h-4 w-4" />{tl('Share on LinkedIn')}
                        </button>
                    </div>
                </SectionCard>
            )}

            {/* Regenerate */}
            <SectionCard title={tl('Regenerate tone')}>
                <div className="space-y-2.5">
                    {STYLES.map((s) => (
                        <button
                            key={s.value}
                            onClick={() => onStyleChange(s.value)}
                            className={`flex w-full items-center gap-3 rounded-xl border p-3.5 text-left transition ${selectedStyle === s.value ? 'border-emerald-900 bg-emerald-950 text-white' : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'}`}
                        >
                            <s.icon className="h-5 w-5 flex-shrink-0" />
                            <div>
                                <div className="text-sm font-bold">{s.label}</div>
                                <div className={`text-xs ${selectedStyle === s.value ? 'text-emerald-200/70' : 'text-stone-400'}`}>{s.desc}</div>
                            </div>
                        </button>
                    ))}
                </div>
                <button
                    onClick={onRegenerate}
                    disabled={isRegenerating}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-950 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-900 disabled:opacity-60"
                >
                    <ArrowPathIcon className={`h-4 w-4 ${isRegenerating ? 'animate-spin' : ''}`} />
                    {isRegenerating ? tl('Regenerating…') : tl('Regenerate report')}
                </button>
            </SectionCard>
        </div>
    );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ReportPage({ sprint, aiSummary, shareToken }) {
    const { tl } = useLanguage();
    const [isRegenerating, setIsRegenerating] = useState(false);
    const [selectedStyle, setSelectedStyle]   = useState('professional');
    const [copied, copy] = useCopy();

    const report   = useMemo(() => parseSprintReport(aiSummary, sprint), [aiSummary, sprint]);
    const shareUrl = shareToken
        ? (typeof window !== 'undefined' ? window.location.origin : '') + '/share/' + shareToken
        : null;

    const regenerate = () => {
        setIsRegenerating(true);
        router.post(
            route('sprints.generate-summary', sprint.ulid),
            { style: selectedStyle },
            {
                preserveScroll: true,
                onSuccess: () => { setIsRegenerating(false); router.reload({ preserveScroll: true }); },
                onError:   () => { setIsRegenerating(false); },
            },
        );
    };

    const printReport = () => {
        const w = window.open('', '_blank', 'width=1100,height=900');
        if (!w) return;
        w.document.open();
        w.document.write(buildPrintableReportHtml(report, sprint));
        w.document.close();
        w.focus();
        w.print();
    };

    if (!report) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-stone-50">
                <p className="text-stone-500">
                    {tl('Report not available.')} <Link href={route('sprints.show', sprint.ulid)} className="underline">{tl('Back to sprint')}</Link>
                </p>
            </div>
        );
    }

    const metrics = [
        { label: tl('Duration'),  value: sprint.duration_days + ' ' + tl('days'), icon: CalendarDaysIcon },
        { label: tl('Updates'),   value: report.metrics.updates_posted,            icon: ChartBarIcon },
        { label: tl('Score'),     value: report.metrics.score,                     icon: StarIcon },
        { label: tl('Reactions'), value: report.metrics.reactions_received,        icon: FireIcon },
        { label: tl('Rank'),      value: report.metrics.rank_label,                icon: TrophyIcon },
    ];

    return (
        <>
            <Head title={`${report.headline ?? ''} · ${tl('Sprint Report')}`} />

            <div className="min-h-screen bg-[#f5f1e8]">

                {/* ── Sticky top bar ── */}
                <header className="sticky top-0 z-30 border-b border-stone-200 bg-white/85 backdrop-blur-md">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
                        <Link
                            href={route('sprints.show', sprint.ulid)}
                            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-stone-600 transition hover:bg-stone-100"
                        >
                            <ArrowLeftIcon className="h-4 w-4" />
                            {tl('Back to sprint')}
                        </Link>

                        <span className="text-sm font-black tracking-tight text-emerald-900">{tl('Sprint Report')}</span>

                        <div className="flex items-center gap-2">
                            {shareUrl && (
                                <button
                                    onClick={() => copy(shareUrl, 'toplink')}
                                    className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
                                >
                                    <LinkIcon className="h-4 w-4" />
                                    {copied === 'toplink' ? tl('Copied!') : tl('Share link')}
                                </button>
                            )}
                            <button
                                onClick={printReport}
                                className="inline-flex items-center gap-2 rounded-xl bg-emerald-950 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-900"
                            >
                                <PrinterIcon className="h-4 w-4" />
                                PDF
                            </button>
                        </div>
                    </div>
                </header>

                {/* ── Hero ── */}
                <div className="bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.14),_transparent_40%),linear-gradient(135deg,#0f2318,#173327,#2f6b4f)]">
                    <div className="mx-auto max-w-7xl px-5 py-16 sm:py-20">
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-100">
                                <SparklesIcon className="h-3.5 w-3.5" />
                                {tl('Sprint Report')}
                            </div>

                            <h1 className="mt-5 max-w-4xl text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl">
                                {report.headline}
                            </h1>

                            <p className="mt-4 max-w-2xl text-base leading-7 text-emerald-100/75">
                                {report.subheadline}
                            </p>

                            {/* Metrics row */}
                            <div className="mt-10 flex flex-wrap gap-3">
                                {metrics.map(({ label, value, icon }) => (
                                    <MetricPill key={label} label={label} value={value} icon={icon} />
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* ── Quick share bar ── */}
                <div className="border-b border-stone-200 bg-white">
                    <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-5 py-4">
                        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">{tl('Share')}</span>
                        {shareUrl && (
                            <>
                                <button
                                    onClick={() => window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent((report.formats.twitter || '') + '\n\n' + shareUrl), '_blank', 'noopener,noreferrer')}
                                    className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-800"
                                >
                                    <XIcon className="h-4 w-4" />{tl('Post on X')}
                                </button>
                                <button
                                    onClick={() => window.open('https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(shareUrl), '_blank', 'noopener,noreferrer')}
                                    className="inline-flex items-center gap-2 rounded-xl bg-[#0077B5] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#006097]"
                                >
                                    <LinkedInIcon className="h-4 w-4" />LinkedIn
                                </button>
                                <button
                                    onClick={() => copy(shareUrl, 'bar')}
                                    className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
                                >
                                    <LinkIcon className="h-4 w-4" />
                                    {copied === 'bar' ? tl('Copied!') : tl('Copy public link')}
                                </button>
                            </>
                        )}
                        <div className="ml-auto flex items-center gap-2">
                            <button
                                onClick={() => copy(report.formats.linkedin, 'barli')}
                                className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
                            >
                                <ClipboardDocumentIcon className="h-4 w-4" />
                                {copied === 'barli' ? tl('Copied!') : tl('Copy LinkedIn post')}
                            </button>
                            <button
                                onClick={printReport}
                                className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
                            >
                                <PrinterIcon className="h-4 w-4" />PDF
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Body ── */}
                <div className="mx-auto max-w-7xl px-5 py-10">
                    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">

                        {/* Main content */}
                        <div className="space-y-6 min-w-0">

                            <SectionCard title={tl('Overview')} accent>
                                <p className="text-base leading-8 text-stone-700">{report.summary}</p>
                            </SectionCard>

                            {report.accomplishments?.length > 0 && (
                                <SectionCard title={tl('Accomplishments')} accent>
                                    <div className="space-y-4">
                                        {report.accomplishments.map((item, i) => (
                                            <div key={item} className="flex gap-4">
                                                <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-black text-emerald-800">
                                                    {i + 1}
                                                </div>
                                                <p className="text-sm leading-7 text-stone-700 pt-1">{item}</p>
                                            </div>
                                        ))}
                                    </div>
                                </SectionCard>
                            )}

                            {report.timeline?.length > 0 && (
                                <SectionCard title={tl('Timeline')} accent>
                                    <div>
                                        {report.timeline.map((item, i) => (
                                            <TimelineItem
                                                key={`${item.title}-${item.day_number}`}
                                                item={item}
                                                index={i}
                                                total={report.timeline.length}
                                                tl={tl}
                                            />
                                        ))}
                                    </div>
                                </SectionCard>
                            )}

                            {report.lessons?.length > 0 && (
                                <SectionCard title={tl('Lessons')} accent>
                                    <div className="space-y-3">
                                        {report.lessons.map((item) => (
                                            <div key={item} className="flex gap-3 rounded-2xl bg-stone-50 p-4">
                                                <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-emerald-600" />
                                                <p className="text-sm leading-7 text-stone-700">{item}</p>
                                            </div>
                                        ))}
                                    </div>
                                </SectionCard>
                            )}

                            <SectionCard title={tl('LinkedIn-ready post')} accent>
                                <div className="relative">
                                    <button
                                        onClick={() => copy(report.formats.linkedin, 'main-li')}
                                        className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-xl bg-emerald-950 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-900"
                                    >
                                        {copied === 'main-li' ? <CheckIcon className="h-3.5 w-3.5" /> : <ClipboardDocumentIcon className="h-3.5 w-3.5" />}
                                        {copied === 'main-li' ? tl('Copied!') : tl('Copy')}
                                    </button>
                                    <div className="rounded-2xl bg-stone-50 p-5 pt-12">
                                        <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-stone-700">{report.formats.linkedin}</pre>
                                    </div>
                                </div>
                            </SectionCard>

                            {report.formats?.twitter && (
                                <SectionCard title={tl('X / Twitter post')} accent>
                                    <div className="relative">
                                        <button
                                            onClick={() => copy(report.formats.twitter, 'main-tw')}
                                            className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-xl bg-black px-3 py-2 text-xs font-semibold text-white transition hover:bg-stone-800"
                                        >
                                            {copied === 'main-tw' ? <CheckIcon className="h-3.5 w-3.5" /> : <ClipboardDocumentIcon className="h-3.5 w-3.5" />}
                                            {copied === 'main-tw' ? tl('Copied!') : tl('Copy')}
                                        </button>
                                        <div className="rounded-2xl bg-stone-50 p-5 pt-12">
                                            <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-stone-700">{report.formats.twitter}</pre>
                                        </div>
                                    </div>
                                </SectionCard>
                            )}

                            {report.gallery?.length > 0 && (
                                <SectionCard title={tl('Gallery')} accent>
                                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                        {report.gallery.map((item) => (
                                            <figure key={`${item.url}-${item.position}`} className="overflow-hidden rounded-2xl border border-stone-200">
                                                <div className="aspect-[4/3] overflow-hidden bg-stone-100">
                                                    <img src={item.url} alt={item.caption || tl('Sprint image')} className="h-full w-full object-cover transition duration-300 hover:scale-105" />
                                                </div>
                                                <figcaption className="p-3">
                                                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">{tl('Day {day}', { day: item.day_number })}</div>
                                                    <p className="mt-1 text-xs leading-5 text-stone-600">{item.caption}</p>
                                                </figcaption>
                                            </figure>
                                        ))}
                                    </div>
                                </SectionCard>
                            )}
                        </div>

                        {/* Sticky sidebar */}
                        <div className="lg:sticky lg:top-[61px] lg:self-start">
                            <Sidebar
                                sprint={sprint}
                                report={report}
                                shareUrl={shareUrl}
                                onRegenerate={regenerate}
                                isRegenerating={isRegenerating}
                                selectedStyle={selectedStyle}
                                onStyleChange={setSelectedStyle}
                                tl={tl}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
