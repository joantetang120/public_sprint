export default function UserAvatar({ user, size = 'md', className = '' }) {
    const sizeClasses = {
        'xs': 'h-6 w-6',
        'sm': 'h-8 w-8',
        'md': 'h-10 w-10',
        'lg': 'h-12 w-12',
        'xl': 'h-16 w-16',
        '2xl': 'h-32 w-32',
    };

    const getAvatarUrl = () => {
        if (user?.avatar) {
            return `/storage/${user.avatar}`;
        }
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&size=200&background=random`;
    };

    return (
        <span className={`relative inline-flex shrink-0 self-start rounded-full bg-[linear-gradient(135deg,#b7f34a,#63b3ff,#ff8066)] p-[2px] ${className}`}>
            <img
                src={getAvatarUrl()}
                alt={user?.name || 'User'}
                className={`${sizeClasses[size]} rounded-full border-2 border-white object-cover shadow-sm`}
            />
        </span>
    );
}
