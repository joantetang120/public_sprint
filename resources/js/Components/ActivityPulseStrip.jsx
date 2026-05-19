import { motion } from 'framer-motion';
import {
    BoltIcon,
    ChatBubbleOvalLeftEllipsisIcon,
    FireIcon,
    RocketLaunchIcon,
    UserGroupIcon,
} from '@heroicons/react/24/outline';
import { useLanguage } from '@/Contexts/LanguageContext';

const items = [
    { key: 'shipping', icon: RocketLaunchIcon, color: 'bg-[#b7f34a]' },
    { key: 'feedback', icon: ChatBubbleOvalLeftEllipsisIcon, color: 'bg-[#63b3ff]' },
    { key: 'streaks', icon: FireIcon, color: 'bg-[#ff8066]' },
    { key: 'teams', icon: UserGroupIcon, color: 'bg-[#fff0a8]' },
    { key: 'momentum', icon: BoltIcon, color: 'bg-[#50d69a]' },
];

export default function ActivityPulseStrip({ compact = false }) {
    const { tl } = useLanguage();

    return (
        <div className={`overflow-hidden border border-black/10 bg-white/75 shadow-sm ${compact ? 'rounded-lg p-2' : 'rounded-lg p-3'}`}>
            <div className="flex items-center gap-2">
                {items.map((item, index) => (
                    <motion.div
                        key={item.key}
                        initial={{ y: 8, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: index * 0.08 }}
                        className={`flex min-w-0 items-center gap-2 rounded-full ${item.color} px-3 py-2 text-xs font-black text-[#17211d]`}
                    >
                        <item.icon className="h-4 w-4 shrink-0" />
                        {!compact && <span className="truncate">{tl(item.key)}</span>}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
