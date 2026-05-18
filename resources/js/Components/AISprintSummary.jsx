import { useEffect, useMemo, useState } from 'react';
import { router } from '@inertiajs/react';
import {
    ArrowRight,
    BookText,
    Briefcase,
    Check,
    Clipboard,
    Eye,
    FileDown,
    GalleryVerticalEnd,
    LayoutTemplate,
    RefreshCcw,
    Sparkles,
} from 'lucide-react';
import AISummaryModal from './AISummaryModal';
import { getSprintReportPreview, parseSprintReport } from '@/lib/sprintReport';

const styles = [
    { value: 'professional', label: 'Professional', description: 'Clean for LinkedIn and public sharing', icon: Briefcase },
    { value: 'casual', label: 'Builder Story', description: 'Warmer and more personal', icon: Sparkles },
    { value: 'technical', label: 'Technical', description: 'Sharper, more execution-focused', icon: LayoutTemplate },
];

export default function AISprintSummary({ sprint, aiSummary = null, viewOnly = false }) {
    const [summary, setSummary] = useState(aiSummary);
    const [isGenerating, setIsGenerating] = useState(false);
    const [copied, setCopied] = useState(false);
    const [selectedStyle, setSelectedStyle] = useState('professional');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        setSummary(aiSummary);
    }, [aiSummary]);

    const report = useMemo(() => parseSprintReport(summary, sprint), [summary, sprint]);
    const previewText = getSprintReportPreview(summary, sprint);

    const generateSummary = (style = selectedStyle) => {
        setIsGenerating(true);

        router.post(
            route('sprints.generate-summary', sprint.id),
            { style },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsGenerating(false);
                    router.reload({ preserveScroll: true });
                },
                onError: () => {
                    setIsGenerating(false);
                    alert('Failed to generate report. Please try again.');
                },
            }
        );
    };

    const handleCopy = async () => {
        if (!report?.formats?.linkedin) {
            return;
        }

        try {
            await navigator.clipboard.writeText(report.formats.linkedin);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    };

    const handleDownload = () => {
        if (!report?.formats?.portfolio) {
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

    return (
        <>
            <div className="overflow-hidden rounded-[28px] border border-stone-200 bg-[linear-gradient(180deg,#fffdf8_0%,#f2ede1_100%)] shadow-lg">
                <div className="border-b border-stone-200 bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.16),_transparent_32%),linear-gradient(135deg,#173327,#2f6b4f)] px-6 py-7 sm:px-8">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-50">
                                Free structured report
                            </div>
                            <h3 className="mt-4 text-3xl font-black tracking-tight text-white">End-of-sprint report</h3>
                            <p className="mt-3 text-sm leading-6 text-emerald-50/82 sm:text-base">
                                Turn your sprint history into a polished recap with a cleaner overview, exportable copy, and a gallery of progress shots.
                            </p>
                        </div>

                        {report && (
                            <div className="flex flex-wrap items-center gap-3">
                                <button
                                    onClick={handleCopy}
                                    className={`inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                                        copied ? 'bg-emerald-400 text-emerald-950' : 'bg-white/12 text-white hover:bg-white/18'
                                    }`}
                                >
                                    {copied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
                                    Copy LinkedIn
                                </button>
                                <button
                                    onClick={handleDownload}
                                    className="inline-flex items-center gap-2 rounded-2xl bg-white/12 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/18"
                                >
                                    <FileDown className="h-4 w-4" />
                                    Download
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-6 sm:p-8">
                    {report ? (
                        <div className="space-y-6">
                            <div className="grid gap-6 xl:grid-cols-[1.15fr,0.85fr]">
                                <section className="rounded-[24px] border border-stone-200 bg-white p-6 shadow-sm">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">Overview</div>
                                            <h4 className="mt-2 text-2xl font-black text-stone-900">{report.headline}</h4>
                                        </div>
                                        <button
                                            onClick={() => setShowModal(true)}
                                            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900"
                                        >
                                            <Eye className="h-4 w-4" />
                                            Open full report
                                        </button>
                                    </div>
                                    <p className="mt-5 text-sm leading-8 text-stone-700">{previewText}</p>
                                </section>

                                <section className="rounded-[24px] border border-stone-200 bg-white p-6 shadow-sm">
                                    <div className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">At a glance</div>
                                    <div className="mt-5 grid grid-cols-2 gap-4">
                                        {[
                                            ['Updates', report.metrics.updates_posted],
                                            ['Score', report.metrics.score],
                                            ['Reactions', report.metrics.reactions_received],
                                            ['Images', report.metrics.images_count],
                                        ].map(([label, value]) => (
                                            <div key={label} className="rounded-2xl bg-stone-100 p-4">
                                                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">{label}</div>
                                                <div className="mt-3 text-2xl font-black text-stone-900">{value}</div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>

                            <div className="grid gap-6 xl:grid-cols-[0.92fr,1.08fr]">
                                <section className="rounded-[24px] border border-stone-200 bg-white p-6 shadow-sm">
                                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
                                        <BookText className="h-4 w-4" />
                                        Export formats
                                    </div>
                                    <div className="mt-5 space-y-4">
                                        <div className="rounded-2xl bg-stone-100 p-4">
                                            <div className="font-bold text-stone-900">LinkedIn post</div>
                                            <p className="mt-2 text-sm leading-7 text-stone-600">
                                                Ready-to-copy public post with metrics, story, and hashtags.
                                            </p>
                                        </div>
                                        <div className="rounded-2xl bg-stone-100 p-4">
                                            <div className="font-bold text-stone-900">Portfolio copy</div>
                                            <p className="mt-2 text-sm leading-7 text-stone-600">
                                                Longer case-study style text for your site, Notion page, or project archive.
                                            </p>
                                        </div>
                                        <div className="rounded-2xl bg-stone-100 p-4">
                                            <div className="font-bold text-stone-900">Printable report</div>
                                            <p className="mt-2 text-sm leading-7 text-stone-600">
                                                Open the full report and save it as a PDF with the image gallery included.
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                <section className="rounded-[24px] border border-stone-200 bg-white p-6 shadow-sm">
                                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
                                        <GalleryVerticalEnd className="h-4 w-4" />
                                        What gets included
                                    </div>
                                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                        {[
                                            'A clean written overview of your sprint',
                                            'Top accomplishments pulled from your updates',
                                            'A timeline of key milestones',
                                            'Any images attached during the sprint',
                                            'Any resource links shared along the way',
                                            'Copy tailored for sharing outside the app',
                                        ].map((item) => (
                                            <div key={item} className="flex items-start gap-3 rounded-2xl bg-stone-100 p-4">
                                                <div className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-emerald-700" />
                                                <p className="text-sm leading-7 text-stone-700">{item}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>

                            {!viewOnly && (
                                <section className="rounded-[24px] border border-stone-200 bg-white p-6 shadow-sm">
                                    <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                                        <div>
                                            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">Regenerate tone</div>
                                            <p className="mt-2 text-sm leading-7 text-stone-600">
                                                Keep the same report structure and switch the writing tone.
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => generateSummary()}
                                            disabled={isGenerating}
                                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-950 px-5 py-4 text-sm font-semibold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            <RefreshCcw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                                            {isGenerating ? 'Regenerating report...' : 'Regenerate report'}
                                        </button>
                                    </div>

                                    <div className="mt-5 grid gap-3 md:grid-cols-3">
                                        {styles.map((style) => (
                                            <button
                                                key={style.value}
                                                onClick={() => setSelectedStyle(style.value)}
                                                className={`rounded-[22px] border p-5 text-left transition ${
                                                    selectedStyle === style.value
                                                        ? 'border-emerald-900 bg-emerald-950 text-white shadow-lg'
                                                        : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                                                }`}
                                            >
                                                <style.icon className="h-6 w-6" />
                                                <div className="mt-4 font-bold">{style.label}</div>
                                                <p className={`mt-2 text-sm leading-6 ${selectedStyle === style.value ? 'text-emerald-50/78' : 'text-stone-500'}`}>
                                                    {style.description}
                                                </p>
                                            </button>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <section className="rounded-[24px] border border-stone-200 bg-white p-6 shadow-sm">
                                <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                                    <div className="max-w-2xl">
                                        <div className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">Generate your first report</div>
                                        <h4 className="mt-3 text-2xl font-black text-stone-900">Build a clean, shareable sprint recap for free</h4>
                                        <p className="mt-4 text-sm leading-8 text-stone-600">
                                            We will turn your updates, metrics, attached images, and resource links into a structured end-of-sprint report with LinkedIn copy, portfolio text, and a printable PDF layout.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => generateSummary()}
                                        disabled={isGenerating}
                                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-950 px-6 py-4 text-sm font-semibold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        <Sparkles className={`h-5 w-5 ${isGenerating ? 'animate-spin' : ''}`} />
                                        {isGenerating ? 'Generating report...' : 'Generate report'}
                                        {!isGenerating && <ArrowRight className="h-4 w-4" />}
                                    </button>
                                </div>
                            </section>

                            <section className="rounded-[24px] border border-stone-200 bg-white p-6 shadow-sm">
                                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">Choose a tone</div>
                                <div className="mt-5 grid gap-3 md:grid-cols-3">
                                    {styles.map((style) => (
                                        <button
                                            key={style.value}
                                            onClick={() => setSelectedStyle(style.value)}
                                            className={`rounded-[22px] border p-5 text-left transition ${
                                                selectedStyle === style.value
                                                    ? 'border-emerald-900 bg-emerald-950 text-white shadow-lg'
                                                    : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                                            }`}
                                        >
                                            <style.icon className="h-6 w-6" />
                                            <div className="mt-4 font-bold">{style.label}</div>
                                            <p className={`mt-2 text-sm leading-6 ${selectedStyle === style.value ? 'text-emerald-50/78' : 'text-stone-500'}`}>
                                                {style.description}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            </section>
                        </div>
                    )}
                </div>
            </div>

            <AISummaryModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                summary={summary}
                sprint={sprint}
            />
        </>
    );
}
