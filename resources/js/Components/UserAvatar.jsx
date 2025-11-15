export default function UserAvatar({ user, size = 'md', className = '' }) {
    const sizeClasses = {
        'xs': 'w-6 h-6',
        'sm': 'w-8 h-8',
        'md': 'w-10 h-10',
        'lg': 'w-12 h-12',
        'xl': 'w-16 h-16',
        '2xl': 'w-32 h-32',
    };

    const getAvatarUrl = () => {
        if (user?.avatar) {
            return `/storage/${user.avatar}`;
        }
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&size=200&background=random`;
    };

    return (
        <img 
            src={getAvatarUrl()}
            alt={user?.name || 'User'}
            className={`${sizeClasses[size]} rounded-xl object-cover ${className}`}
        />
    );
}
