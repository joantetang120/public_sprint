import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    BellAlertIcon as Bell,
    BoltIcon as Zap,
    ChatBubbleOvalLeftEllipsisIcon as MessageSquare,
    CheckIcon as Check,
    CheckCircleIcon as CheckCheck,
    HeartIcon as Heart,
    LockClosedIcon as Lock,
    RocketLaunchIcon as RocketIcon,
    SparklesIcon as Sparkles,
    TrashIcon as Trash2,
    UserPlusIcon as UserPlus,
    XMarkIcon as XIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import PublicSprintLayout from '@/Layouts/PublicSprintLayout';
import UserAvatar from '@/Components/UserAvatar';
import { useLanguage } from '@/Contexts/LanguageContext';

export default function Index({ auth, notifications }) {
    const { tl, formatDateTime } = useLanguage();
    const [localNotifications, setLocalNotifications] = useState(notifications.data || []);
    // Track responded invitations locally: { [invitationId]: 'accepted' | 'declined' }
    const [invitationResponses, setInvitationResponses] = useState({});

    const respondToInvitation = (invitationId, action, notificationId) => {
        const routeName = action === 'accept' ? 'invitations.accept' : 'invitations.decline';
        router.post(route(routeName, invitationId), {}, {
            preserveScroll: true,
            onSuccess: () => {
                setInvitationResponses(prev => ({ ...prev, [invitationId]: action + 'd' }));
                setLocalNotifications(prev =>
                    prev.map(n => n.id === notificationId ? { ...n, read_at: new Date() } : n)
                );
            },
        });
    };

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
            case 'sprint_invitation':
                return <RocketIcon className="w-5 h-5 text-emerald-600" />;
            case 'welcome':
                return <Sparkles className="w-5 h-5 text-green-600" />;
            case 'google_password_setup':
                return <Lock className="w-5 h-5 text-indigo-600" />;
            default:
                return <Bell className="w-5 h-5 text-gray-600" />;
        }
    };

    const getNotificationMessage = (notification) => {
        const data = notification.data || {};

        if (data.translation_key) {
            return tl(data.translation_key, data.translation_params || {});
        }

        return data.message;
    };

    const getNotificationLink = (notification) => {
        const data = notification.data;
        
        if (data.target === 'settings') {
            return route('settings.index');
        }
        if (data.target === 'dashboard') {
            return route('dashboard');
        }
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
                                        <div className="flex-1 min-w-0">
                                            <p
                                                className={`text-sm ${isUnread ? 'font-semibold' : ''} text-gray-900 dark:text-white cursor-pointer`}
                                                onClick={() => handleNotificationClick(notification)}
                                            >
                                                {getNotificationMessage(notification)}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                {formatDateTime(notification.created_at)}
                                            </p>

                                            {/* Inline Accept/Decline for sprint invitations */}
                                            {notification.type === 'sprint_invitation' && notification.data?.invitation_id && (() => {
                                                const invId = notification.data.invitation_id;
                                                const response = invitationResponses[invId];
                                                if (response === 'accepted') {
                                                    return (
                                                        <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                                                            <Check className="h-3.5 w-3.5" /> {tl('Joined!')}
                                                        </span>
                                                    );
                                                }
                                                if (response === 'declined') {
                                                    return (
                                                        <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                                                            {tl('Declined')}
                                                        </span>
                                                    );
                                                }
                                                return (
                                                    <div className="mt-2 flex items-center gap-2">
                                                        <button
                                                            onClick={() => respondToInvitation(invId, 'accept', notification.id)}
                                                            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-emerald-700"
                                                        >
                                                            <Check className="h-3.5 w-3.5" /> {tl('Accept')}
                                                        </button>
                                                        <button
                                                            onClick={() => respondToInvitation(invId, 'decline', notification.id)}
                                                            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 transition hover:bg-gray-50 dark:hover:bg-gray-800"
                                                        >
                                                            <XIcon className="h-3.5 w-3.5" /> {tl('Decline')}
                                                        </button>
                                                        {notification.data.sprint_ulid && (
                                                            <a
                                                                href={route('sprints.show', notification.data.sprint_ulid)}
                                                                className="text-xs text-emerald-600 hover:underline dark:text-emerald-400"
                                                                onClick={e => e.stopPropagation()}
                                                            >
                                                                {tl('View sprint')} →
                                                            </a>
                                                        )}
                                                    </div>
                                                );
                                            })()}
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
