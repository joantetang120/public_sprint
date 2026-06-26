import { Head, Link, router } from '@inertiajs/react';
import { GlobeAltIcon, LockClosedIcon, MagnifyingGlassIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import AdminLayout from './Layout';

const adminPath = () => window.__adminPath || 'xk9-control-panel';

export default function Sprints({ sprints, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [filter, setFilter] = useState(filters?.filter || '');

    const destroy = (sprint) => {
        if (!confirm(`Delete sprint "${sprint.title}"? This cannot be undone.`)) return;
        router.delete(`/${adminPath()}/sprints/${sprint.id}`);
    };

    return (
        <>
            <Head title="Admin — Sprints" />
            <AdminLayout title="Sprints">
                {/* Filters */}
                <div className="mb-6 flex flex-wrap items-center gap-3">
                    <div className="relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && router.get(`/${adminPath()}/sprints`, { search, filter }, { preserveState: true, replace: true })}
                            placeholder="Search sprints or owners…"
                            className="rounded-xl border border-stone-200 bg-white py-2.5 pl-9 pr-4 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                        />
                    </div>
                    {['', 'public', 'private', 'active'].map(f => (
                        <button key={f} onClick={() => router.get(`/${adminPath()}/sprints`, { search, filter: f }, { preserveState: true, replace: true })}
                            className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${filter === f ? 'bg-emerald-950 text-white' : 'border border-stone-200 bg-white text-stone-600 hover:border-stone-300'}`}>
                            {f === '' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                    <span className="ml-auto text-sm text-stone-400">{sprints.total} sprints</span>
                </div>

                {/* Table */}
                <div className="rounded-2xl border border-stone-200 bg-white overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-stone-100 bg-stone-50">
                                {['Sprint', 'Owner', 'Type', 'Status', 'Updates', 'Created', ''].map(h => (
                                    <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-stone-400">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {sprints.data.map(sprint => (
                                <tr key={sprint.id} className="border-b border-stone-100 hover:bg-stone-50 last:border-0">
                                    <td className="px-4 py-3">
                                        <p className="font-semibold text-stone-900 max-w-[200px] truncate">{sprint.title}</p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="h-6 w-6 flex-shrink-0 overflow-hidden rounded-full bg-stone-100">
                                                {sprint.owner_avatar
                                                    ? <img src={sprint.owner_avatar} alt="" className="h-full w-full object-cover" />
                                                    : <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-stone-400">{sprint.owner_name?.[0]?.toUpperCase()}</div>
                                                }
                                            </div>
                                            <span className="text-stone-600 text-xs">{sprint.owner_name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                            !sprint.is_private ? 'bg-blue-100 text-blue-700' : 'bg-stone-100 text-stone-600'
                                        }`}>
                                            {!sprint.is_private ? <GlobeAltIcon className="h-3 w-3" /> : <LockClosedIcon className="h-3 w-3" />}
                                            {!sprint.is_private ? 'Public' : 'Private'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                            sprint.status === 'active' ? 'bg-emerald-100 text-emerald-700'
                                            : sprint.status === 'completed' ? 'bg-blue-100 text-blue-700'
                                            : 'bg-stone-100 text-stone-500'
                                        }`}>
                                            {sprint.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 font-semibold text-stone-700">{sprint.updates_count ?? 0}</td>
                                    <td className="px-4 py-3 text-stone-400 text-xs">{new Date(sprint.created_at).toLocaleDateString()}</td>
                                    <td className="px-4 py-3">
                                        <button onClick={() => destroy(sprint)} title="Delete"
                                            className="rounded-lg p-1.5 text-stone-400 transition hover:bg-red-50 hover:text-red-600">
                                            <TrashIcon className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {sprints.last_page > 1 && (
                    <div className="mt-4 flex items-center justify-between text-sm">
                        <p className="text-stone-400">Page {sprints.current_page} of {sprints.last_page}</p>
                        <div className="flex gap-2">
                            {sprints.prev_page_url && <Link href={sprints.prev_page_url} className="rounded-xl border border-stone-200 bg-white px-4 py-2 font-semibold text-stone-600 hover:border-stone-300">Previous</Link>}
                            {sprints.next_page_url && <Link href={sprints.next_page_url} className="rounded-xl bg-emerald-950 px-4 py-2 font-semibold text-white hover:bg-emerald-800">Next</Link>}
                        </div>
                    </div>
                )}
            </AdminLayout>
        </>
    );
}
