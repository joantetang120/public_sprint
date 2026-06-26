import { Link, Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowRightIcon,
    BoltIcon,
    CalendarDaysIcon,
    ChartBarIcon,
    CheckCircleIcon,
    DocumentChartBarIcon,
    EyeIcon,
    FlagIcon,
    GlobeAltIcon,
    RocketLaunchIcon,
    SparklesIcon,
    StarIcon,
    TrophyIcon,
    UserGroupIcon,
} from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import { useLanguage } from '@/Contexts/LanguageContext';

const fadeUp = {
    hidden:  { opacity: 0, y: 24 },
    visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.4 } }),
};

export default function Welcome({ canLogin, canRegister }) {
    const { tl } = useLanguage();
    const [activeTestimonial, setActiveTestimonial] = useState(0);

    const testimonials = [
        {
            quote: "PublicSprint helped me ship the first version of my fintech app in Douala. The daily check-ins kept me accountable.",
            author: "Jerry Tetang",
            role: "Builder · Cameroon",
            image: "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?w=96&h=96&fit=crop&crop=faces&q=80",
        },
        {
            quote: "I used one 7-day sprint to launch my design portfolio and land my first international client.",
            author: "Amina Nguemeni",
            role: "Product Designer · Yaoundé",
            image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=96&h=96&fit=crop&crop=faces&q=80",
        },
        {
            quote: "Seeing other African builders share raw progress every day gave me the courage to launch my edtech MVP.",
            author: "Lionel Fokou",
            role: "Indie Hacker · Buea",
            image: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=96&h=96&fit=crop&crop=faces&q=80",
        },
        {
            quote: "We ran a 3-day sprint with our dev community in Bamenda and shipped three projects in one weekend.",
            author: "Brenda Mbarga",
            role: "Community Lead · Cameroon",
            image: "https://images.unsplash.com/photo-1559599101-7466fe601f5a?w=96&h=96&fit=crop&crop=faces&q=80",
        },
    ];

    useEffect(() => {
        const t = setInterval(() => setActiveTestimonial(p => (p + 1) % testimonials.length), 5000);
        return () => clearInterval(t);
    }, [testimonials.length]);

    return (
        <>
            <Head title="PublicSprint — The building process. Finally documented." />

            <div className="min-h-screen bg-[#f5f1e8] font-sans antialiased">

                {/* ── Navigation ── */}
                <nav className="fixed inset-x-0 top-0 z-50 border-b border-stone-200/60 bg-[#f5f1e8]/90 backdrop-blur-md">
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
                        <Link href="/" className="flex items-center gap-2.5">
                            <img src="/logo/log2.png" alt="PublicSprint" className="h-14 w-auto" />
                        </Link>

                        <div className="hidden items-center gap-8 md:flex">
                            <a href="#story"       className="text-sm font-medium text-stone-600 transition hover:text-emerald-800">{tl('How it works')}</a>
                            <a href="#features"    className="text-sm font-medium text-stone-600 transition hover:text-emerald-800">{tl('Community')}</a>
                            <Link href={route('discover')} className="text-sm font-medium text-stone-600 transition hover:text-emerald-800">{tl('Discover')}</Link>
                        </div>

                        <div className="flex items-center gap-3">
                            <LanguageSwitcher compact />
                            {canLogin && (
                                <Link href={route('login')} className="text-sm font-medium text-stone-600 transition hover:text-emerald-800">
                                    {tl('Sign in')}
                                </Link>
                            )}
                            {canRegister && (
                                <Link
                                    href={route('register')}
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
                                >
                                    {tl('Get Started')}
                                    <ArrowRightIcon className="h-3.5 w-3.5" />
                                </Link>
                            )}
                        </div>
                    </div>
                </nav>

                {/* ── Hero ── */}
                <section className="relative overflow-hidden bg-[linear-gradient(135deg,#0c1f12,#173327,#1e4d35)] pt-16">
                    {/* subtle grid texture */}
                    <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
                        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '36px 36px' }} />

                    <div className="relative mx-auto max-w-7xl px-5 pb-0 pt-28">
                        <motion.div
                            variants={fadeUp} initial="hidden" animate="visible"
                            className="mx-auto max-w-4xl text-center"
                        >
                            {/* Badge */}
                            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2">
                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200">
                                    {tl('The building process. Finally documented.')}
                                </span>
                            </div>

                            {/* Headline */}
                            <h1 className="text-5xl font-black leading-[1.04] tracking-tight text-white sm:text-6xl lg:text-7xl">
                                {tl('Watch the next great founder build —')}
                                <br />
                                <span className="text-emerald-300">{tl('before the world knows their name.')}</span>
                            </h1>

                            <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-emerald-100/70">
                                {tl('Start a sprint. Document your journey. Get discovered.')}
                            </p>

                            {/* CTAs */}
                            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                                {canRegister && (
                                    <Link
                                        href={route('register')}
                                        className="group inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-4 text-sm font-bold text-emerald-950 shadow-lg transition hover:bg-emerald-50"
                                    >
                                        <RocketLaunchIcon className="h-4 w-4" />
                                        {tl('Start your sprint')}
                                        <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-0.5" />
                                    </Link>
                                )}
                                <Link
                                    href={route('discover')}
                                    className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/8 px-7 py-4 text-sm font-bold text-white transition hover:bg-white/15"
                                >
                                    <EyeIcon className="h-4 w-4" />
                                    {tl('Explore sprints')}
                                </Link>
                            </div>

                            {/* Trust pills */}
                            <div className="mt-8 flex flex-wrap items-center justify-center gap-5 text-xs font-medium text-emerald-200/60">
                                {[
                                    { icon: CheckCircleIcon, label: tl('Free forever') },
                                    { icon: CheckCircleIcon, label: tl('No credit card') },
                                    { icon: CheckCircleIcon, label: tl('2 min setup') },
                                ].map(({ icon: Icon, label }) => (
                                    <span key={label} className="flex items-center gap-1.5">
                                        <Icon className="h-3.5 w-3.5 text-emerald-400" />
                                        {label}
                                    </span>
                                ))}
                            </div>
                        </motion.div>

                        {/* App mockup strip */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="relative mx-auto mt-16 max-w-5xl"
                        >
                            <div className="overflow-hidden rounded-t-[28px] border border-white/10 bg-white/5 backdrop-blur-sm">
                                {/* Fake browser chrome */}
                                <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3.5">
                                    <span className="h-3 w-3 rounded-full bg-red-400/70" />
                                    <span className="h-3 w-3 rounded-full bg-yellow-400/70" />
                                    <span className="h-3 w-3 rounded-full bg-green-400/70" />
                                    <div className="ml-4 flex-1 rounded-full bg-white/10 px-4 py-1 text-xs text-white/40">
                                        publicsprint.com/discover
                                    </div>
                                </div>
                                {/* Sprint cards preview */}
                                <div className="grid grid-cols-3 gap-4 p-5">
                                    {[
                                        {
                                            name: "Amara K.",
                                            img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&h=80&fit=crop&crop=faces&q=80",
                                            title: "Building my SaaS from $0",
                                            day: "Day 12 / 30",
                                            tag: "Founder",
                                            likes: 47,
                                        },
                                        {
                                            name: "Lucas M.",
                                            img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=faces&q=80",
                                            title: "AWS certification in 30 days",
                                            day: "Day 8 / 30",
                                            tag: "Developer",
                                            likes: 31,
                                        },
                                        {
                                            name: "Priya S.",
                                            img: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&h=80&fit=crop&crop=faces&q=80",
                                            title: "Redesigning my entire portfolio",
                                            day: "Day 5 / 14",
                                            tag: "Designer",
                                            likes: 22,
                                        },
                                    ].map((card) => (
                                        <div key={card.title} className="rounded-2xl bg-white/8 border border-white/8 p-4">
                                            <div className="flex items-center gap-2.5 mb-3">
                                                <img src={card.img} alt={card.name} className="h-8 w-8 rounded-full object-cover" />
                                                <div>
                                                    <div className="text-xs font-bold text-white">{card.name}</div>
                                                    <div className="text-[10px] text-emerald-300/60">{card.tag}</div>
                                                </div>
                                            </div>
                                            <p className="text-xs font-semibold text-white/90 leading-5 mb-3">{card.title}</p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] text-emerald-400/80 font-medium">{card.day}</span>
                                                <span className="flex items-center gap-1 text-[10px] text-white/40">
                                                    <StarIcon className="h-3 w-3" /> {card.likes}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* ── Stats bar ── */}
                <section className="border-b border-stone-200 bg-white">
                    <div className="mx-auto max-w-7xl px-5 py-10">
                        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                            {[
                                { value: '2,800+', label: tl('Builders worldwide'),     icon: UserGroupIcon },
                                { value: '890+',   label: tl('Sprints launched'),        icon: RocketLaunchIcon },
                                { value: '38',     label: tl('Countries represented'),   icon: GlobeAltIcon },
                                { value: '4.9',    label: 'Community rating',             icon: StarIcon },
                            ].map(({ value, label, icon: Icon }, i) => (
                                <motion.div
                                    key={label}
                                    variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                                    className="flex flex-col items-center text-center"
                                >
                                    <Icon className="mb-3 h-6 w-6 text-emerald-700" />
                                    <div className="text-3xl font-black text-stone-900">{value}</div>
                                    <div className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">{label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── The Story Nobody Tells ── */}
                <section id="story" className="py-28 px-5">
                    <div className="mx-auto max-w-7xl">
                        <div className="grid items-center gap-16 lg:grid-cols-2">
                            {/* Copy */}
                            <motion.div
                                variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                            >
                                <p className="mb-4 text-xs font-bold uppercase tracking-[0.26em] text-emerald-700">The story nobody tells</p>
                                <h2 className="text-4xl font-black leading-[1.08] tracking-tight text-stone-900 sm:text-5xl">
                                    {tl('We know how it ended.')}
                                    <br />
                                    <span className="text-emerald-700">{tl('We missed how it started.')}</span>
                                </h2>

                                <div className="mt-8 space-y-4 text-base leading-8 text-stone-600">
                                    <p>
                                        {tl('Everyone knows the Facebook story.')}{' '}
                                        {tl('The billion-dollar valuation. The movie. The IPO.')}
                                    </p>
                                    <p>
                                        {tl('Nobody was there for the dorm room nights.')}{' '}
                                        {tl('Same with Microsoft. With Apple. With every company that changed the world.')}
                                    </p>
                                    <p>
                                        {tl('We only discover founders after the fact — never while they\'re building.')}
                                    </p>
                                </div>

                                <div className="mt-10 rounded-2xl border-l-4 border-emerald-700 bg-emerald-50 py-5 pl-6 pr-5">
                                    <p className="text-base font-bold text-emerald-900">
                                        {tl('PublicSprint changes that.')}
                                    </p>
                                    <p className="mt-1 text-sm text-emerald-700">
                                        {tl('Here, the journey is the product.')}
                                    </p>
                                </div>

                                {canRegister && (
                                    <Link
                                        href={route('register')}
                                        className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-emerald-950 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-800"
                                    >
                                        {tl('Start your sprint')}
                                        <ArrowRightIcon className="h-4 w-4" />
                                    </Link>
                                )}
                            </motion.div>

                            {/* Image grid */}
                            <div className="relative hidden lg:block">
                                <div className="grid grid-cols-2 gap-4">
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }} transition={{ duration: 0.5 }}
                                        className="space-y-4"
                                    >
                                        <div className="overflow-hidden rounded-2xl shadow-md">
                                            <img
                                                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80&fit=crop"
                                                alt="Developer working"
                                                className="h-48 w-full object-cover"
                                            />
                                        </div>
                                        <div className="overflow-hidden rounded-2xl shadow-md">
                                            <img
                                                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80&fit=crop"
                                                alt="Team building"
                                                className="h-36 w-full object-cover"
                                            />
                                        </div>
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
                                        className="mt-8 space-y-4"
                                    >
                                        <div className="overflow-hidden rounded-2xl shadow-md">
                                            <img
                                                src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&q=80&fit=crop"
                                                alt="Founder presenting"
                                                className="h-36 w-full object-cover"
                                            />
                                        </div>
                                        <div className="overflow-hidden rounded-2xl shadow-md">
                                            <img
                                                src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80&fit=crop"
                                                alt="Coding at night"
                                                className="h-48 w-full object-cover"
                                            />
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Floating card */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }} transition={{ delay: 0.3 }}
                                    className="absolute -bottom-6 -left-6 rounded-2xl bg-white p-4 shadow-xl border border-stone-100"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
                                            <TrophyIcon className="h-5 w-5 text-emerald-700" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-stone-900">Amara just completed Day 30</div>
                                            <div className="text-xs text-stone-500">Received 142 reactions</div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Features ── */}
                <section id="features" className="bg-white py-28 px-5">
                    <div className="mx-auto max-w-7xl">
                        <motion.div
                            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                            className="mb-16 text-center"
                        >
                            <p className="mb-3 text-xs font-bold uppercase tracking-[0.26em] text-emerald-700">{tl('What you can do')}</p>
                            <h2 className="text-4xl font-black tracking-tight text-stone-900 sm:text-5xl">
                                Create. Follow. Get discovered.
                            </h2>
                        </motion.div>

                        <div className="grid gap-6 md:grid-cols-3">
                            {[
                                {
                                    icon: FlagIcon,
                                    img: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=700&q=80&fit=crop",
                                    title: tl('Create a sprint'),
                                    desc: tl('Set a goal, define a timeline, build in public. Every update becomes a permanent record of your process.'),
                                },
                                {
                                    icon: EyeIcon,
                                    img: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=700&q=80&fit=crop",
                                    title: tl('Follow the builders'),
                                    desc: tl('Find builders worth watching. React, comment, and be part of their story before they become famous.'),
                                },
                                {
                                    icon: DocumentChartBarIcon,
                                    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=700&q=80&fit=crop",
                                    title: tl('Get your proof of work'),
                                    desc: tl('When your sprint ends, get an AI-powered shareable report — ready for LinkedIn, Twitter, and your portfolio.'),
                                },
                            ].map(({ icon: Icon, img, title, desc }, i) => (
                                <motion.div
                                    key={title}
                                    variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                                    className="group overflow-hidden rounded-[26px] border border-stone-200 bg-[#f5f1e8] transition hover:border-emerald-300 hover:shadow-lg"
                                >
                                    <div className="overflow-hidden">
                                        <img
                                            src={img}
                                            alt={title}
                                            className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="p-7">
                                        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-950">
                                            <Icon className="h-5 w-5 text-white" />
                                        </div>
                                        <h3 className="mb-2 text-lg font-black text-stone-900">{title}</h3>
                                        <p className="text-sm leading-7 text-stone-600">{desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── How it works ── */}
                <section className="py-28 px-5">
                    <div className="mx-auto max-w-7xl">
                        <motion.div
                            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                            className="mb-16 text-center"
                        >
                            <p className="mb-3 text-xs font-bold uppercase tracking-[0.26em] text-emerald-700">{tl('How it works')}</p>
                            <h2 className="text-4xl font-black tracking-tight text-stone-900 sm:text-5xl">
                                {tl('Three steps to document your building journey')}
                            </h2>
                        </motion.div>

                        <div className="grid gap-8 md:grid-cols-3">
                            {[
                                {
                                    num: '01',
                                    icon: FlagIcon,
                                    title: tl('Pick a goal'),
                                    desc: tl('Set your target and your timeline. 7, 14, or 30 days. Make it public or keep it private.'),
                                },
                                {
                                    num: '02',
                                    icon: ChartBarIcon,
                                    title: tl('Post daily updates'),
                                    desc: tl('Share your progress, your wins, and your blockers. The community follows along and supports you.'),
                                },
                                {
                                    num: '03',
                                    icon: BoltIcon,
                                    title: tl('Get discovered'),
                                    desc: tl('Your sprint becomes your verified proof of work. Recruiters, investors, and followers find you.'),
                                },
                            ].map(({ num, icon: Icon, title, desc }, i) => (
                                <motion.div
                                    key={num}
                                    variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                                    className="relative rounded-[26px] border border-stone-200 bg-white p-8"
                                >
                                    <div className="mb-6 flex items-center gap-4">
                                        <span className="text-5xl font-black text-stone-100">{num}</span>
                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-950">
                                            <Icon className="h-5 w-5 text-white" />
                                        </div>
                                    </div>
                                    <h3 className="mb-3 text-xl font-black text-stone-900">{title}</h3>
                                    <p className="text-sm leading-7 text-stone-600">{desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Testimonials ── */}
                <section className="bg-white py-28 px-5">
                    <div className="mx-auto max-w-7xl">
                        <motion.div
                            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                            className="mb-16 text-center"
                        >
                            <div className="mb-4 flex items-center justify-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <StarIcon key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                                ))}
                            </div>
                            <h2 className="text-4xl font-black tracking-tight text-stone-900 sm:text-5xl">
                                {tl('Loved by builders worldwide')}
                            </h2>
                            <p className="mt-4 text-base text-stone-500">{tl('Real stories from people who built in public')}</p>
                        </motion.div>

                        <div className="grid gap-6 md:grid-cols-2">
                            {testimonials.map((t, i) => (
                                <motion.div
                                    key={i}
                                    variants={fadeUp} custom={i % 2} initial="hidden" whileInView="visible" viewport={{ once: true }}
                                    className="rounded-[26px] border border-stone-200 bg-[#f5f1e8] p-8"
                                >
                                    <div className="mb-5 flex gap-1">
                                        {[...Array(5)].map((_, j) => (
                                            <StarIcon key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                                        ))}
                                    </div>
                                    <p className="mb-6 text-base leading-8 text-stone-700">"{t.quote}"</p>
                                    <div className="flex items-center gap-3">
                                        <img src={t.image} alt={t.author} className="h-11 w-11 rounded-full object-cover" />
                                        <div>
                                            <div className="text-sm font-bold text-stone-900">{t.author}</div>
                                            <div className="text-xs text-stone-500">{t.role}</div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Final CTA ── */}
                <section className="relative overflow-hidden bg-[linear-gradient(135deg,#0c1f12,#173327,#1e4d35)] py-32 px-5">
                    <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
                        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '36px 36px' }} />

                    <motion.div
                        variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                        className="relative mx-auto max-w-4xl text-center"
                    >
                        <SparklesIcon className="mx-auto mb-6 h-10 w-10 text-emerald-400" />
                        <h2 className="text-5xl font-black leading-[1.06] tracking-tight text-white sm:text-6xl">
                            {tl('The next big story is starting today.')}
                            <br />
                            <span className="text-emerald-300">{tl('Be part of it.')}</span>
                        </h2>
                        <p className="mx-auto mt-7 max-w-xl text-lg text-emerald-100/70">
                            {tl('Join thousands of builders already documenting their journey on PublicSprint.')}
                        </p>

                        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                            {canRegister && (
                                <Link
                                    href={route('register')}
                                    className="group inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-sm font-bold text-emerald-950 shadow-xl transition hover:bg-emerald-50"
                                >
                                    <RocketLaunchIcon className="h-4 w-4" />
                                    {tl('Start building for free')}
                                    <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-0.5" />
                                </Link>
                            )}
                            <Link
                                href={route('discover')}
                                className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/8 px-8 py-4 text-sm font-bold text-white transition hover:bg-white/15"
                            >
                                <EyeIcon className="h-4 w-4" />
                                {tl('Explore sprints')}
                            </Link>
                        </div>

                        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-emerald-200/50">
                            {[tl('No credit card required'), tl('Free forever'), tl('Start in 2 minutes')].map(l => (
                                <span key={l} className="flex items-center gap-1.5">
                                    <CheckCircleIcon className="h-3.5 w-3.5 text-emerald-400" />
                                    {l}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                </section>

                {/* ── Footer ── */}
                <footer className="bg-stone-950 px-5 py-16 text-white">
                    <div className="mx-auto max-w-7xl">
                        <div className="mb-12 grid gap-10 md:grid-cols-4">
                            <div className="md:col-span-2">
                                <img src="/logo/logogreen-removebg-preview.png" alt="PublicSprint" className="mb-5 h-24 w-auto" />
                                <p className="max-w-sm text-sm leading-7 text-stone-400">
                                    The platform where builders document their journey in public — and where the next great story starts.
                                </p>
                                <div className="mt-6 flex items-center gap-3">
                                    <a
                                        href="https://x.com/jerrytetan67"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-800 text-xs font-bold text-white transition hover:bg-emerald-600"
                                    >
                                        X
                                    </a>
                                </div>
                            </div>

                            <div>
                                <h4 className="mb-5 text-sm font-bold uppercase tracking-[0.18em] text-stone-300">{tl('Product')}</h4>
                                <ul className="space-y-3">
                                    {[
                                        { label: tl('Discover Sprints'), href: route('discover') },
                                        { label: tl('How it works'),     href: '#story' },
                                        { label: tl('Community'),        href: '#features' },
                                        { label: tl('Roadmap'),          href: '#' },
                                    ].map(({ label, href }) => (
                                        <li key={label}>
                                            <a href={href} className="text-sm text-stone-400 transition hover:text-emerald-400">{label}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h4 className="mb-5 text-sm font-bold uppercase tracking-[0.18em] text-stone-300">{tl('Company')}</h4>
                                <ul className="space-y-3">
                                    {[tl('About'), tl('Blog'), tl('Careers'), tl('Contact')].map(label => (
                                        <li key={label}>
                                            <a href="#" className="text-sm text-stone-400 transition hover:text-emerald-400">{label}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-between gap-4 border-t border-stone-800 pt-8 md:flex-row">
                            <p className="text-xs text-stone-500">© 2025 PublicSprint. All rights reserved.</p>
                            <div className="flex gap-6">
                                {[tl('Privacy'), tl('Terms'), tl('Cookies')].map(label => (
                                    <a key={label} href="#" className="text-xs text-stone-500 transition hover:text-emerald-400">{label}</a>
                                ))}
                            </div>
                        </div>
                    </div>
                </footer>

            </div>
        </>
    );
}
