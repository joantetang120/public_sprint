import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowTopRightOnSquareIcon as ExternalLink,
    BookOpenIcon as BookOpen,
    BriefcaseIcon as Briefcase,
    CheckIcon as Check,
    ClipboardDocumentIcon as Clipboard,
    DocumentArrowDownIcon as Download,
    DocumentTextIcon as FileText,
    LinkIcon as Link2,
    PhotoIcon as GalleryVerticalEnd,
    PhotoIcon as ImageIcon,
    PrinterIcon as Printer,
    SparklesIcon as Sparkles,
    XMarkIcon as X,
} from '@heroicons/react/24/outline';
import { buildPrintableReportHtml, parseSprintReport } from '@/lib/sprintReport';
import { useLanguage } from '@/Contexts/LanguageContext';

export default function AISummaryModal({ isOpen, onClose, summary, sprint }) {
    const { tl } = useLanguage();
    const [activeTab, setActiveTab] = useState('overview');
    const [copiedState, setCopiedState] = useState('');
    const tabs = [
        { id: 'overview', label: tl('Overview'), icon: Sparkles },
        { id: 'linkedin', label: tl('LinkedIn'), icon: Briefcase },
        { id: 'portfolio', label: tl('Portfolio'), icon: FileText },
        { id: 'gallery', label: tl('Gallery'), icon: GalleryVerticalEnd },
    ];

    const report = useMemo(() => parseSprintReport(summary, sprint), [summary, sprint]);

    const copyText = async (value, key) => {
        if (!value) {
            return;
        }

        try {
            await navigator.clipboard.writeText(value);
            setCopiedState(key);
            setTimeout(() => setCopiedState(''), 1800);
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    };

    const downloadMarkdown = () => {
        if (!report) {
            return;
        }

        const blob = new Blob([report.formats.portfolio], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${sprint.title.replace(/[^a-z0-9]/gi, '_')}_report.md`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const printReport = () => {
        if (!report) {
            return;
        }

        const printWindow = window.open('', '_blank', 'width=1100,height=900');
        if (!printWindow) {
            return;
        }

        printWindow.document.open();
        printWindow.document.write(buildPrintableReportHtml(report, sprint));
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    };

    if (!isOpen || !report) {
        return null;
    }

    return (
        <AnimatePresence>
            <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, y: 16, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 16, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                    className="max-h-[92vh] w-full max-w-6xl overflow-hidden rounded-[28px] bg-stone-50 shadow-2xl"
                    onClick={(event) => event.stopPropagation()}
                >
                    <div className="bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.18),_transparent_38%),linear-gradient(135deg,#173327,#2f6b4f)] px-6 py-7 sm:px-8">
                        <div className="flex items-start justify-between gap-6">
                            <div className="max-w-3xl">
                                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-50">
                                    {tl('Sprint Report')}
                                </div>
                                <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                                    {report.headline}
                                </h2>
                                <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50/82 sm:text-base">
                                    {report.subheadline}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="rounded-2xl border border-white/15 bg-white/10 p-3 text-white transition hover:bg-white/20"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    <div className="grid max-h-[calc(92vh-148px)] grid-cols-1 overflow-hidden lg:grid-cols-[220px,1fr]">
                        <aside className="border-b border-stone-200 bg-white lg:border-b-0 lg:border-r">
                            <div className="flex gap-2 overflow-x-auto p-4 lg:block lg:space-y-2">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex min-w-[160px] items-center gap-3 rounded-2xl px-4 py-3 text-left transition lg:w-full ${
                                            activeTab === tab.id
                                                ? 'bg-emerald-950 text-white shadow-lg'
                                                : 'text-stone-600 hover:bg-stone-100'
                                        }`}
                                    >
                                        <tab.icon className="h-5 w-5" />
                                        <span className="font-semibold">{tab.label}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="border-t border-stone-200 p-4">
                                <div className="space-y-3 rounded-3xl bg-stone-100 p-4">
                                    <button
                                        onClick={() => copyText(report.formats.linkedin, 'linkedin')}
                                        className="flex w-full items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
                                    >
                                        <span className="flex items-center gap-2">
                                            <Clipboard className="h-4 w-4" />
                                            {tl('Copy LinkedIn')}
                                        </span>
                                        {copiedState === 'linkedin' && <Check className="h-4 w-4 text-emerald-600" />}
                                    </button>
                                    <button
                                        onClick={() => copyText(report.formats.portfolio, 'portfolio')}
                                        className="flex w-full items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
                                    >
                                        <span className="flex items-center gap-2">
                                            <BookOpen className="h-4 w-4" />
                                            {tl('Copy Portfolio')}
                                        </span>
                                        {copiedState === 'portfolio' && <Check className="h-4 w-4 text-emerald-600" />}
                                    </button>
                                    <button
                                        onClick={downloadMarkdown}
                                        className="flex w-full items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
                                    >
                                        <Download className="h-4 w-4" />
                                        {tl('Download Markdown')}
                                    </button>
                                    <button
                                        onClick={printReport}
                                        className="flex w-full items-center gap-2 rounded-2xl bg-emerald-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900"
                                    >
                                        <Printer className="h-4 w-4" />
                                        {tl('Print / Save PDF')}
                                    </button>
                                </div>
                            </div>
                        </aside>

                        <div className="overflow-y-auto bg-stone-50 p-5 sm:p-8">
                            {activeTab === 'overview' && (
                                <div className="space-y-6">
                                    <section className="rounded-[26px] border border-stone-200 bg-white p-6 shadow-sm">
                                        <p className="text-lg leading-8 text-stone-700">{report.summary}</p>
                                    </section>

                                    <section className="grid grid-cols-2 gap-4 lg:grid-cols-5">
                                        {[
                                            [tl('Duration'), tl('{count} days', { count: report.metrics.duration_days })],
                                            [tl('Updates'), report.metrics.updates_posted],
                                            [tl('Score'), report.metrics.score],
                                            [tl('Reactions'), report.metrics.reactions_received],
                                            [tl('Rank'), report.metrics.rank_label],
                                        ].map(([label, value]) => (
                                            <div key={label} className="rounded-[24px] border border-stone-200 bg-white p-5 shadow-sm">
                                                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">{label}</div>
                                                <div className="mt-3 text-2xl font-black text-stone-900">{value}</div>
                                            </div>
                                        ))}
                                    </section>

                                    <div className="grid gap-6 xl:grid-cols-[1.05fr,0.95fr]">
                                        <section className="rounded-[26px] border border-stone-200 bg-white p-6 shadow-sm">
                                            <h3 className="text-sm font-black uppercase tracking-[0.24em] text-emerald-800">{tl('Accomplishments')}</h3>
                                            <div className="mt-5 space-y-4">
                                                {report.accomplishments.map((item, index) => (
                                                    <div key={item} className="flex gap-4">
                                                        <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-800">
                                                            {index + 1}
                                                        </div>
                                                        <p className="text-sm leading-7 text-stone-700">{item}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>

                                        <section className="rounded-[26px] border border-stone-200 bg-white p-6 shadow-sm">
                                            <h3 className="text-sm font-black uppercase tracking-[0.24em] text-emerald-800">{tl('Lessons')}</h3>
                                            <div className="mt-5 space-y-4">
                                                {report.lessons.map((item) => (
                                                    <div key={item} className="rounded-2xl bg-stone-100 p-4 text-sm leading-7 text-stone-700">
                                                        {item}
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    </div>

                                    <section className="rounded-[26px] border border-stone-200 bg-white p-6 shadow-sm">
                                        <h3 className="text-sm font-black uppercase tracking-[0.24em] text-emerald-800">{tl('Timeline')}</h3>
                                        <div className="mt-5 space-y-5">
                                            {report.timeline.map((item) => (
                                                <div key={`${item.title}-${item.day_number}`} className="rounded-3xl border border-stone-200 p-5">
                                                    <div className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
                                                        {item.title} · {tl('Day {day}', { day: item.day_number })}
                                                    </div>
                                                    <p className="mt-3 text-sm leading-7 text-stone-700">{item.summary}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                </div>
                            )}

                            {activeTab === 'linkedin' && (
                                <div className="space-y-6">
                                    <section className="rounded-[26px] border border-stone-200 bg-white p-6 shadow-sm">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <h3 className="text-xl font-black text-stone-900">{tl('LinkedIn-ready post')}</h3>
                                                <p className="mt-2 text-sm text-stone-600">
                                                    {tl('Copy this directly, then attach screenshots or add your own voice before posting.')}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => copyText(report.formats.linkedin, 'linkedin-main')}
                                                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900"
                                            >
                                                {copiedState === 'linkedin-main' ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
                                                {tl('Copy')}
                                            </button>
                                        </div>
                                        <div className="mt-6 rounded-3xl bg-stone-100 p-6">
                                            <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-stone-700">{report.formats.linkedin}</pre>
                                        </div>
                                    </section>
                                </div>
                            )}

                            {activeTab === 'portfolio' && (
                                <div className="space-y-6">
                                    <section className="rounded-[26px] border border-stone-200 bg-white p-6 shadow-sm">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <h3 className="text-xl font-black text-stone-900">{tl('Portfolio / case study copy')}</h3>
                                                <p className="mt-2 text-sm text-stone-600">
                                                    {tl('A longer format for your site, Notion page, or resume project appendix.')}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => copyText(report.formats.portfolio, 'portfolio-main')}
                                                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900"
                                            >
                                                {copiedState === 'portfolio-main' ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
                                                {tl('Copy')}
                                            </button>
                                        </div>
                                        <div className="mt-6 rounded-3xl bg-stone-100 p-6">
                                            <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-stone-700">{report.formats.portfolio}</pre>
                                        </div>
                                    </section>
                                </div>
                            )}

                            {activeTab === 'gallery' && (
                                <div className="space-y-6">
                                    <section className="rounded-[26px] border border-stone-200 bg-white p-6 shadow-sm">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <h3 className="text-xl font-black text-stone-900">{tl('Report assets')}</h3>
                                                <p className="mt-2 text-sm text-stone-600">
                                                    Use these images as proof points in LinkedIn carousels, a PDF export, or your portfolio entry.
                                                </p>
                                            </div>
                                            {report.resources?.length > 0 && (
                                                <div className="rounded-2xl bg-stone-100 px-4 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
                                                    {tl('{count} linked resource{suffix}', {
                                                        count: report.resources.length,
                                                        suffix: report.resources.length === 1 ? '' : 's',
                                                    })}
                                                </div>
                                            )}
                                        </div>

                                        {report.gallery?.length > 0 ? (
                                            <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                                                {report.gallery.map((item) => (
                                                    <figure key={`${item.url}-${item.position}`} className="overflow-hidden rounded-[24px] border border-stone-200 bg-stone-50">
                                                        <div className="aspect-[4/3] overflow-hidden bg-stone-200">
                                                            <img
                                                                src={item.url}
                                                                alt={item.caption || 'Sprint image'}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        </div>
                                                        <figcaption className="space-y-2 p-4">
                                                            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                                                                <span>{tl('Day {day}', { day: item.day_number ?? '-' })}</span>
                                                                <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-emerald-800">
                                                                    {tl('Open')}
                                                                    <ExternalLink className="h-3 w-3" />
                                                                </a>
                                                            </div>
                                                            <p className="text-sm leading-6 text-stone-700">{item.caption}</p>
                                                        </figcaption>
                                                    </figure>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="mt-6 rounded-3xl border border-dashed border-stone-300 bg-stone-100 p-10 text-center">
                                                <ImageIcon className="mx-auto h-10 w-10 text-stone-400" />
                                                <p className="mt-4 text-sm text-stone-600">
                                                    {tl('No images were attached to this sprint, but the written report is still ready to export.')}
                                                </p>
                                            </div>
                                        )}

                                        {report.resources?.length > 0 && (
                                            <div className="mt-6 rounded-3xl bg-stone-100 p-5">
                                                <div className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-[0.24em] text-stone-600">
                                                    <Link2 className="h-4 w-4" />
                                                    {tl('Resources')}
                                                </div>
                                                <div className="space-y-3">
                                                    {report.resources.map((resource) => (
                                                        <a
                                                            key={resource}
                                                            href={resource}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm text-stone-700 transition hover:bg-stone-50"
                                                        >
                                                            <span className="truncate pr-3">{resource}</span>
                                                            <ExternalLink className="h-4 w-4 flex-shrink-0 text-stone-400" />
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </section>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
