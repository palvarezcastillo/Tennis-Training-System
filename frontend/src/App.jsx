import React from 'react'
import { Icon } from './shared.jsx'
import {
  SplashScreen,
  DashboardScreen,
  CalendarScreen,
  TrainingScreen,
  FoodScreen,
  ProgressScreen,
  AIScreen,
} from './screens.jsx'

const TABS = [
  { id: 'dashboard', label: 'Inicio',      icon: 'home'      },
  { id: 'calendar',  label: 'Calendario',  icon: 'calendar'  },
  { id: 'training',  label: 'Entreno',     icon: 'dumbbell'  },
  { id: 'food',      label: 'Comida',      icon: 'utensils'  },
  { id: 'progress',  label: 'Progreso',    icon: 'chart'     },
  { id: 'ai',        label: 'Coach IA',    icon: 'brain'     },
]

export default function App() {
  const [showSplash, setShowSplash] = React.useState(true)
  const [activeTab, setActiveTab] = React.useState('dashboard')

  if (showSplash) {
    return <SplashScreen onEnter={() => setShowSplash(false)} />
  }

  const renderScreen = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardScreen setScreen={setActiveTab} />
      case 'calendar':  return <CalendarScreen />
      case 'training':  return <TrainingScreen />
      case 'food':      return <FoodScreen />
      case 'progress':  return <ProgressScreen />
      case 'ai':        return <AIScreen />
      default:          return <DashboardScreen setScreen={setActiveTab} />
    }
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100dvh', maxWidth: 430, margin: '0 auto',
      background: '#0d0805', fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', paddingTop: 16 }}>
        {renderScreen()}
      </div>

      {/* Bottom tab bar */}
      <nav style={{
        display: 'flex', background: '#120804',
        borderTop: '1px solid #2a1208',
        paddingBottom: 'env(safe-area-inset-bottom)',
        flexShrink: 0,
      }}>
        {TABS.map(tab => {
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: 3, padding: '10px 2px', border: 'none',
                background: 'transparent', cursor: 'pointer',
                color: active ? '#d4501a' : '#5a3a22',
                transition: 'color 0.2s',
              }}
            >
              <Icon name={tab.icon} size={20} color={active ? '#d4501a' : '#5a3a22'} />
              <span style={{ fontSize: 9, fontWeight: active ? 700 : 400, letterSpacing: 0.3 }}>
                {tab.label}
              </span>
              {active && (
                <div style={{ position: 'absolute', bottom: 0, width: 20, height: 2, background: '#d4501a', borderRadius: 1 }} />
              )}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
