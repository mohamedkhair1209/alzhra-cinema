import { useLanguage } from '../context/LanguageContext'

export default function Contact() {
    const { t } = useLanguage()

    return (
        <div className="container" style={{ padding: '100px 20px' }}>
            <h1 style={{ color: 'var(--gold)', marginBottom: '30px' }}>{t('اتصل بنا', 'Contact Us')}</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '50px' }}>
                <div>
                    <h3>{t('معلومات التواصل', 'Contact Info')}</h3>
                    <p style={{ margin: '20px 0' }}>📞 +963 991 730 262</p>
                    <p>📍 {t('شارع بنسلفانيا، حلب، سوريا', 'Pennsylvania St, Aleppo, Syria')}</p>
                </div>
                <div style={{ height: '350px', backgroundColor: '#111', borderRadius: '10px', overflow: 'hidden' }}>
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
        </div>
    )
}
