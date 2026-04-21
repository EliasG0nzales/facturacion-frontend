import { useState } from 'react'
import type { Page, User } from './types'
import LoginPage from './components/LoginPage'
import RegisterPage from './components/RegisterPage'
import RecoverPage from './components/RecoverPage'
import Dashboard from './components/Dashboard'
import './App.css'

const SESSION_KEY = 'venderapp_session'

function getSavedUser(): User | null {
  try {
    const saved = localStorage.getItem(SESSION_KEY)
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(getSavedUser)
  const [page, setPage] = useState<Page>(getSavedUser() ? 'dashboard' : 'login')

  const handleLogin = (user: User) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user))
    setCurrentUser(user)
    setPage('dashboard')
  }

  const handleLogout = () => {
    localStorage.removeItem(SESSION_KEY)
    setCurrentUser(null)
    setPage('login')
  }

  if (page === 'dashboard' && currentUser) {
    return <Dashboard user={currentUser} onLogout={handleLogout} />
  }

  if (page === 'register') {
    return (
      <RegisterPage
        onGoLogin={() => setPage('login')}
        onRegistered={handleLogin}
      />
    )
  }

  if (page === 'recover') {
    return <RecoverPage onGoLogin={() => setPage('login')} />
  }

  return (
    <LoginPage
      onLogin={handleLogin}
      onGoRegister={() => setPage('register')}
      onGoRecover={() => setPage('recover')}
    />
  )
}
