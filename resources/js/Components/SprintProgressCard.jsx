import { useRef } from 'react';
import {
    ArrowTrendingUpIcon as TrendingUp,
    BoltIcon as Zap,
    CalendarDaysIcon as Calendar,
    CursorArrowRaysIcon as Target,
    DocumentArrowDownIcon as Download,
    ShareIcon as Share2,
    TrophyIcon as Award,
    TrophyIcon as Trophy,
    UserGroupIcon as Users,
} from '@heroicons/react/24/outline';
import UserAvatar from './UserAvatar';
import html2canvas from 'html2canvas';

export default function SprintProgressCard({ sprint, userStats, completionStats }) {
    const cardRef = useRef(null);

    const handleDownload = async () => {
        if (!cardRef.current) return;

        try {
            const canvas = await html2canvas(cardRef.current, {
                backgroundColor: '#ffffff',
                scale: 2,
                logging: false,
            });

            const link = document.createElement('a');
            link.download = `${sprint.title.replace(/[^a-z0-9]/gi, '_')}_completion.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            console.error('Failed to generate image:', error);
        }
    };

    const handleShare = async () => {
        if (!cardRef.current) return;

        try {
            const canvas = await html2canvas(cardRef.current, {
                backgroundColor: '#ffffff',
                scale: 2,
                logging: false,
            });

            canvas.toBlob(async (blob) => {
                const file = new File([blob], 'sprint-completion.png', { type: 'image/png' });
                
                if (navigator.share && navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        title: `I completed: ${sprint.title}`,
                        text: `Just completed a ${sprint.duration_days}-day sprint on PublicSprint! 🚀`,
                        files: [file],
                    });
                } else {
                    // Fallback to download
                    handleDownload();
                }
            });
        } catch (error) {
            console.error('Failed to share:', error);
            handleDownload();
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
    };

    return (
        <div className="space-y-4">
            {/* Action Buttons */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Progress Card</h3>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={handleShare}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
                    >
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
                    </button>
                    <button
                        onClick={handleDownload}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm"
                    >
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                    </button>
                </div>
            </div>

            {/* Progress Card - Optimized for LinkedIn (1200x627px ratio) */}
            <div 
                ref={cardRef}
                className="relative bg-gradient-to-br from-green-500 via-green-600 to-blue-600 rounded-2xl p-8 shadow-2xl"
                style={{ aspectRatio: '1200/627' }}
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                        backgroundSize: '40px 40px'
                    }}></div>
                </div>

                {/* Content */}
                <div className="relative h-full flex flex-col justify-between">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-3">
                                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                    <Trophy className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-white/90 font-semibold text-sm uppercase tracking-wider">
                                    Sprint Completed
                                </span>
                            </div>
                            <h2 className="text-3xl font-black text-white mb-2 leading-tight">
                                {sprint.title}
                            </h2>
                            <div className="flex items-center space-x-3 text-white/80 text-sm">
                                <div className="flex items-center space-x-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>{formatDate(sprint.starts_at)} - {formatDate(sprint.ends_at)}</span>
                                </div>
                                <span>•</span>
                                <span>{sprint.duration_days} days</span>
                            </div>
                        </div>
                        
                        {/* Rank Badge */}
                        {userStats.rank && userStats.rank <= 3 && (
                            <div className={`w-20 h-20 rounded-full flex flex-col items-center justify-center shadow-lg ${
                                userStats.rank === 1 ? 'bg-yellow-400' :
                                userStats.rank === 2 ? 'bg-gray-300' :
                                'bg-orange-400'
                            }`}>
                                <div className="text-3xl font-black text-gray-900">#{userStats.rank}</div>
                                <div className="text-xs font-bold text-gray-700">RANK</div>
                            </div>
                        )}
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-4 gap-4">
                        <div className="bg-white/15 backdrop-blur-md rounded-xl p-4 border border-white/20">
                            <div className="text-3xl font-black text-white mb-1">
                                {userStats.updates_posted || 0}
                            </div>
                            <div className="text-sm text-white/80 font-semibold">Updates</div>
                        </div>
                        <div className="bg-white/15 backdrop-blur-md rounded-xl p-4 border border-white/20">
                            <div className="text-3xl font-black text-white mb-1">
                                {userStats.score || 0}
                            </div>
                            <div className="text-sm text-white/80 font-semibold">Points</div>
                        </div>
                        <div className="bg-white/15 backdrop-blur-md rounded-xl p-4 border border-white/20">
                            <div className="text-3xl font-black text-white mb-1">
                                {userStats.reactions_received || 0}
                            </div>
                            <div className="text-sm text-white/80 font-semibold">Likes</div>
                        </div>
                        <div className="bg-white/15 backdrop-blur-md rounded-xl p-4 border border-white/20">
                            <div className="text-3xl font-black text-white mb-1">
                                {completionStats.active_participants || 0}
                            </div>
                            <div className="text-sm text-white/80 font-semibold">Builders</div>
                        </div>
                    </div>

                    {/* Badges */}
                    {userStats.badges && userStats.badges.length > 0 && (
                        <div className="flex items-center space-x-2">
                            <span className="text-white/80 text-sm font-semibold">Achievements:</span>
                            <div className="flex items-center space-x-2">
                                {userStats.badges.map((badge, i) => (
                                    <div 
                                        key={i}
                                        className="px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full border border-white/30 flex items-center space-x-1.5"
                                    >
                                        {badge === 'top_contributor' && <><Award className="w-4 h-4 text-yellow-300" /><span className="text-white text-xs font-bold">Top Contributor</span></>}
                                        {badge === 'daily_streak' && <><Zap className="w-4 h-4 text-orange-300" /><span className="text-white text-xs font-bold">Daily Streak</span></>}
                                        {badge === 'most_helpful' && <><Users className="w-4 h-4 text-blue-300" /><span className="text-white text-xs font-bold">Most Helpful</span></>}
                                        {badge === 'early_bird' && <><TrendingUp className="w-4 h-4 text-yellow-300" /><span className="text-white text-xs font-bold">Early Bird</span></>}
                                        {badge === 'consistent_builder' && <><Target className="w-4 h-4 text-green-300" /><span className="text-white text-xs font-bold">Consistent</span></>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/20">
                        <div className="flex items-center space-x-3">
                            <UserAvatar user={userStats.user} className="w-12 h-12 border-2 border-white/30" />
                            <div>
                                <div className="text-white font-bold text-lg">{userStats.user?.name}</div>
                                <div className="text-white/70 text-sm">Built in public on PublicSprint</div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 text-white/90">
                            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                <Zap className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-lg">PublicSprint</span>
                        </div>
                    </div>
                </div>
            </div>

            <p className="text-sm text-gray-600 text-center">
                This card is optimized for LinkedIn (1200x627px). Download and share your achievement! 🎉
            </p>
        </div>
    );
}
