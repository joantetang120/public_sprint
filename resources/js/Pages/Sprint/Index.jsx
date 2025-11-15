import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Plus, Filter, Grid, List, Calendar, TrendingUp, Zap, Users, Clock } from 'lucide-react';
import { useState } from 'react';
import PublicSprintLayout from '@/Layouts/PublicSprintLayout';
import SprintCard from '@/Components/SprintCard';

export default function Index({ auth, sprints }) {
    const [viewMode, setViewMode] = useState('grid');
    const [activeFilter, setActiveFilter] = useState('all');

    const filters = [
        { key: 'all', label: 'All Sprints', icon: Zap },
        { key: 'active', label: 'Active', icon: Clock },
        { key: 'upcoming', label: 'Upcoming', icon: Calendar },
        { key: 'completed', label: 'Completed', icon: TrendingUp },
    ];

    return (
        <PublicSprintLayout>
            <Head title="My Sprints - PublicSprint" />

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="space-y-8">
                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
                        >
                            <div className="text-center lg:text-left">
                                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-50 rounded-full mb-4 border border-green-200">
                                    <Zap className="w-4 h-4 text-green-600" />
                                    <span className="text-sm font-semibold text-green-700">
                                        Your builder journey
                                    </span>
                                </div>
                                <h1 className="text-4xl font-bold text-gray-900 mb-3">
                                    My Sprints
                                </h1>
                                <p className="text-lg text-gray-600 max-w-2xl">
                                    Track and manage all your active projects and sprints
                                </p>
                            </div>
                            <Link
                                href={route('sprints.create')}
                                className="flex items-center space-x-2 px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors shadow-sm hover:shadow-md"
                            >
                                <Plus className="w-5 h-5" />
                                <span>New Sprint</span>
                            </Link>
                        </motion.div>

                        {/* Quick Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-6"
                        >
                            <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
                                <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-green-100 flex items-center justify-center">
                                    <Zap className="w-6 h-6 text-green-600" />
                                </div>
                                <div className="text-2xl font-bold text-gray-900 mb-1">
                                    {sprints?.data?.filter(s => s.computed_status === 'active').length || 0}
                                </div>
                                <div className="text-sm text-gray-600">Active</div>
                            </div>
                            <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
                                <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-blue-100 flex items-center justify-center">
                                    <Calendar className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="text-2xl font-bold text-gray-900 mb-1">
                                    {sprints?.data?.filter(s => s.computed_status === 'upcoming').length || 0}
                                </div>
                                <div className="text-sm text-gray-600">Upcoming</div>
                            </div>
                            <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
                                <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-gray-100 flex items-center justify-center">
                                    <TrendingUp className="w-6 h-6 text-gray-600" />
                                </div>
                                <div className="text-2xl font-bold text-gray-900 mb-1">
                                    {sprints?.data?.filter(s => s.computed_status === 'completed').length || 0}
                                </div>
                                <div className="text-sm text-gray-600">Completed</div>
                            </div>
                        </motion.div>

                        {/* Filters & Controls */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-xl p-6 border border-gray-200"
                        >
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                {/* Filter Tabs */}
                                <div className="flex flex-wrap gap-2">
                                    {filters.map((filter) => (
                                        <button
                                            key={filter.key}
                                            onClick={() => setActiveFilter(filter.key)}
                                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                                                activeFilter === filter.key
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
                                            <filter.icon className="w-4 h-4" />
                                            <span>{filter.label}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* View Toggle */}
                                <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded-md transition-colors ${
                                            viewMode === 'grid'
                                                ? 'bg-white text-green-600 shadow-sm'
                                                : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                    >
                                        <Grid className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 rounded-md transition-colors ${
                                            viewMode === 'list'
                                                ? 'bg-white text-green-600 shadow-sm'
                                                : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                    >
                                        <List className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Sprints Content */}
                        {sprints && sprints.data && sprints.data.length > 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className={
                                    viewMode === 'grid'
                                        ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6'
                                        : 'space-y-4'
                                }
                            >
                                {sprints.data
                                    .filter(sprint => {
                                        if (activeFilter === 'all') return true;
                                        return sprint.computed_status === activeFilter;
                                    })
                                    .map((sprint, index) => (
                                        <motion.div
                                            key={sprint.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.05 * index }}
                                        >
                                            <SprintCard sprint={sprint} />
                                        </motion.div>
                                    ))
                                }
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-center py-16 bg-white rounded-xl border border-gray-200"
                            >
                                <div className="max-w-md mx-auto">
                                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gray-100 flex items-center justify-center">
                                        <Calendar className="w-10 h-10 text-gray-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                        No sprints yet
                                    </h3>
                                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                        Start your building journey by creating your first sprint. Share your progress and build alongside the community.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                        <Link
                                            href={route('sprints.create')}
                                            className="inline-flex items-center space-x-2 px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
                                        >
                                            <Plus className="w-5 h-5" />
                                            <span>Create First Sprint</span>
                                        </Link>
                                        <Link
                                            href={route('discover')}
                                            className="inline-flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                                        >
                                            <Users className="w-5 h-5" />
                                            <span>Discover Sprints</span>
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Pagination */}
                        {sprints && sprints.data && sprints.data.length > 0 && sprints.links && sprints.links.length > 1 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex justify-center"
                            >
                                <div className="flex items-center space-x-2 bg-white rounded-lg border border-gray-200 p-2">
                                    {sprints.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            className={`px-4 py-2 rounded-md font-medium transition-colors ${
                                                link.active
                                                    ? 'bg-green-500 text-white'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                            } ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </PublicSprintLayout>
    );
}