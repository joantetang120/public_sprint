import { useState } from 'react';
import { Sparkles, Copy, Check, Download, Briefcase, MessageCircle, Code } from 'lucide-react';
import { router } from '@inertiajs/react';

export default function AISprintSummary({ sprint, aiSummary = null }) {
    const [summary, setSummary] = useState(aiSummary);
    const [isGenerating, setIsGenerating] = useState(false);
    const [copied, setCopied] = useState(false);
    const [selectedStyle, setSelectedStyle] = useState('professional');

    const generateSummary = (style = selectedStyle) => {
        setIsGenerating(true);
        
        // Call backend to generate AI summary
        router.post(route('sprints.generate-summary', sprint.id), 
            { style },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsGenerating(false);
                    // Reload to get updated summary
                    router.reload({ only: ['completedSprints'] });
                },
                onError: () => {
                    setIsGenerating(false);
                }
            }
        );
    };

    const handleCopy = async () => {
        if (!summary) return;
        
        try {
            await navigator.clipboard.writeText(summary);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleDownload = () => {
        if (!summary) return;

        const blob = new Blob([summary], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${sprint.title.replace(/[^a-z0-9]/gi, '_')}_summary.txt`;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-100 dark:border-purple-800">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">AI Sprint Summary</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {summary ? 'Your journey summarized' : 'Generate a professional summary'}
                        </p>
                    </div>
                </div>
                {summary && (
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handleCopy}
                            className={`p-2 rounded-lg transition-colors ${
                                copied 
                                    ? 'bg-green-100 text-green-600' 
                                    : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                            title="Copy summary"
                        >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                        <button
                            onClick={handleDownload}
                            className="p-2 bg-white text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                            title="Download summary"
                        >
                            <Download className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            {summary ? (
                <div className="space-y-4">
                    <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-4 max-h-64 overflow-y-auto">
                        <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap text-sm">
                            {summary}
                        </p>
                    </div>
                    <button
                        onClick={() => generateSummary()}
                        disabled={isGenerating}
                        className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 text-sm"
                    >
                        <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                        <span>{isGenerating ? 'Regenerating...' : 'Regenerate'}</span>
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-400 text-sm text-center">
                        Generate an AI-powered summary perfect for LinkedIn, Twitter, or your portfolio.
                    </p>
                    
                    {/* Style Selection */}
                    <div className="grid grid-cols-3 gap-2">
                        <button
                            onClick={() => setSelectedStyle('professional')}
                            className={`flex flex-col items-center space-y-1 p-3 rounded-lg border-2 transition-all ${
                                selectedStyle === 'professional'
                                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                            }`}
                        >
                            <Briefcase className="w-5 h-5 text-purple-600" />
                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Professional</span>
                        </button>
                        <button
                            onClick={() => setSelectedStyle('casual')}
                            className={`flex flex-col items-center space-y-1 p-3 rounded-lg border-2 transition-all ${
                                selectedStyle === 'casual'
                                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                            }`}
                        >
                            <MessageCircle className="w-5 h-5 text-purple-600" />
                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Casual</span>
                        </button>
                        <button
                            onClick={() => setSelectedStyle('technical')}
                            className={`flex flex-col items-center space-y-1 p-3 rounded-lg border-2 transition-all ${
                                selectedStyle === 'technical'
                                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                            }`}
                        >
                            <Code className="w-5 h-5 text-purple-600" />
                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Technical</span>
                        </button>
                    </div>

                    <button
                        onClick={() => generateSummary()}
                        disabled={isGenerating}
                        className="w-full inline-flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    >
                        <Sparkles className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
                        <span>{isGenerating ? 'Generating...' : 'Generate Summary'}</span>
                    </button>
                </div>
            )}

            {summary && (
                <div className="mt-4 p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <p className="text-xs text-purple-800 dark:text-purple-200">
                        ✨ <strong>Pro tip:</strong> This summary is optimized for LinkedIn posts and professional portfolios.
                    </p>
                </div>
            )}
        </div>
    );
}
