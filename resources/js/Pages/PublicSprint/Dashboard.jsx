import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Zap, TrendingUp, Users, Trophy, Plus, ArrowRight, Calendar, Target, MessageSquare, Sparkles, CheckCircle2, Award, Medal, Crown, Star, Flame, Heart } from 'lucide-react';
import { useState } from 'react';
import PublicSprintLayout from '@/Layouts/PublicSprintLayout';
import UserAvatar from '@/Components/UserAvatar';
import SprintProgressCard from '@/Components/SprintProgressCard';
import AISprintSummary from '@/Components/AISprintSummary';
import { getSprintReportPreview, hasSprintReport } from '@/lib/sprintReport';
import { routeKey } from '@/lib/routeKey';

export default function Dashboard({ auth, updates = [], stats = {}, completedSprints = [] }) {
    const [selectedSprint, setSelectedSprint] = useState(null);
    const [activeTab, setActiveTab] = useState('overview'); // overview, summaries

    const sprintsWithSummaries = completedSprints.filter(item => hasSprintReport(item.ai_summary));

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

                        {/* Tab Navigation */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-white rounded-xl border border-gray-200 p-2"
                        >
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setActiveTab('overview')}
                                    className={`flex-1 px-6 py-3 rounded-lg font-bold transition-all ${
                                        activeTab === 'overview'
                                            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    📊 Overview
                                </button>
                                <button
                                    onClick={() => setActiveTab('summaries')}
                                    className={`flex-1 px-6 py-3 rounded-lg font-bold transition-all relative ${
                                        activeTab === 'summaries'
                                            ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    ✨ My Summaries
                                    {sprintsWithSummaries.length > 0 && (
                                        <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-black rounded-full flex items-center justify-center">
                                            {sprintsWithSummaries.length}
                                        </span>
                                    )}
                                </button>
                            </div>
                        </motion.div>

                        {/* Overview Tab */}
                        {activeTab === 'overview' && completedSprints && completedSprints.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="space-y-4"
                            >
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        🏆 Completion History
                                    </h2>
                                    <Link 
                                        href={route('sprints.index')} 
                                        className="text-sm font-semibold text-green-600 hover:text-green-700 flex items-center space-x-1"
                                    >
                                        <span>View all sprints</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {completedSprints.map((item, index) => {
                                        const { sprint, stats, user_rank, user_score, user_badges } = item;
                                        const badges = user_badges || [];
                                        
                                        return (
                                            <Link
                                                key={sprint.id}
                                                href={route('sprints.show', routeKey(sprint))}
                                            >
                                                <motion.div
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.1 * index }}
                                                    className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200 hover:border-green-400 hover:shadow-lg transition-all cursor-pointer group"
                                                >
                                                    {/* Header */}
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div className="flex-1">
                                                            <div className="flex items-center space-x-2 mb-2">
                                                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                                                                <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">Completed</span>
                                                            </div>
                                                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-700 transition-colors line-clamp-2">
                                                                {sprint.title}
                                                            </h3>
                                                        </div>
                                                        {user_rank && user_rank <= 3 && (
                                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                                user_rank === 1 ? 'bg-yellow-400' :
                                                                user_rank === 2 ? 'bg-gray-300' :
                                                                'bg-orange-400'
                                                            }`}>
                                                                {user_rank === 1 && <Crown className="w-5 h-5 text-yellow-900" />}
                                                                {user_rank === 2 && <Medal className="w-5 h-5 text-gray-700" />}
                                                                {user_rank === 3 && <Award className="w-5 h-5 text-orange-900" />}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Your Performance */}
                                                    <div className="bg-white/60 rounded-lg p-4 mb-4">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-sm font-semibold text-gray-700">Your Performance</span>
                                                            {user_rank && (
                                                                <span className="text-sm font-bold text-green-700">Rank #{user_rank}</span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-2xl font-black text-green-600">{user_score}</span>
                                                            <span className="text-sm text-gray-600">points</span>
                                                        </div>
                                                    </div>

                                                    {/* Badges */}
                                                    {badges.length > 0 && (
                                                        <div className="flex flex-wrap gap-2 mb-4">
                                                            {badges.map((badge, i) => (
                                                                <div key={i} className="flex items-center space-x-1 px-2 py-1 bg-white/80 rounded-full text-xs font-semibold">
                                                                    {badge === 'top_contributor' && <><Star className="w-3 h-3 text-purple-600" /><span className="text-purple-700">Top</span></>}
                                                                    {badge === 'daily_streak' && <><Flame className="w-3 h-3 text-orange-600" /><span className="text-orange-700">Streak</span></>}
                                                                    {badge === 'most_helpful' && <><Heart className="w-3 h-3 text-blue-600" /><span className="text-blue-700">Helpful</span></>}
                                                                    {badge === 'early_bird' && <><Zap className="w-3 h-3 text-yellow-600" /><span className="text-yellow-700">Early</span></>}
                                                                    {badge === 'consistent_builder' && <><Target className="w-3 h-3 text-green-600" /><span className="text-green-700">Consistent</span></>}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Sprint Stats */}
                                                    <div className="grid grid-cols-3 gap-2 text-center">
                                                        <div className="bg-white/60 rounded-lg p-2">
                                                            <div className="text-lg font-bold text-gray-900">{stats.total_updates}</div>
                                                            <div className="text-xs text-gray-600">Updates</div>
                                                        </div>
                                                        <div className="bg-white/60 rounded-lg p-2">
                                                            <div className="text-lg font-bold text-gray-900">{stats.active_participants}</div>
                                                            <div className="text-xs text-gray-600">Builders</div>
                                                        </div>
                                                        <div className="bg-white/60 rounded-lg p-2">
                                                            <div className="text-lg font-bold text-gray-900">{stats.completion_rate}%</div>
                                                            <div className="text-xs text-gray-600">Rate</div>
                                                        </div>
                                                    </div>

                                                    {/* Action Buttons */}
                                                    <div className="mt-4 flex items-center space-x-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                setSelectedSprint(item);
                                                            }}
                                                            className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-white text-green-700 rounded-lg font-semibold hover:bg-green-50 transition-colors text-sm border border-green-200"
                                                        >
                                                            <Trophy className="w-4 h-4" />
                                                            <span>Progress Card</span>
                                                        </button>
                                                        <div className="flex items-center space-x-1 text-sm font-semibold text-green-700 group-hover:text-green-800">
                                                            <span>View</span>
                                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}

                        {/* My Summaries Tab */}
                        {activeTab === 'summaries' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold text-gray-900">Sprint Reports</h2>
                                    <span className="text-sm text-gray-600">
                                        {sprintsWithSummaries.length} {sprintsWithSummaries.length === 1 ? 'report' : 'reports'}
                                    </span>
                                </div>

                                {sprintsWithSummaries.length > 0 ? (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                                                    className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200 hover:border-purple-400 hover:shadow-xl transition-all"
                                                >
                                                    {/* Header */}
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div className="flex-1">
                                                            <div className="flex items-center space-x-2 mb-2">
                                                                <Sparkles className="w-5 h-5 text-purple-600" />
                                                                <span className="text-xs font-semibold text-purple-700 uppercase tracking-wide">Structured Report</span>
                                                            </div>
                                                            <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-2">
                                                                {sprint.title}
                                                            </h3>
                                                            <div className="flex items-center space-x-3 text-sm text-gray-600">
                                                                <span className="flex items-center space-x-1">
                                                                    <Trophy className="w-4 h-4 text-yellow-600" />
                                                                    <span>Rank #{user_rank}</span>
                                                                </span>
                                                                <span>•</span>
                                                                <span>{user_score} points</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Summary Preview */}
                                                    <div className="bg-white/80 rounded-xl p-4 mb-4">
                                                        <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                                                            {cleanSummary}
                                                        </p>
                                                    </div>

                                                    {/* Badges */}
                                                    {badges.length > 0 && (
                                                        <div className="flex flex-wrap gap-2 mb-4">
                                                            {badges.slice(0, 3).map((badge, i) => (
                                                                <div key={i} className="flex items-center space-x-1 px-2 py-1 bg-white/80 rounded-full text-xs font-semibold">
                                                                    {badge === 'top_contributor' && <><Star className="w-3 h-3 text-purple-600" /><span className="text-purple-700">Top</span></>}
                                                                    {badge === 'daily_streak' && <><Flame className="w-3 h-3 text-orange-600" /><span className="text-orange-700">Streak</span></>}
                                                                    {badge === 'most_helpful' && <><Heart className="w-3 h-3 text-blue-600" /><span className="text-blue-700">Helpful</span></>}
                                                                    {badge === 'early_bird' && <><Zap className="w-3 h-3 text-yellow-600" /><span className="text-yellow-700">Early</span></>}
                                                                    {badge === 'consistent_builder' && <><Target className="w-3 h-3 text-green-600" /><span className="text-green-700">Consistent</span></>}
                                                                </div>
                                                            ))}
                                                            {badges.length > 3 && (
                                                                <span className="px-2 py-1 bg-white/80 rounded-full text-xs font-semibold text-gray-600">
                                                                    +{badges.length - 3} more
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Action Button */}
                                                    <button
                                                        onClick={() => setSelectedSprint(item)}
                                                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                                                    >
                                                        <Sparkles className="w-5 h-5" />
                                                        <span>View Report</span>
                                                    </button>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-12 text-center border-2 border-purple-200">
                                        <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">No Reports Yet</h3>
                                        <p className="text-gray-600 mb-6">
                                            Complete a sprint and generate a report to see it here.
                                        </p>
                                        <Link
                                            href={route('sprints.index')}
                                            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
                                        >
                                            <Plus className="w-5 h-5" />
                                            <span>Discover Sprints</span>
                                        </Link>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* Recent Activity Section */}
                        {activeTab === 'overview' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
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
                                            href={route('sprints.show', routeKey(update.sprint) ?? update.sprint_id)}
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
                        )}

                        {/* Quick Actions */}
                        {activeTab === 'overview' && (
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
                        )}
                    </div>
                </div>
            </div>

            {/* Progress Card Modal */}
            {selectedSprint && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                    onClick={() => setSelectedSprint(null)}
                >
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-2xl p-6 max-w-5xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Sprint Report & Share Assets</h2>
                            <button
                                onClick={() => setSelectedSprint(null)}
                                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Sprint report section - Only show if report exists, otherwise show generator */}
                            {selectedSprint.ai_summary ? (
                                <AISprintSummary 
                                    sprint={selectedSprint.sprint}
                                    aiSummary={selectedSprint.ai_summary}
                                    viewOnly={true}
                                />
                            ) : (
                                <AISprintSummary 
                                    sprint={selectedSprint.sprint}
                                    aiSummary={selectedSprint.ai_summary}
                                />
                            )}

                            {/* Progress Card Section */}
                            <SprintProgressCard
                                sprint={selectedSprint.sprint}
                                userStats={{
                                    user: auth.user,
                                    updates_posted: selectedSprint.sprint.participants?.find(p => p.id === auth.user.id)?.pivot?.updates_posted || 0,
                                    score: selectedSprint.user_score,
                                    reactions_received: selectedSprint.sprint.participants?.find(p => p.id === auth.user.id)?.pivot?.reactions_received || 0,
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
