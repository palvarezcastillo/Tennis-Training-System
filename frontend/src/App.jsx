import React from 'react'
import { Icon, TennisPlayer } from './shared.jsx'
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
  { id: 'dashboard', label: 'Inicio',     icon: 'home'     },
  { id: 'calendar',  label: 'Calendario', icon: 'calendar' },
  { id: 'training',  label: 'Entreno',    icon: 'dumbbell' },
  { id: 'food',      label: 'Comida',     icon: 'utensils' },
  { id: 'progress',  label: 'Progreso',   icon: 'chart'    },
  { id: 'ai',        label: 'Coach IA',   icon: 'brain'    },
]

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = React.useState(
    () => window.innerWidth > 768
  )
  React.useEffect(() => {
    const mq = window.matchMedia('(min-width: 769px)')
    const onChange = (e) => setIsDesktop(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return isDesktop
}

const FONT = 'system-ui, -apple-system, sans-serif'

export default function App() {
  const [showSplash, setShowSplash] = React.useState(true)
  const [activeTab, setActiveTab] = React.useState('dashboard')
  const isDesktop = useIsDesktop()

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

  // ── Desktop layout ──────────────────────────────────────────────────────────
  if (isDesktop) {
    return (
      <div style={{ minHeight: '100dvh', background: '#0d0805', fontFamily: FONT }}>
        <div style={{
          height: '100dvh', display: 'flex',
        }}>
          {/* Sidebar */}
          <nav style={{
            width: 220, flexShrink: 0, background: '#0a0603',
            borderRight: '1px solid #2a1208',
            display: 'flex', flexDirection: 'column',
          }}>
            {/* Brand */}
            <div style={{ padding: '28px 20px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 2 }}>
                <TennisPlayer size={38} color="#d4501a" />
                <div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: '#fff', letterSpacing: '-0.3px' }}>MIRA</div>
                  <div style={{ fontSize: 12, fontWeight: 300, color: '#d4501a', letterSpacing: 2 }}>TENNIS</div>
                </div>
              </div>
              <div style={{ fontSize: 9, color: '#5a3a22', letterSpacing: 3, textTransform: 'uppercase', marginTop: 6 }}>
                Training System
              </div>
            </div>

            <div style={{ width: '80%', height: 1, background: '#2a1208', margin: '0 auto 12px' }} />

            {/* Nav items */}
            <div style={{ flex: 1, padding: '4px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
              {TABS.map(tab => {
                const active = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '11px 14px', borderRadius: 12, border: 'none',
                      borderLeft: `3px solid ${active ? '#d4501a' : 'transparent'}`,
                      background: active ? 'rgba(212,80,26,0.12)' : 'transparent',
                      cursor: 'pointer', width: '100%', textAlign: 'left',
                      transition: 'background 0.15s, border-color 0.15s',
                    }}
                  >
                    <Icon name={tab.icon} size={18} color={active ? '#d4501a' : '#5a3a22'} />
                    <span style={{
                      fontSize: 13, fontWeight: active ? 700 : 400,
                      color: active ? '#f0dac8' : '#5a3a22',
                    }}>
                      {tab.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </nav>

          {/* Content area */}
          <div style={{ flex: 1, overflowY: 'auto', paddingTop: 16 }}>
            {renderScreen()}
          </div>
        </div>
      </div>
    )
  }

  // ── Mobile layout ───────────────────────────────────────────────────────────
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100dvh', maxWidth: 480, margin: '0 auto',
      background: '#0d0805', fontFamily: FONT,
    }}>
      <div style={{ flex: 1, overflowY: 'auto', paddingTop: 16 }}>
        {renderScreen()}
      </div>

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
                position: 'relative',
              }}
            >
              <Icon name={tab.icon} size={20} color={active ? '#d4501a' : '#5a3a22'} />
              <span style={{ fontSize: 9, fontWeight: active ? 700 : 400, color: active ? '#d4501a' : '#5a3a22', letterSpacing: 0.3 }}>
                {tab.label}
              </span>
              {active && (
                <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 20, height: 2, background: '#d4501a', borderRadius: 1 }} />
              )}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
