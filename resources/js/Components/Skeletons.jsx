/**
 * Reusable skeleton placeholder components.
 * Usage: show while Inertia is navigating or data is loading.
 */

function Pulse({ className = '' }) {
    return <div className={`animate-pulse rounded bg-gray-200 dark:bg-gray-700 ${className}`} />;
}

/** Mirrors the SprintCard layout */
export function SprintCardSkeleton() {
    return (
        <div className="overflow-hidden rounded-[20px] border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
            {/* Cover */}
            <div className="h-40 bg-gray-200 dark:bg-gray-800" />

            <div className="space-y-3 p-5">
                <Pulse className="h-4 w-3/4" />
                <Pulse className="h-3 w-full" />
                <Pulse className="h-3 w-5/6" />
                <Pulse className="h-3 w-2/3" />

                <div className="flex gap-2 pt-1">
                    <Pulse className="h-6 w-16 rounded-full" />
                    <Pulse className="h-6 w-16 rounded-full" />
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                    <Pulse className="h-10 rounded-lg" />
                    <Pulse className="h-10 rounded-lg" />
                </div>
            </div>

            <div className="flex items-center gap-3 border-t border-gray-100 px-5 py-4 dark:border-gray-800">
                <Pulse className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-1.5">
                    <Pulse className="h-3 w-1/2" />
                    <Pulse className="h-2.5 w-1/3" />
                </div>
            </div>
        </div>
    );
}

/** Mirrors an update/publication card in the sprint feed */
export function UpdateSkeleton() {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-3 flex items-start gap-3">
                <Pulse className="h-9 w-9 flex-shrink-0 rounded-full" />
                <div className="flex-1 space-y-1.5">
                    <Pulse className="h-3.5 w-1/3" />
                    <Pulse className="h-3 w-1/4" />
                </div>
            </div>
            <Pulse className="mb-1.5 h-3 w-full" />
            <Pulse className="mb-1.5 h-3 w-full" />
            <Pulse className="mb-4 h-3 w-3/4" />
            <div className="flex gap-4 border-t border-gray-100 pt-3 dark:border-gray-800">
                <Pulse className="h-4 w-12" />
                <Pulse className="h-4 w-12" />
            </div>
        </div>
    );
}

/** Row of N skeleton cards for grid layouts */
export function SprintCardSkeletonGrid({ count = 6 }) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <SprintCardSkeleton key={i} />
            ))}
        </>
    );
}

/** Column of N skeleton update cards */
export function UpdateSkeletonFeed({ count = 4 }) {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, i) => (
                <UpdateSkeleton key={i} />
            ))}
        </div>
    );
}
