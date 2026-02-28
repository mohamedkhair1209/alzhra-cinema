import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { ui } from '../i18n/translations'

export default function Navbar() {
    const { toggleLang, t, isAr } = useLanguage()

    const isHomePage = window.location.pathname === '/'

    const NavLink = ({ to, label }) => {
        if (isHomePage) {
            return <a href={to}>{label}</a>
        }
        return <Link to={`/${to}`}>{label}</Link>
    }

    return (
        <nav className="navbar">
            <div className="container nav-content">
                <Link to="/" className="logo">
                    <span className="ar">سينما الزهراء</span>
                    <span className="en">ALZHRA CINEMA</span>
                </Link>
                <div className="nav-links">
                    <NavLink to="#hero" label={t(ui.nav.home.ar, ui.nav.home.en)} />
                    <NavLink to="#movies" label={t(ui.home.nowShowing.ar, ui.home.nowShowing.en)} />
                    <NavLink to="#about" label={t(ui.nav.about.ar, ui.nav.about.en)} />
                    <NavLink to="#contact" label={t(ui.nav.contact.ar, ui.nav.contact.en)} />
                    <button onClick={toggleLang} className="lang-btn">
                        {isAr ? 'English' : 'العربية'}
                    </button>
                </div>
            </div>
        </nav>
    )
}
