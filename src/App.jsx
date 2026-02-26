import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import MovieDetails from './pages/MovieDetails'
import AboutUs from './pages/AboutUs'
import Contact from './pages/Contact'
import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import Movies from './pages/admin/Movies'
import Showtimes from './pages/admin/Showtimes'

function RequireAuth({ children }) {
    const { user, loading } = useAuth()
    if (loading) return <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>Loading...</div>
    if (!user) return <Navigate to="/admin/login" replace />
    return children
}

export default function App() {
    return (
        <LanguageProvider>
            <AuthProvider>
                <BrowserRouter>
                    <div className="web-app">
                        <Navbar />
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/movie/:id" element={<MovieDetails />} />
                            <Route path="/about" element={<AboutUs />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/admin/login" element={<Login />} />
                            <Route path="/admin" element={<RequireAuth><Dashboard /></RequireAuth>} />
                            <Route path="/admin/movies" element={<RequireAuth><Movies /></RequireAuth>} />
                            <Route path="/admin/showtimes" element={<RequireAuth><Showtimes /></RequireAuth>} />
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                        <footer className="container" style={{ padding: '60px 0', textAlign: 'center', borderTop: '1px solid #222', marginTop: '40px', color: '#444', fontSize: '0.8rem' }}>
                            © {new Date().getFullYear()} Alzhra Cinema | سينما الزهراء
                        </footer>
                    </div>
                </BrowserRouter>
            </AuthProvider>
        </LanguageProvider>
    )
}
