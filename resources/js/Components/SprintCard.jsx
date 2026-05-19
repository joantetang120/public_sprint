import { Link, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
    CalendarDaysIcon,
    ChartBarIcon,
    ClockIcon,
    EllipsisVerticalIcon,
    LockClosedIcon,
    MapPinIcon,
    PencilSquareIcon,
    TagIcon,
    TrashIcon,
    UserGroupIcon,
} from '@heroicons/react/24/outline';
import Modal from '@/Components/Modal';
import UserAvatar from '@/Components/UserAvatar';
import { useLanguage } from '@/Contexts/LanguageContext';
import { routeKey } from '@/lib/routeKey';

export default function SprintCard({ sprint, showManagementMenu = false }) {
    const { tl, formatDate } = useLanguage();
    const sprintStatus = sprint.computed_status || sprint.status;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const menuRef = useRef(null);

    const getDaysRemaining = () => {
        const end = new Date(sprint.ends_at);
        const now = new Date();
        const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
        return Math.max(0, diff);
    };

    useEffect(() => {
        if (!isMenuOpen) {
            return undefined;
        }

        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMenuOpen]);

    const statusStyles = {
        active: 'bg-[#b7f34a] text-[#17211d]',
        upcoming: 'bg-[#dcecff] text-[#183d63]',
        completed: 'bg-[#17211d] text-white',
    };

    const getTagClassName = (tagName) => {
        const palettes = [
            'bg-emerald-100 text-emerald-800 border border-emerald-200',
            'bg-sky-100 text-sky-800 border border-sky-200',
            'bg-amber-100 text-amber-800 border border-amber-200',
            'bg-rose-100 text-rose-800 border border-rose-200',
            'bg-violet-100 text-violet-800 border border-violet-200',
            'bg-teal-100 text-teal-800 border border-teal-200',
        ];

        const hash = [...String(tagName || '')].reduce((sum, char) => sum + char.charCodeAt(0), 0);
        return palettes[hash % palettes.length];
    };

    return (
        <motion.article
            whileHover={{ y: -4 }}
            className="ps-feed-card relative overflow-hidden"
        >
            {showManagementMenu && (
                <div ref={menuRef} className="absolute right-4 top-4 z-20">
                    <button
                        type="button"
                        onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            setIsMenuOpen((current) => !current);
                        }}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/88 text-stone-700 shadow-sm backdrop-blur transition hover:bg-white"
                    >
                        <EllipsisVerticalIcon className="h-5 w-5" />
                    </button>

                    {isMenuOpen && (
                        <div className="absolute right-0 mt-2 w-40 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xl">
                            <Link
                                href={route('sprints.edit', routeKey(sprint))}
                                onClick={(event) => event.stopPropagation()}
                                className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-stone-700 transition hover:bg-stone-50"
                            >
                                <PencilSquareIcon className="h-4 w-4" />
                                <span>{tl('Edit')}</span>
                            </Link>
                            <button
                                type="button"
                                onClick={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    setIsMenuOpen(false);
                                    setIsDeleteModalOpen(true);
                                }}
                                className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-bold text-red-600 transition hover:bg-red-50"
                            >
                                <TrashIcon className="h-4 w-4" />
                                <span>{tl('Delete')}</span>
                            </button>
                        </div>
                    )}
                </div>
            )}

            <Link href={route('sprints.show', routeKey(sprint))} className="block">
                <div className="ps-card-cover p-5 text-white">
                    <div className="relative z-10 flex items-start justify-between gap-3">
                        <div className="space-y-3">
                            <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-black uppercase ${statusStyles[sprintStatus] || statusStyles.completed}`}>
                                {sprintStatus === 'active' && <span className="ps-live-dot" />}
                                {tl(sprintStatus)}
                            </span>
                            <h3 className="max-w-[16rem] font-display text-2xl font-black leading-tight text-white line-clamp-2">
                                {sprint.title}
                            </h3>
                            <div className="flex flex-wrap gap-2 text-xs font-bold text-white/80">
                                <span className="rounded-full bg-white/12 px-3 py-1 backdrop-blur">
                                    {tl('{count} builder{suffix}', {
                                        count: sprint.participants_count || 0,
                                        suffix: (sprint.participants_count || 0) === 1 ? '' : 's',
                                    })}
                                </span>
                                <span className="rounded-full bg-white/12 px-3 py-1 backdrop-blur">
                                    {tl('{count} update{suffix}', {
                                        count: sprint.updates_count || 0,
                                        suffix: (sprint.updates_count || 0) === 1 ? '' : 's',
                                    })}
                                </span>
                            </div>
                        </div>
                        {sprint.is_private && (
                            <span className={`grid h-9 w-9 place-items-center rounded-full bg-white/15 backdrop-blur ${showManagementMenu ? 'mr-12' : ''}`}>
                                <LockClosedIcon className="h-5 w-5" />
                            </span>
                        )}
                    </div>
                </div>

                <div className="space-y-4 p-5">
                    <p className="min-h-[4.5rem] text-sm leading-6 text-[#66736d] line-clamp-3">
                        {sprint.description || tl('No description yet. Open this sprint to see the goal, timeline, and what the builder is aiming to finish.')}
                    </p>

                    {sprint.tags && sprint.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {sprint.tags.slice(0, 3).map((tag) => (
                                <span
                                    key={tag.id}
                                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold normal-case ${getTagClassName(tag.name)}`}
                                >
                                    <TagIcon className="h-3.5 w-3.5" />
                                    #{tag.name}
                                </span>
                            ))}
                            {sprint.tags.length > 3 && (
                                <span className="inline-flex items-center rounded-full border border-stone-200 bg-stone-100 px-3 py-1 text-xs font-bold normal-case text-stone-700">
                                    {tl('{count} more', { count: `+${sprint.tags.length - 3}` })}
                                </span>
                            )}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                        <MetaItem
                            icon={CalendarDaysIcon}
                            label={tl('Starts')}
                            value={sprint.starts_at ? formatDate(sprint.starts_at) : formatDate(sprint.created_at)}
                        />
                        <MetaItem
                            icon={ClockIcon}
                            label={tl('Ends')}
                            value={sprint.ends_at ? formatDate(sprint.ends_at) : tl('No end date')}
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        <Metric icon={UserGroupIcon} value={sprint.participants_count || 0} />
                        <Metric icon={ChartBarIcon} value={sprint.updates_count || 0} />
                        <Metric icon={CalendarDaysIcon} value={`${sprint.duration_days}d`} />
                    </div>

                    {sprintStatus === 'active' && (
                        <div className="flex items-center justify-between rounded-lg bg-[#f1ffe0] px-3 py-2 text-sm font-black text-[#17211d]">
                            <span className="inline-flex items-center gap-2">
                                <ClockIcon className="h-4 w-4" />
                                {tl('{days}d left', { days: getDaysRemaining() })}
                            </span>
                            <span className="ps-live-dot" />
                        </div>
                    )}
                </div>
            </Link>

            <Modal show={isDeleteModalOpen} maxWidth="md" onClose={() => setIsDeleteModalOpen(false)}>
                <div className="p-6 sm:p-7">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                            <TrashIcon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-black text-stone-900">{tl('Delete Sprint')}</h3>
                            <p className="mt-2 text-sm leading-7 text-stone-600">
                                {tl('Are you sure you want to delete this sprint? This action cannot be undone.')}
                            </p>
                            <div className="mt-5 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3">
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">{tl('Sprint')}</p>
                                <p className="mt-2 text-sm font-bold text-stone-900">{sprint.title}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="inline-flex items-center justify-center rounded-xl border border-stone-300 px-5 py-3 font-bold text-stone-700 transition hover:bg-stone-50"
                        >
                            {tl('Cancel')}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                router.delete(route('sprints.destroy', routeKey(sprint)), {
                                    onFinish: () => setIsDeleteModalOpen(false),
                                });
                            }}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-bold text-white transition hover:bg-red-700"
                        >
                            <TrashIcon className="h-4 w-4" />
                            <span>{tl('Delete Sprint')}</span>
                        </button>
                    </div>
                </div>
            </Modal>

            <Link
                href={route('users.show', routeKey(sprint.creator))}
                onClick={(event) => event.stopPropagation()}
                className="flex items-center gap-3 border-t border-black/10 px-5 py-4 transition hover:bg-[#f5f3ea]"
            >
                <UserAvatar user={sprint.creator} size="sm" />
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-black text-[#17211d]">{sprint.creator?.name}</p>
                    <p className="flex items-center gap-1 text-xs font-bold text-[#66736d]">
                        <MapPinIcon className="h-3.5 w-3.5" />
                        {tl('Created {date}', { date: formatDate(sprint.created_at) })}
                    </p>
                </div>
            </Link>
        </motion.article>
    );
}

function Metric({ icon: Icon, value }) {
    return (
        <div className="flex items-center justify-center gap-1.5 rounded-lg border border-black/10 bg-[#fbfaf5] px-2 py-2 text-sm font-black text-[#17211d]">
            <Icon className="h-4 w-4 text-[#66736d]" />
            <span>{value}</span>
        </div>
    );
}

function MetaItem({ icon: Icon, label, value }) {
    return (
        <div className="rounded-lg border border-black/10 bg-[#fbfaf5] px-3 py-2">
            <div className="mb-1 inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-[#66736d]">
                <Icon className="h-3.5 w-3.5" />
                <span>{label}</span>
            </div>
            <div className="truncate text-sm font-black text-[#17211d]">{value}</div>
        </div>
    );
}
