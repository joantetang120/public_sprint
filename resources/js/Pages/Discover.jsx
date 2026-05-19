import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowTrendingUpIcon as TrendingUp,
    BoltIcon as Zap,
    HashtagIcon as Hash,
    SparklesIcon as Sparkles,
} from '@heroicons/react/24/outline';
import AppLayout from '@/Layouts/AppLayout';
import SprintCard from '@/Components/SprintCard';

export default function Discover({ trending, active, popularTags }) {
    return (
        <AppLayout>
            <Head title="Discover Sprints" />

            <div className="space-y-12">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4">
                        <Sparkles className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                        <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                            Discover Amazing Projects
                        </span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black mb-4">
                        <span className="gradient-text">Explore Sprints</span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Join active sprints or discover what others are building
                    </p>
                </motion.div>

                {/* Popular Tags */}
                {popularTags && popularTags.length > 0 && (
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="flex items-center space-x-2 mb-6">
                            <Hash className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Popular Tags
                            </h2>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {popularTags.map((tag) => (
                                <motion.button
                                    key={tag.id}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-4 py-2 glass-card rounded-xl font-medium hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                                >
                                    <span className="text-primary-600 dark:text-primary-400">#{tag.name}</span>
                                    <span className="ml-2 text-gray-500 dark:text-gray-400 text-sm">
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
                        <div className="flex items-center space-x-2 mb-6">
                            <TrendingUp className="w-6 h-6 text-orange-500" />
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Trending Sprints
                            </h2>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {trending.map((sprint, index) => (
                                <motion.div
                                    key={sprint.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * index }}
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
                        <div className="flex items-center space-x-2 mb-6">
                            <Zap className="w-6 h-6 text-green-500" />
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Active Sprints
                            </h2>
                            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-semibold">
                                Happening Now
                            </span>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {active.map((sprint, index) => (
                                <motion.div
                                    key={sprint.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * index }}
                                >
                                    <SprintCard sprint={sprint} />
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>
                )}

                {/* Empty State */}
                {(!trending || trending.length === 0) && (!active || active.length === 0) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-dark-800 flex items-center justify-center">
                            <Sparkles className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            No sprints yet
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Be the first to create a sprint and start building!
                        </p>
                    </motion.div>
                )}
            </div>
        </AppLayout>
    );
}
