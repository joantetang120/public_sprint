import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Zap, TrendingUp, Users, Trophy, Plus, ArrowRight, Calendar, Target, MessageSquare, Sparkles } from 'lucide-react';
import PublicSprintLayout from '@/Layouts/PublicSprintLayout';
import UserAvatar from '@/Components/UserAvatar';

export default function Dashboard({ auth, updates = [], stats = {} }) {
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <PublicSprintLayout>
            <Head title="Dashboard - PublicSprint" />

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="space-y-8">
                        {/* Welcome Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-8 text-white"
                        >
                            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
                                <div className="mb-6 lg:mb-0">
                                    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                                        <Sparkles className="w-4 h-4" />
                                        <span className="text-sm font-semibold">
                                            {getGreeting()}
                                        </span>
                                    </div>
                                    <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                                        Welcome back, {auth.user.name}!
                                    </h1>
                                    <p className="text-green-100 text-lg">
                                        {stats.active_sprints > 0 
                                            ? `You have ${stats.active_sprints} active sprint${stats.active_sprints > 1 ? 's' : ''} in progress` 
                                            : "Ready to start building something amazing?"}
                                    </p>
                                </div>
                                <Link
                                    href={route('sprints.create')}
                                    className="group px-6 py-3 bg-white text-green-600 rounded-lg font-semibold hover:scale-105 transition-all flex items-center space-x-2 shadow-lg"
                                >
                                    <Plus className="w-5 h-5" />
                                    <span>New Sprint</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </motion.div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                                        <Target className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-600 mb-1">Active Sprints</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {stats.active_sprints || 0}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                                        <Zap className="w-6 h-6 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-600 mb-1">Current Streak</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {stats.current_streak || 0} <span className="text-lg">🔥</span>
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                                        <Trophy className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-600 mb-1">Total Likes</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {stats.total_likes || 0}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                                        <MessageSquare className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-600 mb-1">Updates Posted</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {stats.updates_posted || 0}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Recent Activity Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-white rounded-xl border border-gray-200"
                        >
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 mb-1">
                                            Recent Activity
                                        </h2>
                                        <p className="text-sm text-gray-600">Your latest updates and progress</p>
                                    </div>
                                    <Link 
                                        href="/discover" 
                                        className="text-sm font-semibold text-green-600 hover:text-green-700 flex items-center space-x-1"
                                    >
                                        <span>View all</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>

                            {updates && updates.length > 0 ? (
                                <div className="divide-y divide-gray-200">
                                    {updates.map((update, i) => (
                                        <Link
                                            key={update.id}
                                            href={route('sprints.show', update.sprint_id)}
                                        >
                                            <div className="p-6 hover:bg-gray-50 transition-colors cursor-pointer">
                                                <div className="flex items-start space-x-4">
                                                    <UserAvatar 
                                                        user={update.user}
                                                        size="lg"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center space-x-2 mb-2">
                                                            <span className="font-semibold text-gray-900">
                                                                {update.user?.name}
                                                            </span>
                                                            <span className="text-gray-400 text-sm">•</span>
                                                            <span className="text-gray-500 text-sm">
                                                                posted in
                                                            </span>
                                                            <span className="font-semibold text-green-600 text-sm truncate">
                                                                {update.sprint?.title}
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-700 leading-relaxed line-clamp-2">
                                                            {update.content}
                                                        </p>
                                                        <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                                                            <span>Day {update.day_number}</span>
                                                            <span>•</span>
                                                            <span>{new Date(update.created_at).toLocaleDateString()}</span>
                                                            {update.images && update.images.length > 0 && (
                                                                <>
                                                                    <span>•</span>
                                                                    <span>📸 {update.images.length} image{update.images.length > 1 ? 's' : ''}</span>
                                                                </>
                                                            )}
                                                            {update.links && update.links.length > 0 && (
                                                                <>
                                                                    <span>•</span>
                                                                    <span>🔗 {update.links.length} link{update.links.length > 1 ? 's' : ''}</span>
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
                                    <div className="max-w-sm mx-auto">
                                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                                            <MessageSquare className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            No updates yet
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-6">
                                            Join a sprint and start sharing your progress with the community
                                        </p>
                                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                            <Link
                                                href="/discover"
                                                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-lg transition-colors"
                                            >
                                                <span>Discover Sprints</span>
                                                <ArrowRight className="w-4 h-4" />
                                            </Link>
                                            <Link
                                                href={route('sprints.create')}
                                                className="inline-flex items-center space-x-2 px-5 py-2.5 border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                <Plus className="w-4 h-4" />
                                                <span>Start Sprint</span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>

                        {/* Quick Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        >
                            <Link
                                href="/discover"
                                className="bg-white p-6 rounded-xl border border-gray-200 hover:border-green-500 hover:shadow-md transition-all group"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                        <TrendingUp className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Discover Sprints</h3>
                                        <p className="text-sm text-gray-600">Find inspiring projects to join</p>
                                    </div>
                                </div>
                            </Link>

                            <Link
                                href={route('sprints.index')}
                                className="bg-white p-6 rounded-xl border border-gray-200 hover:border-green-500 hover:shadow-md transition-all group"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                                        <Users className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">My Sprints</h3>
                                        <p className="text-sm text-gray-600">Manage all your active projects</p>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>
        </PublicSprintLayout>
    );
}