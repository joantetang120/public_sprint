import { createContext, useContext, useState, useEffect } from 'react';
import en from '../translations/en.json';
import fr from '../translations/fr.json';

const LanguageContext = createContext();

const translations = {
    en,
    fr,
};

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem('language') || 'en';
    });

    // Update language
    const updateLanguage = (newLanguage) => {
        localStorage.setItem('language', newLanguage);
        setLanguage(newLanguage);
    };

    // Listen for storage changes (when settings are saved)
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'language' && e.newValue) {
                setLanguage(e.newValue);
            }
        };
        
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const t = (key, params = {}) => {
        const keys = key.split('.');
        let value = translations[language];
        
        for (const k of keys) {
            value = value?.[k];
        }
        
        if (!value) {
            console.warn(`Translation missing for key: ${key} in language: ${language}`);
            return key;
        }
        
        // Replace parameters
        let result = value;
        Object.keys(params).forEach(param => {
            result = result.replace(`{${param}}`, params[param]);
        });
        
        return result;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: updateLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider');
    }
    return context;
}
