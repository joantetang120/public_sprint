import { Head, Link, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Zap, Calendar, Users, Target, TrendingUp, MessageSquare, 
    Heart, Share2, Flag, Clock, CheckCircle2, ArrowRight, Plus, 
    Link as Link2, Trash2, Reply, MoreVertical, Sparkles, Rocket, X,
    Trophy, Award, Medal, Crown, Star, Flame, Check, Copy
} from 'lucide-react';
import { useState } from 'react';
import PublicSprintLayout from '@/Layouts/PublicSprintLayout';
import UserAvatar from '@/Components/UserAvatar';
import JoinWithMeLink from '@/Components/JoinWithMeLink';
import AISprintSummary from '@/Components/AISprintSummary';

export default function Show({ auth, sprint, isParticipant, leaderboard, completionStats }) {
    const [activeTab, setActiveTab] = useState('updates');
    const [showLeaveModal, setShowLeaveModal] = useState(false);
    const [localReactions, setLocalReactions] = useState({});
    const [showComments, setShowComments] = useState({});
    const [commentText, setCommentText] = useState({});
    const [replyingTo, setReplyingTo] = useState({});
    const [replyText, setReplyText] = useState({});
    const [selectedImage, setSelectedImage] = useState(null);
    const [showShareModal, setShowShareModal] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);

    const getDaysRemaining = () => {
        const end = new Date(sprint.ends_at);
        const now = new Date();
        const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
        return Math.max(0, diff);
    };

    const isSprintActive = () => {
        const now = new Date();
        const startDate = new Date(sprint.starts_at);
        return now >= startDate;
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const getSprintUrl = () => {
        // Get the current page URL which is already the sprint show page
        return window.location.href;
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(getSprintUrl());
            setLinkCopied(true);
            setTimeout(() => setLinkCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy link:', err);
        }
    };

    const handleShare = (platform) => {
        const url = encodeURIComponent(getSprintUrl());
        const title = encodeURIComponent(sprint.title);
        const text = encodeURIComponent(`Check out this sprint: ${sprint.title}`);
        
        const shareUrls = {
            twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
            whatsapp: `https://wa.me/?text=${text}%20${url}`,
            telegram: `https://t.me/share/url?url=${url}&text=${text}`,
        };
        
        if (shareUrls[platform]) {
            window.open(shareUrls[platform], '_blank', 'width=600,height=400');
        }
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: sprint.title,
                    text: `Check out this sprint: ${sprint.title}`,
                    url: getSprintUrl(),
                });
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('Error sharing:', err);
                }
            }
        } else {
            setShowShareModal(true);
        }
    };

    const getProgress = () => {
        const start = new Date(sprint.starts_at);
        const end = new Date(sprint.ends_at);
        const now = new Date();
        const total = end - start;
        const elapsed = now - start;
        return Math.min(100, Math.max(0, (elapsed / total) * 100));
    };

    const handleJoin = () => {
        router.post(`/sprints/${sprint.id}/join`);
    };

    const handleLeave = () => {
        setShowLeaveModal(true);
    };

    const confirmLeave = () => {
        router.post(`/sprints/${sprint.id}/leave`);
        setShowLeaveModal(false);
    };

    const handleReaction = (updateId) => {
        if (!auth.user) {
            router.visit('/login');
            return;
        }

        const update = sprint.updates.find(u => u.id === updateId);
        const hasReacted = update?.reactions?.some(r => r.user_id === auth.user.id);
        
        setLocalReactions(prev => ({
            ...prev,
            [updateId]: {
                hasReacted: !hasReacted,
                count: hasReacted 
                    ? (update?.reactions?.length || 0) - 1 
                    : (update?.reactions?.length || 0) + 1
            }
        }));

        router.post(`/updates/${updateId}/react`, {}, {
            preserveScroll: true,
            onError: (errors) => {
                setLocalReactions(prev => {
                    const newState = { ...prev };
                    delete newState[updateId];
                    return newState;
                });
            },
        });
    };

    const toggleComments = (updateId) => {
        setShowComments(prev => ({
            ...prev,
            [updateId]: !prev[updateId]
        }));
    };

    const handleCommentSubmit = async (updateId) => {
        if (!auth.user) {
            router.visit('/login');
            return;
        }

        const content = commentText[updateId]?.trim();
        if (!content) return;

        try {
            await router.post(`/updates/${updateId}/comments`, {
                content: content
            }, {
                preserveScroll: true,
                preserveState: true
            });
            setCommentText(prev => ({ ...prev, [updateId]: '' }));
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    };

    const handleReply = async (updateId, commentId) => {
        if (!auth.user) {
            router.visit('/login');
            return;
        }

        const content = replyText[commentId]?.trim();
        if (!content) return;

        try {
            await router.post(route('comments.store', { update: updateId }), {
                content: content,
                parent_id: commentId
            }, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    // Refresh the page to show the new reply
                    router.reload({ only: ['sprint'] });
                }
            });
            
            setReplyText(prev => ({ ...prev, [commentId]: '' }));
            setReplyingTo(prev => ({ ...prev, [commentId]: false }));
        } catch (error) {
            console.error('Error submitting reply:', error);
        }
    };

    const toggleReply = (commentId) => {
        setReplyingTo(prev => ({
            ...prev,
            [commentId]: !prev[commentId]
        }));
        // Initialize reply text if it doesn't exist
        if (!replyText[commentId]) {
            setReplyText(prev => ({
                ...prev,
                [commentId]: ''
            }));
        }
    };

    // Safe route generation functions
    const getUpdateCreateRoute = () => {
        return `/sprints/${sprint.id}/updates/create`;
    };

    const getRegisterRoute = () => {
        return '/register';
    };

    const getLoginRoute = () => {
        return '/login';
    };

    return (
        <PublicSprintLayout>
            <Head title={sprint.title} />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="space-y-8">
                        {/* Header Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                                {/* Main Content */}
                                <div className="flex-1">
                                    {/* Status & Creator */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-3 h-3 rounded-full ${
                                                sprint.computed_status === 'active' ? 'bg-green-500 animate-pulse' : 
                                                sprint.computed_status === 'upcoming' ? 'bg-yellow-500' : 'bg-gray-400'
                                            }`} />
                                            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 capitalize">
                                                {sprint.computed_status} Sprint
                                            </span>
                                            <span className="text-gray-300 dark:text-gray-600">•</span>
                                            <div className="flex items-center space-x-2">
                                                <UserAvatar 
                                                    user={sprint.creator}
                                                    size="sm"
                                                />
                                                <span className="text-sm text-gray-600 dark:text-gray-400">by {sprint.creator.name}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button 
                                                onClick={() => setShowShareModal(true)}
                                                className="flex items-center space-x-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700"
                                                title="Share sprint"
                                            >
                                                <Share2 className="w-4 h-4" />
                                                <span className="text-sm font-semibold hidden sm:inline">Share</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Title & Description */}
                                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">{sprint.title}</h1>
                                    {sprint.description && (
                                        <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">{sprint.description}</p>
                                    )}

                                    {/* Progress & Stats */}
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="font-semibold text-gray-700 dark:text-gray-300">Sprint Progress</span>
                                                <span className="font-bold text-green-600">{Math.round(getProgress())}%</span>
                                            </div>
                                            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500"
                                                    style={{ width: `${getProgress()}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                <div className="text-xl font-bold text-gray-900 dark:text-white">{sprint.duration_days}</div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">Days</div>
                                            </div>
                                            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                <div className="text-xl font-bold text-gray-900 dark:text-white">{sprint.participants_count || 0}</div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">Builders</div>
                                            </div>
                                            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                <div className="text-xl font-bold text-gray-900 dark:text-white">{sprint.updates?.length || 0}</div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">Updates</div>
                                            </div>
                                            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                <div className="text-xl font-bold text-gray-900 dark:text-white">{getDaysRemaining()}</div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">Days Left</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tags */}
                                    {sprint.tags && sprint.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            {sprint.tags.map((tag) => (
                                                <span key={tag.id} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium">
                                                    #{tag.name}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* AI Summary for Completed Sprints - Full Width */}
                                    {auth.user && isParticipant && sprint.computed_status === 'completed' && (
                                        <div className="mt-6">
                                            <AISprintSummary 
                                                sprint={sprint} 
                                                aiSummary={leaderboard.find(p => p.id === auth.user.id)?.pivot?.ai_summary}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Action Sidebar */}
                                <div className="lg:w-64 space-y-3">
                                    {/* Join/Leave Actions */}
                                    <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-4 border border-green-100 dark:border-green-800">
                                        {auth.user ? (
                                            isParticipant ? (
                                                <div className="space-y-2">
                                                    {sprint.computed_status === 'completed' ? (
                                                        <div className="w-full text-center px-4 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg font-medium text-sm flex items-center justify-center space-x-2">
                                                            <CheckCircle2 className="w-4 h-4" />
                                                            <span>Sprint Completed</span>
                                                        </div>
                                                    ) : isSprintActive() ? (
                                                        <Link
                                                            href={getUpdateCreateRoute()}
                                                            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors shadow-sm text-sm"
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                            <span>Post Update</span>
                                                        </Link>
                                                    ) : (
                                                        <div className="w-full text-center px-4 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg font-medium text-sm">
                                                            Starts on {formatDate(sprint.starts_at)}
                                                        </div>
                                                    )}
                                                    {sprint.computed_status !== 'completed' && (
                                                        <button
                                                            onClick={handleLeave}
                                                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
                                                        >
                                                            Leave Sprint
                                                        </button>
                                                    )}
                                                </div>
                                            ) : sprint.computed_status === 'completed' ? (
                                                <div className="w-full text-center px-4 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg font-medium text-sm flex items-center justify-center space-x-2">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    <span>Sprint Completed</span>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={handleJoin}
                                                    className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors shadow-sm text-sm"
                                                >
                                                    <Rocket className="w-4 h-4" />
                                                    <span>Join Sprint</span>
                                                </button>
                                            )
                                        ) : (
                                            <Link
                                                href={getRegisterRoute()}
                                                className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors shadow-sm text-sm"
                                            >
                                                <span>Sign up to Join</span>
                                            </Link>
                                        )}
                                    </div>

                                    {/* Quick Info */}
                                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 space-y-2">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-gray-600 dark:text-gray-400">Starts</span>
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                {new Date(sprint.starts_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-gray-600 dark:text-gray-400">Ends</span>
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                {new Date(sprint.ends_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-gray-600 dark:text-gray-400">Visibility</span>
                                            <span className="font-semibold text-gray-900 dark:text-white capitalize">
                                                {sprint.is_private ? 'Private' : 'Public'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Completion Summary Banner */}
                        {completionStats && sprint.computed_status === 'completed' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 sm:p-8 text-white shadow-lg"
                            >
                                <div className="flex items-center justify-center mb-4">
                                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                        <Trophy className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">Sprint Completed! 🎉</h2>
                                <p className="text-green-100 text-center mb-6 max-w-2xl mx-auto">
                                    Congratulations! This sprint has been successfully completed. Here's a summary of the achievements.
                                </p>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                                        <div className="text-3xl font-black mb-1">{completionStats.total_updates}</div>
                                        <div className="text-sm text-green-100">Total Updates</div>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                                        <div className="text-3xl font-black mb-1">{completionStats.active_participants}</div>
                                        <div className="text-sm text-green-100">Active Builders</div>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                                        <div className="text-3xl font-black mb-1">{completionStats.total_reactions}</div>
                                        <div className="text-sm text-green-100">Total Likes</div>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                                        <div className="text-3xl font-black mb-1">{completionStats.completion_rate}%</div>
                                        <div className="text-sm text-green-100">Completion Rate</div>
                                    </div>
                                </div>

                                {/* Top Performers */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {completionStats.top_contributor && (
                                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <Crown className="w-5 h-5 text-yellow-300" />
                                                <span className="font-semibold text-sm">Top Contributor</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <UserAvatar user={completionStats.top_contributor} size="sm" />
                                                <div>
                                                    <div className="font-bold text-sm">{completionStats.top_contributor.name}</div>
                                                    <div className="text-xs text-green-100">{completionStats.top_contributor.pivot?.score || 0} points</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {completionStats.most_active && (
                                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <Zap className="w-5 h-5 text-yellow-300" />
                                                <span className="font-semibold text-sm">Most Active</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <UserAvatar user={completionStats.most_active} size="sm" />
                                                <div>
                                                    <div className="font-bold text-sm">{completionStats.most_active.name}</div>
                                                    <div className="text-xs text-green-100">{completionStats.most_active.pivot?.updates_posted || 0} updates</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {completionStats.most_engaged && (
                                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <Heart className="w-5 h-5 text-pink-300" />
                                                <span className="font-semibold text-sm">Most Engaged</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <UserAvatar user={completionStats.most_engaged} size="sm" />
                                                <div>
                                                    <div className="font-bold text-sm">{completionStats.most_engaged.name}</div>
                                                    <div className="text-xs text-green-100">{completionStats.most_engaged.pivot?.reactions_received || 0} likes</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* Navigation Tabs */}
                        <div className="bg-white dark:bg-gray-900 rounded-xl p-1 border border-gray-200 dark:border-gray-800 shadow-sm">
                            <div className="flex space-x-1">
                                {['updates', 'participants', 'leaderboard'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`flex-1 py-2.5 px-4 rounded-lg font-semibold capitalize transition-all text-sm ${
                                            activeTab === tab
                                                ? 'bg-green-500 text-white shadow-sm'
                                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                                        }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Main Content Area */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Updates Feed */}
                            <div className="lg:col-span-2 space-y-4 order-2 lg:order-1">
                                {activeTab === 'updates' && (
                                    <>
                                        {sprint.updates && sprint.updates.length > 0 ? (
                                            sprint.updates.map((update, i) => (
                                                <motion.div
                                                    key={update.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: i * 0.1 }}
                                                    className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow"
                                                >
                                                    {/* Update Header */}
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex items-center space-x-3">
                                                            <UserAvatar 
                                                                user={update.user}
                                                                size="md"
                                                            />
                                                            <div>
                                                                <Link href={`/users/${update.user?.id}`} className="font-semibold text-gray-900 dark:text-white hover:text-green-600 dark:hover:text-green-400 transition-colors">
                                                                    {update.user?.name}
                                                                </Link>
                                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                    Day {update.day_number} • {new Date(update.created_at).toLocaleDateString()}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-xs font-semibold">
                                                            Day {update.day_number}
                                                        </span>
                                                    </div>

                                                    {/* Update Content */}
                                                    <div className="mb-3">
                                                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                                            {(() => {
                                                                const words = update.content.split(/\s+/);
                                                                return words.map((word, i) => {
                                                                    // Check if the word is a URL
                                                                    const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/;
                                                                    const isUrl = urlPattern.test(word);
                                                                    
                                                                    if (isUrl) {
                                                                        // Ensure the URL has a protocol
                                                                        const href = word.startsWith('http') ? word : `https://${word}`;
                                                                        return (
                                                                            <a 
                                                                                key={i} 
                                                                                href={href} 
                                                                                target="_blank" 
                                                                                rel="noopener noreferrer"
                                                                                className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline break-all"
                                                                            >
                                                                                <Link2 className="w-4 h-4 mr-1 flex-shrink-0" />
                                                                                {word} 
                                                                            </a>
                                                                        );
                                                                    }
                                                                    return <span key={i}>{word} </span>;
                                                                });
                                                            })()}
                                                        </p>
                                                    </div>

                                                    {/* Saved Links */}
                                                    {update.links && update.links.length > 0 && (
                                                        <div className="mb-3 space-y-2">
                                                            {update.links.map((link, idx) => {
                                                                // Ensure the URL has a protocol
                                                                const href = link.startsWith('http') ? link : `https://${link}`;
                                                                // Extract domain for display
                                                                let domain = '';
                                                                try {
                                                                    const url = new URL(href);
                                                                    domain = url.hostname.replace('www.', '');
                                                                } catch (e) {
                                                                    domain = 'link';
                                                                }
                                                                
                                                                return (
                                                                    <a 
                                                                        key={idx}
                                                                        href={href}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                                    >
                                                                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3">
                                                                            <Link2 className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                                                        </div>
                                                                        <div className="min-w-0">
                                                                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                                                {domain}
                                                                            </p>
                                                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                                                {link.length > 50 ? `${link.substring(0, 50)}...` : link}
                                                                            </p>
                                                                        </div>
                                                                    </a>
                                                                );
                                                            })}
                                                        </div>
                                                    )}

                                                    {/* Update Images */}
                                                    {update.images && update.images.length > 0 && (
                                                        <div className="mb-3">
                                                            <div className={`grid gap-2 ${
                                                                update.images.length === 1 ? 'grid-cols-1' : 
                                                                update.images.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : 
                                                                'grid-cols-1 sm:grid-cols-2'
                                                            }`}>
                                                                {update.images.map((img, idx) => (
                                                                    <button 
                                                                        key={idx}
                                                                        onClick={() => setSelectedImage(img)}
                                                                        className="relative group overflow-hidden rounded-lg"
                                                                    >
                                                                        <img 
                                                                            src={img}
                                                                            alt={`Update attachment ${idx + 1}`}
                                                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                                        />
                                                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                                                                            <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                                                            </svg>
                                                                        </div>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Actions */}
                                                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                                                        {(() => {
                                                            const localReaction = localReactions[update.id];
                                                            const hasReacted = localReaction?.hasReacted ?? update.reactions?.some(r => r.user_id === auth.user?.id);
                                                            const reactionCount = localReaction?.count ?? (update.reactions?.length || 0);
                                                            
                                                            return (
                                                                <button 
                                                                    onClick={() => handleReaction(update.id)}
                                                                    className={`flex items-center space-x-1 transition-all ${
                                                                        hasReacted
                                                                            ? 'text-red-600'
                                                                            : 'text-gray-500 hover:text-red-600'
                                                                    }`}
                                                                >
                                                                    <Heart 
                                                                        className={`w-4 h-4 transition-all ${
                                                                            hasReacted
                                                                                ? 'fill-current scale-110'
                                                                                : ''
                                                                        }`}
                                                                    />
                                                                    <span className="font-medium text-sm">{reactionCount}</span>
                                                                </button>
                                                            );
                                                        })()}
                                                        <button 
                                                            onClick={() => toggleComments(update.id)}
                                                            className="flex items-center space-x-1 text-gray-500 hover:text-green-600 transition-colors"
                                                        >
                                                            <MessageSquare className="w-4 h-4" />
                                                            <span className="font-medium text-sm">{update.comments?.length || 0}</span>
                                                        </button>
                                                    </div>

                                                    {/* Comments Section */}
                                                    {showComments[update.id] && (
                                                        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 space-y-3">
                                                            {/* Comment Input */}
                                                            {auth.user && (
                                                                <div className="flex space-x-2">
                                                                    <UserAvatar 
                                                                        user={auth.user}
                                                                        size="sm"
                                                                    />
                                                                    <div className="flex-1">
                                                                        <textarea
                                                                            value={commentText[update.id] || ''}
                                                                            onChange={(e) => setCommentText(prev => ({ ...prev, [update.id]: e.target.value }))}
                                                                            placeholder="Add a comment..."
                                                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                                                                            rows="2"
                                                                        />
                                                                        <div className="flex justify-end mt-1">
                                                                            <button
                                                                                onClick={() => handleCommentSubmit(update.id)}
                                                                                disabled={!commentText[update.id]?.trim()}
                                                                                className="px-3 py-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded text-xs font-medium transition-colors"
                                                                            >
                                                                                Comment
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Comments List */}
                                                            {update.comments && update.comments.length > 0 && (
                                                                <div className="space-y-2">
                                                                    {update.comments.filter(c => !c.parent_id).map((comment) => (
                                                                        <div key={comment.id} className="flex space-x-2">
                                                                            <UserAvatar 
                                                                                user={comment.user}
                                                                                size="sm"
                                                                            />
                                                                            <div className="flex-1">
                                                                                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
                                                                                    <div className="flex items-center space-x-2 mb-1">
                                                                                        <Link href={`/users/${comment.user?.id}`} className="font-medium text-xs text-gray-900 dark:text-white hover:text-green-600 dark:hover:text-green-400 transition-colors">
                                                                                            {comment.user?.name}
                                                                                        </Link>
                                                                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                                                                            {new Date(comment.created_at).toLocaleDateString()}
                                                                                        </span>
                                                                                    </div>
                                                                                    <p className="text-xs text-gray-700 dark:text-gray-300 mb-2">
                                                                                        {comment.content}
                                                                                    </p>
                                                                                    <div className="flex items-center space-x-3 text-xs">
                                                                                        <button 
                                                                                            onClick={() => toggleReply(comment.id)}
                                                                                            className="text-gray-500 hover:text-green-600 transition-colors flex items-center"
                                                                                        >
                                                                                            <Reply className="w-3 h-3 mr-1" />
                                                                                            Reply
                                                                                        </button>
                                                                                        <span className="text-gray-500">
                                                                                            {comment.replies_count || 0} {comment.replies_count === 1 ? 'reply' : 'replies'}
                                                                                        </span>
                                                                                    </div>

                                                                                    {/* Reply Input */}
                                                                                    {replyingTo[comment.id] && (
                                                                                        <div className="mt-2 pl-2 border-l-2 border-gray-200 dark:border-gray-700">
                                                                                            <div className="flex space-x-2 mt-2">
                                                                                                <UserAvatar 
                                                                                                    user={auth.user}
                                                                                                    size="xs"
                                                                                                />
                                                                                                <div className="flex-1">
                                                                                                    <textarea
                                                                                                        value={replyText[comment.id] || ''}
                                                                                                        onChange={(e) => setReplyText(prev => ({
                                                                                                            ...prev,
                                                                                                            [comment.id]: e.target.value
                                                                                                        }))}
                                                                                                        placeholder="Write a reply..."
                                                                                                        className="w-full px-2 py-1 text-xs border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none focus:ring-1 focus:ring-green-500 focus:border-transparent"
                                                                                                        rows="2"
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === 'Enter' && !e.shiftKey) {
                                                                            e.preventDefault();
                                                                            handleReply(update.id, comment.id);
                                                                        }
                                                                    }}
                                                                                                    />
                                                                                                    <div className="flex justify-end space-x-2 mt-1">
                                                                                                        <button
                                                                            onClick={() => setReplyingTo(prev => ({ ...prev, [comment.id]: false }))}
                                                                            className="px-2 py-1 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
                                                                        >
                                                                            Cancel
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleReply(update.id, comment.id)}
                                                                            disabled={!replyText[comment.id]?.trim()}
                                                                            className="px-3 py-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded text-xs font-medium transition-colors"
                                                                        >
                                                                            Reply
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Replies */}
                                                    {comment.replies && comment.replies.length > 0 && (
                                                        <div className="mt-2 space-y-2 pl-4 border-l-2 border-gray-100 dark:border-gray-700">
                                                            {comment.replies.map(reply => (
                                                                <div key={reply.id} className="flex space-x-2">
                                                                    <UserAvatar 
                                                                        user={reply.user}
                                                                        size="xs"
                                                                    />
                                                                    <div className="flex-1">
                                                                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
                                                                            <div className="flex items-center space-x-2 mb-1">
                                                                                <Link href={`/users/${reply.user?.id}`} className="font-medium text-xs text-gray-900 dark:text-white hover:text-green-600 dark:hover:text-green-400 transition-colors">
                                                                                    {reply.user?.name}
                                                                                </Link>
                                                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                                                    {new Date(reply.created_at).toLocaleDateString()}
                                                                                </span>
                                                                            </div>
                                                                            <p className="text-xs text-gray-700 dark:text-gray-300">
                                                                                {reply.content}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                                                        </div>
                                                    )}
                                                </motion.div>
                                            ))
                                        ) : (
                                            <div className="text-center py-8 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
                                                <Sparkles className="w-8 h-8 mx-auto mb-3 text-gray-400" />
                                                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                                                    No updates yet
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-400 mb-3 text-sm">
                                                    Be the first to share your progress!
                                                </p>
                                                {isParticipant && (
                                                    <Link
                                                        href={getUpdateCreateRoute()}
                                                        className="inline-flex items-center space-x-1 px-3 py-1.5 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors text-sm"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                        <span>Post Update</span>
                                                    </Link>
                                                )}
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* Participants Tab */}
                                {activeTab === 'participants' && (
                                    <div className="grid gap-3">
                                        {sprint.participants && sprint.participants.map((participant, i) => (
                                            <motion.div
                                                key={participant.id}
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: i * 0.05 }}
                                                className="bg-white dark:bg-gray-900 rounded-xl p-3 border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <UserAvatar 
                                                        user={participant}
                                                        size="md"
                                                    />
                                                    <div className="flex-1">
                                                        <Link href={`/users/${participant.id}`} className="font-semibold text-gray-900 dark:text-white hover:text-green-600 dark:hover:text-green-400 transition-colors">
                                                            {participant.name}
                                                        </Link>
                                                        <div className="text-xs text-gray-600 dark:text-gray-400">
                                                            Joined {new Date(participant.pivot.joined_at).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                    {participant.id === sprint.user_id && (
                                                        <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded text-xs font-medium">
                                                            Creator
                                                        </span>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}

                                {/* Leaderboard Tab */}
                                {activeTab === 'leaderboard' && (
                                    <div className="space-y-4">
                                        {/* Top 3 Podium */}
                                        {leaderboard && leaderboard.length > 0 && (
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                                                {/* 2nd Place */}
                                                {leaderboard[1] && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.1 }}
                                                        className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 border-2 border-gray-300 dark:border-gray-700 text-center sm:mt-8"
                                                    >
                                                        <div className="relative">
                                                            <UserAvatar user={leaderboard[1]} size="lg" />
                                                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900">
                                                                <Medal className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                                                            </div>
                                                        </div>
                                                        <Link href={`/users/${leaderboard[1].id}`} className="font-bold text-sm text-gray-900 dark:text-white mt-2 block hover:text-green-600 dark:hover:text-green-400 transition-colors">
                                                            {leaderboard[1].name}
                                                        </Link>
                                                        <div className="text-2xl font-black text-gray-600 dark:text-gray-300 mt-1">{leaderboard[1].pivot?.score || 0}</div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">points</div>
                                                    </motion.div>
                                                )}

                                                {/* 1st Place */}
                                                {leaderboard[0] && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0 }}
                                                        className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30 rounded-xl p-4 border-2 border-yellow-400 dark:border-yellow-600 text-center"
                                                    >
                                                        <div className="relative">
                                                            <UserAvatar user={leaderboard[0]} size="xl" />
                                                            <div className="absolute -top-3 -right-2 w-10 h-10 bg-yellow-400 dark:bg-yellow-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900 shadow-lg">
                                                                <Crown className="w-5 h-5 text-yellow-900" />
                                                            </div>
                                                        </div>
                                                        <Link href={`/users/${leaderboard[0].id}`} className="font-bold text-base text-gray-900 dark:text-white mt-2 block hover:text-green-600 dark:hover:text-green-400 transition-colors">
                                                            {leaderboard[0].name}
                                                        </Link>
                                                        <div className="text-3xl font-black text-yellow-600 dark:text-yellow-400 mt-1">{leaderboard[0].pivot?.score || 0}</div>
                                                        <div className="text-xs text-gray-600 dark:text-gray-400">points</div>
                                                    </motion.div>
                                                )}

                                                {/* 3rd Place */}
                                                {leaderboard[2] && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.2 }}
                                                        className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 rounded-xl p-4 border-2 border-orange-300 dark:border-orange-700 text-center sm:mt-8"
                                                    >
                                                        <div className="relative">
                                                            <UserAvatar user={leaderboard[2]} size="lg" />
                                                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-200 dark:bg-orange-700 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900">
                                                                <Award className="w-4 h-4 text-orange-600 dark:text-orange-300" />
                                                            </div>
                                                        </div>
                                                        <Link href={`/users/${leaderboard[2].id}`} className="font-bold text-sm text-gray-900 dark:text-white mt-2 block hover:text-green-600 dark:hover:text-green-400 transition-colors">
                                                            {leaderboard[2].name}
                                                        </Link>
                                                        <div className="text-2xl font-black text-orange-600 dark:text-orange-400 mt-1">{leaderboard[2].pivot?.score || 0}</div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">points</div>
                                                    </motion.div>
                                                )}
                                            </div>
                                        )}

                                        {/* Rest of Leaderboard */}
                                        {leaderboard && leaderboard.length > 3 && (
                                            <div className="space-y-2">
                                                <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-3">Other Participants</h3>
                                                {leaderboard.slice(3).map((user, i) => {
                                                    const actualRank = i + 4;
                                                    const badges = user.pivot?.badges ? JSON.parse(user.pivot.badges) : [];
                                                    const completionRate = sprint.duration_days > 0 ? Math.round((user.pivot?.updates_posted || 0) / sprint.duration_days * 100) : 0;
                                                    
                                                    return (
                                                        <motion.div
                                                            key={user.id}
                                                            initial={{ opacity: 0, x: -20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: i * 0.05 }}
                                                            className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow"
                                                        >
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex items-start space-x-3 flex-1">
                                                                    <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-bold text-sm text-gray-700 dark:text-gray-300">
                                                                        {actualRank}
                                                                    </div>
                                                                    <UserAvatar 
                                                                        user={user}
                                                                        size="md"
                                                                    />
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-center space-x-2">
                                                                            <Link href={`/users/${user.id}`} className="font-semibold text-gray-900 dark:text-white text-sm hover:text-green-600 dark:hover:text-green-400 transition-colors">
                                                                                {user.name}
                                                                            </Link>
                                                                            {badges.length > 0 && (
                                                                                <div className="flex items-center space-x-1">
                                                                                    {badges.includes('top_contributor') && (
                                                                                        <div className="w-5 h-5 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center" title="Top Contributor">
                                                                                            <Star className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                                                                                        </div>
                                                                                    )}
                                                                                    {badges.includes('daily_streak') && (
                                                                                        <div className="w-5 h-5 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center" title="Daily Streak">
                                                                                            <Flame className="w-3 h-3 text-orange-600 dark:text-orange-400" />
                                                                                        </div>
                                                                                    )}
                                                                                    {badges.includes('most_helpful') && (
                                                                                        <div className="w-5 h-5 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center" title="Most Helpful">
                                                                                            <Heart className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-2 text-xs">
                                                                            <div>
                                                                                <div className="text-gray-500 dark:text-gray-400">Updates</div>
                                                                                <div className="font-semibold text-gray-900 dark:text-white">{user.pivot?.updates_posted || 0}</div>
                                                                            </div>
                                                                            <div>
                                                                                <div className="text-gray-500 dark:text-gray-400">Likes</div>
                                                                                <div className="font-semibold text-gray-900 dark:text-white">{user.pivot?.reactions_received || 0}</div>
                                                                            </div>
                                                                            <div>
                                                                                <div className="text-gray-500 dark:text-gray-400">Comments</div>
                                                                                <div className="font-semibold text-gray-900 dark:text-white">{user.pivot?.comments_made || 0}</div>
                                                                            </div>
                                                                        </div>
                                                                        {completionRate > 0 && (
                                                                            <div className="mt-2">
                                                                                <div className="flex items-center justify-between text-xs mb-1">
                                                                                    <span className="text-gray-500 dark:text-gray-400">Completion</span>
                                                                                    <span className="font-semibold text-gray-900 dark:text-white">{completionRate}%</span>
                                                                                </div>
                                                                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                                                                    <div 
                                                                                        className="bg-green-500 h-1.5 rounded-full transition-all" 
                                                                                        style={{ width: `${Math.min(completionRate, 100)}%` }}
                                                                                    ></div>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="text-right ml-4">
                                                                    <div className="text-xl font-bold text-green-600 dark:text-green-400">{user.pivot?.score || 0}</div>
                                                                    <div className="text-xs text-gray-500 dark:text-gray-400">points</div>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {/* Points Breakdown */}
                                        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                                            <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-3 flex items-center space-x-2">
                                                <Trophy className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                <span>Points System</span>
                                            </h3>
                                            <div className="space-y-2 text-xs">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-700 dark:text-gray-300">Post an update</span>
                                                    <span className="font-semibold text-green-600 dark:text-green-400">+2 pts</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-700 dark:text-gray-300">Receive a like</span>
                                                    <span className="font-semibold text-green-600 dark:text-green-400">+1 pt</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-700 dark:text-gray-300">Make a comment</span>
                                                    <span className="font-semibold text-green-600 dark:text-green-400">+0.5 pts</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-4 order-1 lg:order-2">
                                {/* Top Contributors */}
                                {leaderboard && leaderboard.length > 0 && (
                                    <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">Top Builders</h3>
                                        <div className="space-y-2">
                                            {leaderboard.slice(0, 5).map((user, i) => (
                                                <div key={user.id} className="flex items-center space-x-2">
                                                    <div className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold ${
                                                        i === 0 ? 'bg-yellow-100 text-yellow-700' :
                                                        i === 1 ? 'bg-gray-100 text-gray-700' :
                                                        i === 2 ? 'bg-orange-100 text-orange-700' :
                                                        'bg-gray-50 text-gray-600'
                                                    }`}>
                                                        {i + 1}
                                                    </div>
                                                    <UserAvatar 
                                                        user={user}
                                                        size="sm"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <Link href={`/users/${user.id}`} className="font-medium text-gray-900 dark:text-white text-xs truncate hover:text-green-600 dark:hover:text-green-400 transition-colors">
                                                            {user.name}
                                                        </Link>
                                                    </div>
                                                    <div className="text-xs font-semibold text-green-600">{user.pivot?.score || 0}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Sprint Stats */}
                                <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">Sprint Activity</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-600 dark:text-gray-400">Total Updates</span>
                                            <span className="font-semibold text-gray-900 dark:text-white">{sprint.updates?.length || 0}</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-600 dark:text-gray-400">Active Builders</span>
                                            <span className="font-semibold text-gray-900 dark:text-white">{sprint.participants_count || 0}</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-600 dark:text-gray-400">Completion</span>
                                            <span className="font-semibold text-green-600">{Math.round(getProgress())}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Leave Sprint Modal */}
            {showLeaveModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-md w-full shadow-2xl"
                    >
                        <div className="text-center">
                            <Flag className="w-12 h-12 mx-auto mb-4 text-red-500" />
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Leave Sprint?</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                You'll lose your progress in <span className="font-semibold">{sprint.title}</span>
                            </p>
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setShowLeaveModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmLeave}
                                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600"
                                >
                                    Leave
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Share Modal */}
            <AnimatePresence>
                {showShareModal && (
                    <motion.div 
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowShareModal(false)}
                    >
                        <motion.div 
                            className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-gray-200 dark:border-gray-800"
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                                        <Share2 className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Share Sprint</h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Spread the word!</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setShowShareModal(false)}
                                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Copy Link Section */}
                            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                                    Sprint Link
                                </label>
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                                    <input 
                                        type="text" 
                                        value={getSprintUrl()} 
                                        readOnly
                                        className="flex-1 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                    <button
                                        onClick={handleCopyLink}
                                        className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 whitespace-nowrap ${
                                            linkCopied 
                                                ? 'bg-green-500 text-white shadow-lg shadow-green-500/50' 
                                                : 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600 shadow-lg'
                                        }`}
                                    >
                                        {linkCopied ? (
                                            <>
                                                <Check className="w-4 h-4" />
                                                <span>Copied!</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-4 h-4" />
                                                <span>Copy Link</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Social Share Buttons */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                                    Share on Social Media
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => handleShare('twitter')}
                                        className="group flex items-center justify-center space-x-2 px-4 py-3.5 bg-[#1DA1F2] text-white rounded-xl font-semibold hover:bg-[#1a8cd8] transition-all hover:shadow-lg hover:scale-105 active:scale-95"
                                    >
                                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                        </svg>
                                        <span className="text-sm">Twitter</span>
                                    </button>
                                    <button
                                        onClick={() => handleShare('facebook')}
                                        className="group flex items-center justify-center space-x-2 px-4 py-3.5 bg-[#1877F2] text-white rounded-xl font-semibold hover:bg-[#166fe5] transition-all hover:shadow-lg hover:scale-105 active:scale-95"
                                    >
                                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                        </svg>
                                        <span className="text-sm">Facebook</span>
                                    </button>
                                    <button
                                        onClick={() => handleShare('linkedin')}
                                        className="group flex items-center justify-center space-x-2 px-4 py-3.5 bg-[#0A66C2] text-white rounded-xl font-semibold hover:bg-[#095196] transition-all hover:shadow-lg hover:scale-105 active:scale-95"
                                    >
                                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                        </svg>
                                        <span className="text-sm">LinkedIn</span>
                                    </button>
                                    <button
                                        onClick={() => handleShare('whatsapp')}
                                        className="group flex items-center justify-center space-x-2 px-4 py-3.5 bg-[#25D366] text-white rounded-xl font-semibold hover:bg-[#20bd5a] transition-all hover:shadow-lg hover:scale-105 active:scale-95"
                                    >
                                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                                        </svg>
                                        <span className="text-sm">WhatsApp</span>
                                    </button>
                                </div>
                                
                                {/* Pro Tip */}
                                <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                    <p className="text-xs text-gray-700 dark:text-gray-300">
                                        💡 <strong>Tip:</strong> Share this sprint to invite others to join and build in public together!
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Image Preview Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div 
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                    >
                        <motion.div 
                            className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <button 
                                onClick={() => setSelectedImage(null)}
                                className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
                                aria-label="Close preview"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            <img 
                                src={selectedImage} 
                                alt="Preview" 
                                className="max-w-full max-h-[80vh] object-contain rounded-lg"
                            />
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                                Click outside to close
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </PublicSprintLayout>
    );
}