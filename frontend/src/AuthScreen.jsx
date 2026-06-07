import React from 'react'
import { supabase } from './supabase'
import { TennisPlayer } from './shared.jsx'

const FONT = 'system-ui, -apple-system, sans-serif'

const ERROR_MESSAGES = {
  'Invalid login credentials':        'Email o contraseña incorrectos.',
  'Email not confirmed':              'Confirmá tu email antes de iniciar sesión.',
  'User already registered':          'Ya existe una cuenta con ese email.',
  'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres.',
  'Unable to validate email address': 'El email ingresado no es válido.',
}

const translateError = (msg) => {
  for (const [key, val] of Object.entries(ERROR_MESSAGES)) {
    if (msg?.includes(key)) return val
  }
  return msg || 'Ocurrió un error. Intentá de nuevo.'
}

export default function AuthScreen() {
  const [tab, setTab]         = React.useState('login')
  const [email, setEmail]     = React.useState('')
  const [password, setPass]   = React.useState('')
  const [name, setName]       = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [error, setError]     = React.useState(null)
  const [success, setSuccess] = React.useState(null)

  const inp = {
    background: '#1a0e08',
    border: '1px solid #3a1808',
    borderRadius: 10,
    padding: '12px 14px',
    color: '#fff',
    fontSize: 14,
    width: '100%',
    boxSizing: 'border-box',
    outline: 'none',
    fontFamily: FONT,
  }

  const clearMessages = () => { setError(null); setSuccess(null) }

  const handleLogin = async (e) => {
    e.preventDefault()
    clearMessages()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(translateError(error.message))
    setLoading(false)
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    clearMessages()
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })
    if (error) {
      setError(translateError(error.message))
    } else {
      setSuccess('¡Cuenta creada! Revisá tu email para confirmar tu cuenta.')
    }
    setLoading(false)
  }

  const handleGoogle = async () => {
    clearMessages()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        queryParams: { prompt: 'select_account' },
      },
    })
    if (error) setError(translateError(error.message))
  }

  return (
    <div style={{
      minHeight: '100dvh', background: '#0d0805', fontFamily: FONT,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px 16px',
    }}>
      <div style={{ width: '100%', maxWidth: 380 }}>

        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <TennisPlayer size={44} color="#d4501a" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>MIRA</div>
              <div style={{ fontSize: 13, fontWeight: 300, color: '#d4501a', letterSpacing: 3 }}>TENNIS</div>
            </div>
          </div>
          <div style={{ fontSize: 10, color: '#5a3a22', letterSpacing: 4, textTransform: 'uppercase' }}>
            Training System
          </div>
        </div>

        {/* Card */}
        <div style={{ background: '#1a0e08', border: '1px solid #2a1208', borderRadius: 18, padding: 24 }}>

          {/* Tabs */}
          <div style={{ display: 'flex', background: '#0d0805', borderRadius: 10, padding: 3, marginBottom: 24 }}>
            {[['login', 'Iniciar sesión'], ['signup', 'Registrarse']].map(([id, label]) => (
              <button
                key={id}
                onClick={() => { setTab(id); clearMessages() }}
                style={{
                  flex: 1, padding: '9px 0', borderRadius: 8, border: 'none',
                  background: tab === id ? '#d4501a' : 'transparent',
                  color: tab === id ? '#fff' : '#5a3a22',
                  fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  transition: 'background 0.15s, color 0.15s',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={tab === 'login' ? handleLogin : handleSignup}>
            {tab === 'signup' && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: '#8a5a3a', marginBottom: 5 }}>Nombre</div>
                <input
                  type="text" value={name} placeholder="Tu nombre"
                  onChange={e => setName(e.target.value)}
                  style={inp} autoComplete="name"
                />
              </div>
            )}

            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: '#8a5a3a', marginBottom: 5 }}>Email</div>
              <input
                type="email" value={email} placeholder="tu@email.com" required
                onChange={e => setEmail(e.target.value)}
                style={inp} autoComplete="email"
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: '#8a5a3a', marginBottom: 5 }}>Contraseña</div>
              <input
                type="password" value={password} placeholder="••••••••" required
                onChange={e => setPass(e.target.value)}
                style={inp} autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
              />
            </div>

            {error && (
              <div style={{ background: 'rgba(212,80,26,0.12)', border: '1px solid rgba(212,80,26,0.35)', borderRadius: 10, padding: '10px 14px', marginBottom: 14, fontSize: 13, color: '#e87a3c' }}>
                {error}
              </div>
            )}

            {success && (
              <div style={{ background: 'rgba(76,175,80,0.12)', border: '1px solid rgba(76,175,80,0.35)', borderRadius: 10, padding: '10px 14px', marginBottom: 14, fontSize: 13, color: '#4caf50' }}>
                {success}
              </div>
            )}

            <button
              type="submit" disabled={loading}
              style={{
                width: '100%', background: loading ? '#5a2a10' : 'linear-gradient(135deg, #a03010, #d4501a)',
                border: 'none', borderRadius: 12, padding: 14,
                color: '#fff', fontSize: 15, fontWeight: 800,
                cursor: loading ? 'not-allowed' : 'pointer', marginBottom: 12,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Cargando...' : tab === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ flex: 1, height: 1, background: '#2a1208' }} />
            <span style={{ fontSize: 11, color: '#5a3a22' }}>o</span>
            <div style={{ flex: 1, height: 1, background: '#2a1208' }} />
          </div>

          {/* Google */}
          <button
            onClick={handleGoogle}
            style={{
              width: '100%', background: 'transparent',
              border: '1px solid #3a1808', borderRadius: 12, padding: 13,
              color: '#f0dac8', fontSize: 14, fontWeight: 600,
              cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 10,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuar con Google
          </button>
        </div>
      </div>
    </div>
  )
}
