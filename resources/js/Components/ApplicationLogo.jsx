export default function ApplicationLogo({ className = '', ...props }) {
    return (
        <img
            src="/logo/log2.png"
            alt="PublicSprint Logo"
            className={className}
            {...props}
        />
    );
}
