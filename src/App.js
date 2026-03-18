import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import AppLayout from './components/layout/AppLayout'

import LoginPage         from './pages/LoginPage'
import DashboardPage     from './pages/DashboardPage'
import ClientsPage       from './pages/ClientsPage'
import ApprovalsPage     from './pages/ApprovalsPage'
import ApprovalPublicPage from './pages/ApprovalPublicPage'
import SchedulePage      from './pages/SchedulePage'
import TeamPage          from './pages/TeamPage'
import IntegrationsPage  from './pages/IntegrationsPage'
import SettingsPage      from './pages/SettingsPage'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 32, height: 32, border: '3px solid var(--brand-light)', borderTopColor: 'var(--brand)', borderRadius: '50%', animation: 'spin .6s linear infinite' }} />
    </div>
  )
  return user ? children : <Navigate to="/login" replace />
}

function AppRoutes() {
  const { user } = useAuth()

  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/approve/:token" element={<ApprovalPublicPage />} />

      {/* Private */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard"    element={<PrivateRoute><AppLayout><DashboardPage /></AppLayout></PrivateRoute>} />
      <Route path="/clients"      element={<PrivateRoute><AppLayout><ClientsPage /></AppLayout></PrivateRoute>} />
      <Route path="/approvals"    element={<PrivateRoute><AppLayout><ApprovalsPage /></AppLayout></PrivateRoute>} />
      <Route path="/schedule"     element={<PrivateRoute><AppLayout><SchedulePage /></AppLayout></PrivateRoute>} />
      <Route path="/team"         element={<PrivateRoute><AppLayout><TeamPage /></AppLayout></PrivateRoute>} />
      <Route path="/integrations" element={<PrivateRoute><AppLayout><IntegrationsPage /></AppLayout></PrivateRoute>} />
      <Route path="/settings"     element={<PrivateRoute><AppLayout><SettingsPage /></AppLayout></PrivateRoute>} />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            style: { fontFamily: 'var(--font-body)', fontSize: 14, borderRadius: 10, boxShadow: 'var(--shadow)' },
            success: { iconTheme: { primary: '#0ea472', secondary: '#fff' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  )
}
