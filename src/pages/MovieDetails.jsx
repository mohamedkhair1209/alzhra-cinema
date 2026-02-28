import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../supabase'
import { useLanguage } from '../context/LanguageContext'
import { ui } from '../i18n/translations'

export default function MovieDetails() {
    const { id } = useParams()
    const { t } = useLanguage()
    const [movie, setMovie] = useState(null)
    const [showtimes, setShowtimes] = useState([])

    useEffect(() => {
        async function getData() {
            const { data: m } = await supabase.from('movies').select('*').eq('id', id).single()
            const { data: s } = await supabase.from('showtimes').select('*').eq('movie_id', id)
            setMovie(m)
            setShowtimes(s || [])
        }
        getData()
    }, [id])

    if (!movie) return <div className="container" style={{ paddingTop: '100px' }}>{t('جاري التحميل...', 'Loading...')}</div>

    return (
        <div className="container detail-view">
            <div>
                <img src={movie.poster_url} alt={movie.title_ar} className="detail-poster" />
            </div>
            <div className="detail-info">
                <Link to="/" style={{ color: 'var(--gold)', textDecoration: 'none', display: 'block', marginBottom: '20px' }}>
                    {t('← العودة للرئيسية', '← Back to Home')}
                </Link>
                <h1>{t(movie.title_ar, movie.title_en)}</h1>
                <div className="genre-container">
                    {(movie.genres || []).map(genre => (
                        <span key={genre} className="genre-badge">
                            {t(ui.genres[genre]?.ar, genre)}
                        </span>
                    ))}
                </div>
                <p style={{ marginTop: '20px' }}><strong>{t(ui.movie.duration.ar, ui.movie.duration.en)}:</strong> {movie.duration} {t(ui.movie.min.ar, ui.movie.min.en)}</p>
                <p><strong>{t(ui.movie.release.ar, ui.movie.release.en)}:</strong> {movie.release_date}</p>
                <p style={{ marginTop: '20px', color: '#ccc' }}>{t(movie.description_ar, movie.description_en)}</p>

                <h3 style={{ marginTop: '40px', color: 'var(--gold)' }}>{t(ui.movie.showtimes.ar, ui.movie.showtimes.en)}</h3>
                <div className="showtimes-box">
                    {showtimes.length === 0 && <p style={{ color: '#555' }}>{t('لا توجد مواعيد عرض', 'No showtimes')}</p>}
                    {showtimes.map(st => (
                        <div key={st.id} className="st-pill">
                            {st.date} | {st.time?.slice(0, 5)}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
