import { Head, Link } from '@inertiajs/react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '@/Contexts/LanguageContext';
import LanguageSwitcher from '@/Components/LanguageSwitcher';

function Section({ title, children }) {
    return (
        <section className="border-b border-stone-100 py-10 last:border-0">
            <h2 className="mb-5 text-lg font-black text-stone-900">{title}</h2>
            <div className="space-y-4 text-sm leading-7 text-stone-600">{children}</div>
        </section>
    );
}

export default function PrivacyPolicy() {
    const { language } = useLanguage();
    const isFr = language === 'fr';

    return (
        <>
            <Head title="Privacy Policy — PublicSprint" />

            <div className="min-h-screen bg-[#f5f1e8]">
                {/* Nav */}
                <nav className="sticky top-0 z-30 border-b border-stone-200/60 bg-[#f5f1e8]/90 backdrop-blur-md">
                    <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-5">
                        <Link href="/" className="flex items-center gap-2">
                            <img src="/logo/log2.png" alt="PublicSprint" className="h-12 w-auto" />
                        </Link>
                        <div className="flex items-center gap-4">
                            <LanguageSwitcher compact />
                            <Link
                                href="/register"
                                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
                            >
                                <ArrowLeftIcon className="h-3.5 w-3.5 rotate-180" />
                                {isFr ? 'Retour' : 'Back'}
                            </Link>
                        </div>
                    </div>
                </nav>

                <div className="mx-auto max-w-4xl px-5 py-16">
                    {/* Header */}
                    <div className="mb-12">
                        <p className="mb-3 text-xs font-bold uppercase tracking-[0.26em] text-emerald-700">
                            {isFr ? 'Documents légaux' : 'Legal'}
                        </p>
                        <h1 className="text-4xl font-black tracking-tight text-stone-900">
                            {isFr ? 'Politique de confidentialité' : 'Privacy Policy'}
                        </h1>
                        <p className="mt-3 text-sm text-stone-400">
                            {isFr ? 'Dernière mise à jour : 26 juin 2025' : 'Last updated: June 26, 2025'}
                        </p>
                    </div>

                    <div className="rounded-[28px] border border-stone-200 bg-white p-8 md:p-12">

                        {/* Intro */}
                        <div className="mb-10 rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
                            <p className="text-sm leading-7 text-emerald-800">
                                {isFr
                                    ? 'Chez PublicSprint, nous prenons la protection de vos données personnelles au sérieux. Cette politique explique quelles informations nous collectons, comment nous les utilisons et quels droits vous avez.'
                                    : 'At PublicSprint, we take your personal data seriously. This policy explains what information we collect, how we use it, and what rights you have.'
                                }
                            </p>
                        </div>

                        <Section title={isFr ? '1. Qui sommes-nous' : '1. Who We Are'}>
                            <p>
                                {isFr
                                    ? 'PublicSprint est opéré par Lymoratech, basé au Cameroun. En tant que responsable du traitement de vos données, nous sommes responsables de leur protection conformément aux lois applicables.'
                                    : 'PublicSprint is operated by Lymoratech, based in Cameroon. As the data controller for your information, we are responsible for protecting it in accordance with applicable laws.'
                                }
                            </p>
                            <p>
                                {isFr ? 'Contact : contact@maisoft-group.com' : 'Contact: contact@maisoft-group.com'}
                            </p>
                        </Section>

                        <Section title={isFr ? '2. Données que nous collectons' : '2. Data We Collect'}>
                            <p className="font-semibold text-stone-700">
                                {isFr ? 'Informations que vous nous fournissez directement :' : 'Information you provide directly:'}
                            </p>
                            <ul className="ml-5 list-disc space-y-2">
                                {(isFr ? [
                                    'Nom et adresse e-mail lors de la création de votre compte',
                                    'Photo de profil (optionnelle)',
                                    'Contenu de vos sprints : titres, descriptions, mises à jour quotidiennes, images',
                                    'Commentaires et réactions que vous publiez',
                                    'Informations de profil que vous choisissez de partager',
                                ] : [
                                    'Name and email address when creating your account',
                                    'Profile photo (optional)',
                                    'Your sprint content: titles, descriptions, daily updates, images',
                                    'Comments and reactions you post',
                                    'Profile information you choose to share',
                                ]).map(item => <li key={item}>{item}</li>)}
                            </ul>
                            <p className="font-semibold text-stone-700">
                                {isFr ? 'Informations collectées automatiquement :' : 'Information collected automatically:'}
                            </p>
                            <ul className="ml-5 list-disc space-y-2">
                                {(isFr ? [
                                    'Adresse IP et type de navigateur',
                                    'Pages visitées et actions effectuées sur la plateforme',
                                    'Horodatages des connexions et des activités',
                                    'Données de session via cookies',
                                ] : [
                                    'IP address and browser type',
                                    'Pages visited and actions taken on the platform',
                                    'Timestamps of logins and activities',
                                    'Session data via cookies',
                                ]).map(item => <li key={item}>{item}</li>)}
                            </ul>
                            <p className="font-semibold text-stone-700">
                                {isFr ? 'Si vous vous connectez via Google :' : 'If you sign in via Google:'}
                            </p>
                            <p>
                                {isFr
                                    ? 'Nous recevons votre nom, adresse e-mail et photo de profil fournis par Google. Nous ne stockons pas votre mot de passe Google.'
                                    : 'We receive your name, email address, and profile picture provided by Google. We do not store your Google password.'
                                }
                            </p>
                        </Section>

                        <Section title={isFr ? '3. Comment nous utilisons vos données' : '3. How We Use Your Data'}>
                            <p>{isFr ? 'Nous utilisons vos informations pour :' : 'We use your information to:'}</p>
                            <ul className="ml-5 list-disc space-y-2">
                                {(isFr ? [
                                    'Créer et gérer votre compte',
                                    'Afficher votre contenu sur la plateforme',
                                    'Vous envoyer des e-mails transactionnels (vérification, réinitialisation de mot de passe, notifications)',
                                    'Calculer les scores et classements des sprints',
                                    'Générer des rapports de sprint avec l\'IA (vos données restent sur nos serveurs et ne sont pas partagées avec des tiers pour la formation)',
                                    'Améliorer la plateforme grâce à des analyses anonymisées',
                                    'Prévenir la fraude et assurer la sécurité',
                                ] : [
                                    'Create and manage your account',
                                    'Display your content on the platform',
                                    'Send you transactional emails (verification, password reset, notifications)',
                                    'Calculate sprint scores and rankings',
                                    'Generate AI sprint reports (your data stays on our servers and is not shared with third parties for training)',
                                    'Improve the platform through anonymized analytics',
                                    'Prevent fraud and ensure security',
                                ]).map(item => <li key={item}>{item}</li>)}
                            </ul>
                        </Section>

                        <Section title={isFr ? '4. Partage de vos données' : '4. Data Sharing'}>
                            <p className="font-semibold text-stone-700">
                                {isFr ? 'Nous ne vendons jamais vos données.' : 'We never sell your data.'}
                            </p>
                            <p>
                                {isFr
                                    ? 'Nous pouvons partager des informations avec des prestataires de services tiers uniquement dans la mesure nécessaire au fonctionnement du service :'
                                    : 'We may share information with third-party service providers only to the extent necessary to operate the service:'
                                }
                            </p>
                            <ul className="ml-5 list-disc space-y-2">
                                {(isFr ? [
                                    'Hébergement et infrastructure cloud (serveurs sécurisés)',
                                    'Service d\'envoi d\'e-mails transactionnels',
                                    'Authentification Google (si vous choisissez de vous connecter via Google)',
                                    'API d\'intelligence artificielle pour la génération de rapports',
                                ] : [
                                    'Cloud hosting and infrastructure (secured servers)',
                                    'Transactional email delivery service',
                                    'Google authentication (if you choose to sign in via Google)',
                                    'Artificial intelligence API for report generation',
                                ]).map(item => <li key={item}>{item}</li>)}
                            </ul>
                            <p>
                                {isFr
                                    ? 'Ces prestataires sont contractuellement tenus de protéger vos données et de ne les utiliser qu\'aux fins spécifiées.'
                                    : 'These providers are contractually required to protect your data and use it only for the specified purposes.'
                                }
                            </p>
                            <p>
                                {isFr
                                    ? 'Nous pouvons également divulguer vos données si la loi l\'exige ou pour protéger nos droits légaux.'
                                    : 'We may also disclose your data if required by law or to protect our legal rights.'
                                }
                            </p>
                        </Section>

                        <Section title={isFr ? '5. Contenu public' : '5. Public Content'}>
                            <p>
                                {isFr
                                    ? 'PublicSprint est une plateforme de construction en public. Lorsque vous créez un sprint public ou publiez des mises à jour publiques, ces informations sont visibles par tous les visiteurs du site, y compris les personnes non inscrites.'
                                    : 'PublicSprint is a build-in-public platform. When you create a public sprint or post public updates, that information is visible to all site visitors, including non-registered people.'
                                }
                            </p>

                            <p>
                                {isFr
                                    ? 'Réfléchissez bien avant de publier des informations sensibles dans un sprint public.'
                                    : 'Think carefully before publishing sensitive information in a public sprint.'
                                }
                            </p>
                        </Section>

                        <Section title={isFr ? '6. Cookies' : '6. Cookies'}>
                            <p>
                                {isFr
                                    ? 'Nous utilisons des cookies essentiels pour faire fonctionner la plateforme — notamment pour maintenir votre session active après connexion. Nous utilisons également des cookies de préférences pour mémoriser votre langue préférée.'
                                    : 'We use essential cookies to operate the platform — including to keep your session active after login. We also use preference cookies to remember your preferred language.'
                                }
                            </p>
                            <p>
                                {isFr
                                    ? 'Nous n\'utilisons pas de cookies publicitaires ou de suivi tiers.'
                                    : 'We do not use advertising or third-party tracking cookies.'
                                }
                            </p>
                        </Section>

                        <Section title={isFr ? '7. Conservation des données' : '7. Data Retention'}>
                            <p>
                                {isFr
                                    ? 'Nous conservons vos données aussi longtemps que votre compte est actif. Si vous supprimez votre compte, nous supprimerons vos données personnelles dans un délai de 30 jours, sauf obligation légale de conservation plus longue.'
                                    : 'We retain your data for as long as your account is active. If you delete your account, we will remove your personal data within 30 days, unless we are legally required to retain it longer.'
                                }
                            </p>
                            <p>
                                {isFr
                                    ? 'Le contenu que vous avez publié dans des sprints publics peut rester dans nos journaux de sauvegarde pendant 90 jours supplémentaires après la suppression.'
                                    : 'Content you posted in public sprints may remain in our backup logs for an additional 90 days after deletion.'
                                }
                            </p>
                        </Section>

                        <Section title={isFr ? '8. Vos droits' : '8. Your Rights'}>
                            <p>{isFr ? 'Vous avez le droit de :' : 'You have the right to:'}</p>
                            <ul className="ml-5 list-disc space-y-2">
                                {(isFr ? [
                                    'Accéder à vos données personnelles',
                                    'Corriger des informations inexactes',
                                    'Demander la suppression de votre compte et de vos données',
                                    'Exporter vos données (rapports, mises à jour)',
                                    'Vous opposer à certains traitements de données',
                                    'Retirer votre consentement à tout moment',
                                ] : [
                                    'Access your personal data',
                                    'Correct inaccurate information',
                                    'Request deletion of your account and data',
                                    'Export your data (reports, updates)',
                                    'Object to certain data processing',
                                    'Withdraw your consent at any time',
                                ]).map(item => <li key={item}>{item}</li>)}
                            </ul>
                            <p>
                                {isFr
                                    ? 'Pour exercer ces droits, contactez-nous à lymoratech@gmail.com. Nous répondrons dans un délai de 30 jours.'
                                    : 'To exercise these rights, contact us at lymoratech@gmail.com. We will respond within 30 days.'
                                }
                            </p>
                        </Section>

                        <Section title={isFr ? '9. Sécurité' : '9. Security'}>
                            <p>
                                {isFr
                                    ? 'Nous mettons en place des mesures de sécurité raisonnables pour protéger vos données : chiffrement HTTPS, mots de passe hachés, accès restreint aux données en production.'
                                    : 'We implement reasonable security measures to protect your data: HTTPS encryption, hashed passwords, restricted access to production data.'
                                }
                            </p>
                            <p>
                                {isFr
                                    ? 'Cependant, aucun système n\'est infaillible. En cas de violation de données qui vous affecte significativement, nous vous en informerons dans les meilleurs délais.'
                                    : 'However, no system is infallible. In the event of a data breach that significantly affects you, we will notify you as soon as possible.'
                                }
                            </p>
                        </Section>

                        <Section title={isFr ? '10. Enfants' : '10. Children'}>
                            <p>
                                {isFr
                                    ? 'PublicSprint n\'est pas destiné aux personnes de moins de 13 ans. Nous ne collectons pas sciemment de données personnelles d\'enfants de moins de 13 ans. Si vous pensez qu\'un enfant nous a fourni des données, contactez-nous et nous les supprimerons.'
                                    : 'PublicSprint is not intended for people under 13 years of age. We do not knowingly collect personal data from children under 13. If you believe a child has provided us with data, contact us and we will delete it.'
                                }
                            </p>
                        </Section>

                        <Section title={isFr ? '11. Modifications de cette politique' : '11. Changes to This Policy'}>
                            <p>
                                {isFr
                                    ? 'Nous pouvons mettre à jour cette politique de confidentialité. En cas de changements importants, nous vous en informerons par e-mail ou via la plateforme. La date de la dernière mise à jour est indiquée en haut de cette page.'
                                    : 'We may update this privacy policy. For significant changes, we will notify you by email or through the platform. The date of the last update is shown at the top of this page.'
                                }
                            </p>
                        </Section>

                        <Section title={isFr ? '12. Nous contacter' : '12. Contact Us'}>
                            <p>
                                {isFr
                                    ? 'Pour toute question relative à votre vie privée ou à cette politique, contactez-nous à :'
                                    : 'For any questions about your privacy or this policy, contact us at:'
                                }
                            </p>
                            <p className="font-semibold text-stone-800">lymoratech@gmail.com</p>
                            <p>PublicSprint — Lymoratech, Cameroun</p>
                        </Section>
                    </div>

                    {/* Footer links */}
                    <div className="mt-8 flex items-center justify-center gap-6">
                        <Link href="/terms" className="text-sm font-semibold text-emerald-700 transition hover:text-emerald-900">
                            {isFr ? 'Conditions d\'utilisation' : 'Terms of Service'}
                        </Link>
                        <span className="text-stone-300">·</span>
                        <Link href="/register" className="text-sm font-semibold text-stone-500 transition hover:text-stone-800">
                            {isFr ? 'Retour à l\'inscription' : 'Back to register'}
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
