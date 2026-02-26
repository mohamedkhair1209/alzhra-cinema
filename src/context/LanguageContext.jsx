import { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
    const [lang, setLang] = useState('ar')

    useEffect(() => {
        document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr')
        document.documentElement.setAttribute('lang', lang)
    }, [lang])

    const t = (ar, en) => (lang === 'ar' ? ar : en)
    const toggleLang = () => setLang(l => (l === 'ar' ? 'en' : 'ar'))

    return (
        <LanguageContext.Provider value={{ lang, toggleLang, t, isAr: lang === 'ar' }}>
            {children}
        </LanguageContext.Provider>
    )
}

export const useLanguage = () => useContext(LanguageContext)
