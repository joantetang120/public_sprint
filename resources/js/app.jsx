import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './Contexts/ThemeContext';
import { LanguageProvider } from './Contexts/LanguageContext';

const appName = import.meta.env.VITE_APP_NAME || 'PublicSprint';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        // Create a wrapper component that can access Inertia props
        function AppWrapper() {
            return <App {...props} />;
        }

        root.render(
            <ThemeProvider>
                <LanguageProvider>
                    <AppWrapper />
                </LanguageProvider>
            </ThemeProvider>
        );
    },
    progress: {
        color: '#10B981',
    },
});
