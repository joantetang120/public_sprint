import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Camera, User, Mail, MapPin, Globe, Save, ArrowLeft, Upload } from 'lucide-react';
import { useState } from 'react';
import PublicSprintLayout from '@/Layouts/PublicSprintLayout';

export default function EditNew({ auth }) {
    const { data, setData, post, patch, processing, errors } = useForm({
        name: auth.user.name || '',
        email: auth.user.email || '',
        bio: auth.user.bio || '',
        location: auth.user.location || '',
        website: auth.user.website || '',
        avatar: null,
        cover_image: null,
    });

    const [avatarPreview, setAvatarPreview] = useState(
        auth.user.avatar ? `/storage/${auth.user.avatar}` : null
    );
    const [coverPreview, setCoverPreview] = useState(
        auth.user.cover_image ? `/storage/${auth.user.cover_image}` : null
    );

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('avatar', file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleCoverChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('cover_image', file);
            setCoverPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Use post with _method for file uploads
        post(route('profile.update.full'), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const getAvatarUrl = () => {
        if (avatarPreview) return avatarPreview;
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(auth.user.name)}&size=200&background=random`;
    };

    return (
        <PublicSprintLayout>
            <Head title="Edit Profile" />

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white">
                            Edit Profile
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Update your profile information and settings
                        </p>
                    </div>
                    <Link
                        href={route('users.show', auth.user.id)}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-dark-800 text-gray-900 dark:text-white rounded-xl hover:bg-gray-200 dark:hover:bg-dark-700 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Profile</span>
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Cover Image & Avatar Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-dark-900 rounded-2xl border-2 border-gray-200 dark:border-dark-700 overflow-hidden"
                    >
                        {/* Cover Image */}
                        <div className="relative h-48 bg-gradient-to-r from-primary-600 to-purple-600">
                            {coverPreview && (
                                <img 
                                    src={coverPreview}
                                    alt="Cover"
                                    className="w-full h-full object-cover"
                                />
                            )}
                            <label className="absolute top-4 right-4 cursor-pointer">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleCoverChange}
                                    className="hidden"
                                />
                                <div className="px-4 py-2 bg-white/90 dark:bg-dark-900/90 backdrop-blur-sm rounded-xl flex items-center space-x-2 hover:bg-white dark:hover:bg-dark-900 transition-colors">
                                    <Camera className="w-4 h-4 text-gray-900 dark:text-white" />
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                        Change Cover
                                    </span>
                                </div>
                            </label>
                        </div>

                        {/* Avatar */}
                        <div className="px-8 pb-8">
                            <div className="flex items-end -mt-16 mb-6">
                                <div className="relative">
                                    <img 
                                        src={getAvatarUrl()}
                                        alt={auth.user.name}
                                        className="w-32 h-32 rounded-2xl border-4 border-white dark:border-dark-900 shadow-xl"
                                    />
                                    <label className="absolute bottom-0 right-0 cursor-pointer">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                            className="hidden"
                                        />
                                        <div className="w-10 h-10 bg-primary-600 hover:bg-primary-700 rounded-xl flex items-center justify-center shadow-lg transition-colors">
                                            <Camera className="w-5 h-5 text-white" />
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {errors.avatar && (
                                <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                                    {errors.avatar}
                                </p>
                            )}
                            {errors.cover_image && (
                                <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                                    {errors.cover_image}
                                </p>
                            )}
                        </div>
                    </motion.div>

                    {/* Profile Information */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white dark:bg-dark-900 rounded-2xl border-2 border-gray-200 dark:border-dark-700 p-8"
                    >
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                            Profile Information
                        </h2>

                        <div className="space-y-6">
                            {/* Name */}
                            <div>
                                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    <User className="w-4 h-4" />
                                    <span>Name</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-800 border-2 border-gray-200 dark:border-dark-700 rounded-xl focus:border-primary-500 dark:focus:border-primary-500 focus:outline-none text-gray-900 dark:text-white"
                                    placeholder="Your name"
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    <Mail className="w-4 h-4" />
                                    <span>Email</span>
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-800 border-2 border-gray-200 dark:border-dark-700 rounded-xl focus:border-primary-500 dark:focus:border-primary-500 focus:outline-none text-gray-900 dark:text-white"
                                    placeholder="your@email.com"
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Bio */}
                            <div>
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                                    Bio
                                </label>
                                <textarea
                                    value={data.bio}
                                    onChange={(e) => setData('bio', e.target.value)}
                                    rows="4"
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-800 border-2 border-gray-200 dark:border-dark-700 rounded-xl focus:border-primary-500 dark:focus:border-primary-500 focus:outline-none text-gray-900 dark:text-white resize-none"
                                    placeholder="Tell us about yourself..."
                                    maxLength="500"
                                />
                                <div className="flex justify-between items-center mt-1">
                                    {errors.bio && (
                                        <p className="text-sm text-red-600 dark:text-red-400">
                                            {errors.bio}
                                        </p>
                                    )}
                                    <p className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                                        {data.bio.length}/500
                                    </p>
                                </div>
                            </div>

                            {/* Location */}
                            <div>
                                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    <MapPin className="w-4 h-4" />
                                    <span>Location</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.location}
                                    onChange={(e) => setData('location', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-800 border-2 border-gray-200 dark:border-dark-700 rounded-xl focus:border-primary-500 dark:focus:border-primary-500 focus:outline-none text-gray-900 dark:text-white"
                                    placeholder="City, Country"
                                />
                                {errors.location && (
                                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                                        {errors.location}
                                    </p>
                                )}
                            </div>

                            {/* Website */}
                            <div>
                                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    <Globe className="w-4 h-4" />
                                    <span>Website</span>
                                </label>
                                <input
                                    type="url"
                                    value={data.website}
                                    onChange={(e) => setData('website', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-800 border-2 border-gray-200 dark:border-dark-700 rounded-xl focus:border-primary-500 dark:focus:border-primary-500 focus:outline-none text-gray-900 dark:text-white"
                                    placeholder="https://yourwebsite.com"
                                />
                                {errors.website && (
                                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                                        {errors.website}
                                    </p>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Save Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex justify-end space-x-4"
                    >
                        <Link
                            href={route('users.show', auth.user.id)}
                            className="px-6 py-3 bg-gray-100 dark:bg-dark-800 text-gray-900 dark:text-white rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-dark-700 transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center space-x-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-colors"
                        >
                            <Save className="w-5 h-5" />
                            <span>{processing ? 'Saving...' : 'Save Changes'}</span>
                        </button>
                    </motion.div>
                </form>
            </div>
        </PublicSprintLayout>
    );
}
