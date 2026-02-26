import { useEffect, useState } from 'react'
import { supabase } from '../../supabase'
import { useLanguage } from '../../context/LanguageContext'
import { ui } from '../../i18n/translations'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { Link } from 'react-router-dom'

export default function Dashboard() {
    const { t } = useLanguage()
    const [stats, setStats] = useState({
        totalMovies: 0,
        activeMovies: 0,
        totalShowtimes: 0
    })

    useEffect(() => {
        async function fetchStats() {
            try {
                // Fetch movies with a fallback for missing is_active column
                const { data: movies, error: movieError } = await supabase.from('movies').select('id, is_active')

                let movieData = movies || []
                let activeCount = 0

                if (movieError && (movieError.code === 'PGRST204' || movieError.message.includes('is_active'))) {
                    console.warn('Dashboard: is_active column missing, falling back to id only select')
                    const { data: minimalMovies } = await supabase.from('movies').select('id')
                    movieData = minimalMovies || []
                    activeCount = movieData.length // Default all to active if column missing
                } else {
                    activeCount = movieData.filter(m => m.is_active !== false).length
                }

                const { data: showtimes } = await supabase.from('showtimes').select('id')

                setStats({
                    totalMovies: movieData.length,
                    activeMovies: activeCount,
                    totalShowtimes: (showtimes || []).length
                })
            } catch (err) {
                console.error('Dashboard Stats Error:', err)
            }
        }
        fetchStats()
    }, [])

    const cards = [
        { label: t(ui.admin.stats.totalMovies.ar, ui.admin.stats.totalMovies.en), value: stats.totalMovies, link: '/admin/movies', icon: '🎬' },
        { label: t(ui.admin.stats.activeMovies.ar, ui.admin.stats.activeMovies.en), value: stats.activeMovies, link: '/admin/movies', icon: '✅' },
        { label: t(ui.admin.stats.totalShowtimes.ar, ui.admin.stats.totalShowtimes.en), value: stats.totalShowtimes, link: '/admin/showtimes', icon: '🕐' },
    ]

    return (
        <AdminLayout title={t(ui.admin.dashboard.ar, ui.admin.dashboard.en)}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
                {cards.map(card => (
                    <Link key={card.label} to={card.link} className="movie-card" style={{ padding: '30px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ fontSize: '2.5rem' }}>{card.icon}</div>
                        <div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '5px' }}>{card.label}</div>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--gold)' }}>{card.value}</div>
                        </div>
                    </Link>
                ))}
            </div>

            <div style={{ marginTop: '60px' }}>
                <h2 style={{ color: 'var(--gold)', marginBottom: '30px' }}>{t('الوصول السريع', 'Quick Access')}</h2>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <Link to="/admin/movies" className="btn btn-primary">{t('إدارة الأفلام', 'Manage Movies')}</Link>
                    <Link to="/admin/showtimes" className="btn btn-primary">{t('إدارة المواعيد', 'Manage Showtimes')}</Link>
                </div>
            </div>
        </AdminLayout>
    )
}
