import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { ui } from '../i18n/translations'

export default function Navbar() {
    const { toggleLang, t, isAr } = useLanguage()

    return (
        <nav className="navbar">
            <div className="container nav-content">
                <Link to="/" className="logo">
                    <span className="ar">سينما الزهراء</span>
                    <span className="en">ALZHRA CINEMA</span>
                </Link>
                <div className="nav-links">
                    <Link to="/">{t(ui.nav.home.ar, ui.nav.home.en)}</Link>
                    <Link to="/about">{t(ui.nav.about.ar, ui.nav.about.en)}</Link>
                    <Link to="/contact">{t(ui.nav.contact.ar, ui.nav.contact.en)}</Link>
                    <button onClick={toggleLang} className="lang-btn">
                        {isAr ? 'English' : 'العربية'}
                    </button>
                </div>
            </div>
        </nav>
    )
}
