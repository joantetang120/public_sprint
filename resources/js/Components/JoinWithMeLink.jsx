import { useState } from 'react';
import { Link2, Check, Copy, Twitter, Linkedin, Facebook } from 'lucide-react';
import { routeKey } from '@/lib/routeKey';

export default function JoinWithMeLink({ sprint, user }) {
    const [linkCopied, setLinkCopied] = useState(false);

    const getJoinUrl = () => {
        const baseUrl = window.location.origin;
        return `${baseUrl}/sprints/${routeKey(sprint)}?ref=${routeKey(user)}`;
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(getJoinUrl());
            setLinkCopied(true);
            setTimeout(() => setLinkCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy link:', err);
        }
    };

    const handleShare = (platform) => {
        const url = encodeURIComponent(getJoinUrl());
        const text = encodeURIComponent(`Join me in this ${sprint.duration_days}-day sprint: ${sprint.title}`);
        
        const shareUrls = {
            twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`,
        };
        
        if (shareUrls[platform]) {
            window.open(shareUrls[platform], '_blank', 'width=600,height=400');
        }
    };

    return (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800">
            <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Link2 className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">Join with Me</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Invite others to this sprint</p>
                </div>
            </div>

            {/* Copy Link */}
            <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                    Your Referral Link
                </label>
                <div className="flex items-center space-x-2">
                    <input 
                        type="text" 
                        value={getJoinUrl()} 
                        readOnly
                        className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleCopyLink}
                        className={`px-3 py-2 rounded-lg font-semibold transition-all flex items-center space-x-1.5 text-sm ${
                            linkCopied 
                                ? 'bg-green-500 text-white' 
                                : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                    >
                        {linkCopied ? (
                            <>
                                <Check className="w-4 h-4" />
                                <span>Copied!</span>
                            </>
                        ) : (
                            <>
                                <Copy className="w-4 h-4" />
                                <span>Copy</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Social Share Buttons */}
            <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                    Share On
                </label>
                <div className="grid grid-cols-3 gap-2">
                    <button
                        onClick={() => handleShare('twitter')}
                        className="flex items-center justify-center space-x-1.5 px-3 py-2 bg-[#1DA1F2] text-white rounded-lg font-semibold hover:bg-[#1a8cd8] transition-colors text-sm"
                    >
                        <Twitter className="w-4 h-4" />
                        <span>Twitter</span>
                    </button>
                    <button
                        onClick={() => handleShare('linkedin')}
                        className="flex items-center justify-center space-x-1.5 px-3 py-2 bg-[#0A66C2] text-white rounded-lg font-semibold hover:bg-[#095196] transition-colors text-sm"
                    >
                        <Linkedin className="w-4 h-4" />
                        <span>LinkedIn</span>
                    </button>
                    <button
                        onClick={() => handleShare('facebook')}
                        className="flex items-center justify-center space-x-1.5 px-3 py-2 bg-[#1877F2] text-white rounded-lg font-semibold hover:bg-[#166fe5] transition-colors text-sm"
                    >
                        <Facebook className="w-4 h-4" />
                        <span>Facebook</span>
                    </button>
                </div>
            </div>

            <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <p className="text-xs text-blue-800 dark:text-blue-200">
                    💡 <strong>Tip:</strong> People who join through your link will see you invited them. Great for building together!
                </p>
            </div>
        </div>
    );
}
