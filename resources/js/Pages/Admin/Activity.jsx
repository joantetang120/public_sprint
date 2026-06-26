import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AdminLayout from './Layout';

const adminPath = () => window.__adminPath || 'xk9-control-panel';

const ACTION_COLORS = {
    page_view:      'bg-stone-100 text-stone-600',
    sprint_created: 'bg-emerald-100 text-emerald-700',
    update_posted:  'bg-blue-100 text-blue-700',
    comment_posted: 'bg-purple-100 text-purple-700',
    login:          'bg-amber-100 text-amber-700',
};

export default function Activity({ logs, filters }) {
    const [action, setAction] = useState(filters?.action || '');

    // Auto-refresh every 30 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            router.reload({ only: ['logs'] });
        }, 30000);
        return () => clearInterval(timer);
    }, []);

    return (
        <>
            <Head title="Admin — Activity" />
            <AdminLayout title="Activity Feed">
                {/* Filters */}
                <div className="mb-6 flex flex-wrap items-center gap-3">
                    {['', 'page_view', 'sprint_created', 'update_posted', 'comment_posted', 'login'].map(a => (
                        <button key={a}
                            onClick={() => router.get(`/${adminPath()}/activity`, { action: a }, { preserveState: true, replace: true })}
                            className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${action === a ? 'bg-emerald-950 text-white' : 'border border-stone-200 bg-white text-stone-600 hover:border-stone-300'}`}>
                            {a === '' ? 'All' : a.replace(/_/g, ' ')}
                        </button>
                    ))}
                    <span className="ml-auto text-xs text-stone-400 flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Refreshes every 30s
                    </span>
                </div>

                {/* Log table */}
                <div className="rounded-2xl border border-stone-200 bg-white overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-stone-100 bg-stone-50">
                                {['User', 'Action', 'Detail', 'IP', 'Time'].map(h => (
                                    <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-stone-400">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {logs.data.map(log => (
                                <tr key={log.id} className="border-b border-stone-100 hover:bg-stone-50 last:border-0">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="h-7 w-7 flex-shrink-0 overflow-hidden rounded-full bg-stone-100">
                                                {log.user?.avatar
                                                    ? <img src={log.user.avatar} alt="" className="h-full w-full object-cover" />
                                                    : <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-stone-400">{log.user?.name?.[0]?.toUpperCase()}</div>
                                                }
                                            </div>
                                            <span className="font-semibold text-stone-800 text-xs">{log.user?.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${ACTION_COLORS[log.action] || 'bg-stone-100 text-stone-600'}`}>
                                            {log.action?.replace(/_/g, ' ')}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-stone-500 max-w-[240px] truncate text-xs">
                                        {log.description || log.url}
                                    </td>
                                    <td className="px-4 py-3 text-stone-400 text-xs font-mono">{log.ip_address}</td>
                                    <td className="px-4 py-3 text-stone-400 text-xs whitespace-nowrap">
                                        {new Date(log.created_at).toLocaleString([], { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' })}
                                    </td>
                                </tr>
                            ))}
                            {logs.data.length === 0 && (
                                <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-stone-400">No activity yet.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {logs.last_page > 1 && (
                    <div className="mt-4 flex items-center justify-between text-sm">
                        <p className="text-stone-400">Page {logs.current_page} of {logs.last_page} — {logs.total} events</p>
                        <div className="flex gap-2">
                            {logs.prev_page_url && <Link href={logs.prev_page_url} className="rounded-xl border border-stone-200 bg-white px-4 py-2 font-semibold text-stone-600">Previous</Link>}
                            {logs.next_page_url && <Link href={logs.next_page_url} className="rounded-xl bg-emerald-950 px-4 py-2 font-semibold text-white">Next</Link>}
                        </div>
                    </div>
                )}
            </AdminLayout>
        </>
    );
}
