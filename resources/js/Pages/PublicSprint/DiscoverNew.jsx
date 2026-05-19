import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Search, Filter, SlidersHorizontal, TrendingUp, Clock, Users, X, Sparkles, Zap, Rocket } from 'lucide-react';
import { useState } from 'react';
import PublicSprintLayout from '@/Layouts/PublicSprintLayout';
import SprintCard from '@/Components/SprintCard';
import { useLanguage } from '@/Contexts/LanguageContext';

export default function DiscoverNew({ sprints, statusCounts, featured, popularTags, filters }) {
    const { tl } = useLanguage();
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');
    const [selectedSort, setSelectedSort] = useState(filters.sort || 'trending');

    const handleSearch = (e) => {
        e.preventDefault();
        applyFilters({ search: searchTerm });
    };

    const applyFilters = (newFilters = {}) => {
        const params = {
            search: searchTerm,
            status: selectedStatus,
            sort: selectedSort,
            ...newFilters,
        };

        // Remove empty params
        Object.keys(params).forEach(key => {
            if (!params[key] || params[key] === 'all') {
                delete params[key];
            }
        });

        router.get(route('discover'), params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedStatus('all');
        setSelectedSort('trending');
        router.get(route('discover'));
    };

    const hasActiveFilters = filters.search || filters.status !== 'all' || filters.sort !== 'trending';

    const sortOptions = [
        { value: 'trending', label: tl('Trending'), icon: TrendingUp },
        { value: 'recent', label: tl('Most Recent'), icon: Clock },
        { value: 'popular', label: tl('Most Popular'), icon: Users },
        { value: 'ending_soon', label: tl('Ending Soon'), icon: Clock },
    ];

    const statusOptions = [
        { value: 'all', label: tl('All Sprints'), count: statusCounts?.all || 0 },
        { value: 'active', label: tl('Active'), count: statusCounts?.active || 0 },
        { value: 'upcoming', label: tl('Upcoming'), count: statusCounts?.upcoming || 0 },
        { value: 'completed', label: tl('Completed'), count: statusCounts?.completed || 0 },
    ];

    return (
        <PublicSprintLayout>
            <Head title={tl('Discover Sprints')} />

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="space-y-8">
                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center"
                        >
                            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-50 rounded-full mb-4 border border-green-200">
                                <Sparkles className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-semibold text-green-700">{tl('Explore the community')}</span>
                            </div>
                            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                                {tl('Discover')} <span className="text-green-600">{tl('Sprints')}</span>
                            </h1>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                {tl('Find inspiring projects and join fellow builders in active sprints')}
                            </p>
                        </motion.div>

                        {/* Search & Filters */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-xl p-6 border border-gray-200"
                        >
                            {/* Search Bar */}
                            <form onSubmit={handleSearch} className="flex gap-3 mb-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder={tl('Search sprints by title or description...')}
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none text-gray-900 placeholder-gray-500 transition-all"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors shadow-sm hover:shadow-md"
                                >
                                    {tl('Search')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg font-semibold transition-colors flex items-center space-x-2 shadow-sm"
                                >
                                    <SlidersHorizontal className="w-5 h-5" />
                                    <span>{tl('Filters')}</span>
                                </button>
                            </form>

                            {/* Filters Panel */}
                            {showFilters && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="border-t border-gray-200 pt-4 space-y-4"
                                >
                                    {/* Status Filter */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            {tl('Status')}
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {statusOptions.map((option) => (
                                                <button
                                                    key={option.value}
                                                    onClick={() => {
                                                        setSelectedStatus(option.value);
                                                        applyFilters({ status: option.value });
                                                    }}
                                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                                        selectedStatus === option.value
                                                            ? 'bg-green-500 text-white'
                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                                >
                                                    {option.label} ({option.count})
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Sort Options */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            {tl('Sort By')}
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {sortOptions.map((option) => (
                                                <button
                                                    key={option.value}
                                                    onClick={() => {
                                                        setSelectedSort(option.value);
                                                        applyFilters({ sort: option.value });
                                                    }}
                                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                                                        selectedSort === option.value
                                                            ? 'bg-green-500 text-white'
                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                                >
                                                    <option.icon className="w-4 h-4" />
                                                    <span>{option.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Clear Filters */}
                                    {hasActiveFilters && (
                                        <button
                                            onClick={clearFilters}
                                            className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                            <span>{tl('Clear All Filters')}</span>
                                        </button>
                                    )}
                                </motion.div>
                            )}
                        </motion.div>

                        {/* Results */}
                        {sprints && sprints.data && sprints.data.length > 0 ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        {hasActiveFilters ? tl('Search Results') : tl('All Sprints')} ({sprints.total})
                                    </h2>
                                </div>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {sprints.data.map((sprint, i) => (
                                        <motion.div
                                            key={sprint.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                        >
                                            <SprintCard sprint={sprint} />
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {sprints.last_page > 1 && (
                                    <div className="flex justify-center mt-8 space-x-2">
                                        {sprints.links.map((link, i) => (
                                            <Link
                                                key={i}
                                                href={link.url || '#'}
                                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                                    link.active
                                                        ? 'bg-green-500 text-white'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-xl p-12 text-center border border-gray-200"
                            >
                                <Search className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    {tl('No sprints found')}
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    {tl('Try adjusting your search or filters')}
                                </p>
                                {hasActiveFilters && (
                                    <button
                                        onClick={clearFilters}
                                        className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors"
                                    >
                                        {tl('Clear Filters')}
                                    </button>
                                )}
                            </motion.div>
                        )}

                        {/* Featured Sections (only shown when no filters) */}
                        {!hasActiveFilters && featured && (
                            <div className="space-y-8">
                                {/* Trending */}
                                {featured.trending && featured.trending.length > 0 && (
                                    <motion.section
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <div className="flex items-center space-x-3 mb-6">
                                            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                                                <TrendingUp className="w-4 h-4 text-orange-600" />
                                            </div>
                                            <h2 className="text-2xl font-bold text-gray-900">
                                                {tl('Trending Sprints')}
                                            </h2>
                                            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold border border-orange-200">
                                                {tl('Community Favorites')}
                                            </span>
                                        </div>
                                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {featured.trending.map((sprint) => (
                                                <SprintCard key={sprint.id} sprint={sprint} />
                                            ))}
                                        </div>
                                    </motion.section>
                                )}

                                {/* Active */}
                                {featured.active && featured.active.length > 0 && (
                                    <motion.section
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        <div className="flex items-center space-x-3 mb-6">
                                            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                                                <Zap className="w-4 h-4 text-green-600" />
                                            </div>
                                            <h2 className="text-2xl font-bold text-gray-900">
                                                {tl('Active Sprints')}
                                            </h2>
                                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold border border-green-200">
                                                {tl('Happening Now')}
                                            </span>
                                        </div>
                                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {featured.active.map((sprint) => (
                                                <SprintCard key={sprint.id} sprint={sprint} />
                                            ))}
                                        </div>
                                    </motion.section>
                                )}

                                {/* Upcoming */}
                                {featured.upcoming && featured.upcoming.length > 0 && (
                                    <motion.section
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        <div className="flex items-center space-x-3 mb-6">
                                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                                <Rocket className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <h2 className="text-2xl font-bold text-gray-900">
                                                {tl('Coming Soon')}
                                            </h2>
                                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold border border-blue-200">
                                                {tl('Starting Soon')}
                                            </span>
                                        </div>
                                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {featured.upcoming.map((sprint) => (
                                                <SprintCard key={sprint.id} sprint={sprint} />
                                            ))}
                                        </div>
                                    </motion.section>
                                )}
                            </div>
                        )}

                        {/* CTA Section */}
                        {!hasActiveFilters && (
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-8 text-center text-white"
                            >
                                <h3 className="text-2xl font-bold mb-3">{tl('Ready to start building?')}</h3>
                                <p className="text-green-100 mb-6 max-w-md mx-auto">
                                    {tl('Create your own sprint and invite the community to build alongside you')}
                                </p>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
                                >
                                    {tl('Start a Sprint')}
                                </motion.button>
                            </motion.section>
                        )}
                    </div>
                </div>
            </div>
        </PublicSprintLayout>
    );
}
