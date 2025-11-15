import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { TrendingUp, Zap, Hash, Sparkles, Search, Filter, Plus, Calendar } from 'lucide-react';
import PublicSprintLayout from '@/Layouts/PublicSprintLayout';
import SprintCard from '@/Components/SprintCard';
import { useState } from 'react';

export default function Discover({ auth, trending = [], active = [], upcoming = [], popularTags = [] }) {
    const [searchQuery, setSearchQuery] = useState('');
    
    return (
        <PublicSprintLayout>
            <Head title="Discover Sprints" />

            <div className="space-y-16">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-100 to-purple-100 dark:from-primary-900/30 dark:to-purple-900/30 rounded-full mb-6">
                        <Sparkles className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                        <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                            {trending.length + active.length + upcoming.length}+ Sprints
                        </span>
                    </div>
                    <h1 className="text-5xl sm:text-6xl font-black mb-6 leading-tight">
                        <span className="text-gray-900 dark:text-white">Discover what</span>
                        <br />
                        <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">builders are shipping</span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
                        Join active sprints, get inspired, and build in public with the community
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search sprints by name, tag, or creator..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-dark-900 border-2 border-gray-200 dark:border-dark-800 rounded-2xl focus:border-primary-500 dark:focus:border-primary-500 focus:outline-none text-gray-900 dark:text-white placeholder-gray-400 font-medium"
                            />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-gray-100 dark:bg-dark-800 rounded-xl hover:bg-gray-200 dark:hover:bg-dark-700 transition-colors">
                                <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Popular Tags */}
                {popularTags && popularTags.length > 0 && (
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
                                    <Hash className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        Trending Topics
                                    </h2>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Popular tags this week</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {popularTags.map((tag, i) => (
                                <motion.button
                                    key={tag.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.05 * i }}
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="group px-5 py-3 bg-white dark:bg-dark-900 border-2 border-gray-200 dark:border-dark-800 hover:border-primary-500 dark:hover:border-primary-500 rounded-xl font-semibold transition-all shadow-sm hover:shadow-md"
                                >
                                    <span className="text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">#{tag.name}</span>
                                    <span className="ml-2 px-2 py-0.5 bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-400 rounded-full text-xs font-bold">
                                        {tag.usage_count}
                                    </span>
                                </motion.button>
                            ))}
                        </div>
                    </motion.section>
                )}

                {/* Trending Sprints */}
                {trending && trending.length > 0 && (
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                                    <TrendingUp className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-gray-900 dark:text-white">
                                        🔥 Trending Now
                                    </h2>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Most popular sprints this week</p>
                                </div>
                            </div>
                            <span className="px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full text-sm font-bold">
                                {trending.length} sprints
                            </span>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {trending.map((sprint, index) => (
                                <motion.div
                                    key={sprint.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.05 * index }}
                                >
                                    <SprintCard sprint={sprint} />
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>
                )}

                {/* Active Sprints */}
                {active && active.length > 0 && (
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                                    <Zap className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-gray-900 dark:text-white">
                                        ⚡ Active Sprints
                                    </h2>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Join these sprints happening right now</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-bold">
                                    {active.length} live
                                </span>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {active.map((sprint, index) => (
                                <motion.div
                                    key={sprint.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.05 * index }}
                                >
                                    <SprintCard sprint={sprint} />
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>
                )}

                {/* Upcoming Sprints */}
                {upcoming && upcoming.length > 0 && (
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-gray-900 dark:text-white">
                                        📅 Starting Soon
                                    </h2>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Get ready to join these upcoming sprints</p>
                                </div>
                            </div>
                            <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-bold">
                                {upcoming.length} upcoming
                            </span>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {upcoming.map((sprint, index) => (
                                <motion.div
                                    key={sprint.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.05 * index }}
                                >
                                    <SprintCard sprint={sprint} />
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>
                )}

                {/* Empty State */}
                {(!trending || trending.length === 0) && (!active || active.length === 0) && (!upcoming || upcoming.length === 0) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-32"
                    >
                        <div className="max-w-md mx-auto">
                            <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-primary-100 to-purple-100 dark:from-primary-900/30 dark:to-purple-900/30 flex items-center justify-center">
                                <Sparkles className="w-12 h-12 text-primary-600 dark:text-primary-400" />
                            </div>
                            <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-3">
                                No sprints yet
                            </h3>
                            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                                Be the first to create a sprint and start building in public!
                            </p>
                            {auth?.user && (
                                <Link
                                    href={route('sprints.create')}
                                    className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-2xl font-bold text-lg hover:scale-105 transition-transform shadow-xl"
                                >
                                    <Plus className="w-5 h-5" />
                                    <span>Create Your First Sprint</span>
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>
        </PublicSprintLayout>
    );
}
