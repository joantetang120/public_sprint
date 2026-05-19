import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, Image as ImageIcon, Link2, X, Calendar, Users } from 'lucide-react';
import { useState } from 'react';
import PublicSprintLayout from '@/Layouts/PublicSprintLayout';
import { routeKey } from '@/lib/routeKey';
import { useLanguage } from '@/Contexts/LanguageContext';

export default function Create({ auth, sprint }) {
    const { tl } = useLanguage();
    const { data, setData, post, processing, errors } = useForm({
        content: '',
        day_number: sprint.current_day || 1,
        images: [],
        links: [],
    });

    const [charCount, setCharCount] = useState(0);
    const maxChars = 1000;
    const [imagePreviews, setImagePreviews] = useState([]);
    const [linkInput, setLinkInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('updates.store', routeKey(sprint)), {
            forceFormData: true,
            onSuccess: () => {
                // Will redirect to sprint detail page
            }
        });
    };

    const handleContentChange = (e) => {
        const content = e.target.value;
        setData('content', content);
        setCharCount(content.length);
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const newImages = [...data.images, ...files];
            setData('images', newImages);
            
            // Create previews for new files
            files.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreviews(prev => [...prev, reader.result]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeImage = (index) => {
        const newImages = data.images.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);
        setData('images', newImages);
        setImagePreviews(newPreviews);
    };

    const addLink = () => {
        if (linkInput.trim() && data.links.length < 5) {
            setData('links', [...data.links, linkInput.trim()]);
            setLinkInput('');
        }
    };

    const removeLink = (index) => {
        const newLinks = data.links.filter((_, i) => i !== index);
        setData('links', newLinks);
    };

    // Check if sprint is active
    const isSprintActive = sprint.computed_status === 'active';

    return (
        <PublicSprintLayout>
            <Head title={`${tl('Post Update')} - ${sprint.title}`} />

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <Link
                            href={route('sprints.show', routeKey(sprint))}
                            className="inline-flex items-center space-x-2 text-gray-600 hover:text-green-600 font-medium mb-6 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Back to Sprint</span>
                        </Link>
                        
                        <div className="text-center mb-8">
                            <h1 className="text-4xl font-bold text-gray-900 mb-3">
                                {isSprintActive ? 'Share Your Progress' : 'Sprint Not Active'}
                            </h1>
                            <p className="text-lg text-gray-600">
                                {isSprintActive 
                                    ? 'Update the community on your sprint journey'
                                    : 'This sprint is no longer active. You cannot post new updates.'}
                            </p>
                        </div>

                        {/* Sprint Info Card */}
                        <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-1">{sprint.title}</h2>
                                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                                        <div className="flex items-center space-x-1">
                                            <Calendar className="w-4 h-4" />
                                            <span>Day {sprint.current_day || 1} of {sprint.duration_days}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Users className="w-4 h-4" />
                                            <span>{sprint.participants_count} participants</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-green-600">{sprint.updates_count || 0}</div>
                                    <div className="text-sm text-gray-600">Updates</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Update Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-xl p-6 border border-gray-200"
                        >
                            <label className="block text-sm font-semibold text-gray-900 mb-3">
                                What did you work on today? *
                            </label>
                            <textarea
                                value={data.content}
                                onChange={handleContentChange}
                                placeholder="Share your progress, challenges, learnings, or anything you'd like to update the community about..."
                                rows={6}
                                maxLength={maxChars}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none text-gray-900 placeholder-gray-500 font-medium transition-all resize-none"
                                required
                            />
                            
                            {/* Character Count */}
                            <div className="flex items-center justify-between mt-3">
                                <div className={`text-sm ${
                                    charCount > maxChars * 0.9 ? 'text-orange-600 font-medium' : 'text-gray-500'
                                }`}>
                                    {charCount} / {maxChars} characters
                                </div>
                                {errors.content && (
                                    <p className="text-sm text-red-600">
                                        {errors.content}
                                    </p>
                                )}
                            </div>

                            {/* Writing Tips */}
                            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <h4 className="font-medium text-blue-900 mb-2 text-sm">
                                    💡 Tips for great updates:
                                </h4>
                                <ul className="space-y-1 text-sm text-blue-800">
                                    <li>• Share specific progress or achievements</li>
                                    <li>• Mention challenges and how you overcame them</li>
                                    <li>• Include what you learned today</li>
                                    <li>• Be authentic - the community loves real stories!</li>
                                </ul>
                            </div>
                        </motion.div>

                        {/* Image Upload */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-xl p-6 border border-gray-200"
                        >
                            <label className="block text-sm font-semibold text-gray-900 mb-3">
                                Add Images ({imagePreviews.length} selected)
                            </label>
                            
                            {/* Image Previews Grid */}
                            {imagePreviews.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                                    {imagePreviews.map((preview, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={preview}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-24 object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-sm"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            {/* Upload Button */}
                            <label className="block cursor-pointer">
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
                                    <ImageIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                    <p className="text-gray-600 font-medium mb-1">
                                        Add images to your update
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        PNG, JPG, GIF up to 5MB each
                                    </p>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                            
                            {errors.images && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.images}
                                </p>
                            )}
                        </motion.div>

                        {/* Links */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-xl p-6 border border-gray-200"
                        >
                            <label className="block text-sm font-semibold text-gray-900 mb-3">
                                Add Links ({data.links.length}/5)
                            </label>
                            
                            {/* Added Links */}
                            {data.links.length > 0 && (
                                <div className="space-y-2 mb-4">
                                    {data.links.map((link, index) => (
                                        <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                                            <Link2 className="w-4 h-4 text-gray-600 flex-shrink-0" />
                                            <a 
                                                href={link} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="flex-1 text-sm text-gray-700 hover:text-green-600 truncate"
                                            >
                                                {link}
                                            </a>
                                            <button
                                                type="button"
                                                onClick={() => removeLink(index)}
                                                className="p-1 text-red-600 hover:bg-red-100 rounded-full flex-shrink-0"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            {/* Add Link Input */}
                            {data.links.length < 5 && (
                                <div className="flex space-x-2">
                                    <input
                                        type="url"
                                        value={linkInput}
                                        onChange={(e) => setLinkInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLink())}
                                        placeholder="https://example.com"
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none bg-white text-gray-900 text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={addLink}
                                        disabled={!linkInput.trim()}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 disabled:opacity-50 transition-colors text-sm"
                                    >
                                        Add
                                    </button>
                                </div>
                            )}
                            
                            {errors.links && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.links}
                                </p>
                            )}
                        </motion.div>

                        {/* Preview Section */}
                        {data.content && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white rounded-xl p-6 border border-gray-200"
                            >
                                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                                    Preview
                                </h3>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
                                        {data.content}
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {/* Submit Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white text-center"
                        >
                            <h3 className="text-xl font-bold mb-2">Ready to share your update?</h3>
                            <p className="text-green-100 mb-6">
                                Your progress will inspire others in the sprint
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    type="submit"
                                    disabled={processing || !data.content.trim()}
                                    className="px-8 py-3 bg-white text-green-600 rounded-lg font-semibold hover:scale-105 transition-all flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50"
                                >
                                    <Send className="w-5 h-5" />
                                    <span>{processing ? 'Posting...' : 'Post Update'}</span>
                                </button>
                                <Link
                                    href={route('sprints.show', routeKey(sprint))}
                                    className="px-8 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors"
                                >
                                    Cancel
                                </Link>
                            </div>
                        </motion.div>

                        {/* Info Note */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-center text-sm text-gray-600"
                        >
                            <p>
                                Your update will be visible to all sprint participants and visitors.
                                You can edit or delete it later if needed.
                            </p>
                        </motion.div>
                        </form>
                    ) : (
                        <div className="text-center py-8 bg-white rounded-xl shadow-sm border border-gray-200">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                <Calendar className="h-6 w-6 text-red-600" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Sprint {sprint.computed_status}</h3>
                            <p className="text-gray-600 mb-6">
                                This sprint is currently {sprint.computed_status}. You can only post updates to active sprints.
                            </p>
                            <Link
                                href={route('sprints.show', routeKey(sprint))}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                Back to Sprint
                            </Link>
                        </div>
                    )
                </div>
            </div>
        </PublicSprintLayout>
    );
}
