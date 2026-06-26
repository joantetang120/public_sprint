import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { RocketLaunchIcon, StarIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '@/Contexts/LanguageContext';

const BUILDER_AVATARS = [
    'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&h=80&fit=crop&crop=faces&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=faces&q=80',
    'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&h=80&fit=crop&crop=faces&q=80',
    'https://images.unsplash.com/photo-1544006659-f0b21884ce1d?w=80&h=80&fit=crop&crop=faces&q=80',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&h=80&fit=crop&crop=faces&q=80',
];

export default function AuthSidePanel({ headline, sub, stats }) {
    const { tl } = useLanguage();

    const defaultStats = [
        { value: '2.8k+', label: tl('Active Builders'),    icon: UserGroupIcon },
        { value: '890+',  label: tl('Projects Shipped'),   icon: RocketLaunchIcon },
        { value: '4.9',   label: tl('Community Rating'),   icon: StarIcon },
    ];

    const displayStats = stats ?? defaultStats;

    return (
        <div className="hidden lg:flex lg:w-[45%] xl:w-1/2 flex-col justify-between relative overflow-hidden bg-[linear-gradient(140deg,#0c1f12,#173327,#1e4d35)] p-12">
            {/* Subtle dot grid */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.035]"
                style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}
            />

            {/* Logo */}
            <Link href="/" className="relative z-10">
                <img src="/logo/logoWhite-removebg-preview.png" alt="PublicSprint" className="h-20 w-auto" />
            </Link>

            {/* Main content */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.4 }}
                className="relative z-10 space-y-8"
            >
                {/* Headline */}
                <div>
                    <h1 className="text-4xl font-black leading-[1.1] tracking-tight text-white xl:text-5xl">
                        {headline}
                    </h1>
                    {sub && (
                        <p className="mt-4 text-base leading-7 text-emerald-100/70">
                            {sub}
                        </p>
                    )}
                </div>

                {/* Builder avatars + label */}
                <div className="flex items-center gap-4">
                    <div className="flex -space-x-2.5">
                        {BUILDER_AVATARS.map((src, i) => (
                            <img
                                key={i}
                                src={src}
                                alt="builder"
                                className="h-9 w-9 rounded-full border-2 border-emerald-950 object-cover"
                            />
                        ))}
                    </div>
                    <p className="text-sm font-semibold text-emerald-200/80">
                        +2,800 {tl('Active Builders')}
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                    {displayStats.map(({ value, label, icon: Icon }) => (
                        <div
                            key={label}
                            className="rounded-2xl border border-white/10 bg-white/6 p-4 backdrop-blur-sm"
                        >
                            <Icon className="mb-2 h-5 w-5 text-emerald-300/70" />
                            <div className="text-xl font-black text-white">{value}</div>
                            <div className="mt-0.5 text-xs font-medium text-emerald-200/60">{label}</div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Footer */}
            <div className="relative z-10 text-xs font-medium text-emerald-200/40">
                {tl('Built in public, by builders.')}
            </div>
        </div>
    );
}
