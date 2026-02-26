import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import { ui } from '../../i18n/translations'

export default function Login() {
    const { user, login } = useAuth()
    const { t, toggleLang, lang } = useLanguage()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    if (user) return <Navigate to="/admin" replace />

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        const { error: authError } = await login(email, password)
        if (authError) {
            setError(t('خطأ في تسجيل الدخول. يرجى التحقق من بياناتك.', 'Login failed. Please check your credentials.'))
        } else {
            navigate('/admin')
        }
        setLoading(false)
    }

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-logo">
                    <h1>{t(ui.admin.login.ar, ui.admin.login.en)}</h1>
                    <p>{t('لوحة تحكم الإدارة لسينما الزهراء', 'Admin Panel for Alzhra Cinema')}</p>
                </div>
                {error && <div className="alert alert-error">⚠️ {error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">{t(ui.admin.email.ar, ui.admin.email.en)}</label>
                        <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} required dir="ltr" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">{t(ui.admin.password.ar, ui.admin.password.en)}</label>
                        <input className="form-input" type="password" value={password} onChange={e => setPassword(e.target.value)} required dir="ltr" />
                    </div>
                    <button className="btn btn-primary" style={{ width: '100%', padding: '15px' }} disabled={loading}>
                        {loading ? t('جاري الدخول...', 'Logging in...') : t(ui.admin.submit.ar, ui.admin.submit.en)}
                    </button>
                </form>
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <button className="lang-btn" onClick={toggleLang}>{lang === 'ar' ? 'English' : 'عربي'}</button>
                </div>
            </div>
        </div>
    )
}
