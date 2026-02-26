import { useLanguage } from '../context/LanguageContext'

export default function AboutUs() {
    const { t } = useLanguage()

    return (
        <div className="container" style={{ padding: '100px 20px' }}>
            <h1 style={{ color: 'var(--gold)', marginBottom: '30px' }}>{t('من نحن', 'About Us')}</h1>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                {t(
                    'سينما الزهراء هي صرح ثقافي وسينمائي رائد في مدينة حلب، نهدف لتقديم أحدث الأفلام العالمية والعربية بأفضل تقنيات العرض.',
                    'Alzhra Cinema is a leading cultural and cinematic landmark in Aleppo, aiming to present the latest international and Arabic films.'
                )}
            </p>
        </div>
    )
}
