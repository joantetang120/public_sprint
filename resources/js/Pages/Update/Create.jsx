import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import {
    ArrowLeftIcon as ArrowLeft,
    CalendarDaysIcon as Calendar,
    LinkIcon as Link2,
    PaperAirplaneIcon as Send,
    PhotoIcon as ImageIcon,
    UserGroupIcon as Users,
    XMarkIcon as X,
} from '@heroicons/react/24/outline';
import PublicSprintLayout from '@/Layouts/PublicSprintLayout';
import { routeKey } from '@/lib/routeKey';
import { useLanguage } from '@/Contexts/LanguageContext';

export default function Create({ sprint }) {
    const { tl } = useLanguage();
    const { data, setData, post, processing, errors } = useForm({
        content: '',
        day_number: sprint.current_day || 1,
        images: [],
        links: [],
    });

    const [charCount, setCharCount] = useState(0);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [linkInput, setLinkInput] = useState('');
    const maxChars = 1000;
    const isSprintActive = sprint.computed_status === 'active';

    const handleSubmit = (event) => {
        event.preventDefault();
        post(route('updates.store', routeKey(sprint)), {
            forceFormData: true,
        });
    };

    const handleContentChange = (event) => {
        const content = event.target.value;
        setData('content', content);
        setCharCount(content.length);
    };

    const handleImageChange = (event) => {
        const files = Array.from(event.target.files || []);
        if (files.length === 0) {
            return;
        }

        const newImages = [...data.images, ...files];
        setData('images', newImages);

        files.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews((current) => [...current, reader.result]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index) => {
        setData(
            'images',
            data.images.filter((_, imageIndex) => imageIndex !== index)
        );
        setImagePreviews((current) => current.filter((_, imageIndex) => imageIndex !== index));
    };

    const addLink = () => {
        if (!linkInput.trim() || data.links.length >= 5) {
            return;
        }

        setData('links', [...data.links, linkInput.trim()]);
        setLinkInput('');
    };

    const removeLink = (index) => {
        setData(
            'links',
            data.links.filter((_, linkIndex) => linkIndex !== index)
        );
    };

    return (
        <PublicSprintLayout>
            <Head title={`${tl('New Publication')} - ${sprint.title}`} />

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <Link
                            href={route('sprints.show', routeKey(sprint))}
                            className="mb-6 inline-flex items-center space-x-2 font-medium text-gray-600 transition-colors hover:text-green-600"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span>{tl('Back to Sprint')}</span>
                        </Link>

                        <div className="mb-8 text-center">
                            <h1 className="mb-3 text-4xl font-bold text-gray-900">
                                {isSprintActive ? tl('Share Your Publication') : tl('Sprint Not Active')}
                            </h1>
                            <p className="text-lg text-gray-600">
                                {isSprintActive
                                    ? tl('Share your sprint progress with the community')
                                    : tl('This sprint is not active. You cannot publish yet.')}
                            </p>
                        </div>

                        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="mb-1 text-xl font-bold text-gray-900">{sprint.title}</h2>
                                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                                        <div className="flex items-center space-x-1">
                                            <Calendar className="h-4 w-4" />
                                            <span>
                                                {tl('Day {day} of {total}', {
                                                    day: sprint.current_day || 1,
                                                    total: sprint.duration_days,
                                                })}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Users className="h-4 w-4" />
                                            <span>
                                                {tl('{count} participant{suffix}', {
                                                    count: sprint.participants_count,
                                                    suffix: sprint.participants_count === 1 ? '' : 's',
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-green-600">{sprint.updates_count || 0}</div>
                                    <div className="text-sm text-gray-600">{tl('Publications')}</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {isSprintActive ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="rounded-xl border border-gray-200 bg-white p-6"
                            >
                                <label className="mb-3 block text-sm font-semibold text-gray-900">
                                    {tl('What did you publish today? *')}
                                </label>
                                <textarea
                                    value={data.content}
                                    onChange={handleContentChange}
                                    placeholder={tl('Share your progress, challenges, learnings, or anything you want the community to see.')}
                                    rows={6}
                                    maxLength={maxChars}
                                    className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 font-medium text-gray-900 transition-all placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                />

                                <div className="mt-3 flex items-center justify-between">
                                    <div
                                        className={`text-sm ${
                                            charCount > maxChars * 0.9 ? 'font-medium text-orange-600' : 'text-gray-500'
                                        }`}
                                    >
                                        {tl('{count} / {max} characters', { count: charCount, max: maxChars })}
                                    </div>
                                    {errors.content && <p className="text-sm text-red-600">{errors.content}</p>}
                                </div>

                                <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
                                    <h4 className="mb-2 text-sm font-medium text-blue-900">{tl('Tips for great publications:')}</h4>
                                    <ul className="space-y-1 text-sm text-blue-800">
                                        <li>{tl('• Share specific progress or achievements')}</li>
                                        <li>{tl('• Mention challenges and how you overcame them')}</li>
                                        <li>{tl('• Include what you learned today')}</li>
                                        <li>{tl('• Be authentic - the community loves real stories!')}</li>
                                    </ul>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="rounded-xl border border-gray-200 bg-white p-6"
                            >
                                <label className="mb-3 block text-sm font-semibold text-gray-900">
                                    {tl('Add Images ({count} selected)', { count: imagePreviews.length })}
                                </label>

                                {imagePreviews.length > 0 && (
                                    <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-3">
                                        {imagePreviews.map((preview, index) => (
                                            <div key={index} className="group relative">
                                                <img
                                                    src={preview}
                                                    alt={`Preview ${index + 1}`}
                                                    className="h-24 w-full rounded-lg object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white shadow-sm transition-colors hover:bg-red-600"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <label className="block cursor-pointer">
                                    <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition-colors hover:border-green-500">
                                        <ImageIcon className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                                        <p className="mb-1 font-medium text-gray-600">{tl('Add images to your publication')}</p>
                                        <p className="text-sm text-gray-500">{tl('PNG, JPG, GIF up to 5MB each')}</p>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>

                                {errors.images && <p className="mt-2 text-sm text-red-600">{errors.images}</p>}
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="rounded-xl border border-gray-200 bg-white p-6"
                            >
                                <label className="mb-3 block text-sm font-semibold text-gray-900">
                                    {tl('Add Links ({count}/5)', { count: data.links.length })}
                                </label>

                                {data.links.length > 0 && (
                                    <div className="mb-4 space-y-2">
                                        {data.links.map((link, index) => (
                                            <div key={index} className="flex items-center space-x-2 rounded-lg bg-gray-50 p-3">
                                                <Link2 className="h-4 w-4 flex-shrink-0 text-gray-600" />
                                                <a
                                                    href={link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex-1 truncate text-sm text-gray-700 hover:text-green-600"
                                                >
                                                    {link}
                                                </a>
                                                <button
                                                    type="button"
                                                    onClick={() => removeLink(index)}
                                                    className="flex-shrink-0 rounded-full p-1 text-red-600 hover:bg-red-100"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {data.links.length < 5 && (
                                    <div className="flex space-x-2">
                                        <input
                                            type="url"
                                            value={linkInput}
                                            onChange={(event) => setLinkInput(event.target.value)}
                                            onKeyPress={(event) => event.key === 'Enter' && (event.preventDefault(), addLink())}
                                            placeholder="https://example.com"
                                            className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={addLink}
                                            disabled={!linkInput.trim()}
                                            className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300 disabled:opacity-50"
                                        >
                                            {tl('Add')}
                                        </button>
                                    </div>
                                )}

                                {errors.links && <p className="mt-2 text-sm text-red-600">{errors.links}</p>}
                            </motion.div>

                            {data.content && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.35 }}
                                    className="rounded-xl border border-gray-200 bg-white p-6"
                                >
                                    <h3 className="mb-3 text-sm font-semibold text-gray-900">{tl('Preview')}</h3>
                                    <div className="rounded-lg bg-gray-50 p-4">
                                        <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">{data.content}</p>
                                    </div>
                                </motion.div>
                            )}

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="rounded-xl bg-gradient-to-r from-green-500 to-green-600 p-6 text-center text-white"
                            >
                                <h3 className="mb-2 text-xl font-bold">{tl('Ready to share your publication?')}</h3>
                                <p className="mb-6 text-green-100">{tl('Your progress can inspire other people in this sprint')}</p>

                                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                                    <button
                                        type="submit"
                                        disabled={processing || !data.content.trim()}
                                        className="flex items-center justify-center space-x-2 rounded-lg bg-white px-8 py-3 font-semibold text-green-600 shadow-lg transition-all hover:scale-105 disabled:opacity-50"
                                    >
                                        <Send className="h-5 w-5" />
                                        <span>{processing ? tl('Publishing...') : tl('Publish')}</span>
                                    </button>
                                    <Link
                                        href={route('sprints.show', routeKey(sprint))}
                                        className="rounded-lg bg-white/10 px-8 py-3 font-semibold text-white transition-colors hover:bg-white/20"
                                    >
                                        {tl('Cancel')}
                                    </Link>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="text-center text-sm text-gray-600"
                            >
                                <p>{tl('Your publication will be visible to all sprint participants and visitors. You can edit or delete it later if needed.')}</p>
                            </motion.div>
                        </form>
                    ) : (
                        <div className="rounded-xl border border-gray-200 bg-white py-8 text-center shadow-sm">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                                <Calendar className="h-6 w-6 text-red-600" />
                            </div>
                            <h3 className="mb-2 text-lg font-medium text-gray-900">
                                {tl('Sprint {status}', { status: tl(sprint.computed_status) })}
                            </h3>
                            <p className="mb-6 text-gray-600">
                                {tl('This sprint is currently {status}. You can only publish in active sprints.', {
                                    status: tl(sprint.computed_status),
                                })}
                            </p>
                            <Link
                                href={route('sprints.show', routeKey(sprint))}
                                className="inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700"
                            >
                                {tl('Back to Sprint')}
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </PublicSprintLayout>
    );
}
