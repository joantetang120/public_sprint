import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import {
    ArrowLeftIcon as ArrowLeft,
    ArrowRightIcon as ArrowRight,
    CalendarDaysIcon as Calendar,
    LockClosedIcon as Lock,
    TagIcon as Tag,
} from '@heroicons/react/24/outline';
import PublicSprintLayout from '@/Layouts/PublicSprintLayout';
import { useLanguage } from '@/Contexts/LanguageContext';
import { routeKey } from '@/lib/routeKey';

export default function Edit({ sprint, tags = [] }) {
    const { tl } = useLanguage();
    const initialTags = sprint.tags?.map((tag) => tag.name) || [];
    const [customTag, setCustomTag] = useState('');
    const { data, setData, put, processing, errors } = useForm({
        title: sprint.title || '',
        description: sprint.description || '',
        duration_days: sprint.duration_days || 7,
        is_private: Boolean(sprint.is_private),
        starts_at: sprint.starts_at ? String(sprint.starts_at).slice(0, 10) : '',
        tags: initialTags,
    });

    const PRESET_DURATIONS = [3, 7, 14, 21, 30];
    const [customActive, setCustomActive] = useState(!PRESET_DURATIONS.includes(sprint.duration_days || 7));

    const selectPreset = (d) => {
        setCustomActive(false);
        setData('duration_days', d);
    };

    const activateCustom = () => {
        setCustomActive(true);
        if (PRESET_DURATIONS.includes(data.duration_days)) {
            setData('duration_days', '');
        }
    };

    const toggleTag = (tagName) => {
        const normalizedTag = tagName.trim();

        if (!normalizedTag) {
            return;
        }

        const hasTag = data.tags.includes(normalizedTag);
        if (hasTag) {
            setData('tags', data.tags.filter((tag) => tag !== normalizedTag));
            return;
        }

        if (data.tags.length >= 5) {
            return;
        }

        setData('tags', [...data.tags, normalizedTag]);
    };

    const addCustomTag = () => {
        if (!customTag.trim()) {
            return;
        }

        toggleTag(customTag);
        setCustomTag('');
    };

    const submit = (event) => {
        event.preventDefault();
        put(route('sprints.update', routeKey(sprint)));
    };

    return (
        <PublicSprintLayout>
            <Head title={tl('Edit Sprint')} />

            <div className="min-h-screen py-8">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-10">
                        <Link
                            href={route('sprints.index')}
                            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-stone-600 transition hover:text-emerald-700"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span>{tl('Back to My Sprints')}</span>
                        </Link>

                        <div className="rounded-[28px] border border-stone-200 bg-[linear-gradient(135deg,#173327,#2f6b4f)] p-8 text-white shadow-lg">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-emerald-50">
                                <Lock className="h-4 w-4" />
                                <span>{tl('Editable before launch')}</span>
                            </div>
                            <h1 className="mt-5 font-display text-4xl font-black">{tl('Edit Sprint')}</h1>
                            <p className="mt-3 max-w-2xl text-sm leading-7 text-emerald-50/80 sm:text-base">
                                {tl('You can update this sprint because it has not started yet and no one else has joined.')}
                            </p>
                        </div>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                            <h2 className="text-xl font-black text-stone-900">{tl('Sprint Details')}</h2>
                            <div className="mt-6 space-y-5">
                                <div>
                                    <label className="mb-2 block text-sm font-bold text-stone-900">{tl('Title')}</label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(event) => setData('title', event.target.value)}
                                        className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                                        placeholder={tl('What are you building?')}
                                    />
                                    {errors.title && <p className="mt-2 text-sm text-red-600">{errors.title}</p>}
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-bold text-stone-900">{tl('Description')}</label>
                                    <textarea
                                        rows={5}
                                        value={data.description}
                                        onChange={(event) => setData('description', event.target.value)}
                                        className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                                        placeholder={tl('Describe the goal, scope, and what success looks like for this sprint.')}
                                    />
                                    {errors.description && <p className="mt-2 text-sm text-red-600">{errors.description}</p>}
                                </div>
                            </div>
                        </section>

                        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                            <h2 className="text-xl font-black text-stone-900">{tl('Timing')}</h2>
                            <div className="mt-6 grid gap-5 md:grid-cols-2">
                                <div>
                                    <label className="mb-3 block text-sm font-bold text-stone-900">{tl('Duration')}</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {PRESET_DURATIONS.map((d) => (
                                            <button
                                                key={d}
                                                type="button"
                                                onClick={() => selectPreset(d)}
                                                className={`rounded-xl border px-4 py-3 text-sm font-bold transition ${
                                                    !customActive && data.duration_days === d
                                                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                                                        : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                                                }`}
                                            >
                                                {d}d
                                            </button>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={activateCustom}
                                            className={`rounded-xl border px-4 py-3 text-sm font-bold transition ${
                                                customActive
                                                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                                                    : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                                            }`}
                                        >
                                            {tl('Custom')}
                                        </button>
                                    </div>
                                    {customActive && (
                                        <div className="mt-3 flex items-center gap-3">
                                            <input
                                                type="number"
                                                min={1}
                                                max={365}
                                                value={data.duration_days}
                                                onChange={(e) => {
                                                    const v = parseInt(e.target.value, 10);
                                                    setData('duration_days', isNaN(v) ? '' : Math.min(365, Math.max(1, v)));
                                                }}
                                                className="w-28 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-center font-bold text-stone-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                                                placeholder="e.g. 45"
                                                autoFocus
                                            />
                                            <span className="text-sm text-stone-600">{tl('days')}</span>
                                        </div>
                                    )}
                                    {errors.duration_days && <p className="mt-2 text-sm text-red-600">{errors.duration_days}</p>}
                                </div>

                                <div>
                                    <label className="mb-3 block text-sm font-bold text-stone-900">{tl('Start Date')}</label>
                                    <div className="relative">
                                        <Calendar className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
                                        <input
                                            type="date"
                                            value={data.starts_at}
                                            onChange={(event) => setData('starts_at', event.target.value)}
                                            min={new Date().toISOString().split('T')[0]}
                                            className="w-full rounded-xl border border-stone-200 bg-stone-50 py-3 pl-10 pr-4 text-stone-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                                        />
                                    </div>
                                    {errors.starts_at && <p className="mt-2 text-sm text-red-600">{errors.starts_at}</p>}
                                </div>
                            </div>
                        </section>

                        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                            <h2 className="text-xl font-black text-stone-900">{tl('Visibility & Tags')}</h2>

                            <div className="mt-6">
                                <label className="mb-3 block text-sm font-bold text-stone-900">{tl('Privacy')}</label>
                                <div className="grid gap-3 md:grid-cols-2">
                                    <button
                                        type="button"
                                        onClick={() => setData('is_private', false)}
                                        className={`rounded-xl border p-4 text-left transition ${
                                            !data.is_private
                                                ? 'border-emerald-500 bg-emerald-50'
                                                : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
                                        }`}
                                    >
                                        <div className="font-bold text-stone-900">{tl('Public Sprint')}</div>
                                        <p className="mt-1 text-sm text-stone-600">{tl('Anyone can discover and join.')}</p>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setData('is_private', true)}
                                        className={`rounded-xl border p-4 text-left transition ${
                                            data.is_private
                                                ? 'border-emerald-500 bg-emerald-50'
                                                : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
                                        }`}
                                    >
                                        <div className="font-bold text-stone-900">{tl('Private Sprint')}</div>
                                        <p className="mt-1 text-sm text-stone-600">{tl('Only invited people can join.')}</p>
                                    </button>
                                </div>
                            </div>

                            <div className="mt-6">
                                <label className="mb-3 block text-sm font-bold text-stone-900">{tl('Tags')}</label>

                                {data.tags.length > 0 && (
                                    <div className="mb-4 flex flex-wrap gap-2">
                                        {data.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-800"
                                            >
                                                <Tag className="h-3.5 w-3.5" />
                                                <span>#{tag}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => toggleTag(tag)}
                                                    className="text-emerald-700 transition hover:text-emerald-900"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="mb-4 flex gap-2">
                                    <div className="relative flex-1">
                                        <Tag className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                                        <input
                                            type="text"
                                            value={customTag}
                                            onChange={(event) => setCustomTag(event.target.value)}
                                            onKeyDown={(event) => {
                                                if (event.key === 'Enter') {
                                                    event.preventDefault();
                                                    addCustomTag();
                                                }
                                            }}
                                            className="w-full rounded-xl border border-stone-200 bg-stone-50 py-3 pl-10 pr-4 text-stone-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                                            placeholder={tl('Add a custom tag')}
                                            disabled={data.tags.length >= 5}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={addCustomTag}
                                        disabled={!customTag.trim() || data.tags.length >= 5}
                                        className="rounded-xl border border-stone-300 bg-white px-4 py-3 font-bold text-stone-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {tl('Add')}
                                    </button>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {tags.map((tag) => (
                                        <button
                                            key={tag.id}
                                            type="button"
                                            onClick={() => toggleTag(tag.name)}
                                            disabled={!data.tags.includes(tag.name) && data.tags.length >= 5}
                                            className={`rounded-full px-3 py-1 text-sm font-bold transition ${
                                                data.tags.includes(tag.name)
                                                    ? 'bg-stone-900 text-white'
                                                    : 'border border-stone-200 bg-stone-100 text-stone-700 hover:bg-stone-200'
                                            } disabled:cursor-not-allowed disabled:opacity-50`}
                                        >
                                            #{tag.name}
                                        </button>
                                    ))}
                                </div>
                                {errors.tags && <p className="mt-2 text-sm text-red-600">{errors.tags}</p>}
                            </div>
                        </section>

                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                            <Link
                                href={route('sprints.index')}
                                className="inline-flex items-center justify-center rounded-xl border border-stone-300 px-6 py-3 font-bold text-stone-700 transition hover:bg-stone-50"
                            >
                                {tl('Cancel')}
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-950 px-6 py-3 font-bold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <span>{processing ? tl('Saving...') : tl('Save Changes')}</span>
                                {!processing && <ArrowRight className="h-4 w-4" />}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </PublicSprintLayout>
    );
}
