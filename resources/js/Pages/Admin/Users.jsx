import { Head, Link, router, useForm } from '@inertiajs/react';
import { MagnifyingGlassIcon, ShieldCheckIcon, TrashIcon, NoSymbolIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import AdminLayout from './Layout';

const adminPath = () => window.__adminPath || 'xk9-control-panel';

export default function Users({ users, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [filter, setFilter] = useState(filters?.filter || '');

    const applyFilters = () => {
        router.get(`/${adminPath()}/users`, { search, filter }, { preserveState: true, replace: true });
    };

    const suspend = (user) => {
        if (!confirm(`${user.is_suspended ? 'Unsuspend' : 'Suspend'} ${user.name}?`)) return;
        router.post(`/${adminPath()}/users/${user.id}/suspend`);
    };

    const destroy = (user) => {
        if (!confirm(`Permanently delete ${user.name}? This cannot be undone.`)) return;
        router.delete(`/${adminPath()}/users/${user.id}`);
    };

    return (
        <>
            <Head title="Admin — Users" />
            <AdminLayout title="Users">
                {/* Filters */}
                <div className="mb-6 flex flex-wrap items-center gap-3">
                    <div className="relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && applyFilters()}
                            placeholder="Search by name or email…"
                            className="rounded-xl border border-stone-200 bg-white py-2.5 pl-9 pr-4 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                        />
                    </div>
                    {['', 'admin', 'suspended'].map(f => (
                        <button key={f} onClick={() => { setFilter(f); router.get(`/${adminPath()}/users`, { search, filter: f }, { preserveState: true, replace: true }); }}
                            className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${filter === f ? 'bg-emerald-950 text-white' : 'border border-stone-200 bg-white text-stone-600 hover:border-stone-300'}`}>
                            {f === '' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                    <span className="ml-auto text-sm text-stone-400">{users.total} users</span>
                </div>

                {/* Table */}
                <div className="rounded-2xl border border-stone-200 bg-white overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-stone-100 bg-stone-50">
                                {['User', 'Email', 'Sprints', 'Updates', 'Joined', 'Status', ''].map(h => (
                                    <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-stone-400">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {users.data.map(user => (
                                <tr key={user.id} className="border-b border-stone-100 hover:bg-stone-50 last:border-0">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-stone-100">
                                                {user.avatar
                                                    ? <img src={user.avatar} alt="" className="h-full w-full object-cover" />
                                                    : <div className="flex h-full w-full items-center justify-center text-xs font-bold text-stone-400">{user.name?.[0]?.toUpperCase()}</div>
                                                }
                                            </div>
                                            <div>
                                                <p className="font-semibold text-stone-900">{user.name}</p>
                                                {user.is_admin && (
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                                                        <ShieldCheckIcon className="h-3 w-3" /> Admin
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-stone-500">{user.email}</td>
                                    <td className="px-4 py-3 font-semibold text-stone-700">{user.created_sprints_count ?? 0}</td>
                                    <td className="px-4 py-3 font-semibold text-stone-700">{user.updates_count ?? 0}</td>
                                    <td className="px-4 py-3 text-stone-400 text-xs">{new Date(user.created_at).toLocaleDateString()}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                            user.is_suspended ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                                        }`}>
                                            {user.is_suspended ? 'Suspended' : 'Active'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        {!user.is_admin && (
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => suspend(user)} title={user.is_suspended ? 'Unsuspend' : 'Suspend'}
                                                    className="rounded-lg p-1.5 text-stone-400 transition hover:bg-amber-50 hover:text-amber-600">
                                                    {user.is_suspended ? <CheckCircleIcon className="h-4 w-4" /> : <NoSymbolIcon className="h-4 w-4" />}
                                                </button>
                                                <button onClick={() => destroy(user)} title="Delete"
                                                    className="rounded-lg p-1.5 text-stone-400 transition hover:bg-red-50 hover:text-red-600">
                                                    <TrashIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {users.last_page > 1 && (
                    <div className="mt-4 flex items-center justify-between text-sm">
                        <p className="text-stone-400">Page {users.current_page} of {users.last_page}</p>
                        <div className="flex gap-2">
                            {users.prev_page_url && (
                                <Link href={users.prev_page_url}
                                    className="rounded-xl border border-stone-200 bg-white px-4 py-2 font-semibold text-stone-600 hover:border-stone-300">
                                    Previous
                                </Link>
                            )}
                            {users.next_page_url && (
                                <Link href={users.next_page_url}
                                    className="rounded-xl bg-emerald-950 px-4 py-2 font-semibold text-white hover:bg-emerald-800">
                                    Next
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </AdminLayout>
        </>
    );
}
