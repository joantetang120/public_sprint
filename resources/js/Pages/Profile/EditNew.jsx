import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowLeftIcon,
    CameraIcon,
    EnvelopeIcon,
    GlobeAltIcon,
    PencilSquareIcon,
    BookmarkSquareIcon,
    MapPinIcon,
    UserIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import PublicSprintLayout from '@/Layouts/PublicSprintLayout';
import ActivityPulseStrip from '@/Components/ActivityPulseStrip';
import UserAvatar from '@/Components/UserAvatar';
import { routeKey } from '@/lib/routeKey';
import { useLanguage } from '@/Contexts/LanguageContext';

export default function EditNew({ auth }) {
    const { tl } = useLanguage();
    const { data, setData, post, processing, errors } = useForm({
        name: auth.user.name || '',
        email: auth.user.email || '',
        bio: auth.user.bio || '',
        location: auth.user.location || '',
        website: auth.user.website || '',
        avatar: null,
        cover_image: null,
    });

    const [avatarPreview, setAvatarPreview] = useState(
        auth.user.avatar ? `/storage/${auth.user.avatar}` : null
    );
    const [coverPreview, setCoverPreview] = useState(
        auth.user.cover_image ? `/storage/${auth.user.cover_image}` : null
    );

    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setData('avatar', file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleCoverChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setData('cover_image', file);
            setCoverPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        post(route('profile.update.full'), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const previewUser = {
        ...auth.user,
        avatar: avatarPreview ? null : auth.user.avatar,
    };

    return (
        <PublicSprintLayout>
            <Head title={tl('Edit Profile')} />

            <div className="mx-auto max-w-5xl space-y-6">
                <section className="ps-hero-band p-7">
                    <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div className="max-w-2xl">
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/12 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white backdrop-blur-sm">
                                <span className="grid h-6 w-6 place-items-center rounded-full bg-white/14">
                                    <PencilSquareIcon className="h-3.5 w-3.5" />
                                </span>
                                {tl('Edit Profile')}
                            </div>
                            <h1 className="font-display text-4xl font-black text-white">
                                {tl('Edit Profile')}
                            </h1>
                            <p className="mt-2 text-sm leading-7 text-white/74">
                                {tl('Update your profile information and settings')}
                            </p>
                        </div>

                        <div className="w-full max-w-sm space-y-3">
                            <ActivityPulseStrip />
                            <Link
                                href={route('users.show', routeKey(auth.user))}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-[#17211d] transition hover:bg-[#f3ffcf]"
                            >
                                <ArrowLeftIcon className="h-4 w-4" />
                                <span>{tl('Back to Profile')}</span>
                            </Link>
                        </div>
                    </div>
                </section>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <motion.section
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="ps-feed-card overflow-hidden"
                    >
                        <div className="ps-card-cover h-56">
                            {coverPreview && (
                                <img
                                    src={coverPreview}
                                    alt="Cover"
                                    className="h-full w-full object-cover"
                                />
                            )}
                            <label className="absolute right-4 top-4 z-10 cursor-pointer">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleCoverChange}
                                    className="hidden"
                                />
                                <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-[#17211d] shadow-sm transition hover:bg-[#f3ffcf]">
                                    <CameraIcon className="h-4 w-4" />
                                    {tl('Change Cover')}
                                </span>
                            </label>
                        </div>

                        <div className="bg-white px-8 pb-8">
                            <div className="-mt-16 mb-6 flex items-end">
                                <div className="relative">
                                    <UserAvatar user={previewUser} size="2xl" className="shadow-2xl" />
                                    {avatarPreview && (
                                        <img
                                            src={avatarPreview}
                                            alt={auth.user.name}
                                            className="absolute inset-[2px] h-32 w-32 rounded-full border-2 border-white object-cover"
                                        />
                                    )}
                                    <label className="absolute bottom-0 right-0 cursor-pointer">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                            className="hidden"
                                        />
                                        <span className="grid h-11 w-11 place-items-center rounded-full bg-[#17211d] text-white shadow-lg transition hover:bg-[#0f1714]">
                                            <CameraIcon className="h-5 w-5" />
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {errors.avatar && <p className="mb-3 text-sm text-red-600">{errors.avatar}</p>}
                            {errors.cover_image && <p className="mb-3 text-sm text-red-600">{errors.cover_image}</p>}
                        </div>
                    </motion.section>

                    <motion.section
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.08 }}
                        className="ps-feed-card p-8"
                    >
                        <h2 className="mb-6 font-display text-2xl font-black text-[#17211d]">
                            {tl('Profile Information')}
                        </h2>

                        <div className="space-y-6">
                            <Field
                                icon={UserIcon}
                                label={tl('Name')}
                                error={errors.name}
                                input={
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(event) => setData('name', event.target.value)}
                                        className="w-full px-4 py-3 text-[#17211d]"
                                        placeholder={tl('Your name')}
                                    />
                                }
                            />

                            <Field
                                icon={EnvelopeIcon}
                                label={tl('Email')}
                                error={errors.email}
                                input={
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(event) => setData('email', event.target.value)}
                                        className="w-full px-4 py-3 text-[#17211d]"
                                        placeholder={tl('your@email.com')}
                                    />
                                }
                            />

                            <Field
                                label={tl('Bio')}
                                error={errors.bio}
                                input={
                                    <>
                                        <textarea
                                            value={data.bio}
                                            onChange={(event) => setData('bio', event.target.value)}
                                            rows="4"
                                            className="w-full resize-none px-4 py-3 text-[#17211d]"
                                            placeholder={tl('Tell us about yourself...')}
                                            maxLength="500"
                                        />
                                        <div className="mt-2 flex justify-between gap-3">
                                            <span className="text-sm text-red-600">{errors.bio}</span>
                                            <span className="ml-auto text-xs font-bold text-[#66736d]">
                                                {data.bio.length}/500
                                            </span>
                                        </div>
                                    </>
                                }
                            />

                            <Field
                                icon={MapPinIcon}
                                label={tl('Location')}
                                error={errors.location}
                                input={
                                    <input
                                        type="text"
                                        value={data.location}
                                        onChange={(event) => setData('location', event.target.value)}
                                        className="w-full px-4 py-3 text-[#17211d]"
                                        placeholder={tl('City, Country')}
                                    />
                                }
                            />

                            <Field
                                icon={GlobeAltIcon}
                                label={tl('Website')}
                                error={errors.website}
                                input={
                                    <input
                                        type="url"
                                        value={data.website}
                                        onChange={(event) => setData('website', event.target.value)}
                                        className="w-full px-4 py-3 text-[#17211d]"
                                        placeholder={tl('https://yourwebsite.com')}
                                    />
                                }
                            />
                        </div>
                    </motion.section>

                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.12 }}
                        className="flex justify-end gap-4"
                    >
                        <Link
                            href={route('users.show', routeKey(auth.user))}
                            className="rounded-full border border-black/10 bg-[#f5f3ea] px-6 py-3 text-sm font-black text-[#17211d] transition hover:bg-[#ece8dc]"
                        >
                            {tl('Cancel')}
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 rounded-full bg-[#17211d] px-6 py-3 text-sm font-black text-white transition hover:bg-[#0f1714] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <BookmarkSquareIcon className="h-5 w-5" />
                            <span>{processing ? tl('Saving...') : tl('Save Changes')}</span>
                        </button>
                    </motion.div>
                </form>
            </div>
        </PublicSprintLayout>
    );
}

function Field({ icon: Icon, label, error, input }) {
    return (
        <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-black text-[#17211d]">
                {Icon ? <Icon className="h-4 w-4" /> : null}
                <span>{label}</span>
            </label>
            {input}
            {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
        </div>
    );
}
