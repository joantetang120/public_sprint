import { Head } from '@inertiajs/react';
import {
    BoltIcon,
    ChartBarIcon,
    RocketLaunchIcon,
    UserGroupIcon,
    UserPlusIcon,
} from '@heroicons/react/24/outline';
import AdminLayout from './Layout';

function StatCard({ label, value, sub, icon: Icon, color = 'emerald' }) {
    const colors = {
        emerald: 'bg-emerald-50 text-emerald-700',
        blue:    'bg-blue-50 text-blue-700',
        amber:   'bg-amber-50 text-amber-700',
        purple:  'bg-purple-50 text-purple-700',
    };
    return (
        <div className="rounded-2xl border border-stone-200 bg-white p-6">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-stone-400">{label}</p>
                    <p className="mt-2 text-3xl font-black text-stone-900">{value?.toLocaleString()}</p>
                    {sub && <p className="mt-1 text-xs text-stone-400">{sub}</p>}
                </div>
                <div className={`rounded-xl p-2.5 ${colors[color]}`}>
                    <Icon className="h-5 w-5" />
                </div>
            </div>
        </div>
    );
}

function ActivityRow({ log }) {
    const actionLabel = {
        page_view:      'Viewed',
        sprint_created: 'Created sprint',
        update_posted:  'Posted update',
        comment_posted: 'Commented',
        login:          'Logged in',
    };

    return (
        <div className="flex items-center gap-3 py-3 border-b border-stone-100 last:border-0">
            <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-stone-100">
                {log.user?.avatar
                    ? <img src={log.user.avatar} alt="" className="h-full w-full object-cover" />
                    : <div className="flex h-full w-full items-center justify-center text-xs font-bold text-stone-400">
                        {log.user?.name?.[0]?.toUpperCase()}
                      </div>
                }
            </div>
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-stone-800">{log.user?.name}</p>
                <p className="truncate text-xs text-stone-400">
                    {actionLabel[log.action] || log.action} — {log.description || log.url}
                </p>
            </div>
            <p className="flex-shrink-0 text-xs text-stone-400">
                {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
        </div>
    );
}

export default function Dashboard({
    totalUsers, newToday, newThisWeek,
    totalSprints, activeSprints,
    updatesToday, totalUpdates,
    onlineCount, signupTrend,
    recentActivity, topUsers,
}) {
    return (
        <>
            <Head title="Admin — Overview" />
            <AdminLayout title="Overview">
                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <StatCard label="Total Users"     value={totalUsers}    sub={`+${newToday} today`}      icon={UserGroupIcon}  color="emerald" />
                    <StatCard label="Online Now"      value={onlineCount}   sub="last 10 minutes"           icon={BoltIcon}       color="blue" />
                    <StatCard label="Active Sprints"  value={activeSprints} sub={`${totalSprints} total`}   icon={RocketLaunchIcon} color="amber" />
                    <StatCard label="Updates Today"   value={updatesToday}  sub={`${totalUpdates} total`}   icon={ChartBarIcon}   color="purple" />
                </div>

                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Recent Activity */}
                    <div className="lg:col-span-2 rounded-2xl border border-stone-200 bg-white p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-sm font-black text-stone-900">Live Activity</h2>
                            <span className="flex items-center gap-1.5 text-xs text-stone-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Auto-refreshes every 30s
                            </span>
                        </div>
                        <div className="max-h-[420px] overflow-y-auto">
                            {recentActivity.length === 0
                                ? <p className="text-sm text-stone-400">No activity yet.</p>
                                : recentActivity.map(log => <ActivityRow key={log.id} log={log} />)
                            }
                        </div>
                    </div>

                    {/* Top users */}
                    <div className="rounded-2xl border border-stone-200 bg-white p-6">
                        <h2 className="mb-4 text-sm font-black text-stone-900">Top Builders</h2>
                        <div className="space-y-3">
                            {topUsers.map((u, i) => (
                                <div key={u.id} className="flex items-center gap-3">
                                    <span className="w-5 text-center text-xs font-black text-stone-300">#{i+1}</span>
                                    <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-stone-100">
                                        {u.avatar
                                            ? <img src={u.avatar} alt="" className="h-full w-full object-cover" />
                                            : <div className="flex h-full w-full items-center justify-center text-xs font-bold text-stone-400">
                                                {u.name?.[0]?.toUpperCase()}
                                              </div>
                                        }
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-xs font-semibold text-stone-800">{u.name}</p>
                                        <p className="text-xs text-stone-400">{u.updates_count} updates</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Signup trend */}
                {signupTrend.length > 0 && (
                    <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-6">
                        <h2 className="mb-4 text-sm font-black text-stone-900">New signups — last 14 days</h2>
                        <div className="flex items-end gap-1.5 h-24">
                            {(() => {
                                const max = Math.max(...signupTrend.map(d => d.count), 1);
                                return signupTrend.map(d => (
                                    <div key={d.date} className="group relative flex flex-1 flex-col items-center gap-1">
                                        <div
                                            className="w-full rounded-t-md bg-emerald-500 transition-all hover:bg-emerald-600"
                                            style={{ height: `${Math.max((d.count / max) * 80, 4)}px` }}
                                        />
                                        <span className="absolute -top-5 hidden text-xs font-bold text-stone-600 group-hover:block">
                                            {d.count}
                                        </span>
                                        <span className="text-[9px] text-stone-300 rotate-45 origin-left mt-1">
                                            {d.date?.slice(5)}
                                        </span>
                                    </div>
                                ));
                            })()}
                        </div>
                    </div>
                )}
            </AdminLayout>
        </>
    );
}
