import { GlobeAltIcon as Globe } from '@heroicons/react/24/outline';
import { router } from '@inertiajs/react';
import { useLanguage } from '@/Contexts/LanguageContext';

const options = [
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'French' },
];

export default function LanguageSwitcher({ compact = false, className = '' }) {
    const { language, setLanguage, tl } = useLanguage();

    const handleChange = (event) => {
        const nextLanguage = event.target.value;

        setLanguage(nextLanguage);

        router.post(
            route('language.update'),
            { language: nextLanguage },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            },
        );
    };

    return (
        <label className={`flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm ${className}`}>
            <Globe className="h-4 w-4 text-green-600" />
            {!compact && <span className="hidden sm:inline">{tl('Language')}</span>}
            <select
                value={language}
                onChange={handleChange}
                className="bg-transparent pr-6 text-sm font-semibold text-gray-800 outline-none"
                aria-label={tl('Language')}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {tl(option.label)}
                    </option>
                ))}
            </select>
        </label>
    );
}
