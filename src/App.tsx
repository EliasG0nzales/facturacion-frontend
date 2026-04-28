import { useState } from 'react'
import type { Page, User } from './types'
import LoginPage from './components/LoginPage'
import RegisterPage from './components/RegisterPage'
import RecoverPage from './components/RecoverPage'
import Dashboard from './components/Dashboard'
import './App.css'

export default function App() {
  const [page, setPage] = useState<Page>('login')
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  const handleLogin = (user: User) => {
    setCurrentUser(user)
    setPage('dashboard')
  }

  const handleLogout = () => {
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
