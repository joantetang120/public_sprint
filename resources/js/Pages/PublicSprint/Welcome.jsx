import { Link, Head } from '@inertiajs/react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
    ArrowRightIcon as ArrowRight,
    ArrowTrendingUpIcon as TrendingUp,
    BoltIcon as Zap,
    CalendarDaysIcon as Calendar,
    ChatBubbleOvalLeftEllipsisIcon as MessageCircle,
    CheckCircleIcon as CheckCircle2,
    CheckIcon as Check,
    ChevronLeftIcon as ChevronLeft,
    ChevronRightIcon as ChevronRight,
    ClockIcon as Timer,
    CursorArrowRaysIcon as Target,
    PlayCircleIcon as Play,
    RocketLaunchIcon as Rocket,
    SparklesIcon as Sparkles,
    StarIcon as Star,
    TrophyIcon as Trophy,
    UserGroupIcon as Users,
    ChatBubbleLeftRightIcon as Quote,
} from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import { useLanguage } from '@/Contexts/LanguageContext';

export default function Welcome({ canLogin, canRegister }) {
    const { tl } = useLanguage();
    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
    const [currentTestimonial, setCurrentTestimonial] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    const testimonials = [
        {
            quote: "PublicSprint helped me ship the first version of my fintech app in Douala. The daily check-ins kept me accountable.",
            author: "Jerry Tetang",
            role: "Builder @ PublicSprint (Cameroon)",
            image: "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?w=150&h=150&fit=crop&crop=faces",
            rating: 5
        },
        {
            quote: "I used one 7-day sprint to launch my design studio portfolio and get my first international client.",
            author: "Amina Nguemeni",
            role: "Product Designer, Yaoundé",
            image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=faces",
            rating: 5
        },
        {
            quote: "Seeing other African builders share raw progress every day gave me the courage to launch my edtech MVP.",
            author: "Lionel Fokou",
            role: "Indie Hacker, Buea",
            image: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=150&h=150&fit=crop&crop=faces",
            rating: 5
        },
        {
            quote: "We ran a 3-day sprint with our dev community in Bamenda and shipped three projects in one weekend.",
            author: "Brenda Mbarga",
            role: "Community Lead, Cameroon",
            image: "https://images.unsplash.com/photo-1559599101-7466fe601f5a?w=150&h=150&fit=crop&crop=faces",
            rating: 5
        }
    ];

    useEffect(() => {
        if (!isAutoPlaying) return;
        const timer = setInterval(() => {
            setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [isAutoPlaying, testimonials.length]);

    const nextTestimonial = () => {
        setIsAutoPlaying(false);
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setIsAutoPlaying(false);
        setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    return (
        <>
            <Head title={tl('Ship your side project in 7 days')} />
            
            <div className="min-h-screen bg-white overflow-hidden">
                {/* Clean background */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-blue-50 to-green-50 opacity-60" />
                </div>

                {/* Clean Navigation - Fiverr Style */}
                <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <Link href="/" className="flex items-center space-x-3 group">
                                <img 
                                    src="/logo/log2.png" 
                                    alt="PublicSprint Logo" 
                                    className="h-20 w-auto"
                                />
                            </Link>
                            
                            <div className="hidden md:flex items-center space-x-8">
                                <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors duration-200">
                                    How it works
                                </a>
                                <a href="#testimonials" className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors duration-200">
                                    Reviews
                                </a>
                                <a href="/discover" className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors duration-200">
                                    Discover
                                </a>
                                <a href="#" className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors duration-200">
                                    Community
                                </a>
                            </div>

                            {canLogin && (
                                <div className="flex items-center space-x-3">
                                    <LanguageSwitcher compact />
                                    <Link
                                        href={route('login')}
                                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-green-600 transition-colors duration-200"
                                    >
                                        Sign in
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href={route('register')}
                                            className="px-5 py-2.5 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-all duration-200 shadow-sm hover:shadow-md"
                                        >
                                            Get Started
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </nav>

                {/* Clean Hero Section */}
                <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            {/* Content */}
                            <div className="text-center lg:text-left">
                                {/* Community badge */}
                                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-50 rounded-full border border-green-200 mb-8">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    <span className="text-sm font-medium text-green-700">
                                        <Users className="w-3 h-3 inline mr-1" />
                                        2,847 builders shipping this week
                                    </span>
                                </div>

                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                                    Build in public,
                                    <span className="block text-green-600">
                                        ship together
                                    </span>
                                </h1>

                                <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-lg lg:max-w-none">
                                    Join time-boxed sprints, share daily progress, and build alongside a community of makers. 
                                    <span className="font-semibold text-gray-900"> No more abandoned projects.</span>
                                </p>

                                <div className="flex flex-col sm:flex-row gap-3 mb-12">
                                    {canRegister && (
                                        <Link
                                            href={route('register')}
                                            className="group px-8 py-4 bg-green-500 text-white rounded-lg font-semibold text-base hover:bg-green-600 transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm hover:shadow-md"
                                        >
                                            <Rocket className="w-4 h-4" />
                                            <span>Start building free</span>
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    )}
                                    
                                    <Link
                                        href={route('discover')}
                                        className="group px-8 py-4 border border-gray-300 text-gray-700 rounded-lg font-semibold text-base hover:border-green-500 hover:text-green-600 transition-all duration-200 flex items-center justify-center space-x-2"
                                    >
                                        <Play className="w-4 h-4" />
                                        <span>See live sprints</span>
                                    </Link>
                                </div>

                                {/* Trust indicators */}
                                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-gray-500">
                                    <div className="flex items-center space-x-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        <span>Free forever</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        <span>No credit card</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        <span>2 min setup</span>
                                    </div>
                                </div>
                            </div>

                            {/* Community Mockup */}
                            <div className="relative hidden lg:block">
                                <div className="relative bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                                    {/* Community Header */}
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                                                <MessageCircle className="w-6 h-6 text-green-600" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900">7-Day Build Sprint</div>
                                                <div className="text-sm text-gray-500">124 builders participating</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-200">
                                            <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">5</div>
                                            <span className="text-sm font-medium text-orange-700">day streak</span>
                                        </div>
                                    </div>

                                    {/* Progress */}
                                    <div className="mb-6">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-gray-600">Community Progress</span>
                                            <span className="font-semibold text-gray-900">71%</span>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-green-500 rounded-full" style={{ width: '71%' }} />
                                        </div>
                                    </div>

                                    {/* Active Members */}
                                    <div className="mb-4">
                                        <div className="text-sm text-gray-600 mb-3">Active builders</div>
                                        <div className="flex -space-x-2">
                                            {[
                                                "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=150&h=150&fit=crop&crop=faces",
                                                "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=faces",
                                                "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=faces",
                                                "https://images.unsplash.com/photo-1559599101-7466fe601f5a?w=150&h=150&fit=crop&crop=faces",
                                                "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=150&h=150&fit=crop&crop=faces",
                                            ].map((src, i) => (
                                                <img 
                                                    key={i}
                                                    src={src}
                                                    className="w-8 h-8 rounded-full border-2 border-white object-cover"
                                                    alt="PublicSprint builder"
                                                />
                                            ))}
                                            <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                                                <span className="text-xs font-semibold text-gray-600">+28</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Recent Updates */}
                                    <div className="space-y-3">
                                        <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                                            <img 
                                                src="https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=150&h=150&fit=crop&crop=faces"
                                                className="w-8 h-8 rounded-full object-cover"
                                                alt="Builder avatar"
                                            />
                                            <div className="flex-1">
                                                <div className="text-sm font-medium text-gray-900">Clarisse N.</div>
                                                <div className="text-sm text-gray-600">Just shipped the authentication system for my SaaS from Douala! 🎉</div>
                                            </div>
                                            <div className="text-xs text-gray-400">2h ago</div>
                                        </div>
                                        <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                                            <img 
                                                src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=faces"
                                                className="w-8 h-8 rounded-full object-cover"
                                                alt="Builder avatar"
                                            />
                                            <div className="flex-1">
                                                <div className="text-sm font-medium text-gray-900">Samuel Etoundi</div>
                                                <div className="text-sm text-gray-600">Iterating on my sprint dashboard UI today 📊</div>
                                            </div>
                                            <div className="text-xs text-gray-400">1h ago</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating achievement card */}
                                <div className="absolute -bottom-4 -right-4 bg-white rounded-lg p-4 shadow-lg border border-gray-200">
                                    <div className="flex items-center space-x-3">
                                        <Trophy className="w-8 h-8 text-yellow-500" />
                                        <div>
                                            <div className="text-sm font-semibold text-gray-900">Weekly Leader</div>
                                            <div className="text-xs text-gray-500">Jerry Tetang</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Bar */}
                <section className="py-16 px-4 sm:px-6 lg:px-8 border-y border-gray-100 bg-gray-50">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                { value: '2,847', label: 'Active Builders', icon: Users, color: 'text-green-600' },
                                { value: '890+', label: 'Projects Shipped', icon: Rocket, color: 'text-blue-600' },
                                { value: '12.3k', label: 'Daily Updates', icon: MessageCircle, color: 'text-purple-600' },
                                { value: '4.9★', label: 'Community Rating', icon: Star, color: 'text-yellow-500' },
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="text-center group"
                                >
                                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-white mb-4 group-hover:bg-green-50 transition-colors shadow-sm`}>
                                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                    </div>
                                    <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                                    <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How it works */}
                <section id="how-it-works" className="relative py-32 px-4 sm:px-6 lg:px-8 bg-white">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-20">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="inline-flex items-center space-x-2 px-4 py-2 bg-green-50 rounded-full mb-6 border border-green-200"
                            >
                                <Target className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-semibold text-green-700">Simple Process</span>
                            </motion.div>
                            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-900">
                                Build together in <span className="text-green-600">3 steps</span>
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Join the community, start building, and ship your project with daily support.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    num: '1',
                                    title: 'Join a sprint',
                                    desc: 'Pick 3, 7, or 30 days. Set your goal. Join builders worldwide.',
                                    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop',
                                    icon: Users,
                                    color: 'green'
                                },
                                {
                                    num: '2',
                                    title: 'Share daily progress',
                                    desc: 'Post updates, get feedback, and build momentum with the community.',
                                    image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=400&h=300&fit=crop',
                                    icon: MessageCircle,
                                    color: 'blue'
                                },
                                {
                                    num: '3',
                                    title: 'Ship & celebrate',
                                    desc: 'Launch to the world. Get recognized. Start your next project.',
                                    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
                                    icon: Trophy,
                                    color: 'purple'
                                }
                            ].map((step, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.15 }}
                                    className="group text-center"
                                >
                                    <div className="relative bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-green-300 transition-all hover:shadow-lg p-8">
                                        {/* Number */}
                                        <div className={`w-16 h-16 rounded-full bg-${step.color}-100 mx-auto mb-6 flex items-center justify-center group-hover:bg-${step.color}-50 transition-colors`}>
                                            <span className={`text-2xl font-bold text-${step.color}-600`}>{step.num}</span>
                                        </div>
                                        
                                        {/* Icon */}
                                        <div className={`w-12 h-12 rounded-lg bg-${step.color}-100 mx-auto mb-4 flex items-center justify-center`}>
                                            <step.icon className={`w-6 h-6 text-${step.color}-600`} />
                                        </div>

                                        {/* Content */}
                                        <h3 className="text-xl font-bold mb-3 text-gray-900">
                                            {step.title}
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            {step.desc}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Community Features */}
                <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gray-50">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">
                                Why builders love our community
                            </h2>
                            <p className="text-lg text-gray-600">
                                Real support from real people building real projects
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                { 
                                    title: 'Daily Accountability', 
                                    desc: 'Post updates every day and keep your streak alive with community support.',
                                    icon: Calendar,
                                    color: 'green'
                                },
                                { 
                                    title: 'Real-time Feedback', 
                                    desc: 'Get instant feedback on your work from experienced builders.',
                                    icon: MessageCircle,
                                    color: 'blue'
                                },
                                { 
                                    title: 'Progress Tracking', 
                                    desc: 'Visual dashboards show your momentum and keep you motivated.',
                                    icon: TrendingUp,
                                    color: 'purple'
                                },
                                { 
                                    title: 'Leaderboards', 
                                    desc: 'Friendly competition to keep everyone motivated and shipping.',
                                    icon: Trophy,
                                    color: 'yellow'
                                },
                                { 
                                    title: 'Community Events', 
                                    desc: 'Weekly check-ins, AMAs, and build-alongs with the community.',
                                    icon: Users,
                                    color: 'orange'
                                },
                                { 
                                    title: 'Project Showcase', 
                                    desc: 'Celebrate your launches and get featured in our community spotlight.',
                                    icon: Zap,
                                    color: 'green'
                                },
                            ].map((feature, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white rounded-xl p-6 border border-gray-200 hover:border-green-300 transition-all hover:shadow-lg group"
                                >
                                    <div className={`w-12 h-12 rounded-lg bg-${feature.color}-100 flex items-center justify-center mb-4 group-hover:bg-${feature.color}-50 transition-colors`}>
                                        <feature.icon className={`w-6 h-6 text-${feature.color}-600`} />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-3 text-gray-900 group-hover:text-green-600 transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {feature.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <section id="testimonials" className="relative py-32 px-4 sm:px-6 lg:px-8 bg-white">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="inline-flex items-center space-x-1 mb-6"
                            >
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                ))}
                                <span className="ml-3 text-sm font-semibold text-gray-900">4.9 out of 5 from 2,000+ builders</span>
                            </motion.div>
                            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">
                                Loved by the builder community
                            </h2>
                            <p className="text-lg text-gray-600">
                                Real stories from real people shipping real projects
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {testimonials.map((testimonial, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white rounded-xl p-6 border border-gray-200 hover:border-green-300 transition-all hover:shadow-lg"
                                >
                                    <div className="flex items-center space-x-1 mb-4">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                        ))}
                                    </div>
                                    <p className="text-gray-700 mb-6 leading-relaxed">
                                        "{testimonial.quote}"
                                    </p>
                                    <div className="flex items-center space-x-3">
                                        <img 
                                            src={testimonial.image}
                                            alt={testimonial.author}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <div>
                                            <div className="font-semibold text-gray-900">
                                                {testimonial.author}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {testimonial.role}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="relative py-32 px-4 sm:px-6 lg:px-8 bg-green-600 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-green-700" />
                    
                    <div className="relative max-w-5xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center"
                        >
                            {/* Badge */}
                            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-8">
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                <span className="text-sm font-semibold text-white">Join 2,847 builders shipping this week</span>
                            </div>

                            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
                                Ready to build with
                                <br />
                                our community?
                            </h2>
                            <p className="text-lg text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
                                Stop working alone. Join thousands of builders who ship projects together.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                                {canRegister && (
                                    <Link
                                        href={route('register')}
                                        className="group px-8 py-4 bg-white text-green-600 rounded-lg font-semibold text-base hover:scale-105 transition-all shadow-lg flex items-center space-x-2"
                                    >
                                        <Rocket className="w-4 h-4" />
                                        <span>Start building free</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                )}
                                <Link
                                    href="/discover"
                                    className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg font-semibold text-base hover:bg-white/20 transition-all border border-white/30"
                                >
                                    Browse community sprints
                                </Link>
                            </div>

                            <div className="flex flex-wrap items-center justify-center gap-6 text-white/80 text-sm">
                                <div className="flex items-center space-x-2">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>Free forever</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>No credit card required</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>Start in 2 minutes</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="relative py-16 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid md:grid-cols-4 gap-12 mb-12">
                            {/* Brand */}
                            <div className="md:col-span-2">
                                <div className="flex items-center space-x-3 mb-4">
                                    <img 
                                        src="/logo/logogreen-removebg-preview.png" 
                                        alt="PublicSprint Logo" 
                                        className="h-28 w-auto"
                                    />
                                </div>
                                <p className="text-gray-400 leading-relaxed max-w-sm text-sm">
                                    The community platform for builders who are tired of abandoned projects. Join time-boxed sprints and ship your ideas together.
                                </p>
                                <div className="flex items-center space-x-3 mt-6">
                                    <a href="https://x.com/jerrytetan67?s=21" className="w-8 h-8 rounded-full bg-gray-800 hover:bg-green-500 flex items-center justify-center transition-colors">
                                        <span className="text-sm text-white">𝕏</span>
                                    </a>
                                    
                                </div>
                            </div>

                            {/* Product */}
                            <div>
                                <h3 className="font-semibold text-lg mb-4 text-white">Product</h3>
                                <ul className="space-y-3">
                                    <li><a href="/discover" className="text-gray-400 hover:text-green-400 transition-colors text-sm">Discover Sprints</a></li>
                                    <li><a href="#how-it-works" className="text-gray-400 hover:text-green-400 transition-colors text-sm">How it works</a></li>
                                    <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors text-sm">Community</a></li>
                                    <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors text-sm">Roadmap</a></li>
                                </ul>
                            </div>

                            {/* Company */}
                            <div>
                                <h3 className="font-semibold text-lg mb-4 text-white">Company</h3>
                                <ul className="space-y-3">
                                    <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors text-sm">About</a></li>
                                    <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors text-sm">Blog</a></li>
                                    <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors text-sm">Careers</a></li>
                                    <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors text-sm">Contact</a></li>
                                </ul>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                            <p className="text-gray-400 text-sm">
                                © 2024 PublicSprint.
                            </p>
                            <div className="flex items-center space-x-6 text-sm">
                                <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Privacy</a>
                                <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Terms</a>
                                <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Cookies</a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
