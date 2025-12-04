import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Download, Check, Share2, Linkedin, Twitter, Facebook, Instagram, Link2, Image as ImageIcon } from 'lucide-react';

export default function AISummaryModal({ isOpen, onClose, summary, sprint, images = [] }) {
    const [copied, setCopied] = useState(false);
    const [shareSuccess, setShareSuccess] = useState('');

    // Parse summary to extract images metadata
    const parseImages = () => {
        const match = summary?.match(/\[IMAGES:(.*?)\]/);
        if (match && match[1]) {
            return match[1].split(',').filter(img => img);
        }
        return images;
    };

    // Clean summary text (remove images metadata)
    const cleanSummary = summary?.replace(/\n\n\[IMAGES:.*?\]/, '') || '';

    const summaryImages = parseImages();

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(cleanSummary);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleDownload = () => {
        const blob = new Blob([cleanSummary], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${sprint.title.replace(/[^a-z0-9]/gi, '_')}_summary.txt`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const shareToLinkedIn = () => {
        const text = encodeURIComponent(cleanSummary);
        const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}&summary=${text}`;
        window.open(url, '_blank', 'width=600,height=600');
        setShareSuccess('LinkedIn');
        setTimeout(() => setShareSuccess(''), 2000);
    };

    const shareToTwitter = () => {
        const text = encodeURIComponent(cleanSummary.substring(0, 280));
        const url = `https://twitter.com/intent/tweet?text=${text}`;
        window.open(url, '_blank', 'width=600,height=600');
        setShareSuccess('Twitter');
        setTimeout(() => setShareSuccess(''), 2000);
    };

    const shareToFacebook = () => {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}&quote=${encodeURIComponent(cleanSummary)}`;
        window.open(url, '_blank', 'width=600,height=600');
        setShareSuccess('Facebook');
        setTimeout(() => setShareSuccess(''), 2000);
    };

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setShareSuccess('Link copied!');
            setTimeout(() => setShareSuccess(''), 2000);
        } catch (err) {
            console.error('Failed to copy link:', err);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 p-6 sm:p-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
                                        🎉 Your Sprint Summary
                                    </h2>
                                    <p className="text-purple-100 text-sm sm:text-base font-medium">
                                        {sprint.title}
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-all"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 sm:p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
                            {/* Summary Text */}
                            <div className="bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-800 dark:to-purple-900/20 rounded-2xl p-6 mb-6 border-2 border-purple-200 dark:border-purple-700">
                                <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap text-base">
                                    {cleanSummary}
                                </p>
                            </div>

                            {/* Images Gallery */}
                            {summaryImages.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-black text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                                        <ImageIcon className="w-5 h-5 text-purple-600" />
                                        <span>Journey Snapshots</span>
                                    </h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {summaryImages.map((img, index) => (
                                            <div key={index} className="relative aspect-square rounded-xl overflow-hidden shadow-lg">
                                                <img 
                                                    src={img} 
                                                    alt={`Sprint moment ${index + 1}`}
                                                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="space-y-4">
                                {/* Copy & Download */}
                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={handleCopy}
                                        className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 rounded-xl font-bold transition-all ${
                                            copied
                                                ? 'bg-green-500 text-white'
                                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                        }`}
                                    >
                                        {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                        <span>{copied ? 'Copied!' : 'Copy Text'}</span>
                                    </button>
                                    <button
                                        onClick={handleDownload}
                                        className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                                    >
                                        <Download className="w-5 h-5" />
                                        <span>Download</span>
                                    </button>
                                </div>

                                {/* Social Share Buttons */}
                                <div>
                                    <h3 className="text-sm font-black text-gray-700 dark:text-gray-300 mb-3 flex items-center space-x-2">
                                        <Share2 className="w-4 h-4" />
                                        <span>Share Your Achievement</span>
                                    </h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {/* LinkedIn */}
                                        <button
                                            onClick={shareToLinkedIn}
                                            className="flex flex-col items-center space-y-2 p-4 bg-[#0077B5] hover:bg-[#006399] text-white rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg"
                                        >
                                            <Linkedin className="w-6 h-6" />
                                            <span className="text-xs">LinkedIn</span>
                                        </button>

                                        {/* Twitter */}
                                        <button
                                            onClick={shareToTwitter}
                                            className="flex flex-col items-center space-y-2 p-4 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg"
                                        >
                                            <Twitter className="w-6 h-6" />
                                            <span className="text-xs">Twitter</span>
                                        </button>

                                        {/* Facebook */}
                                        <button
                                            onClick={shareToFacebook}
                                            className="flex flex-col items-center space-y-2 p-4 bg-[#1877F2] hover:bg-[#1564d4] text-white rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg"
                                        >
                                            <Facebook className="w-6 h-6" />
                                            <span className="text-xs">Facebook</span>
                                        </button>

                                        {/* Copy Link */}
                                        <button
                                            onClick={copyLink}
                                            className="flex flex-col items-center space-y-2 p-4 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg"
                                        >
                                            <Link2 className="w-6 h-6" />
                                            <span className="text-xs">Copy Link</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Success Message */}
                                <AnimatePresence>
                                    {shareSuccess && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="p-4 bg-green-100 dark:bg-green-900/30 border-2 border-green-500 rounded-xl text-center"
                                        >
                                            <p className="text-green-700 dark:text-green-300 font-bold flex items-center justify-center space-x-2">
                                                <Check className="w-5 h-5" />
                                                <span>Shared to {shareSuccess}!</span>
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Pro Tip */}
                            <div className="mt-6 p-5 bg-gradient-to-r from-purple-100 via-pink-100 to-purple-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl border-2 border-purple-200 dark:border-purple-700">
                                <p className="text-sm text-purple-900 dark:text-purple-200 text-center">
                                    <strong className="font-black">💡 Pro tip:</strong> Share your achievement on LinkedIn to showcase your consistency and build-in-public journey!
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
