import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from '@/hooks/use-appearance';
import Navbar from './navbar'
import Footer from './footer'
const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Initialize theme
initializeTheme();

createInertiaApp({
    title: (title) => title ? `${title} - ${appName}` : appName,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);
      
        // Obtenir le nom du composant actuel
        const componentName = props.initialPage.component;
      
        // Liste des pages qui ne doivent pas afficher Navbar/Footer
        const noLayoutPages = ['admin','Owner']; // adapte selon le nom réel du fichier
      
        const showLayout = !noLayoutPages.includes(componentName);
      
        root.render(
          <>
            {showLayout && <Navbar />}
            <App {...props} />
            {showLayout && <Footer />}
          </>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
