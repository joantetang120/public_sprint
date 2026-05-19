import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Users, Calendar, TrendingUp, Lock, Clock } from 'lucide-react';
import UserAvatar from '@/Components/UserAvatar';
import { routeKey } from '@/lib/routeKey';

export default function SprintCard({ sprint }) {
    const getDaysRemaining = () => {
        const end = new Date(sprint.ends_at);
        const now = new Date();
        const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
        return Math.max(0, diff);
    };

    const getStatusColor = () => {
        switch (sprint.status) {
            case 'active':
                return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'upcoming':
                return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            case 'completed':
                return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
            default:
                return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
        }
    };

    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="glass-card p-6 card-hover"
        >
            <Link href={route('sprints.show', routeKey(sprint))}>
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor()}`}>
                                {sprint.status}
                            </span>
                            {sprint.is_private && (
                                <span className="flex items-center space-x-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-xs font-semibold">
                                    <Lock className="w-3 h-3" />
                                    <span>Private</span>
                                </span>
                            )}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                            {sprint.title}
                        </h3>
                    </div>
                </div>

                {/* Description */}
                {sprint.description && (
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {sprint.description}
                    </p>
                )}

                {/* Tags */}
                {sprint.tags && sprint.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {sprint.tags.slice(0, 3).map((tag) => (
                            <span
                                key={tag.id}
                                className="px-2 py-1 bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium"
                            >
                                #{tag.name}
                            </span>
                        ))}
                        {sprint.tags.length > 3 && (
                            <span className="px-2 py-1 text-gray-500 dark:text-gray-400 text-xs font-medium">
                                +{sprint.tags.length - 3} more
                            </span>
                        )}
                    </div>
                )}

                {/* Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-dark-700">
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{sprint.participants_count}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <TrendingUp className="w-4 h-4" />
                            <span>{sprint.updates_count}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{sprint.duration_days}d</span>
                        </div>
                    </div>

                    {sprint.status === 'active' && (
                        <div className="flex items-center space-x-1 text-sm font-semibold text-primary-600 dark:text-primary-400">
                            <Clock className="w-4 h-4" />
                            <span>{getDaysRemaining()}d left</span>
                        </div>
                    )}
                </div>

            </Link>
            
            {/* Creator - Outside main Link to prevent nested links */}
            <Link 
                href={route('users.show', routeKey(sprint.creator))}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center space-x-2 mt-4 pt-4 border-t border-gray-200 dark:border-dark-700 hover:bg-gray-50 dark:hover:bg-dark-800 -mx-6 px-6 -mb-6 pb-6 rounded-b-2xl transition-colors"
            >
                <UserAvatar 
                    user={sprint.creator}
                    size="sm"
                />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                        {sprint.creator?.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Created {new Date(sprint.created_at).toLocaleDateString()}
                    </p>
                </div>
            </Link>
        </motion.div>
    );
}
