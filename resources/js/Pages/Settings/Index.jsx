import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
    BellAlertIcon as Bell,
    BookmarkSquareIcon as Save,
    CheckIcon as Check,
    ChatBubbleOvalLeftEllipsisIcon as MessageSquare,
    Cog6ToothIcon as SettingsIcon,
    ComputerDesktopIcon as Monitor,
    EnvelopeIcon as Mail,
    ExclamationTriangleIcon as AlertTriangle,
    EyeIcon as Eye,
    EyeSlashIcon as EyeOff,
    GlobeAltIcon as Globe,
    HeartIcon as Heart,
    LockClosedIcon as Lock,
    MoonIcon as Moon,
    PaintBrushIcon as Palette,
    SunIcon as Sun,
    TrashIcon as Trash2,
    TrophyIcon as Trophy,
    UserCircleIcon as User,
} from '@heroicons/react/24/outline';
import PublicSprintLayout from '@/Layouts/PublicSprintLayout';
import { useLanguage } from '@/Contexts/LanguageContext';

export default function Settings({ auth, user }) {
    const { t, tl } = useLanguage();
    const [activeTab, setActiveTab] = useState('notifications');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    
    // Sync database values to localStorage on mount
    useEffect(() => {
        if (user.theme) {
            localStorage.setItem('theme', user.theme);
        }
        if (user.language) {
            localStorage.setItem('language', user.language);
        }
    }, []);

    // Notification settings form
    const notificationForm = useForm({
        email_notifications: user.email_notifications ?? true,
        sprint_updates_notifications: user.sprint_updates_notifications ?? true,
        comment_notifications: user.comment_notifications ?? true,
        reaction_notifications: user.reaction_notifications ?? true,
        sprint_completion_notifications: user.sprint_completion_notifications ?? true,
    });

    // Privacy settings form
    const privacyForm = useForm({
        profile_public: user.profile_public ?? true,
        show_email: user.show_email ?? false,
        show_stats: user.show_stats ?? true,
    });

    // Preferences form - TEMPORARILY COMMENTED OUT
    // const preferencesForm = useForm({
    //     theme: user.theme || 'light',
    //     language: user.language || 'en',
    // });

    // Account settings form
    const accountForm = useForm({
        name: user.name,
        email: user.email,
        bio: user.bio ?? '',
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    });

    // Delete account form
    const deleteForm = useForm({
        password: '',
    });

    const handleNotificationSubmit = (e) => {
        e.preventDefault();
        notificationForm.post(route('settings.notifications'), {
            preserveScroll: true,
        });
    };

    const handlePrivacySubmit = (e) => {
        e.preventDefault();
        privacyForm.post(route('settings.privacy'), {
            preserveScroll: true,
        });
    };

    // TEMPORARILY COMMENTED OUT
    // const handlePreferencesSubmit = (e) => {
    //     e.preventDefault();
    //     
    //     // Save to localStorage immediately
    //     localStorage.setItem('theme', preferencesForm.data.theme);
    //     localStorage.setItem('language', preferencesForm.data.language);
    //     
    //     preferencesForm.post(route('settings.preferences'), {
    //         preserveScroll: true,
    //         onSuccess: () => {
    //             // Force page reload to apply new theme/language
    //             window.location.reload();
    //         },
    //     });
    // };

    const handleAccountSubmit = (e) => {
        e.preventDefault();
        accountForm.post(route('settings.account'), {
            preserveScroll: true,
            onSuccess: () => {
                accountForm.reset('current_password', 'new_password', 'new_password_confirmation');
            },
        });
    };

    const handleDeleteAccount = (e) => {
        e.preventDefault();
        if (confirm(t('settings.account.deleteConfirm'))) {
            deleteForm.post(route('settings.delete'), {
                onSuccess: () => setShowDeleteModal(false),
            });
        }
    };

    const tabs = [
        { id: 'notifications', label: t('settings.tabs.notifications'), icon: Bell },
        { id: 'privacy', label: t('settings.tabs.privacy'), icon: Lock },
        { id: 'account', label: t('settings.tabs.account'), icon: User },
        // { id: 'preferences', label: t('settings.tabs.preferences'), icon: Palette }, // TEMPORARILY COMMENTED OUT
    ];

    return (
        <PublicSprintLayout>
            <Head title={t('settings.title')} />

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                                <SettingsIcon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('settings.title')}</h1>
                                <p className="text-gray-600 dark:text-gray-400">{t('settings.subtitle')}</p>
                            </div>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Sidebar Navigation */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="lg:col-span-1"
                        >
                            <div className="bg-white rounded-xl border border-gray-200 p-2 sticky top-8">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                                            activeTab === tab.id
                                                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        <tab.icon className="w-5 h-5" />
                                        <span className="font-semibold">{tab.label}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        {/* Content Area */}
                        <div className="lg:col-span-3">
                            {/* Notifications Tab */}
                            {activeTab === 'notifications' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-xl border border-gray-200 p-6"
                                >
                                    <div className="flex items-center space-x-3 mb-6">
                                        <Bell className="w-6 h-6 text-green-600" />
                                        <h2 className="text-2xl font-bold text-gray-900">{t('settings.notifications.title')}</h2>
                                    </div>

                                    <form onSubmit={handleNotificationSubmit} className="space-y-6">
                                        {/* Master Toggle */}
                                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border-2 border-green-200">
                                            <div className="flex items-center space-x-3">
                                                <Mail className="w-5 h-5 text-green-600" />
                                                <div>
                                                    <p className="font-bold text-gray-900">{t('settings.notifications.master')}</p>
                                                    <p className="text-sm text-gray-600">{t('settings.notifications.masterDesc')}</p>
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={notificationForm.data.email_notifications}
                                                    onChange={(e) => notificationForm.setData('email_notifications', e.target.checked)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-600"></div>
                                            </label>
                                        </div>

                                        {/* Individual Toggles */}
                                        <div className="space-y-4">
                                            {[
                                                { key: 'sprint_updates_notifications', icon: MessageSquare, label: t('settings.notifications.sprintUpdates'), desc: t('settings.notifications.sprintUpdatesDesc') },
                                                { key: 'comment_notifications', icon: MessageSquare, label: t('settings.notifications.comments'), desc: t('settings.notifications.commentsDesc') },
                                                { key: 'reaction_notifications', icon: Heart, label: t('settings.notifications.reactions'), desc: t('settings.notifications.reactionsDesc') },
                                                { key: 'sprint_completion_notifications', icon: Trophy, label: t('settings.notifications.sprintCompletion'), desc: t('settings.notifications.sprintCompletionDesc') },
                                            ].map((item) => (
                                                <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-green-300 transition-colors">
                                                    <div className="flex items-center space-x-3">
                                                        <item.icon className="w-5 h-5 text-gray-600" />
                                                        <div>
                                                            <p className="font-semibold text-gray-900">{item.label}</p>
                                                            <p className="text-sm text-gray-600">{item.desc}</p>
                                                        </div>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={notificationForm.data[item.key]}
                                                            onChange={(e) => notificationForm.setData(item.key, e.target.checked)}
                                                            disabled={!notificationForm.data.email_notifications}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600 peer-disabled:opacity-50"></div>
                                                    </label>
                                                </div>
                                            ))}
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={notificationForm.processing}
                                            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                                        >
                                            <Save className="w-5 h-5" />
                                            <span>{notificationForm.processing ? t('settings.notifications.saving') : t('settings.notifications.save')}</span>
                                        </button>
                                    </form>
                                </motion.div>
                            )}

                            {/* Privacy Tab */}
                            {activeTab === 'privacy' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-xl border border-gray-200 p-6"
                                >
                                    <div className="flex items-center space-x-3 mb-6">
                                        <Lock className="w-6 h-6 text-green-600" />
                                        <h2 className="text-2xl font-bold text-gray-900">{t('settings.privacy.title')}</h2>
                                    </div>

                                    <form onSubmit={handlePrivacySubmit} className="space-y-6">
                                        {[
                                            { key: 'profile_public', icon: Eye, label: t('settings.privacy.publicProfile'), desc: t('settings.privacy.publicProfileDesc') },
                                            { key: 'show_email', icon: Mail, label: t('settings.privacy.showEmail'), desc: t('settings.privacy.showEmailDesc') },
                                            { key: 'show_stats', icon: Trophy, label: t('settings.privacy.showStats'), desc: t('settings.privacy.showStatsDesc') },
                                        ].map((item) => (
                                            <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-green-300 transition-colors">
                                                <div className="flex items-center space-x-3">
                                                    <item.icon className="w-5 h-5 text-gray-600" />
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{item.label}</p>
                                                        <p className="text-sm text-gray-600">{item.desc}</p>
                                                    </div>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={privacyForm.data[item.key]}
                                                        onChange={(e) => privacyForm.setData(item.key, e.target.checked)}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                                </label>
                                            </div>
                                        ))}

                                        <button
                                            type="submit"
                                            disabled={privacyForm.processing}
                                            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                                        >
                                            <Save className="w-5 h-5" />
                                            <span>{privacyForm.processing ? t('settings.privacy.saving') : t('settings.privacy.save')}</span>
                                        </button>
                                    </form>
                                </motion.div>
                            )}

                            {/* Account Tab */}
                            {activeTab === 'account' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-6"
                                >
                                    {/* Account Info */}
                                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                                        <div className="flex items-center space-x-3 mb-6">
                                            <User className="w-6 h-6 text-green-600" />
                                            <h2 className="text-2xl font-bold text-gray-900">{t('settings.account.title')}</h2>
                                        </div>

                                        <form onSubmit={handleAccountSubmit} className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">{t('settings.account.name')}</label>
                                                <input
                                                    type="text"
                                                    value={accountForm.data.name}
                                                    onChange={(e) => accountForm.setData('name', e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                />
                                                {accountForm.errors.name && <p className="mt-1 text-sm text-red-600">{accountForm.errors.name}</p>}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">{t('settings.account.email')}</label>
                                                <input
                                                    type="email"
                                                    value={accountForm.data.email}
                                                    onChange={(e) => accountForm.setData('email', e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                />
                                                {accountForm.errors.email && <p className="mt-1 text-sm text-red-600">{accountForm.errors.email}</p>}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">{t('settings.account.bio')}</label>
                                                <textarea
                                                    value={accountForm.data.bio}
                                                    onChange={(e) => accountForm.setData('bio', e.target.value)}
                                                    rows={3}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                    placeholder={t('settings.account.bioPlaceholder')}
                                                />
                                                {accountForm.errors.bio && <p className="mt-1 text-sm text-red-600">{accountForm.errors.bio}</p>}
                                            </div>

                                            <div className="pt-4 border-t border-gray-200">
                                                <h3 className="text-lg font-bold text-gray-900 mb-4">{t('settings.account.changePassword')}</h3>
                                                
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-bold text-gray-700 mb-2">{t('settings.account.currentPassword')}</label>
                                                        <input
                                                            type="password"
                                                            value={accountForm.data.current_password}
                                                            onChange={(e) => accountForm.setData('current_password', e.target.value)}
                                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                        />
                                                        {accountForm.errors.current_password && <p className="mt-1 text-sm text-red-600">{accountForm.errors.current_password}</p>}
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-bold text-gray-700 mb-2">{t('settings.account.newPassword')}</label>
                                                        <input
                                                            type="password"
                                                            value={accountForm.data.new_password}
                                                            onChange={(e) => accountForm.setData('new_password', e.target.value)}
                                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                        />
                                                        {accountForm.errors.new_password && <p className="mt-1 text-sm text-red-600">{accountForm.errors.new_password}</p>}
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-bold text-gray-700 mb-2">{t('settings.account.confirmPassword')}</label>
                                                        <input
                                                            type="password"
                                                            value={accountForm.data.new_password_confirmation}
                                                            onChange={(e) => accountForm.setData('new_password_confirmation', e.target.value)}
                                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={accountForm.processing}
                                                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                                            >
                                                <Save className="w-5 h-5" />
                                                <span>{accountForm.processing ? t('settings.account.saving') : t('settings.account.save')}</span>
                                            </button>
                                        </form>
                                    </div>

                                    {/* Danger Zone */}
                                    <div className="bg-red-50 rounded-xl border-2 border-red-200 p-6">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <AlertTriangle className="w-6 h-6 text-red-600" />
                                            <h3 className="text-xl font-bold text-red-900">{t('settings.account.dangerZone')}</h3>
                                        </div>
                                        <p className="text-sm text-red-700 mb-4">
                                            {t('settings.account.dangerZoneDesc')}
                                        </p>
                                        <button
                                            onClick={() => setShowDeleteModal(true)}
                                            className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                            <span>{t('settings.account.deleteAccount')}</span>
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Preferences Tab - TEMPORARILY REMOVED */}
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Account Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
                    >
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">{t('settings.account.deleteModal.title')}</h3>
                        </div>

                        <p className="text-gray-600 mb-6">
                            {t('settings.account.deleteModal.description')}
                        </p>

                        <form onSubmit={handleDeleteAccount} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    {t('settings.account.deleteModal.passwordLabel')}
                                </label>
                                <input
                                    type="password"
                                    value={deleteForm.data.password}
                                    onChange={(e) => deleteForm.setData('password', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    placeholder={t('settings.account.deleteModal.passwordPlaceholder')}
                                />
                                {deleteForm.errors.password && <p className="mt-1 text-sm text-red-600">{deleteForm.errors.password}</p>}
                            </div>

                            <div className="flex items-center space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all"
                                >
                                    {t('settings.account.deleteModal.cancel')}
                                </button>
                                <button
                                    type="submit"
                                    disabled={deleteForm.processing}
                                    className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all disabled:opacity-50"
                                >
                                    {deleteForm.processing ? t('settings.account.deleteModal.deleting') : t('settings.account.deleteModal.confirm')}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </PublicSprintLayout>
    );
}

