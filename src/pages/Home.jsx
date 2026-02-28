import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaInstagram, FaFacebookF } from 'react-icons/fa'
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
            <section id="hero" className="hero">
                <div className="hero-bg"></div>
                <div className="hero-overlay"></div>
                <div className="container hero-content">
                    <h1>{t(ui.home.heroTitle.ar, ui.home.heroTitle.en)}</h1>
                    <p>{t(ui.home.heroSub.ar, ui.home.heroSub.en)}</p>
                </div>
            </section>

            <section id="movies" className="container" style={{ padding: '80px 0' }}>
                <h2 style={{ borderBottom: '2px solid var(--gold)', display: 'inline-block', paddingBottom: '5px' }}>
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

            <section id="about" className="container" style={{ padding: '100px 20px', borderTop: '1px solid #1a1a1a' }}>
                <h2 style={{ color: 'var(--gold)', marginBottom: '30px', borderBottom: '2px solid var(--gold)', display: 'inline-block', paddingBottom: '5px' }}>
                    {t('من نحن', 'About Us')}
                </h2>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', maxWidth: '900px' }}>
                    {t(
                        'سينما الزهراء هي صرح ثقافي وسينمائي رائد في مدينة حلب، نهدف لتقديم أحدث الأفلام العالمية والعربية بأفضل تقنيات العرض لتوفير تجربة مشاهدة لا تُنسى لجميع زوارنا.',
                        'Alzhra Cinema is a leading cultural and cinematic landmark in Aleppo, aiming to present the latest international and Arabic films with the best projection technologies to provide an unforgettable viewing experience.'
                    )}
                </p>
            </section>

            <section id="contact" className="container" style={{ padding: '100px 20px', borderTop: '1px solid #1a1a1a' }}>
                <h2 style={{ color: 'var(--gold)', marginBottom: '30px', borderBottom: '2px solid var(--gold)', display: 'inline-block', paddingBottom: '5px' }}>
                    {t('اتصل بنا', 'Contact Us')}
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '50px' }}>
                    <div>
                        <h3>{t('معلومات التواصل', 'Contact Info')}</h3>
                        <p style={{ margin: '20px 0', fontSize: '1.1rem' }}>📞 +963 991 730 262</p>
                        <p style={{ fontSize: '1.1rem' }}>📍 {t('شارع بنسلفانيا، حلب، سوريا', 'Pennsylvania St, Aleppo, Syria')}</p>

                        <div className="social-links contact-socials">
                            <a href="https://www.facebook.com/cinemaalzahra/?locale=cy_GB" target="_blank" rel="noopener noreferrer" className="social-item" title="Facebook">
                                <FaFacebookF className="social-icon" />
                            </a>
                            <a href="https://www.instagram.com/explore/locations/221729366/cinema-alzahra/" target="_blank" rel="noopener noreferrer" className="social-item" title="Instagram">
                                <FaInstagram className="social-icon" />
                            </a>
                        </div>
                    </div>
                    <div style={{ height: '350px', backgroundColor: '#111', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3220.1!2d37.13!3d36.21!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzbCsDEyJzM2LjAiTiAzN8KwMDgnMDYuMCJF!5e0!3m2!1sen!2sus!4v1708560000000!5m2!1sen!2sus"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                        ></iframe>
                    </div>
                </div>
            </section>
        </main>
    )
}
