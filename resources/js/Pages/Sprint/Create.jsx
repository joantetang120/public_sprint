import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
    Zap, Calendar, Lock, Globe, Tag, ArrowRight, ArrowLeft, 
    Info, CheckCircle2, Sparkles, Rocket, Target, Users, Settings
} from 'lucide-react';
import { useState } from 'react';
import PublicSprintLayout from '@/Layouts/PublicSprintLayout';

export default function Create({ auth, tags }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        duration_days: 7,
        is_private: false,
        starts_at: '',
        tags: [],
    });

    const [selectedTags, setSelectedTags] = useState([]);
    const [customTag, setCustomTag] = useState('');
    const [currentStep, setCurrentStep] = useState(1);

    const durations = [
        { value: 3, label: '3 Days', description: 'Quick sprint', icon: '⚡' },
        { value: 7, label: '7 Days', description: 'One week', icon: '🚀' },
        { value: 14, label: '14 Days', description: 'Two weeks', icon: '🎯' },
        { value: 21, label: '21 Days', description: 'Three weeks', icon: '📈' },
        { value: 30, label: '30 Days', description: 'One month', icon: '🌟' },
    ];

    const steps = [
        { number: 1, title: 'Basic Info', icon: Target },
        { number: 2, title: 'Duration & Start', icon: Calendar },
        { number: 3, title: 'Settings', icon: Settings },
        { number: 4, title: 'Review', icon: CheckCircle2 }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('sprints.store'));
    };

    const addTag = (tagName) => {
        if (!selectedTags.includes(tagName) && selectedTags.length < 5) {
            const newTags = [...selectedTags, tagName];
            setSelectedTags(newTags);
            setData('tags', newTags);
        }
    };

    const removeTag = (tagName) => {
        const newTags = selectedTags.filter(t => t !== tagName);
        setSelectedTags(newTags);
        setData('tags', newTags);
    };

    const addCustomTag = () => {
        if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
            addTag(customTag.trim());
            setCustomTag('');
        }
    };

    // Set default start date to tomorrow
    useState(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dateString = tomorrow.toISOString().split('T')[0];
        setData('starts_at', dateString);
    }, []);

    return (
        <PublicSprintLayout>
            <Head title="Create New Sprint" />

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <Link
                            href={route('dashboard')}
                            className="inline-flex items-center space-x-2 text-gray-600 hover:text-green-600 font-medium mb-6 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Back to Dashboard</span>
                        </Link>
                        
                        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-50 rounded-full mb-4 border border-green-200">
                            <Sparkles className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-semibold text-green-700">
                                Start building with the community
                            </span>
                        </div>
                        
                        <h1 className="text-4xl font-bold text-gray-900 mb-3">
                            Create Your Sprint
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Set up a time-boxed project and invite fellow builders to join your journey
                        </p>
                    </motion.div>

                    {/* Progress Steps */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex justify-center mb-12"
                    >
                        <div className="flex items-center space-x-8">
                            {[1, 2, 3, 4].map((step) => (
                                <div key={step} className="flex items-center space-x-2">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm border-2 ${
                                        step <= currentStep
                                            ? 'bg-green-500 border-green-500 text-white'
                                            : 'bg-white border-gray-300 text-gray-400'
                                    }`}>
                                        {step}
                                    </div>
                                    {step < 4 && (
                                        <div className={`w-8 h-0.5 ${
                                            step < currentStep ? 'bg-green-500' : 'bg-gray-300'
                                        }`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Sprint Basics */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl p-8 border border-gray-200"
                        >
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                    <Target className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Sprint Basics</h2>
                                    <p className="text-gray-600">Tell us about your project</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                                        What are you building? *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="e.g., Build a SaaS product, Create a mobile app, Design a portfolio..."
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none text-gray-900 placeholder-gray-500 font-medium transition-all"
                                        required
                                    />
                                    {errors.title && (
                                        <p className="mt-2 text-sm text-red-600">{errors.title}</p>
                                    )}
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                                        Project Description
                                    </label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Describe your project goals, what you hope to achieve, and what you'll be working on..."
                                        rows={4}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none text-gray-900 placeholder-gray-500 font-medium transition-all resize-none"
                                    />
                                    {errors.description && (
                                        <p className="mt-2 text-sm text-red-600">{errors.description}</p>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        {/* Duration & Timing */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-2xl p-8 border border-gray-200"
                        >
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Duration & Timing</h2>
                                    <p className="text-gray-600">Set your sprint timeline</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Duration */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-4">
                                        How long is your sprint? *
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                        {durations.map((duration) => (
                                            <button
                                                key={duration.value}
                                                type="button"
                                                onClick={() => setData('duration_days', duration.value)}
                                                className={`p-4 rounded-lg border transition-all text-center ${
                                                    data.duration_days === duration.value
                                                        ? 'border-green-500 bg-green-50 shadow-sm'
                                                        : 'border-gray-200 hover:border-gray-300 bg-white'
                                                }`}
                                            >
                                                <div className="text-2xl mb-2">{duration.icon}</div>
                                                <div className={`font-semibold text-sm mb-1 ${
                                                    data.duration_days === duration.value
                                                        ? 'text-green-700'
                                                        : 'text-gray-900'
                                                }`}>
                                                    {duration.label}
                                                </div>
                                                <div className="text-xs text-gray-600">
                                                    {duration.description}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                    {errors.duration_days && (
                                        <p className="mt-2 text-sm text-red-600">{errors.duration_days}</p>
                                    )}
                                </div>

                                {/* Start Date */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                                        When do you want to start? *
                                    </label>
                                    <div className="relative max-w-xs">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="date"
                                            value={data.starts_at}
                                            onChange={(e) => setData('starts_at', e.target.value)}
                                            min={new Date().toISOString().split('T')[0]}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none text-gray-900 font-medium transition-all"
                                            required
                                        />
                                    </div>
                                    {errors.starts_at && (
                                        <p className="mt-2 text-sm text-red-600">{errors.starts_at}</p>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        {/* Sprint Settings */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-2xl p-8 border border-gray-200"
                        >
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                    <Settings className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Sprint Settings</h2>
                                    <p className="text-gray-600">Configure visibility and tags</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Privacy */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-4">
                                        Who can join your sprint?
                                    </label>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setData('is_private', false)}
                                            className={`p-4 rounded-lg border transition-all text-left ${
                                                !data.is_private
                                                    ? 'border-green-500 bg-green-50'
                                                    : 'border-gray-200 hover:border-gray-300 bg-white'
                                            }`}
                                        >
                                            <div className="flex items-center space-x-3 mb-2">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                                    !data.is_private
                                                        ? 'bg-green-100'
                                                        : 'bg-gray-100'
                                                }`}>
                                                    <Globe className={`w-4 h-4 ${
                                                        !data.is_private ? 'text-green-600' : 'text-gray-600'
                                                    }`} />
                                                </div>
                                                <div className={`font-semibold ${
                                                    !data.is_private ? 'text-green-700' : 'text-gray-900'
                                                }`}>
                                                    Public Sprint
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                Anyone can discover and join your sprint
                                            </p>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setData('is_private', true)}
                                            className={`p-4 rounded-lg border transition-all text-left ${
                                                data.is_private
                                                    ? 'border-green-500 bg-green-50'
                                                    : 'border-gray-200 hover:border-gray-300 bg-white'
                                            }`}
                                        >
                                            <div className="flex items-center space-x-3 mb-2">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                                    data.is_private
                                                        ? 'bg-green-100'
                                                        : 'bg-gray-100'
                                                }`}>
                                                    <Lock className={`w-4 h-4 ${
                                                        data.is_private ? 'text-green-600' : 'text-gray-600'
                                                    }`} />
                                                </div>
                                                <div className={`font-semibold ${
                                                    data.is_private ? 'text-green-700' : 'text-gray-900'
                                                }`}>
                                                    Private Sprint
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                Only people you invite can join
                                            </p>
                                        </button>
                                    </div>
                                </div>

                                {/* Tags */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                                        Add tags to help others find your sprint
                                    </label>
                                    
                                    {/* Selected Tags */}
                                    {selectedTags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {selectedTags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="inline-flex items-center space-x-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                                                >
                                                    <span>#{tag}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeTag(tag)}
                                                        className="hover:text-green-900 text-lg leading-none"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Tag Input */}
                                    <div className="flex space-x-2 mb-4">
                                        <div className="relative flex-1">
                                            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="text"
                                                value={customTag}
                                                onChange={(e) => setCustomTag(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomTag())}
                                                placeholder="Add a tag..."
                                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none text-gray-900 placeholder-gray-500 text-sm"
                                                disabled={selectedTags.length >= 5}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={addCustomTag}
                                            disabled={!customTag.trim() || selectedTags.length >= 5}
                                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors disabled:opacity-50 text-sm"
                                        >
                                            Add
                                        </button>
                                    </div>

                                    {/* Popular Tags */}
                                    {tags && tags.length > 0 && (
                                        <div>
                                            <p className="text-sm text-gray-600 mb-2">Suggestions:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {tags.slice(0, 8).map((tag) => (
                                                    <button
                                                        key={tag.id}
                                                        type="button"
                                                        onClick={() => addTag(tag.name)}
                                                        disabled={selectedTags.includes(tag.name) || selectedTags.length >= 5}
                                                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
                                                    >
                                                        #{tag.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        {/* Action Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-8 text-white text-center"
                        >
                            <Rocket className="w-12 h-12 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold mb-2">Ready to launch your sprint?</h3>
                            <p className="text-green-100 mb-6 max-w-md mx-auto">
                                Create your sprint and start building with the community today
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-8 py-4 bg-white text-green-600 rounded-lg font-bold hover:scale-105 transition-all flex items-center justify-center space-x-2 shadow-lg"
                                >
                                    <span>{processing ? 'Creating...' : 'Launch Sprint'}</span>
                                    {!processing && <ArrowRight className="w-5 h-5" />}
                                </button>
                                <Link
                                    href={route('dashboard')}
                                    className="px-8 py-4 bg-white/10 text-white rounded-lg font-bold hover:bg-white/20 transition-colors"
                                >
                                    Cancel
                                </Link>
                            </div>
                        </motion.div>
                    </form>
                </div>
            </div>
        </PublicSprintLayout>
    );
}