import type { DashboardView, User } from '../../types'

interface Props {
  user: User
  activeView: DashboardView
  onChangeView: (v: DashboardView) => void
  onLogout: () => void
}

export default function Sidebar({ user, activeView, onChangeView, onLogout }: Props) {
  const navItems: { view: DashboardView; label: string; icon: string }[] = [
    { view: 'vender', label: 'Vender', icon: '🏷️' },
    { view: 'productos', label: 'Productos', icon: '📦' },
    { view: 'clientes', label: 'Clientes', icon: '👤' },
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-user">
        <div className="sidebar-avatar">{user.name.charAt(0)}</div>
        <p className="sidebar-username">{user.name}</p>
        <p className="sidebar-welcome">Welcome back</p>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => (
          <button
            key={item.view}
            className={`sidebar-nav-item ${activeView === item.view ? 'active' : ''}`}
            onClick={() => onChangeView(item.view)}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-footer-link">help</button>
        <button className="sidebar-footer-link">settings</button>
        <button className="sidebar-footer-link logout" onClick={onLogout}>log out</button>
      </div>
    </aside>
  )
}
