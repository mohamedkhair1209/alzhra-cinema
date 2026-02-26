import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import { ui } from '../../i18n/translations'

export function AdminLayout({ children, title }) {
    const { logout } = useAuth()
    const { t, toggleLang, lang } = useLanguage()
    const navigate = useNavigate()
    const location = useLocation()

    const handleLogout = async () => {
        await logout()
        navigate('/admin/login')
    }

    const navItems = [
        { path: '/admin', label: t(ui.admin.dashboard.ar, ui.admin.dashboard.en), icon: '📊' },
        { path: '/admin/movies', label: t(ui.admin.movies.ar, ui.admin.movies.en), icon: '🎬' },
        { path: '/admin/showtimes', label: t(ui.admin.showtimes.ar, ui.admin.showtimes.en), icon: '🕐' },
    ]

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div style={{ padding: '0 30px' }}>
                    <Link to="/" className="logo">
                        <span className="ar">سينما الزهراء</span>
                        <span className="en">ALZHRA CINEMA</span>
                    </Link>
                </div>
                <nav className="admin-nav">
                    {navItems.map(item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            <span>{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>
                <div style={{ position: 'absolute', bottom: '30px', left: '0', right: '0', padding: '0 30px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <button onClick={toggleLang} className="lang-btn" style={{ width: '100%' }}>{lang === 'ar' ? 'English' : 'عربي'}</button>
                    <button onClick={handleLogout} className="btn btn-secondary" style={{ width: '100%' }}>{t(ui.admin.logout.ar, ui.admin.logout.en)}</button>
                </div>
            </aside>
            <main style={{
                marginLeft: lang === 'ar' ? '0' : '260px',
                marginRight: lang === 'ar' ? '260px' : '0',
                flex: 1,
                padding: '40px',
                minHeight: '100vh'
            }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <h1 style={{ color: 'var(--gold)', fontSize: '2rem' }}>{title}</h1>
                </header>
                {children}
            </main>
        </div>
    )
}
