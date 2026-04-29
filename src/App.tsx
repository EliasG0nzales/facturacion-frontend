import { useAuth } from './context/AuthContext'
import LoginPage from './components/LoginPage'
import Dashboard from './components/Dashboard'
import './App.css'

export default function App() {
  const { isAuthenticated, user, logout } = useAuth()

  if (isAuthenticated && user) {
    return <Dashboard user={user} onLogout={logout} />
  }

  return <LoginPage />
}