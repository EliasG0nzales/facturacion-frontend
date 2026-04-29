import { useState } from 'react'
import type { DashboardView } from '../types'
import type { User } from '../types'
import Sidebar from './dashboard/Sidebar'
import VenderView from './dashboard/VenderView'
import ProductosView from './dashboard/ProductosView'
import ClientesView from './dashboard/ClientesView'

interface Props {
  user: User
  onLogout: () => void
}

export default function Dashboard({ user, onLogout }: Props) {
  const [activeView, setActiveView] = useState<DashboardView>('vender')

  const renderView = () => {
    switch (activeView) {
      case 'vender': return <VenderView />
      case 'productos': return <ProductosView />
      case 'clientes': return <ClientesView />
    }
  }

  return (
    <div className="dashboard">
      <Sidebar
        user={user}
        activeView={activeView}
        onChangeView={setActiveView}
        onLogout={onLogout}
      />
      <main className="dashboard-main">
        {renderView()}
      </main>
    </div>
  )
}