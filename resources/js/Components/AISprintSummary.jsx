import { useState, useEffect } from 'react';
import { Sparkles, Copy, Check, Download, Briefcase, MessageCircle, Code, Wand2, Eye } from 'lucide-react';
import { router } from '@inertiajs/react';
import AISummaryModal from './AISummaryModal';

export default function AISprintSummary({ sprint, aiSummary = null, viewOnly = false }) {
    const [summary, setSummary] = useState(aiSummary);
    const [isGenerating, setIsGenerating] = useState(false);
    const [copied, setCopied] = useState(false);
    const [selectedStyle, setSelectedStyle] = useState('professional');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        console.log('AISprintSummary received:', { sprint: sprint.id, aiSummary });
        setSummary(aiSummary);
    }, [aiSummary]);

    const generateSummary = (style = selectedStyle) => {
        setIsGenerating(true);
        
        console.log('Generating summary with style:', style);
        
        // Call backend to generate AI summary
        router.post(route('sprints.generate-summary', sprint.id), 
            { style },
            {
                preserveScroll: false,
                onSuccess: (page) => {
                    console.log('Summary generation successful', page);
                    setIsGenerating(false);
                    // Force full page reload to ensure fresh data
                    setTimeout(() => {
                        window.location.reload();
                    }, 500);
                },
                onError: (errors) => {
                    console.error('Summary generation failed', errors);
                    setIsGenerating(false);
                    alert('Failed to generate summary. Please try again.');
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
        <>
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border-2 border-purple-200 dark:border-purple-800 overflow-hidden shadow-lg">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 p-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                            <Wand2 className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-white mb-1">AI Summary</h3>
                            <p className="text-sm text-purple-100 font-medium">
                                {summary ? '✨ LinkedIn-ready content' : '🚀 Generate with AI'}
                            </p>
                        </div>
                    </div>
                    {summary && (
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={handleCopy}
                                className={`p-2.5 rounded-lg transition-all ${
                                    copied 
                                        ? 'bg-green-500 text-white scale-110' 
                                        : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
                                }`}
                                title="Copy summary"
                            >
                                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                            </button>
                            <button
                                onClick={handleDownload}
                                className="p-2.5 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 rounded-lg transition-all"
                                title="Download summary"
                            >
                                <Download className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-8">

                {summary ? (
                    <div className="space-y-6">
                        {/* Summary Preview */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-purple-200 dark:border-purple-700 shadow-sm">
                            <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap text-base line-clamp-4">
                                {summary.replace(/\n\n\[IMAGES:.*?\]/, '')}
                            </p>
                            <button
                                onClick={() => setShowModal(true)}
                                className="mt-4 w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                            >
                                <Eye className="w-5 h-5" />
                                <span>View Full Summary & Share</span>
                            </button>
                        </div>

                        {/* Style Selector for Regeneration - Only show if not viewOnly */}
                        {!viewOnly && (
                            <>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Try Different Style</label>
                                    <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { value: 'professional', icon: Briefcase, label: 'Professional' },
                                        { value: 'casual', icon: MessageCircle, label: 'Casual' },
                                        { value: 'technical', icon: Code, label: 'Technical' }
                                        ].map((style) => (
                                            <button
                                                key={style.value}
                                                onClick={() => setSelectedStyle(style.value)}
                                                className={`flex flex-col items-center space-y-2 p-4 rounded-xl border-2 transition-all ${
                                                    selectedStyle === style.value
                                                        ? 'border-purple-500 bg-white dark:bg-purple-900/30 shadow-lg scale-105'
                                                        : 'border-gray-200 dark:border-gray-700 bg-white/50 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-md'
                                                }`}
                                            >
                                                <style.icon className={`w-6 h-6 ${
                                                    selectedStyle === style.value ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500'
                                                }`} />
                                                <span className={`text-xs font-bold ${
                                                    selectedStyle === style.value ? 'text-purple-700 dark:text-purple-300' : 'text-gray-600 dark:text-gray-400'
                                                }`}>{style.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Regenerate Button */}
                                <button
                                    onClick={() => generateSummary()}
                                    disabled={isGenerating}
                                    className="w-full inline-flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 text-white rounded-xl font-black text-base hover:from-purple-700 hover:via-pink-700 hover:to-purple-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95"
                                >
                                    <Sparkles className={`w-6 h-6 ${isGenerating ? 'animate-spin' : ''}`} />
                                    <span>{isGenerating ? 'Regenerating...' : 'Regenerate Summary'}</span>
                                </button>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Info Card */}
                        <div className="bg-white dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border-2 border-purple-200 dark:border-purple-700 shadow-sm">
                            <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Sparkles className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-black text-gray-900 dark:text-white mb-2">AI-Powered Summary</h4>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                        Generate a professional summary of your sprint journey. Perfect for LinkedIn, Twitter, or your portfolio. Our AI analyzes your actual updates to create personalized content.
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Style Selection */}
                        <div>
                            <label className="block text-base font-black text-gray-900 dark:text-gray-100 mb-4">Choose Your Style</label>
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { value: 'professional', icon: Briefcase, label: 'Professional', desc: 'LinkedIn-ready' },
                                    { value: 'casual', icon: MessageCircle, label: 'Casual', desc: 'Friendly tone' },
                                    { value: 'technical', icon: Code, label: 'Technical', desc: 'Data-focused' }
                                ].map((style) => (
                                    <button
                                        key={style.value}
                                        onClick={() => setSelectedStyle(style.value)}
                                        className={`flex flex-col items-center space-y-3 p-5 rounded-2xl border-2 transition-all ${
                                            selectedStyle === style.value
                                                ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 dark:bg-purple-900/30 shadow-xl scale-105'
                                                : 'border-gray-200 dark:border-gray-700 bg-white hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-lg'
                                        }`}
                                    >
                                        <style.icon className={`w-8 h-8 ${
                                            selectedStyle === style.value ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500'
                                        }`} />
                                        <div className="text-center">
                                            <div className={`text-sm font-black mb-1 ${
                                                selectedStyle === style.value ? 'text-purple-700 dark:text-purple-300' : 'text-gray-700 dark:text-gray-300'
                                            }`}>{style.label}</div>
                                            <div className="text-xs font-medium text-gray-500 dark:text-gray-400">{style.desc}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Generate Button */}
                        <button
                            onClick={() => generateSummary()}
                            disabled={isGenerating}
                            className="w-full inline-flex items-center justify-center space-x-3 px-8 py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 text-white rounded-2xl font-black text-lg hover:from-purple-700 hover:via-pink-700 hover:to-purple-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl hover:shadow-purple-500/50 hover:scale-105 active:scale-95"
                        >
                            <Wand2 className={`w-7 h-7 ${isGenerating ? 'animate-spin' : ''}`} />
                            <span>{isGenerating ? 'Generating with AI...' : 'Generate Summary'}</span>
                        </button>
                    </div>
                )}

                {/* Pro Tip */}
                <div className="mt-6 p-5 bg-gradient-to-r from-purple-100 via-pink-100 to-purple-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl border-2 border-purple-200 dark:border-purple-700">
                    <p className="text-sm text-purple-900 dark:text-purple-200 flex items-start space-x-3">
                        <Sparkles className="w-5 h-5 flex-shrink-0 mt-0.5 text-purple-600" />
                        <span className="leading-relaxed">
                            <strong className="font-black">Pro tip:</strong> {summary ? 'Copy and paste directly to LinkedIn, Twitter, or your portfolio! Share your achievement with the world.' : 'Our AI analyzes your actual sprint updates to create personalized, professional content tailored to your journey.'}
                        </span>
                    </p>
                </div>
            </div>
        </div>

        {/* AI Summary Modal */}
        <AISummaryModal 
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            summary={summary}
            sprint={sprint}
        />
        </>
    );
}
