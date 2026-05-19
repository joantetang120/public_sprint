import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import {
    ArrowRightIcon as ArrowRight,
    ArrowTrendingUpIcon as TrendingUp,
    CalendarDaysIcon as Calendar,
    ChatBubbleOvalLeftEllipsisIcon as MessageSquare,
    CheckBadgeIcon as CheckCircle2,
    CursorArrowRaysIcon as Target,
    DocumentTextIcon as DocumentText,
    FireIcon as Flame,
    HeartIcon as Heart,
    PlusIcon as Plus,
    StarIcon as Star,
    TrophyIcon as Trophy,
    UserGroupIcon as Users,
    BoltIcon as Zap,
} from '@heroicons/react/24/outline';
import PublicSprintLayout from '@/Layouts/PublicSprintLayout';
import UserAvatar from '@/Components/UserAvatar';
import SprintProgressCard from '@/Components/SprintProgressCard';
import AISprintSummary from '@/Components/AISprintSummary';
import ActivityPulseStrip from '@/Components/ActivityPulseStrip';
import { getSprintReportPreview, hasSprintReport } from '@/lib/sprintReport';
import { routeKey } from '@/lib/routeKey';
import { useLanguage } from '@/Contexts/LanguageContext';

export default function Dashboard({ auth, updates = [], stats = {}, completedSprints = [] }) {
    const { t, tl, formatDate } = useLanguage();
    const [selectedSprint, setSelectedSprint] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

    const sprintsWithSummaries = completedSprints.filter((item) => hasSprintReport(item.ai_summary));

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return t('dashboard.greeting.morning');
        if (hour < 18) return t('dashboard.greeting.afternoon');
        return t('dashboard.greeting.evening');
    };

    const statCards = [
        {
            label: t('dashboard.stats.activeSprints'),
            value: stats.active_sprints || 0,
            icon: Target,
            iconClass: 'text-emerald-600',
            boxClass: 'bg-emerald-100',
        },
        {
            label: t('dashboard.stats.currentStreak'),
            value: stats.current_streak || 0,
            suffix: tl('days'),
            icon: Flame,
            iconClass: 'text-amber-600',
            boxClass: 'bg-amber-100',
        },
        {
            label: t('dashboard.stats.totalLikes'),
            value: stats.total_likes || 0,
            icon: Heart,
            iconClass: 'text-rose-600',
            boxClass: 'bg-rose-100',
        },
        {
            label: t('dashboard.stats.updatesPosted'),
            value: stats.updates_posted || 0,
            icon: MessageSquare,
            iconClass: 'text-sky-600',
            boxClass: 'bg-sky-100',
        },
    ];

    return (
        <PublicSprintLayout>
            <Head title={t('dashboard.title')} />

            <div className="min-h-screen py-2">
                <div className="space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="ps-hero-band p-7"
                    >
                        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <div className="mb-4 inline-flex items-center space-x-2 rounded-full border border-white/15 bg-white/12 px-4 py-2 backdrop-blur-sm">
                                    <Calendar className="h-4 w-4" />
                                    <span className="text-sm font-semibold">{getGreeting()}</span>
                                </div>
                                <h1 className="mb-2 font-display text-3xl font-black lg:text-4xl">
                                    {t('dashboard.welcome', { name: auth.user.name })}
                                </h1>
                                <p className="max-w-2xl text-lg text-white/80">
                                    {stats.active_sprints > 0
                                        ? tl('You have {count} active sprint{suffix} in progress', {
                                              count: stats.active_sprints,
                                              suffix: stats.active_sprints > 1 ? 's' : '',
                                          })
                                        : tl('Ready to start building something amazing?')}
                                </p>
                            </div>

                            <div className="w-full max-w-md space-y-3 lg:w-[360px]">
                                <ActivityPulseStrip />
                                <Link href={route('sprints.create')} className="ps-command-button w-full">
                                    <Plus className="h-5 w-5" />
                                    <span>{tl('New Sprint')}</span>
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {statCards.map((card, index) => {
                            const Icon = card.icon;

                            return (
                                <motion.div
                                    key={card.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * (index + 1) }}
                                    className="rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${card.boxClass}`}>
                                            <Icon className={`h-6 w-6 ${card.iconClass}`} />
                                        </div>
                                        <div>
                                            <p className="mb-1 text-sm font-semibold text-gray-600">{card.label}</p>
                                            <p className="text-2xl font-bold text-gray-900">
                                                {card.value}
                                                {card.suffix && <span className="ml-1 text-base text-gray-500">{card.suffix}</span>}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="rounded-xl border border-gray-200 bg-white p-2"
                    >
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-6 py-3 font-bold transition-all ${
                                    activeTab === 'overview'
                                        ? 'bg-emerald-950 text-white shadow-lg'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <TrendingUp className="h-4 w-4" />
                                <span>{t('dashboard.tabs.overview')}</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('summaries')}
                                className={`relative flex flex-1 items-center justify-center gap-2 rounded-lg px-6 py-3 font-bold transition-all ${
                                    activeTab === 'summaries'
                                        ? 'bg-stone-900 text-white shadow-lg'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <DocumentText className="h-4 w-4" />
                                <span>{tl('Recaps')}</span>
                                {sprintsWithSummaries.length > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-xs font-black text-white">
                                        {sprintsWithSummaries.length}
                                    </span>
                                )}
                            </button>
                        </div>
                    </motion.div>

                    {activeTab === 'overview' && completedSprints.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center justify-between">
                                <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
                                    <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                                    <span>{t('dashboard.completionHistory')}</span>
                                </h2>
                                <Link
                                    href={route('sprints.index')}
                                    className="flex items-center space-x-1 text-sm font-semibold text-green-600 hover:text-green-700"
                                >
                                    <span>{tl('View all sprints')}</span>
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                                {completedSprints.map((item, index) => {
                                    const { sprint, stats: sprintStats, user_rank, user_score, user_badges } = item;
                                    const badges = user_badges || [];

                                    return (
                                        <Link key={sprint.id} href={route('sprints.show', routeKey(sprint))}>
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.1 * index }}
                                                className="group cursor-pointer rounded-xl border border-emerald-200 bg-[linear-gradient(180deg,#f5fbf7_0%,#e8f4ee_100%)] p-6 transition-all hover:border-emerald-400 hover:shadow-lg"
                                            >
                                                <div className="mb-4 flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="mb-2 flex items-center space-x-2">
                                                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                                            <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                                                                {t('sprints.completed')}
                                                            </span>
                                                        </div>
                                                        <h3 className="line-clamp-2 text-lg font-bold text-gray-900 transition-colors group-hover:text-emerald-700">
                                                            {sprint.title}
                                                        </h3>
                                                    </div>
                                                    {user_rank && user_rank <= 3 && (
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-emerald-700 shadow-sm">
                                                            <Trophy className="h-5 w-5" />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="mb-4 rounded-lg bg-white/80 p-4">
                                                    <div className="mb-2 flex items-center justify-between">
                                                        <span className="text-sm font-semibold text-gray-700">{tl('Your Performance')}</span>
                                                        {user_rank && (
                                                            <span className="text-sm font-bold text-emerald-700">
                                                                {tl('Rank #{rank}', { rank: user_rank })}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-2xl font-black text-emerald-600">{user_score}</span>
                                                        <span className="text-sm text-gray-600">{tl('points')}</span>
                                                    </div>
                                                </div>

                                                {badges.length > 0 && (
                                                    <div className="mb-4 flex flex-wrap gap-2">
                                                        {badges.slice(0, 3).map((badge, i) => (
                                                            <div
                                                                key={i}
                                                                className="flex items-center space-x-1 rounded-full bg-white/90 px-2 py-1 text-xs font-semibold"
                                                            >
                                                                {badge === 'top_contributor' && (
                                                                    <>
                                                                        <Star className="h-3 w-3 text-purple-600" />
                                                                        <span className="text-purple-700">{tl('Top')}</span>
                                                                    </>
                                                                )}
                                                                {badge === 'daily_streak' && (
                                                                    <>
                                                                        <Flame className="h-3 w-3 text-orange-600" />
                                                                        <span className="text-orange-700">{tl('Streak')}</span>
                                                                    </>
                                                                )}
                                                                {badge === 'most_helpful' && (
                                                                    <>
                                                                        <Heart className="h-3 w-3 text-blue-600" />
                                                                        <span className="text-blue-700">{tl('Helpful')}</span>
                                                                    </>
                                                                )}
                                                                {badge === 'early_bird' && (
                                                                    <>
                                                                        <Zap className="h-3 w-3 text-yellow-600" />
                                                                        <span className="text-yellow-700">{tl('Early')}</span>
                                                                    </>
                                                                )}
                                                                {badge === 'consistent_builder' && (
                                                                    <>
                                                                        <Target className="h-3 w-3 text-green-600" />
                                                                        <span className="text-green-700">{tl('Consistent')}</span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                <div className="grid grid-cols-3 gap-2 text-center">
                                                    <div className="rounded-lg bg-white/80 p-2">
                                                        <div className="text-lg font-bold text-gray-900">{sprintStats.total_updates}</div>
                                                        <div className="text-xs text-gray-600">{t('dashboard.stats.updatesPosted')}</div>
                                                    </div>
                                                    <div className="rounded-lg bg-white/80 p-2">
                                                        <div className="text-lg font-bold text-gray-900">{sprintStats.active_participants}</div>
                                                        <div className="text-xs text-gray-600">{tl('Builders')}</div>
                                                    </div>
                                                    <div className="rounded-lg bg-white/80 p-2">
                                                        <div className="text-lg font-bold text-gray-900">{sprintStats.completion_rate}%</div>
                                                        <div className="text-xs text-gray-600">{tl('Rate')}</div>
                                                    </div>
                                                </div>

                                                <div className="mt-4 flex items-center space-x-2">
                                                    <button
                                                        onClick={(event) => {
                                                            event.preventDefault();
                                                            setSelectedSprint(item);
                                                        }}
                                                        className="flex flex-1 items-center justify-center space-x-2 rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50"
                                                    >
                                                        <Trophy className="h-4 w-4" />
                                                        <span>{tl('Progress Card')}</span>
                                                    </button>
                                                    <div className="flex items-center space-x-1 text-sm font-semibold text-emerald-700 transition-colors group-hover:text-emerald-800">
                                                        <span>{tl('View')}</span>
                                                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'summaries' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">{tl('Sprint Recaps')}</h2>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {tl('A cleaner summary of what you finished and shared.')}
                                    </p>
                                </div>
                                <span className="text-sm text-gray-600">
                                    {tl('{count} recap{suffix}', {
                                        count: sprintsWithSummaries.length,
                                        suffix: sprintsWithSummaries.length === 1 ? '' : 's',
                                    })}
                                </span>
                            </div>

                            {sprintsWithSummaries.length > 0 ? (
                                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                    {sprintsWithSummaries.map((item, index) => {
                                        const { sprint, user_rank, user_score, user_badges } = item;
                                        const cleanSummary = getSprintReportPreview(item.ai_summary, sprint);
                                        const badges = user_badges || [];

                                        return (
                                            <motion.div
                                                key={sprint.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.1 * index }}
                                                className="rounded-2xl border border-stone-200 bg-[linear-gradient(180deg,#fffefb_0%,#f3eee5_100%)] p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-lg"
                                            >
                                                <div className="mb-4 flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="mb-2 flex items-center space-x-2">
                                                            <DocumentText className="h-5 w-5 text-emerald-700" />
                                                            <span className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
                                                                {tl('Sprint recap')}
                                                            </span>
                                                        </div>
                                                        <h3 className="mb-2 line-clamp-2 text-lg font-bold text-gray-900">{sprint.title}</h3>
                                                        <div className="flex items-center space-x-3 text-sm text-gray-600">
                                                            <span className="flex items-center space-x-1">
                                                                <Target className="h-4 w-4 text-emerald-600" />
                                                                <span>{tl('Rank #{rank}', { rank: user_rank })}</span>
                                                            </span>
                                                            <span>&bull;</span>
                                                            <span>{tl('{score} points', { score: user_score })}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mb-4 rounded-xl border border-stone-200 bg-white/90 p-4">
                                                    <p className="line-clamp-3 text-sm leading-relaxed text-gray-700">{cleanSummary}</p>
                                                </div>

                                                {badges.length > 0 && (
                                                    <div className="mb-4 flex flex-wrap gap-2">
                                                        {badges.slice(0, 3).map((badge, i) => (
                                                            <div
                                                                key={i}
                                                                className="flex items-center space-x-1 rounded-full bg-white/80 px-2 py-1 text-xs font-semibold"
                                                            >
                                                                {badge === 'top_contributor' && (
                                                                    <>
                                                                        <Star className="h-3 w-3 text-purple-600" />
                                                                        <span className="text-purple-700">{tl('Top')}</span>
                                                                    </>
                                                                )}
                                                                {badge === 'daily_streak' && (
                                                                    <>
                                                                        <Flame className="h-3 w-3 text-orange-600" />
                                                                        <span className="text-orange-700">{tl('Streak')}</span>
                                                                    </>
                                                                )}
                                                                {badge === 'most_helpful' && (
                                                                    <>
                                                                        <Heart className="h-3 w-3 text-blue-600" />
                                                                        <span className="text-blue-700">{tl('Helpful')}</span>
                                                                    </>
                                                                )}
                                                                {badge === 'early_bird' && (
                                                                    <>
                                                                        <Zap className="h-3 w-3 text-yellow-600" />
                                                                        <span className="text-yellow-700">{tl('Early')}</span>
                                                                    </>
                                                                )}
                                                                {badge === 'consistent_builder' && (
                                                                    <>
                                                                        <Target className="h-3 w-3 text-green-600" />
                                                                        <span className="text-green-700">{tl('Consistent')}</span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        ))}
                                                        {badges.length > 3 && (
                                                            <span className="rounded-full bg-white/80 px-2 py-1 text-xs font-semibold text-gray-600">
                                                                {tl('{count} more', { count: `+${badges.length - 3}` })}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}

                                                <button
                                                    onClick={() => setSelectedSprint(item)}
                                                    className="flex w-full items-center justify-center space-x-2 rounded-xl border border-stone-300 bg-white px-4 py-3 font-bold text-stone-800 transition-all hover:border-emerald-300 hover:bg-stone-50"
                                                >
                                                    <DocumentText className="h-5 w-5 text-emerald-700" />
                                                    <span>{tl('Open recap')}</span>
                                                </button>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="rounded-2xl border border-stone-200 bg-[linear-gradient(180deg,#fffefb_0%,#f5f1e8_100%)] p-12 text-center">
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
                                        <DocumentText className="h-8 w-8 text-emerald-700" />
                                    </div>
                                    <h3 className="mb-2 text-xl font-bold text-gray-900">{tl('No recaps yet')}</h3>
                                    <p className="mb-6 text-gray-600">
                                        {tl('Finish a sprint to unlock a clean recap you can review and share later.')}
                                    </p>
                                    <Link
                                        href={route('sprints.index')}
                                        className="inline-flex items-center space-x-2 rounded-xl bg-emerald-950 px-6 py-3 font-bold text-white transition-all hover:bg-emerald-900"
                                    >
                                        <Plus className="h-5 w-5" />
                                        <span>{tl('Discover Sprints')}</span>
                                    </Link>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'overview' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="rounded-xl border border-gray-200 bg-white"
                        >
                            <div className="border-b border-gray-200 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="mb-1 text-xl font-bold text-gray-900">{t('dashboard.recentActivity')}</h2>
                                        <p className="text-sm text-gray-600">{tl('Your latest updates and progress')}</p>
                                    </div>
                                    <Link
                                        href="/discover"
                                        className="flex items-center space-x-1 text-sm font-semibold text-green-600 hover:text-green-700"
                                    >
                                        <span>{tl('View all')}</span>
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            </div>

                            {updates.length > 0 ? (
                                <div className="divide-y divide-gray-200">
                                    {updates.map((update) => (
                                        <Link
                                            key={update.id}
                                            href={route('sprints.show', routeKey(update.sprint) ?? update.sprint_id)}
                                        >
                                            <div className="cursor-pointer p-6 transition-colors hover:bg-gray-50">
                                                <div className="flex items-start space-x-4">
                                                    <UserAvatar user={update.user} size="lg" />
                                                    <div className="min-w-0 flex-1">
                                                        <div className="mb-2 flex items-center space-x-2">
                                                            <span className="font-semibold text-gray-900">{update.user?.name}</span>
                                                            <span className="text-sm text-gray-400">&bull;</span>
                                                            <span className="text-sm text-gray-500">{tl('posted in')}</span>
                                                            <span className="truncate text-sm font-semibold text-green-600">
                                                                {update.sprint?.title}
                                                            </span>
                                                        </div>
                                                        <p className="line-clamp-2 leading-relaxed text-gray-700">{update.content}</p>
                                                        <div className="mt-3 flex items-center space-x-4 text-xs text-gray-500">
                                                            <span>{tl('Day {day}', { day: update.day_number })}</span>
                                                            <span>&bull;</span>
                                                            <span>{formatDate(update.created_at)}</span>
                                                            {update.images && update.images.length > 0 && (
                                                                <>
                                                                    <span>&bull;</span>
                                                                    <span>
                                                                        {tl('{count} image{suffix}', {
                                                                            count: update.images.length,
                                                                            suffix: update.images.length > 1 ? 's' : '',
                                                                        })}
                                                                    </span>
                                                                </>
                                                            )}
                                                            {update.links && update.links.length > 0 && (
                                                                <>
                                                                    <span>&bull;</span>
                                                                    <span>
                                                                        {tl('{count} link{suffix}', {
                                                                            count: update.links.length,
                                                                            suffix: update.links.length > 1 ? 's' : '',
                                                                        })}
                                                                    </span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-12 text-center">
                                    <div className="mx-auto max-w-sm">
                                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                                            <MessageSquare className="h-8 w-8 text-gray-400" />
                                        </div>
                                        <h3 className="mb-2 text-lg font-semibold text-gray-900">{t('dashboard.noUpdates')}</h3>
                                        <p className="mb-6 text-sm text-gray-600">{t('dashboard.joinSprint')}</p>
                                        <div className="flex flex-col justify-center gap-3 sm:flex-row">
                                            <Link
                                                href="/discover"
                                                className="inline-flex items-center space-x-2 rounded-lg bg-green-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-600"
                                            >
                                                <span>{tl('Discover Sprints')}</span>
                                                <ArrowRight className="h-4 w-4" />
                                            </Link>
                                            <Link
                                                href={route('sprints.create')}
                                                className="inline-flex items-center space-x-2 rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                                            >
                                                <Plus className="h-4 w-4" />
                                                <span>{tl('Start Sprint')}</span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'overview' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="grid grid-cols-1 gap-6 md:grid-cols-2"
                        >
                            <Link
                                href="/discover"
                                className="group rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-green-500 hover:shadow-md"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 transition-colors group-hover:bg-blue-200">
                                        <TrendingUp className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="mb-1 font-semibold text-gray-900">{tl('Discover Sprints')}</h3>
                                        <p className="text-sm text-gray-600">{tl('Find inspiring projects to join')}</p>
                                    </div>
                                </div>
                            </Link>

                            <Link
                                href={route('sprints.index')}
                                className="group rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-green-500 hover:shadow-md"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 transition-colors group-hover:bg-green-200">
                                        <Users className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="mb-1 font-semibold text-gray-900">{tl('My Sprints')}</h3>
                                        <p className="text-sm text-gray-600">{tl('Manage all your active projects')}</p>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    )}
                </div>
            </div>

            {selectedSprint && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
                    onClick={() => setSelectedSprint(null)}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900">{tl('Sprint Recap & Share Assets')}</h2>
                            <button
                                onClick={() => setSelectedSprint(null)}
                                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                            >
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-6">
                            <AISprintSummary
                                sprint={selectedSprint.sprint}
                                aiSummary={selectedSprint.ai_summary}
                                viewOnly={Boolean(selectedSprint.ai_summary)}
                            />

                            <SprintProgressCard
                                sprint={selectedSprint.sprint}
                                userStats={{
                                    user: auth.user,
                                    updates_posted:
                                        selectedSprint.sprint.participants?.find((participant) => participant.id === auth.user.id)
                                            ?.pivot?.updates_posted || 0,
                                    score: selectedSprint.user_score,
                                    reactions_received:
                                        selectedSprint.sprint.participants?.find((participant) => participant.id === auth.user.id)
                                            ?.pivot?.reactions_received || 0,
                                    rank: selectedSprint.user_rank,
                                    badges: selectedSprint.user_badges,
                                }}
                                completionStats={selectedSprint.stats}
                            />
                        </div>
                    </motion.div>
                </div>
            )}
        </PublicSprintLayout>
    );
}
