import { useState, useEffect } from 'react'
import { supabase } from '../../supabase'
import { useLanguage } from '../../context/LanguageContext'
import { ui } from '../../i18n/translations'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { Modal } from '../../components/admin/Modal'

const GENRES_LIST = [
    'Action', 'Drama', 'Comedy', 'Thriller', 'Horror', 'Romance',
    'Sci-Fi', 'Adventure', 'Animation', 'Family', 'Crime', 'Documentary'
]

export function MovieForm({ movie, onSave, onCancel }) {
    const { t } = useLanguage()
    const [formData, setFormData] = useState(movie || {
        title_ar: '', title_en: '',
        description_ar: '', description_en: '',
        genres: [],
        poster_url: '', duration: 120,
        is_active: true
    })

    const handleGenreChange = (genre) => {
        const currentGenres = formData.genres || []
        const newGenres = currentGenres.includes(genre)
            ? currentGenres.filter(g => g !== genre)
            : [...currentGenres, genre]
        setFormData({ ...formData, genres: newGenres })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        onSave(formData)
    }

    return (
        <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                    <label>{t('العنوان (عربي)', 'Title (AR)')}</label>
                    <input className="form-control" value={formData.title_ar} onChange={e => setFormData({ ...formData, title_ar: e.target.value })} required />
                </div>
                <div className="form-group">
                    <label>{t('العنوان (EN)', 'Title (EN)')}</label>
                    <input className="form-control" value={formData.title_en} onChange={e => setFormData({ ...formData, title_en: e.target.value })} required />
                </div>
            </div>

            <div className="form-group">
                <label>{t('الأنواع', 'Genres')}</label>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                    gap: '10px',
                    padding: '15px',
                    background: '#1a1a1a',
                    borderRadius: '8px',
                    border: '1px solid #333'
                }}>
                    {GENRES_LIST.map(genre => (
                        <label key={genre} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            fontSize: '0.9rem'
                        }}>
                            <input
                                type="checkbox"
                                checked={(formData.genres || []).includes(genre)}
                                onChange={() => handleGenreChange(genre)}
                                style={{ accentColor: 'var(--gold)' }}
                            />
                            {t(ui.genres[genre]?.ar, genre)}
                        </label>
                    ))}
                </div>
            </div>

            <div className="form-group">
                <label>{t('رابط الصورة', 'Poster URL')}</label>
                <input className="form-control" value={formData.poster_url} onChange={e => setFormData({ ...formData, poster_url: e.target.value })} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                    <label>{t('المدّة (دقائق)', 'Duration (min)')}</label>
                    <input type="number" className="form-control" value={formData.duration} onChange={e => setFormData({ ...formData, duration: parseInt(e.target.value) })} />
                </div>
                <div className="form-group">
                    <label>{t('نشط', 'Active')}</label>
                    <select className="form-control" value={formData.is_active} onChange={e => setFormData({ ...formData, is_active: e.target.value === 'true' })}>
                        <option value="true">{t('نعم', 'Yes')}</option>
                        <option value="false">{t('لا', 'No')}</option>
                    </select>
                </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="submit" className="btn btn-primary">{t('حفظ', 'Save')}</button>
                <button type="button" onClick={onCancel} className="btn btn-secondary">{t('إلغاء', 'Cancel')}</button>
            </div>
        </form>
    )
}

export default function AdminMoviesPage() {
    const { t } = useLanguage()
    const [movies, setMovies] = useState([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingMovie, setEditingMovie] = useState(null)

    useEffect(() => { fetchMovies() }, [])

    async function fetchMovies() {
        setLoading(true)
        const { data } = await supabase.from('movies').select('*').order('created_at', { ascending: false })
        setMovies(data || [])
        setLoading(false)
    }

    async function handleSave(formData) {
        console.log('Inserting/Updating Movie Data:', formData)
        setLoading(true)
        try {
            // Attempt with all fields
            const dataToSave = { ...formData }
            const { error: firstError } = editingMovie
                ? await supabase.from('movies').update(dataToSave).eq('id', editingMovie.id)
                : await supabase.from('movies').insert([dataToSave])

            if (firstError) {
                // If it's a "column does not exist" error, try a fallback without is_active
                if (firstError.code === 'PGRST204' || firstError.message.includes('is_active')) {
                    console.warn('is_active column missing, attempting fallback save...')
                    const fallbackData = { ...dataToSave }
                    delete fallbackData.is_active

                    const { error: secondError } = editingMovie
                        ? await supabase.from('movies').update(fallbackData).eq('id', editingMovie.id)
                        : await supabase.from('movies').insert([fallbackData])

                    if (secondError) throw secondError
                } else {
                    throw firstError
                }
            }

            setIsModalOpen(false)
            setEditingMovie(null)
            await fetchMovies()
        } catch (err) {
            console.error('Supabase Error:', err)
            alert(t('خطأ أثناء الحفظ: ', 'Error saving: ') + (err.message || err.details))
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete(id) {
        if (window.confirm(t('هل أنت متأكد؟', 'Are you sure?'))) {
            await supabase.from('movies').delete().eq('id', id)
            fetchMovies()
        }
    }

    return (
        <AdminLayout title={t(ui.admin.movies.ar, ui.admin.movies.en)}>
            <div style={{ marginBottom: '30px' }}>
                <button className="btn btn-primary" onClick={() => { setEditingMovie(null); setIsModalOpen(true); }}>
                    + {t('إضافة فيلم', 'Add Movie')}
                </button>
            </div>

            {loading ? <p>Loading...</p> : (
                <div className="table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>{t('الفيلم', 'Movie')}</th>
                                <th>{t('المدة', 'Duration')}</th>
                                <th>{t('الحالة', 'Status')}</th>
                                <th>{t('إجراءات', 'Actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movies.map(m => (
                                <tr key={m.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            <img src={m.poster_url} alt="" style={{ width: '40px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                                            <div>
                                                <div style={{ fontWeight: 'bold' }}>{t(m.title_ar, m.title_en)}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{m.duration} {t('دقيقة', 'min')}</td>
                                    <td>
                                        <span className={`badge ${m.is_active !== false ? 'badge-success' : 'badge-error'}`}>
                                            {m.is_active !== false ? t('نشط', 'Active') : t('غير نشط', 'Inactive')}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="btn btn-secondary" style={{ padding: '5px 10px', marginRight: '5px' }} onClick={() => { setEditingMovie(m); setIsModalOpen(true); }}>
                                            {t('تعديل', 'Edit')}
                                        </button>
                                        <button className="btn btn-danger" style={{ padding: '5px 10px' }} onClick={() => handleDelete(m.id)}>
                                            {t('حذف', 'Delete')}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingMovie ? t('تعديل فيلم', 'Edit Movie') : t('إضافة فيلم', 'Add Movie')}>
                <MovieForm
                    movie={editingMovie}
                    onSave={handleSave}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </AdminLayout>
    )
}
