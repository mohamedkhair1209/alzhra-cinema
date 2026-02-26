import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabase'
import { useLanguage } from '../context/LanguageContext'
import { ui } from '../i18n/translations'

export default function Home() {
    const { t } = useLanguage()
    const [movies, setMovies] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function getMovies() {
            const { data } = await supabase.from('movies').select('*')
            setMovies(data || [])
            setLoading(false)
        }
        getMovies()
    }, [])

    return (
        <main>
            <section className="hero">
                <div className="hero-bg"></div>
                <div className="hero-overlay"></div>
                <div className="container hero-content">
                    <h1>{t(ui.home.heroTitle.ar, ui.home.heroTitle.en)}</h1>
                    <p>{t(ui.home.heroSub.ar, ui.home.heroSub.en)}</p>
                </div>
            </section>

            <section className="container">
                <h2 style={{ marginTop: '50px', borderBottom: '2px solid var(--gold)', display: 'inline-block', paddingBottom: '5px' }}>
                    {t(ui.home.nowShowing.ar, ui.home.nowShowing.en)}
                </h2>

                {loading ? (
                    <p style={{ padding: '50px 0', textAlign: 'center' }}>{t('جاري التحميل...', 'Loading...')}</p>
                ) : (
                    <div className="movies-grid">
                        {movies.length === 0 && <p>{t('لا توجد أفلام حالياً', 'No movies available')}</p>}
                        {movies.map(movie => (
                            <Link to={`/movie/${movie.id}`} key={movie.id} className="movie-card">
                                <img src={movie.poster_url} alt={movie.title_ar} className="poster" />
                                <div className="info">
                                    <h3>{t(movie.title_ar, movie.title_en)}</h3>
                                    <p>{t(movie.genre_ar, movie.genre_en)}</p>
                                    <p>{movie.duration} {t(ui.movie.min.ar, ui.movie.min.en)}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </main>
    )
}
