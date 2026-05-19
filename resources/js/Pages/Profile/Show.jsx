import { Head, Link, router } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowRightOnRectangleIcon,
    ArrowTopRightOnSquareIcon,
    BoltIcon,
    CalendarDaysIcon,
    EllipsisHorizontalIcon,
    EnvelopeIcon,
    ExclamationTriangleIcon,
    GlobeAltIcon,
    HeartIcon,
    LockClosedIcon,
    MapPinIcon,
    PencilSquareIcon,
    SparklesIcon,
    TrophyIcon,
    UserGroupIcon,
    UserMinusIcon,
    UserPlusIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import PublicSprintLayout from '@/Layouts/PublicSprintLayout';
import ActivityPulseStrip from '@/Components/ActivityPulseStrip';
import UserAvatar from '@/Components/UserAvatar';
import { routeKey } from '@/lib/routeKey';
import { useLanguage } from '@/Contexts/LanguageContext';

export default function Show({
    auth,
    profile,
    stats,
    isFollowing,
    isOwnProfile,
    followers = [],
    followingUsers = [],
}) {
    const { tl, formatDate } = useLanguage();
    const [following, setFollowing] = useState(isFollowing);
    const [showFollowersModal, setShowFollowersModal] = useState(false);
    const [showFollowingModal, setShowFollowingModal] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showActionMenu, setShowActionMenu] = useState(false);
    const [localFollowing, setLocalFollowing] = useState({});

    const handleFollow = () => {
        if (!auth.user) {
            router.visit(route('login'));
            return;
        }

        const endpoint = following ? 'users.unfollow' : 'users.follow';
        setFollowing(!following);

        router.post(route(endpoint, profile.ulid ?? profile.id), {}, {
            preserveScroll: true,
            preserveState: true,
            onError: () => setFollowing(following),
        });
    };

    const handleFollowUser = (userId, userRouteKey, isCurrentlyFollowing) => {
        if (!auth.user) {
            router.visit(route('login'));
            return;
        }

        const endpoint = isCurrentlyFollowing ? 'users.unfollow' : 'users.follow';

        setLocalFollowing((prev) => ({
            ...prev,
            [userId]: !isCurrentlyFollowing,
        }));

        router.post(route(endpoint, userRouteKey), {}, {
            preserveScroll: true,
            preserveState: true,
            onError: () => {
                setLocalFollowing((prev) => ({
                    ...prev,
                    [userId]: isCurrentlyFollowing,
                }));
            },
        });
    };

    const handleLogout = () => {
        router.post(route('logout'), {}, {
            onSuccess: () => setShowLogoutModal(false),
        });
    };

    const isFollowingUser = (userId) => {
        if (localFollowing[userId] !== undefined) {
            return localFollowing[userId];
        }

        return followingUsers.some((user) => user.id === userId);
    };

    const getSprintStatusClass = (status) => {
        if (status === 'active') {
            return 'bg-[#b7f34a] text-[#17211d]';
        }

        if (status === 'upcoming') {
            return 'bg-[#dcecff] text-[#183d63]';
        }

        return 'bg-[#17211d] text-white';
    };

    if (!profile.profile_public && !isOwnProfile) {
        return (
            <PublicSprintLayout>
                <Head title={`${profile.name} - ${tl('Profile')}`} />
                <div className="mx-auto max-w-3xl py-8">
                    <div className="ps-empty-state">
                        <div className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-full bg-[#17211d] text-white">
                            <LockClosedIcon className="h-10 w-10" />
                        </div>
                        <h2 className="font-display text-3xl font-black text-[#17211d]">
                            {tl('This Profile is Private')}
                        </h2>
                        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#66736d]">
                            {profile.name} {tl('has set their profile to private.')}
                        </p>
                    </div>
                </div>
            </PublicSprintLayout>
        );
    }

    return (
        <PublicSprintLayout>
            <Head title={`${profile.name} - ${tl('Profile')}`} />

            <div className="space-y-6">
                <motion.section
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="ps-feed-card overflow-hidden"
                >
                    <div className="ps-card-cover min-h-[260px] px-6 py-6 sm:px-8">
                        {profile.cover_image && (
                            <img
                                src={`/storage/${profile.cover_image}`}
                                alt="Cover"
                                className="absolute inset-0 h-full w-full object-cover"
                            />
                        )}
                        <div className="relative z-10 flex min-h-[212px] flex-col gap-5">
                            <div className="max-w-xl">
                                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/12 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white backdrop-blur-sm">
                                    <SparklesIcon className="h-4 w-4 text-[#b7f34a]" />
                                    {isOwnProfile ? tl('Profile') : tl('Public Profile')}
                                </div>
                                <ActivityPulseStrip compact />
                            </div>

                            <div className="mt-auto flex w-full items-center justify-end gap-3 lg:self-end">
                                <div className="relative sm:hidden">
                                    <button
                                        onClick={() => setShowActionMenu((open) => !open)}
                                        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/12 text-white backdrop-blur-sm transition hover:bg-white/20"
                                    >
                                        <EllipsisHorizontalIcon className="h-6 w-6" />
                                    </button>

                                    {showActionMenu && (
                                        <div className="absolute bottom-full right-0 z-20 mb-2 min-w-[12rem] overflow-hidden rounded-2xl border border-black/10 bg-white p-2 shadow-2xl">
                                            {isOwnProfile ? (
                                                <>
                                                    <Link
                                                        href={route('profile.edit')}
                                                        onClick={() => setShowActionMenu(false)}
                                                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-[#17211d] transition hover:bg-[#f5f3ea]"
                                                    >
                                                        <PencilSquareIcon className="h-5 w-5" />
                                                        <span>{tl('Edit Profile')}</span>
                                                    </Link>
                                                    <button
                                                        onClick={() => {
                                                            setShowActionMenu(false);
                                                            setShowLogoutModal(true);
                                                        }}
                                                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold text-[#17211d] transition hover:bg-[#f5f3ea]"
                                                    >
                                                        <ArrowRightOnRectangleIcon className="h-5 w-5" />
                                                        <span>{tl('Logout')}</span>
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => {
                                                            setShowActionMenu(false);
                                                            handleFollow();
                                                        }}
                                                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold text-[#17211d] transition hover:bg-[#f5f3ea]"
                                                    >
                                                        {following ? <UserMinusIcon className="h-5 w-5" /> : <UserPlusIcon className="h-5 w-5" />}
                                                        <span>{following ? tl('Unfollow') : tl('Follow')}</span>
                                                    </button>
                                                    {profile.show_email && profile.email && (
                                                        <a
                                                            href={`mailto:${profile.email}`}
                                                            onClick={() => setShowActionMenu(false)}
                                                            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-[#17211d] transition hover:bg-[#f5f3ea]"
                                                        >
                                                            <EnvelopeIcon className="h-5 w-5" />
                                                            <span>{tl('Email')}</span>
                                                        </a>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="ml-auto hidden flex-wrap items-center gap-3 sm:flex">
                                    {isOwnProfile ? (
                                        <>
                                            <Link href={route('profile.edit')} className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-[#17211d] shadow-sm transition hover:bg-[#f3ffcf]">
                                                <PencilSquareIcon className="h-5 w-5" />
                                                <span>{tl('Edit Profile')}</span>
                                            </Link>
                                            <button
                                                onClick={() => setShowLogoutModal(true)}
                                                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white/20"
                                            >
                                                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                                                <span>{tl('Logout')}</span>
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={handleFollow}
                                                className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-black transition ${
                                                    following
                                                        ? 'border border-white/20 bg-white/10 text-white hover:bg-white/20'
                                                        : 'bg-[#b7f34a] text-[#17211d] hover:bg-[#c5fb62]'
                                                }`}
                                            >
                                                {following ? <UserMinusIcon className="h-5 w-5" /> : <UserPlusIcon className="h-5 w-5" />}
                                                <span>{following ? tl('Unfollow') : tl('Follow')}</span>
                                            </button>
                                            {profile.show_email && profile.email && (
                                                <a
                                                    href={`mailto:${profile.email}`}
                                                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white/20"
                                                >
                                                    <EnvelopeIcon className="h-5 w-5" />
                                                    <span>{tl('Email')}</span>
                                                </a>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white px-6 pb-6 pt-5 sm:px-8">
                        <div className="-mt-20 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                            <div className="flex flex-col gap-4 items-start">
                                <UserAvatar user={profile} size="2xl" className="self-start shadow-2xl" />
                                <div className="space-y-2 pl-1">
                                    <h1 className="font-display text-3xl font-black text-[#17211d] sm:text-4xl">
                                        {profile.name}
                                    </h1>
                                    {profile.bio && (
                                        <p className="max-w-2xl text-sm leading-7 text-[#66736d] sm:text-base">
                                            {profile.bio}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <button
                                    onClick={() => setShowFollowersModal(true)}
                                    className="ps-sticker normal-case"
                                >
                                    <UserGroupIcon className="h-4 w-4" />
                                    <span>{stats.followers_count} {tl('Followers')}</span>
                                </button>
                                <button
                                    onClick={() => setShowFollowingModal(true)}
                                    className="ps-sticker normal-case"
                                >
                                    <UserGroupIcon className="h-4 w-4" />
                                    <span>{stats.following_count} {tl('Following')}</span>
                                </button>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-wrap gap-3 text-sm font-bold text-[#66736d]">
                            {profile.show_email && profile.email && (
                                <span className="inline-flex items-center gap-2 rounded-full bg-[#f5f3ea] px-4 py-2">
                                    <EnvelopeIcon className="h-4 w-4 text-[#267f5e]" />
                                    {profile.email}
                                </span>
                            )}
                            {profile.location && (
                                <span className="inline-flex items-center gap-2 rounded-full bg-[#f5f3ea] px-4 py-2">
                                    <MapPinIcon className="h-4 w-4 text-[#d8604c]" />
                                    {profile.location}
                                </span>
                            )}
                            {profile.website && (
                                <a
                                    href={profile.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-full bg-[#f5f3ea] px-4 py-2 transition hover:bg-[#ebf7ff] hover:text-[#183d63]"
                                >
                                    <GlobeAltIcon className="h-4 w-4 text-[#3a78c2]" />
                                    <span className="max-w-[18rem] truncate">{profile.website}</span>
                                    <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                                </a>
                            )}
                            <span className="inline-flex items-center gap-2 rounded-full bg-[#f5f3ea] px-4 py-2">
                                <CalendarDaysIcon className="h-4 w-4 text-[#17211d]" />
                                {tl('Joined {date}', {
                                    date: formatDate(profile.created_at, { month: 'long', year: 'numeric' }),
                                })}
                            </span>
                        </div>
                    </div>
                </motion.section>

                {(profile.show_stats || isOwnProfile) && (
                    <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                        <StatCard icon={SparklesIcon} label={tl('Total Sprints')} value={stats.total_sprints} accent="text-[#267f5e]" />
                        <StatCard icon={BoltIcon} label={tl('Current Streak')} value={stats.current_streak} suffix="🔥" accent="text-[#d8604c]" />
                        <StatCard icon={TrophyIcon} label={tl('Completed')} value={stats.sprints_completed} accent="text-[#17211d]" />
                        <StatCard icon={HeartIcon} label={tl('Total Likes')} value={stats.total_likes} accent="text-[#b44153]" />
                    </section>
                )}

                <motion.section
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="ps-feed-card overflow-hidden"
                >
                    <div className="border-b border-black/10 px-6 py-5 sm:px-8">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <h2 className="font-display text-2xl font-black text-[#17211d]">
                                    {tl('Recent Sprints')}
                                </h2>
                                <p className="text-sm font-bold text-[#66736d]">
                                    {tl('Sprints {name} is participating in', { name: profile.name })}
                                </p>
                            </div>
                            <span className="ps-sticker normal-case">
                                <SparklesIcon className="h-4 w-4" />
                                {profile.sprints?.length || 0} {tl('Sprints')}
                            </span>
                        </div>
                    </div>

                    {profile.sprints && profile.sprints.length > 0 ? (
                        <div className="divide-y divide-black/10">
                            {profile.sprints.map((sprint, index) => (
                                <Link
                                    key={sprint.id}
                                    href={route('sprints.show', routeKey(sprint))}
                                    className="block px-6 py-5 transition hover:bg-[#faf8ef] sm:px-8"
                                >
                                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                        <div className="space-y-2">
                                            <div className="flex flex-wrap items-center gap-3">
                                                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black uppercase ${getSprintStatusClass(sprint.status)}`}>
                                                    {tl(sprint.status)}
                                                </span>
                                                <span className="text-xs font-black uppercase tracking-[0.16em] text-[#66736d]">
                                                    #{String(index + 1).padStart(2, '0')}
                                                </span>
                                            </div>
                                            <h3 className="font-display text-2xl font-black text-[#17211d]">
                                                {sprint.title}
                                            </h3>
                                            {sprint.description && (
                                                <p className="max-w-3xl text-sm leading-7 text-[#66736d]">
                                                    {sprint.description}
                                                </p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-3 gap-2 sm:min-w-[270px]">
                                            <SprintMetric label={tl('Score')} value={sprint.pivot.score || 0} />
                                            <SprintMetric label={tl('Updates')} value={sprint.pivot.updates_posted || 0} />
                                            <SprintMetric label={tl('Likes')} value={sprint.pivot.reactions_received || 0} />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="ps-empty-state rounded-none border-0 shadow-none">
                            <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-[#17211d] text-white">
                                <SparklesIcon className="h-8 w-8" />
                            </div>
                            <p className="text-sm font-bold text-[#66736d]">{tl('No sprints yet')}</p>
                        </div>
                    )}
                </motion.section>
            </div>

            <PeopleModal
                open={showFollowersModal}
                onClose={() => setShowFollowersModal(false)}
                title={`${tl('Followers')} (${stats.followers_count})`}
                users={followers}
                auth={auth}
                onToggleFollow={handleFollowUser}
                isFollowingUser={isFollowingUser}
            />

            <PeopleModal
                open={showFollowingModal}
                onClose={() => setShowFollowingModal(false)}
                title={`${tl('Following')} (${stats.following_count})`}
                users={followingUsers}
                auth={auth}
                onToggleFollow={handleFollowUser}
                isFollowingUser={isFollowingUser}
            />

            <AnimatePresence>
                {showLogoutModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#17211d]/70 p-4 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.96 }}
                            className="ps-modal-surface w-full max-w-md overflow-hidden"
                        >
                            <div className="ps-card-cover min-h-0 px-6 py-6 text-white">
                                <div className="relative z-10 text-center">
                                    <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-white/14">
                                        <ExclamationTriangleIcon className="h-8 w-8" />
                                    </div>
                                    <h3 className="font-display text-2xl font-black">{tl('Confirm Logout')}</h3>
                                </div>
                            </div>
                            <div className="space-y-6 bg-white p-6">
                                <p className="text-center text-sm leading-7 text-[#66736d]">
                                    {tl("Are you sure you want to logout? You'll need to sign in again to access your account.")}
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowLogoutModal(false)}
                                        className="flex-1 rounded-full border border-black/10 bg-[#f5f3ea] px-5 py-3 text-sm font-black text-[#17211d] transition hover:bg-[#ece8dc]"
                                    >
                                        {tl('Cancel')}
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#17211d] px-5 py-3 text-sm font-black text-white transition hover:bg-[#0f1714]"
                                    >
                                        <ArrowRightOnRectangleIcon className="h-5 w-5" />
                                        <span>{tl('Logout')}</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </PublicSprintLayout>
    );
}

function StatCard({ icon: Icon, label, value, suffix = '', accent }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="ps-feed-card p-5"
        >
            <div className="mb-4 flex items-center justify-between">
                <div className={`grid h-11 w-11 place-items-center rounded-full bg-[#f5f3ea] ${accent}`}>
                    <Icon className="h-5 w-5" />
                </div>
            </div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#66736d]">{label}</p>
            <p className="mt-2 font-display text-3xl font-black text-[#17211d]">
                {value} {suffix}
            </p>
        </motion.div>
    );
}

function SprintMetric({ label, value }) {
    return (
        <div className="rounded-lg border border-black/10 bg-[#fbfaf5] px-3 py-3 text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#66736d]">{label}</p>
            <p className="mt-2 text-xl font-black text-[#17211d]">{value}</p>
        </div>
    );
}

function PeopleModal({ open, onClose, title, users, auth, onToggleFollow, isFollowingUser }) {
    const { tl } = useLanguage();

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#17211d]/70 p-4 backdrop-blur-sm" onClick={onClose}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        onClick={(event) => event.stopPropagation()}
                        className="ps-modal-surface flex max-h-[80vh] w-full max-w-xl flex-col overflow-hidden"
                    >
                        <div className="border-b border-black/10 bg-white px-6 py-5">
                            <div className="flex items-center justify-between gap-4">
                                <h2 className="font-display text-2xl font-black text-[#17211d]">{title}</h2>
                                <button
                                    onClick={onClose}
                                    className="grid h-10 w-10 place-items-center rounded-full bg-[#f5f3ea] text-[#17211d] transition hover:bg-[#ece8dc]"
                                >
                                    <XMarkIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        <div className="overflow-y-auto bg-white">
                            {users && users.length > 0 ? (
                                <div className="divide-y divide-black/10">
                                    {users.map((user) => {
                                        const followingThisUser = isFollowingUser(user.id);
                                        const isOwnAccount = auth.user?.id === user.id;

                                        return (
                                            <div key={user.id} className="flex items-center gap-4 px-6 py-4 transition hover:bg-[#faf8ef]">
                                                <Link href={route('users.show', routeKey(user))}>
                                                    <UserAvatar user={user} size="lg" />
                                                </Link>
                                                <Link href={route('users.show', routeKey(user))} className="min-w-0 flex-1">
                                                    <p className="truncate text-sm font-black text-[#17211d]">{user.name}</p>
                                                    {user.bio && (
                                                        <p className="truncate text-sm text-[#66736d]">{user.bio}</p>
                                                    )}
                                                </Link>
                                                {!isOwnAccount && auth.user && (
                                                    <button
                                                        onClick={() => onToggleFollow(user.id, routeKey(user), followingThisUser)}
                                                        className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.12em] transition ${
                                                            followingThisUser
                                                                ? 'border border-black/10 bg-[#f5f3ea] text-[#17211d] hover:bg-[#ece8dc]'
                                                                : 'bg-[#b7f34a] text-[#17211d] hover:bg-[#c5fb62]'
                                                        }`}
                                                    >
                                                        {followingThisUser ? tl('Following') : tl('Follow')}
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="ps-empty-state rounded-none border-0 shadow-none">
                                    <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-[#17211d] text-white">
                                        <UserGroupIcon className="h-8 w-8" />
                                    </div>
                                    <p className="text-sm font-bold text-[#66736d]">
                                        {title.startsWith(tl('Followers')) ? tl('No followers yet') : tl('Not following anyone yet')}
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
