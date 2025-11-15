import { Head, Link, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Zap, Calendar, Users, Target, TrendingUp, MessageSquare, 
    Heart, Share2, Flag, Clock, CheckCircle2, ArrowRight, Plus, 
    Link as Link2, Trash2, Reply, MoreVertical, Sparkles, Rocket, X
} from 'lucide-react';
import { useState } from 'react';
import PublicSprintLayout from '@/Layouts/PublicSprintLayout';
import UserAvatar from '@/Components/UserAvatar';

export default function Show({ auth, sprint, isParticipant, leaderboard }) {
    const [activeTab, setActiveTab] = useState('updates');
    const [showLeaveModal, setShowLeaveModal] = useState(false);
    const [localReactions, setLocalReactions] = useState({});
    const [showComments, setShowComments] = useState({});
    const [commentText, setCommentText] = useState({});
    const [replyingTo, setReplyingTo] = useState({});
    const [replyText, setReplyText] = useState({});
    const [selectedImage, setSelectedImage] = useState(null);

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
                                        <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                                            <MoreVertical className="w-5 h-5" />
                                        </button>
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
                                </div>

                                {/* Action Sidebar */}
                                <div className="lg:w-64 space-y-3">
                                    {/* Join/Leave Actions */}
                                    <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-4 border border-green-100 dark:border-green-800">
                                        {auth.user ? (
                                            isParticipant ? (
                                                <div className="space-y-2">
                                                    {isSprintActive() ? (
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
                                                    <button
                                                        onClick={handleLeave}
                                                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
                                                    >
                                                        Leave Sprint
                                                    </button>
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
                        <div className="grid lg:grid-cols-3 gap-6">
                            {/* Updates Feed */}
                            <div className="lg:col-span-2 space-y-4">
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
                                                                update.images.length === 2 ? 'grid-cols-2' : 
                                                                'grid-cols-2'
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
                                                    <div className="flex items-center space-x-4 pt-3 border-t border-gray-100 dark:border-gray-800">
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
                                    <div className="space-y-2">
                                        {leaderboard && leaderboard.map((user, i) => (
                                            <motion.div
                                                key={user.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.05 }}
                                                className="bg-white dark:bg-gray-900 rounded-xl p-3 border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-3">
                                                        <div className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs ${
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
                                                        <div>
                                                            <Link href={`/users/${user.id}`} className="font-semibold text-gray-900 dark:text-white text-sm hover:text-green-600 dark:hover:text-green-400 transition-colors">
                                                                {user.name}
                                                            </Link>
                                                            <div className="text-xs text-gray-600 dark:text-gray-400">{user.pivot?.updates_posted || 0} updates</div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-base font-bold text-green-600">{user.pivot?.score || 0}</div>
                                                        <div className="text-xs text-gray-600 dark:text-gray-400">points</div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-4">
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