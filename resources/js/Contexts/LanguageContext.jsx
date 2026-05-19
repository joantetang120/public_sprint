import { createContext, useContext, useState, useEffect } from 'react';
import en from '../translations/en.json';
import fr from '../translations/fr.json';
import { uiText } from '../translations/uiText';

const LanguageContext = createContext();

const translations = {
    en,
    fr,
};

const localeMap = {
    en: 'en-US',
    fr: 'fr-FR',
};

const replaceParams = (value, params = {}) => {
    let result = value;
    Object.keys(params).forEach((param) => {
        result = result.replaceAll(`{${param}}`, params[param]);
    });
    return result;
};

const getTranslatedLiteral = (language, value) => {
    if (!value) {
        return value;
    }

    return uiText[language]?.[value] ?? value;
};

export function LanguageProvider({ children, initialLanguage = 'en' }) {
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem('language') || initialLanguage || 'en';
    });

    useEffect(() => {
        if (!localStorage.getItem('language') && initialLanguage) {
            localStorage.setItem('language', initialLanguage);
            setLanguage(initialLanguage);
        }
    }, [initialLanguage]);

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

        return replaceParams(value, params);
    };

    const tl = (value, params = {}) => {
        if (!value) {
            return value;
        }

        const translatedValue = getTranslatedLiteral(language, value);
        return replaceParams(translatedValue, params);
    };

    const formatDate = (value, options = {}) => {
        if (!value) {
            return '';
        }

        const date = value instanceof Date ? value : new Date(value);
        return new Intl.DateTimeFormat(localeMap[language] || 'en-US', options).format(date);
    };

    const formatDateTime = (value, options = {}) => {
        if (!value) {
            return '';
        }

        const date = value instanceof Date ? value : new Date(value);
        return new Intl.DateTimeFormat(localeMap[language] || 'en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
            ...options,
        }).format(date);
    };

    return (
        <LanguageContext.Provider value={{ language, locale: localeMap[language] || 'en-US', setLanguage: updateLanguage, t, tl, formatDate, formatDateTime }}>
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
