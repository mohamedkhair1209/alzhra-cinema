import { useState, useEffect } from 'react'
import { supabase } from '../../supabase'
import { useLanguage } from '../../context/LanguageContext'
import { ui } from '../../i18n/translations'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { Modal } from '../../components/admin/Modal'

function ShowtimeForm({ showtime, movies, onSave, onCancel }) {
    const { t } = useLanguage()
    const [formData, setFormData] = useState(showtime || {
        movie_id: movies[0]?.id || '',
        hall_name_ar: '', hall_name_en: '',
        date: new Date().toISOString().split('T')[0],
        time: '20:00'
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        onSave(formData)
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>{t('الفيلم', 'Movie')}</label>
                <select className="form-control" value={formData.movie_id} onChange={e => setFormData({ ...formData, movie_id: e.target.value })} required>
                    {movies.map(m => (
                        <option key={m.id} value={m.id}>{t(m.title_ar, m.title_en)}</option>
                    ))}
                </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                    <label>{t('التاريخ', 'Date')}</label>
                    <input type="date" className="form-control" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} required />
                </div>
                <div className="form-group">
                    <label>{t('الموعد', 'Time')}</label>
                    <input type="time" className="form-control" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} required />
                </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                    <label>{t('اسم القاعة (عربي)', 'Hall Name (AR)')}</label>
                    <input className="form-control" value={formData.hall_name_ar} onChange={e => setFormData({ ...formData, hall_name_ar: e.target.value })} />
                </div>
                <div className="form-group">
                    <label>{t('اسم القاعة (EN)', 'Hall Name (EN)')}</label>
                    <input className="form-control" value={formData.hall_name_en} onChange={e => setFormData({ ...formData, hall_name_en: e.target.value })} />
                </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="submit" className="btn btn-primary">{t('حفظ', 'Save')}</button>
                <button type="button" onClick={onCancel} className="btn btn-secondary">{t('إلغاء', 'Cancel')}</button>
            </div>
        </form>
    )
}

export default function AdminShowtimesPage() {
    const { t } = useLanguage()
    const [showtimes, setShowtimes] = useState([])
    const [movies, setMovies] = useState([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingShowtime, setEditingShowtime] = useState(null)

    useEffect(() => { fetchData() }, [])

    async function fetchData() {
        setLoading(true)
        const [stRes, mRes] = await Promise.all([
            // Use date/time for sorting and selecting
            supabase.from('showtimes').select('*, movies(title_ar, title_en)').order('date', { ascending: false }),
            supabase.from('movies').select('id, title_ar, title_en').order('title_en')
        ])
        setShowtimes(stRes.data || [])
        setMovies(mRes.data || [])
        setLoading(false)
    }

    async function handleSave(formData) {
        setLoading(true)
        try {
            const dataToSave = { ...formData }
            delete dataToSave.movies

            const { error } = editingShowtime
                ? await supabase.from('showtimes').update(dataToSave).eq('id', editingShowtime.id)
                : await supabase.from('showtimes').insert([dataToSave])

            if (error) throw error

            setIsModalOpen(false)
            setEditingShowtime(null)
            await fetchData()
        } catch (err) {
            console.error('Supabase Error:', err)
            alert(t('خطأ أثناء الحفظ: ', 'Error saving: ') + err.message)
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete(id) {
        if (window.confirm(t('هل أنت متأكد؟', 'Are you sure?'))) {
            await supabase.from('showtimes').delete().eq('id', id)
            fetchData()
        }
    }

    return (
        <AdminLayout title={t(ui.admin.showtimes.ar, ui.admin.showtimes.en)}>
            <div style={{ marginBottom: '30px' }}>
                <button className="btn btn-primary" onClick={() => { setEditingShowtime(null); setIsModalOpen(true); }}>
                    + {t('إضافة موعد', 'Add Showtime')}
                </button>
            </div>

            {loading ? <p>Loading...</p> : (
                <div className="table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>{t('الفيلم', 'Movie')}</th>
                                <th>{t('التاريخ', 'Date')}</th>
                                <th>{t('الوقت', 'Time')}</th>
                                <th>{t('القاعة', 'Hall')}</th>
                                <th>{t('إجراءات', 'Actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {showtimes.map(st => (
                                <tr key={st.id}>
                                    <td>{t(st.movies?.title_ar, st.movies?.title_en)}</td>
                                    <td>{st.date}</td>
                                    <td>{st.time?.slice(0, 5)}</td>
                                    <td>{t(st.hall_name_ar, st.hall_name_en)}</td>
                                    <td>
                                        <button className="btn btn-secondary" style={{ padding: '5px 10px', marginRight: '5px' }} onClick={() => { setEditingShowtime(st); setIsModalOpen(true); }}>
                                            {t('تعديل', 'Edit')}
                                        </button>
                                        <button className="btn btn-danger" style={{ padding: '5px 10px' }} onClick={() => handleDelete(st.id)}>
                                            {t('حذف', 'Delete')}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingShowtime ? t('تعديل موعد', 'Edit Showtime') : t('إضافة موعد', 'Add Showtime')}>
                <ShowtimeForm
                    showtime={editingShowtime}
                    movies={movies}
                    onSave={handleSave}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </AdminLayout>
    )
}
