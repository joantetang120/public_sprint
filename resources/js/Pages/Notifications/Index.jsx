import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    BellAlertIcon as Bell,
    BoltIcon as Zap,
    ChatBubbleOvalLeftEllipsisIcon as MessageSquare,
    CheckIcon as Check,
    CheckCircleIcon as CheckCheck,
    HeartIcon as Heart,
    TrashIcon as Trash2,
    UserPlusIcon as UserPlus,
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import PublicSprintLayout from '@/Layouts/PublicSprintLayout';
import UserAvatar from '@/Components/UserAvatar';
import { useLanguage } from '@/Contexts/LanguageContext';

export default function Index({ auth, notifications }) {
    const { tl, formatDateTime } = useLanguage();
    const [localNotifications, setLocalNotifications] = useState(notifications.data || []);

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'new_follower':
                return <UserPlus className="w-5 h-5 text-primary-600" />;
            case 'new_comment':
                return <MessageSquare className="w-5 h-5 text-blue-600" />;
            case 'new_reaction':
                return <Heart className="w-5 h-5 text-red-600" />;
            case 'sprint_milestone':
                return <Zap className="w-5 h-5 text-yellow-600" />;
            default:
                return <Bell className="w-5 h-5 text-gray-600" />;
        }
    };

    const getNotificationLink = (notification) => {
        const data = notification.data;
        
        if ((data.sprint_ulid || data.sprint_id) && (data.update_ulid || data.update_id)) {
            return route('sprints.show', data.sprint_ulid || data.sprint_id);
        }
        if (data.follower_ulid || data.follower_id) {
            return route('users.show', data.follower_ulid || data.follower_id);
        }
        if (data.sprint_ulid || data.sprint_id) {
            return route('sprints.show', data.sprint_ulid || data.sprint_id);
        }
        return null;
    };

    const markAsRead = (notificationId) => {
        router.post(route('notifications.read', notificationId), {}, {
            preserveScroll: true,
            onSuccess: () => {
                setLocalNotifications(prev =>
                    prev.map(n => n.id === notificationId ? { ...n, read_at: new Date() } : n)
                );
            }
        });
    };

    const markAllAsRead = () => {
        router.post(route('notifications.readAll'), {}, {
            preserveScroll: true,
            onSuccess: () => {
                setLocalNotifications(prev =>
                    prev.map(n => ({ ...n, read_at: new Date() }))
                );
            }
        });
    };

    const deleteNotification = (notificationId) => {
        router.delete(route('notifications.destroy', notificationId), {
            preserveScroll: true,
            onSuccess: () => {
                setLocalNotifications(prev => prev.filter(n => n.id !== notificationId));
            }
        });
    };

    const handleNotificationClick = (notification) => {
        if (!notification.read_at) {
            markAsRead(notification.id);
        }
        const link = getNotificationLink(notification);
        if (link) {
            router.visit(link);
        }
    };

    const unreadCount = localNotifications.filter(n => !n.read_at).length;

    return (
        <PublicSprintLayout>
            <Head title={tl('Notifications')} />

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white">
                            {tl('Notifications')}
                        </h1>
                        {unreadCount > 0 && (
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                {unreadCount === 1
                                    ? tl('You have {count} unread notification', { count: unreadCount })
                                    : tl('You have {count} unread notifications', { count: unreadCount })}
                            </p>
                        )}
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-colors"
                        >
                            <CheckCheck className="w-5 h-5" />
                            <span>{tl('Mark All Read')}</span>
                        </button>
                    )}
                </div>

                {/* Notifications List */}
                {localNotifications && localNotifications.length > 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-dark-900 rounded-2xl border-2 border-gray-200 dark:border-dark-700 overflow-hidden"
                    >
                        <div className="divide-y divide-gray-200 dark:divide-dark-800">
                            {localNotifications.map((notification, i) => {
                                const isUnread = !notification.read_at;
                                const actor = notification.data?.actor_id ? { id: notification.data.actor_id } : null;
                                
                                return (
                                    <motion.div
                                        key={notification.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className={`flex items-start space-x-4 p-4 hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors ${
                                            isUnread ? 'bg-primary-50 dark:bg-primary-900/10' : ''
                                        }`}
                                    >
                                        {/* Icon */}
                                        <div className="flex-shrink-0 mt-1">
                                            {getNotificationIcon(notification.type)}
                                        </div>

                                        {/* Content */}
                                        <div 
                                            className="flex-1 min-w-0 cursor-pointer"
                                            onClick={() => handleNotificationClick(notification)}
                                        >
                                            <p className={`text-sm ${isUnread ? 'font-semibold' : ''} text-gray-900 dark:text-white`}>
                                                {notification.data?.message}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                {formatDateTime(notification.created_at)}
                                            </p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center space-x-2">
                                            {isUnread && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        markAsRead(notification.id);
                                                    }}
                                                    className="p-2 hover:bg-gray-200 dark:hover:bg-dark-700 rounded-lg transition-colors"
                                                    title={tl('Mark as read')}
                                                >
                                                    <Check className="w-4 h-4 text-primary-600" />
                                                </button>
                                            )}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteNotification(notification.id);
                                                }}
                                                className="p-2 hover:bg-gray-200 dark:hover:bg-dark-700 rounded-lg transition-colors"
                                                title={tl('Delete')}
                                            >
                                                <Trash2 className="w-4 h-4 text-red-600" />
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-dark-900 rounded-2xl border-2 border-gray-200 dark:border-dark-700 p-12 text-center"
                    >
                        <Bell className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            {tl('No notifications yet')}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            {tl("When you get notifications, they'll show up here")}
                        </p>
                    </motion.div>
                )}
            </div>
        </PublicSprintLayout>
    );
}
