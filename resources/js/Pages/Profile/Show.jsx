import { Head, Link, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    MapPin, Globe, Calendar, Zap, Trophy, Heart, Users, Target,
    UserPlus, UserMinus, Edit, Mail, X, LogOut, AlertTriangle
} from 'lucide-react';
import { useState } from 'react';
import PublicSprintLayout from '@/Layouts/PublicSprintLayout';
import UserAvatar from '@/Components/UserAvatar';
import { routeKey } from '@/lib/routeKey';
import { useLanguage } from '@/Contexts/LanguageContext';

export default function Show({ auth, profile, stats, isFollowing, isOwnProfile, followers = [], followingUsers = [] }) {
    const { tl, formatDate } = useLanguage();
    const [following, setFollowing] = useState(isFollowing);
    const [showFollowersModal, setShowFollowersModal] = useState(false);
    const [showFollowingModal, setShowFollowingModal] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [localFollowing, setLocalFollowing] = useState({});

    const handleFollow = () => {
        if (!auth.user) {
            router.visit(route('login'));
            return;
        }

        const endpoint = following ? 'users.unfollow' : 'users.follow';
        
        // Optimistic update
        setFollowing(!following);

        router.post(route(endpoint, profile.ulid ?? profile.id), {}, {
            preserveScroll: true,
            preserveState: true,
            onError: () => {
                // Revert on error
                setFollowing(following);
            }
        });
    };

    const handleFollowUser = (userId, userRouteKey, isCurrentlyFollowing) => {
        if (!auth.user) {
            router.visit(route('login'));
            return;
        }

        const endpoint = isCurrentlyFollowing ? 'users.unfollow' : 'users.follow';
        
        // Optimistic update
        setLocalFollowing(prev => ({
            ...prev,
            [userId]: !isCurrentlyFollowing
        }));

        router.post(route(endpoint, userRouteKey), {}, {
            preserveScroll: true,
            preserveState: true,
            onError: () => {
                // Revert on error
                setLocalFollowing(prev => ({
                    ...prev,
                    [userId]: isCurrentlyFollowing
                }));
            }
        });
    };

    const isFollowingUser = (userId) => {
        if (localFollowing[userId] !== undefined) {
            return localFollowing[userId];
        }
        return followingUsers.some(u => u.id === userId);
    };

    const handleLogout = () => {
        router.post(route('logout'), {}, {
            onSuccess: () => {
                setShowLogoutModal(false);
            }
        });
    };

    const getAvatarUrl = () => {
        if (profile.avatar) {
            return `/storage/${profile.avatar}`;
        }
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&size=200&background=random`;
    };

    // Check if profile is private and user is not the owner
    if (!profile.profile_public && !isOwnProfile) {
        return (
            <PublicSprintLayout>
                <Head title={`${profile.name} - ${tl('Profile')}`} />
                <div className="max-w-2xl mx-auto py-12 px-4">
                    <div className="bg-white dark:bg-dark-900 rounded-2xl border-2 border-gray-200 dark:border-dark-700 p-12 text-center">
                        <div className="w-20 h-20 bg-gray-100 dark:bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="w-10 h-10 text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {tl('This Profile is Private')}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
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
                {/* Profile Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-dark-900 rounded-2xl border-2 border-gray-200 dark:border-dark-700 overflow-hidden"
                >
                    {/* Cover */}
                    <div className="h-32 bg-gradient-to-r from-primary-600 to-purple-600 relative">
                        {profile.cover_image && (
                            <img 
                                src={`/storage/${profile.cover_image}`}
                                alt="Cover"
                                className="w-full h-full object-cover absolute inset-0"
                            />
                        )}
                    </div>
                    
                    {/* Profile Info */}
                    <div className="px-8 pb-8">
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 mb-6">
                            <div className="flex items-end space-x-4">
                                <img 
                                    src={getAvatarUrl()}
                                    alt={profile.name}
                                    className="w-32 h-32 rounded-2xl border-4 border-white dark:border-dark-900 shadow-xl relative z-10"
                                />
                                <div className="pb-2">
                                    <h1 className="text-3xl font-black text-gray-900 dark:text-white">
                                        {profile.name}
                                    </h1>
                                    {profile.bio && (
                                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                                            {profile.bio}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex space-x-3 mt-4 md:mt-0">
                                {isOwnProfile ? (
                                    <>
                                        <Link
                                            href={route('profile.edit')}
                                            className="px-6 py-3 bg-gray-100 dark:bg-dark-800 text-gray-900 dark:text-white rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-dark-700 transition-colors flex items-center space-x-2"
                                        >
                                            <Edit className="w-5 h-5" />
                                            <span>{tl('Edit Profile')}</span>
                                        </Link>
                                        <button
                                            onClick={() => setShowLogoutModal(true)}
                                            className="px-6 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-semibold hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex items-center space-x-2"
                                        >
                                            <LogOut className="w-5 h-5" />
                                            <span>{tl('Logout')}</span>
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={handleFollow}
                                            className={`px-6 py-3 rounded-xl font-semibold transition-colors flex items-center space-x-2 ${
                                                following
                                                    ? 'bg-gray-100 dark:bg-dark-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-dark-700'
                                                    : 'bg-primary-600 hover:bg-primary-700 text-white'
                                            }`}
                                        >
                                            {following ? (
                                                <>
                                                    <UserMinus className="w-5 h-5" />
                                                    <span>{tl('Unfollow')}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <UserPlus className="w-5 h-5" />
                                                    <span>{tl('Follow')}</span>
                                                </>
                                            )}
                                        </button>
                                        <button className="px-6 py-3 bg-gray-100 dark:bg-dark-800 text-gray-900 dark:text-white rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-dark-700 transition-colors">
                                            <Mail className="w-5 h-5" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Meta Info */}
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                            {profile.show_email && profile.email && (
                                <div className="flex items-center space-x-1">
                                    <Mail className="w-4 h-4" />
                                    <span>{profile.email}</span>
                                </div>
                            )}
                            {profile.location && (
                                <div className="flex items-center space-x-1">
                                    <MapPin className="w-4 h-4" />
                                    <span>{profile.location}</span>
                                </div>
                            )}
                            {profile.website && (
                                <a 
                                    href={profile.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center space-x-1 hover:text-primary-600 dark:hover:text-primary-400"
                                >
                                    <Globe className="w-4 h-4" />
                                    <span>{profile.website}</span>
                                </a>
                            )}
                            <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>{tl('Joined {date}', { date: formatDate(profile.created_at, { month: 'long', year: 'numeric' }) })}</span>
                            </div>
                        </div>

                        {/* Followers/Following */}
                        <div className="flex space-x-6 mt-4">
                            <button
                                onClick={() => setShowFollowersModal(true)}
                                className="hover:underline transition-all"
                            >
                                <span className="font-bold text-gray-900 dark:text-white">{stats.followers_count}</span>
                                <span className="text-gray-600 dark:text-gray-400 ml-1">{tl('Followers')}</span>
                            </button>
                            <button
                                onClick={() => setShowFollowingModal(true)}
                                className="hover:underline transition-all"
                            >
                                <span className="font-bold text-gray-900 dark:text-white">{stats.following_count}</span>
                                <span className="text-gray-600 dark:text-gray-400 ml-1">{tl('Following')}</span>
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                {(profile.show_stats || isOwnProfile) && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white dark:bg-dark-900 p-6 rounded-xl border-2 border-gray-200 dark:border-dark-700"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                                <Target className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                            </div>
                        </div>
                        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">{tl('Total Sprints')}</p>
                        <p className="text-3xl font-black text-gray-900 dark:text-white">
                            {stats.total_sprints}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white dark:bg-dark-900 p-6 rounded-xl border-2 border-gray-200 dark:border-dark-700"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                                <Zap className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                            </div>
                        </div>
                        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">{tl('Current Streak')}</p>
                        <p className="text-3xl font-black text-gray-900 dark:text-white">
                            {stats.current_streak} 🔥
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white dark:bg-dark-900 p-6 rounded-xl border-2 border-gray-200 dark:border-dark-700"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <Trophy className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">{tl('Completed')}</p>
                        <p className="text-3xl font-black text-gray-900 dark:text-white">
                            {stats.sprints_completed}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white dark:bg-dark-900 p-6 rounded-xl border-2 border-gray-200 dark:border-dark-700"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                <Heart className="w-6 h-6 text-red-600 dark:text-red-400" />
                            </div>
                        </div>
                        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">{tl('Total Likes')}</p>
                        <p className="text-3xl font-black text-gray-900 dark:text-white">
                            {stats.total_likes}
                        </p>
                    </motion.div>
                </div>
                )}

                {/* Recent Sprints */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white dark:bg-dark-900 rounded-2xl border-2 border-gray-200 dark:border-dark-700 overflow-hidden"
                >
                    <div className="p-6 border-b-2 border-gray-200 dark:border-dark-700">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            {tl('Recent Sprints')}
                        </h2>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {tl('Sprints {name} is participating in', { name: profile.name })}
                        </p>
                    </div>

                    {profile.sprints && profile.sprints.length > 0 ? (
                        <div className="divide-y divide-gray-200 dark:divide-dark-800">
                            {profile.sprints.map((sprint) => (
                                <Link
                                    key={sprint.id}
                                    href={route('sprints.show', routeKey(sprint))}
                                    className="block p-6 hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                                                {sprint.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                                                {sprint.description}
                                            </p>
                                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                                                <span>{tl('Score')}: {sprint.pivot.score || 0}</span>
                                                <span>{tl('Updates')}: {sprint.pivot.updates_posted || 0}</span>
                                                <span>{tl('Likes')}: {sprint.pivot.reactions_received || 0}</span>
                                            </div>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                            sprint.status === 'active' 
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                : sprint.status === 'upcoming'
                                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                                        }`}>
                                            {tl(sprint.status)}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <Target className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                            <p className="text-gray-500 dark:text-gray-400">
                                {tl('No sprints yet')}
                            </p>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Followers Modal */}
            <AnimatePresence>
                {showFollowersModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowFollowersModal(false)}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-dark-900 rounded-2xl border-2 border-gray-200 dark:border-dark-700 w-full max-w-md max-h-[80vh] overflow-hidden"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-700">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {tl('Followers')} ({stats.followers_count})
                                </h2>
                                <button
                                    onClick={() => setShowFollowersModal(false)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-xl transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                </button>
                            </div>
                            <div className="overflow-y-auto max-h-[60vh]">
                                {followers && followers.length > 0 ? (
                                    <div className="divide-y divide-gray-200 dark:divide-dark-800">
                                        {followers.map((follower) => {
                                            const isFollowingThisUser = isFollowingUser(follower.id);
                                            const isOwnAccount = auth.user?.id === follower.id;
                                            
                                            return (
                                                <div key={follower.id} className="flex items-center space-x-3 p-4 hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors">
                                                    <Link href={route('users.show', routeKey(follower))}>
                                                        <UserAvatar user={follower} size="lg" />
                                                    </Link>
                                                    <Link 
                                                        href={route('users.show', routeKey(follower))}
                                                        className="flex-1 min-w-0"
                                                    >
                                                        <p className="font-bold text-gray-900 dark:text-white truncate hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                                                            {follower.name}
                                                        </p>
                                                        {follower.bio && (
                                                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                                                {follower.bio}
                                                            </p>
                                                        )}
                                                    </Link>
                                                    {!isOwnAccount && auth.user && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleFollowUser(follower.id, routeKey(follower), isFollowingThisUser);
                                                            }}
                                                            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                                                                isFollowingThisUser
                                                                    ? 'bg-gray-100 dark:bg-dark-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-dark-700'
                                                                    : 'bg-primary-600 hover:bg-primary-700 text-white'
                                                            }`}
                                                        >
                                                            {isFollowingThisUser ? tl('Following') : tl('Follow')}
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="p-12 text-center">
                                        <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                                        <p className="text-gray-500 dark:text-gray-400">{tl('No followers yet')}</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Following Modal */}
            <AnimatePresence>
                {showFollowingModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowFollowingModal(false)}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-dark-900 rounded-2xl border-2 border-gray-200 dark:border-dark-700 w-full max-w-md max-h-[80vh] overflow-hidden"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-700">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {tl('Following')} ({stats.following_count})
                                </h2>
                                <button
                                    onClick={() => setShowFollowingModal(false)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-xl transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                </button>
                            </div>
                            <div className="overflow-y-auto max-h-[60vh]">
                                {followingUsers && followingUsers.length > 0 ? (
                                    <div className="divide-y divide-gray-200 dark:divide-dark-800">
                                        {followingUsers.map((user) => {
                                            const isFollowingThisUser = isFollowingUser(user.id);
                                            const isOwnAccount = auth.user?.id === user.id;
                                            
                                            return (
                                                <div key={user.id} className="flex items-center space-x-3 p-4 hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors">
                                                    <Link href={route('users.show', routeKey(user))}>
                                                        <UserAvatar user={user} size="lg" />
                                                    </Link>
                                                    <Link 
                                                        href={route('users.show', routeKey(user))}
                                                        className="flex-1 min-w-0"
                                                    >
                                                        <p className="font-bold text-gray-900 dark:text-white truncate hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                                                            {user.name}
                                                        </p>
                                                        {user.bio && (
                                                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                                                {user.bio}
                                                            </p>
                                                        )}
                                                    </Link>
                                                    {!isOwnAccount && auth.user && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleFollowUser(user.id, routeKey(user), isFollowingThisUser);
                                                            }}
                                                            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                                                                isFollowingThisUser
                                                                    ? 'bg-gray-100 dark:bg-dark-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-dark-700'
                                                                    : 'bg-primary-600 hover:bg-primary-700 text-white'
                                                            }`}
                                                        >
                                                            {isFollowingThisUser ? tl('Following') : tl('Follow')}
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="p-12 text-center">
                                        <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                                        <p className="text-gray-500 dark:text-gray-400">{tl('Not following anyone yet')}</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Logout Confirmation Modal */}
                {showLogoutModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-dark-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border-2 border-gray-200 dark:border-dark-700"
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-red-500 to-red-600 p-6">
                                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-white/20 backdrop-blur-sm rounded-full">
                                    <AlertTriangle className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-white text-center">
                                    {tl('Confirm Logout')}
                                </h3>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                                    {tl("Are you sure you want to logout? You'll need to sign in again to access your account.")}
                                </p>

                                {/* Actions */}
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => setShowLogoutModal(false)}
                                        className="flex-1 px-6 py-3 bg-gray-100 dark:bg-dark-800 text-gray-900 dark:text-white rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-dark-700 transition-colors"
                                    >
                                        {tl('Cancel')}
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                                    >
                                        <LogOut className="w-5 h-5" />
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
