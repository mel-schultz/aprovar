import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { useAuth } from './contexts/AuthContext'
import AuthPage from './pages/AuthPage'
import Layout from './components/layout/Layout'
import DashboardPage from './pages/DashboardPage'
import CalendarPage from './pages/CalendarPage'
import ClientsPage from './pages/ClientsPage'
import SocialPage from './pages/SocialPage'
import BlogPage from './pages/BlogPage'
import ApprovalsPage from './pages/ApprovalsPage'
import IntegrationsPage from './pages/IntegrationsPage'
import UsersPage from './pages/UsersPage'
import SettingsPage from './pages/SettingsPage'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="d-flex flex-justify-center flex-items-center" style={{ height: '100vh' }}><span className="color-fg-muted">Carregando...</span></div>
  return user ? <>{children}</> : <Navigate to="/auth" replace />
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/auth" replace />
  if (profile?.role !== 'super_admin' && profile?.role !== 'atendimento') return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

function AppRoutes() {
  const { user } = useAuth()
  return (
    <Routes>
      <Route path="/auth" element={user ? <Navigate to="/dashboard" replace /> : <AuthPage />} />
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="clients" element={<ClientsPage />} />
        <Route path="social" element={<SocialPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="approvals" element={<ApprovalsPage />} />
        <Route path="integrations" element={<IntegrationsPage />} />
        <Route path="users" element={<AdminRoute><UsersPage /></AdminRoute>} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster position="top-right" />
      </AuthProvider>
    </BrowserRouter>
  )
}
