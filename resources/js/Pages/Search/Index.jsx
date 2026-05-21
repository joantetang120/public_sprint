import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    MagnifyingGlassIcon,
    MapPinIcon,
    SparklesIcon,
    TagIcon,
    UserGroupIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import PublicSprintLayout from '@/Layouts/PublicSprintLayout';
import UserAvatar from '@/Components/UserAvatar';
import { useLanguage } from '@/Contexts/LanguageContext';
import { routeKey } from '@/lib/routeKey';

export default function Index({ query = '', results }) {
    const { tl, formatDate } = useLanguage();
    const [searchTerm, setSearchTerm] = useState(query);
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        setSearchTerm(query);
    }, [query]);

    const submitSearch = (event) => {
        event.preventDefault();

        router.get(route('search.index'), {
            q: searchTerm,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearSearch = () => {
        setSearchTerm('');
        router.get(route('search.index'), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const sprints = results?.sprints || [];
    const users = results?.users || [];
    const totalResults = (results?.counts?.sprints || 0) + (results?.counts?.users || 0);

    const tabs = [
        { id: 'all', label: tl('All') },
        { id: 'sprints', label: tl('Sprints') },
        { id: 'users', label: tl('Users') },
    ];

    const showSprints = activeTab === 'all' || activeTab === 'sprints';
    const showUsers = activeTab === 'all' || activeTab === 'users';

    return (
        <PublicSprintLayout>
            <Head title={tl('Search')} />

            <div className="mx-auto max-w-6xl space-y-6">
                <motion.section
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="ps-feed-card overflow-hidden"
                >
                    <div className="ps-card-cover px-6 py-7 text-white sm:px-8">
                        <div className="relative z-10 space-y-5">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] backdrop-blur-sm">
                                <MagnifyingGlassIcon className="h-4 w-4 text-[#b7f34a]" />
                                {tl('Global Search')}
                            </div>
                            <div>
                                <h1 className="font-display text-3xl font-black sm:text-4xl">
                                    {tl('Search sprints and people')}
                                </h1>
                                <p className="mt-2 max-w-2xl text-sm font-medium text-white/80 sm:text-base">
                                    {tl('Find public sprints by title, creator, or tag, and discover builders with visible profiles.')}
                                </p>
                            </div>

                            <form onSubmit={submitSearch} className="flex flex-col gap-3 sm:flex-row">
                                <div className="relative flex-1">
                                    <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#66736d]" />
                                    <input
                                        value={searchTerm}
                                        onChange={(event) => setSearchTerm(event.target.value)}
                                        placeholder={tl('Search by sprint title, tag, creator, or user name...')}
                                        className="h-14 w-full rounded-2xl border border-white/15 bg-white px-12 text-sm font-medium text-[#17211d] shadow-sm outline-none transition focus:border-[#b7f34a] focus:ring-2 focus:ring-[#b7f34a]/40"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="inline-flex h-14 items-center justify-center rounded-2xl bg-[#b7f34a] px-6 text-sm font-black text-[#17211d] transition hover:bg-[#c5fb62]"
                                >
                                    {tl('Search')}
                                </button>
                                {query && (
                                    <button
                                        type="button"
                                        onClick={clearSearch}
                                        className="inline-flex h-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-6 text-sm font-black text-white transition hover:bg-white/20"
                                    >
                                        {tl('Clear')}
                                    </button>
                                )}
                            </form>
                        </div>
                    </div>
                </motion.section>

                <div className="sticky top-[88px] z-20 -mt-2 flex flex-wrap gap-3 rounded-2xl border border-black/10 bg-white/90 p-3 shadow-sm backdrop-blur">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black transition ${
                                activeTab === tab.id
                                    ? 'bg-[#b7f34a] text-[#17211d]'
                                    : 'bg-[#f5f3ea] text-[#66736d] hover:text-[#17211d]'
                            }`}
                        >
                            <span>{tab.label}</span>
                            {tab.id === 'sprints' && <span className="rounded-full bg-white/70 px-2 py-0.5 text-xs">{results?.counts?.sprints || 0}</span>}
                            {tab.id === 'users' && <span className="rounded-full bg-white/70 px-2 py-0.5 text-xs">{results?.counts?.users || 0}</span>}
                        </button>
                    ))}
                </div>

                {!query ? (
                    <div className="ps-empty-state">
                        <div className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-full bg-[#17211d] text-white">
                            <MagnifyingGlassIcon className="h-10 w-10" />
                        </div>
                        <h2 className="font-display text-3xl font-black text-[#17211d]">
                            {tl('Start a search')}
                        </h2>
                        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[#66736d]">
                            {tl('Type a sprint title, a tag, a creator name, or a visible profile to explore the community.')}
                        </p>
                    </div>
                ) : totalResults === 0 ? (
                    <div className="ps-empty-state">
                        <div className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-full bg-[#17211d] text-white">
                            <SparklesIcon className="h-10 w-10" />
                        </div>
                        <h2 className="font-display text-3xl font-black text-[#17211d]">
                            {tl('No results found')}
                        </h2>
                        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[#66736d]">
                            {tl('Try another keyword for a sprint title, creator, tag, or public profile.')}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        <div className="px-1 text-sm font-bold text-[#66736d]">
                            {tl('{count} result{suffix} for "{query}"', {
                                count: totalResults,
                                suffix: totalResults === 1 ? '' : 's',
                                query,
                            })}
                        </div>

                        {showSprints && (
                            <section className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="font-display text-2xl font-black text-[#17211d]">{tl('Sprints')}</h2>
                                    <span className="rounded-full bg-[#f5f3ea] px-3 py-1 text-xs font-black text-[#66736d]">
                                        {results?.counts?.sprints || 0}
                                    </span>
                                </div>
                                <div className="space-y-4">
                                    {sprints.map((sprint) => (
                                        <Link
                                            key={sprint.id}
                                            href={route('sprints.show', routeKey(sprint))}
                                            className="block rounded-3xl border border-black/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                                        >
                                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                                <div className="space-y-3">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="rounded-full bg-[#b7f34a]/35 px-3 py-1 text-xs font-black uppercase text-[#17211d]">
                                                            {tl(sprint.computed_status || sprint.status)}
                                                        </span>
                                                        <span className="rounded-full bg-[#f5f3ea] px-3 py-1 text-xs font-bold text-[#66736d]">
                                                            {tl('{count} builder{suffix}', {
                                                                count: sprint.participants_count || 0,
                                                                suffix: (sprint.participants_count || 0) === 1 ? '' : 's',
                                                            })}
                                                        </span>
                                                        <span className="rounded-full bg-[#f5f3ea] px-3 py-1 text-xs font-bold text-[#66736d]">
                                                            {tl('{count} publication{suffix}', {
                                                                count: sprint.updates_count || 0,
                                                                suffix: (sprint.updates_count || 0) === 1 ? '' : 's',
                                                            })}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-display text-2xl font-black text-[#17211d]">{sprint.title}</h3>
                                                        {sprint.description && (
                                                            <p className="mt-2 max-w-3xl text-sm leading-7 text-[#66736d] line-clamp-2">
                                                                {sprint.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {sprint.tags?.slice(0, 4).map((tag) => (
                                                            <span key={tag.id} className="inline-flex items-center gap-1 rounded-full bg-[#eef7ff] px-3 py-1 text-xs font-bold text-[#183d63]">
                                                                <TagIcon className="h-3.5 w-3.5" />
                                                                #{tag.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="lg:min-w-[250px]">
                                                    <div className="rounded-2xl border border-black/10 bg-[#fbfaf5] p-4">
                                                        <div className="flex items-center gap-3">
                                                            <UserAvatar user={sprint.creator} size="sm" />
                                                            <div className="min-w-0">
                                                                <p className="truncate text-sm font-black text-[#17211d]">{sprint.creator?.name}</p>
                                                                <p className="text-xs font-bold text-[#66736d]">
                                                                    {tl('Starts {date}', { date: formatDate(sprint.starts_at) })}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {showUsers && (
                            <section className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="font-display text-2xl font-black text-[#17211d]">{tl('Users')}</h2>
                                    <span className="rounded-full bg-[#f5f3ea] px-3 py-1 text-xs font-black text-[#66736d]">
                                        {results?.counts?.users || 0}
                                    </span>
                                </div>
                                <div className="space-y-4">
                                    {users.map((user) => (
                                        <Link
                                            key={user.id}
                                            href={route('users.show', routeKey(user))}
                                            className="block rounded-3xl border border-black/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                                        >
                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                                                <UserAvatar user={user} size="xl" />
                                                <div className="min-w-0 flex-1 space-y-3">
                                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                                        <div>
                                                            <h3 className="font-display text-2xl font-black text-[#17211d]">{user.name}</h3>
                                                            {user.bio && (
                                                                <p className="mt-1 max-w-3xl text-sm leading-7 text-[#66736d] line-clamp-2">
                                                                    {user.bio}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <span className="rounded-full bg-[#f5f3ea] px-3 py-1 text-xs font-black text-[#66736d]">
                                                            {tl('Visible profile')}
                                                        </span>
                                                    </div>

                                                    <div className="flex flex-wrap gap-3 text-sm font-bold text-[#66736d]">
                                                        {user.location && (
                                                            <span className="inline-flex items-center gap-2 rounded-full bg-[#fbfaf5] px-4 py-2">
                                                                <MapPinIcon className="h-4 w-4 text-[#d8604c]" />
                                                                {user.location}
                                                            </span>
                                                        )}
                                                        <span className="inline-flex items-center gap-2 rounded-full bg-[#fbfaf5] px-4 py-2">
                                                            <MagnifyingGlassIcon className="h-4 w-4 text-[#267f5e]" />
                                                            {tl('Joined {date}', {
                                                                date: formatDate(user.created_at, { month: 'long', year: 'numeric' }),
                                                            })}
                                                        </span>
                                                        {user.show_stats && (
                                                            <>
                                                                <span className="inline-flex items-center gap-2 rounded-full bg-[#fbfaf5] px-4 py-2">
                                                                    <UserGroupIcon className="h-4 w-4 text-[#3a78c2]" />
                                                                    {user.followers_count || 0} {tl('Followers')}
                                                                </span>
                                                                <span className="inline-flex items-center gap-2 rounded-full bg-[#fbfaf5] px-4 py-2">
                                                                    <SparklesIcon className="h-4 w-4 text-[#267f5e]" />
                                                                    {user.created_sprints_count || 0} {tl('Sprints')}
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                )}
            </div>
        </PublicSprintLayout>
    );
}
