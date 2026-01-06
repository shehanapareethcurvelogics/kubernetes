import { useState, useEffect } from 'react'
import Login from './components/Login'
import Signup from './components/Signup'
import UserInfo from './components/UserInfo'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [showSignup, setShowSignup] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/user/', {
        credentials: 'include'
      })
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = (userData) => {
    setUser(userData)
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout/', {
        method: 'POST',
        credentials: 'include'
      })
    } catch (error) {
      console.error('Logout error:', error)
    }
    setUser(null)
  }

  if (loading) {
    return (
      <div className="app-container">
        <div className="loading">Loading...</div>
      </div>
    )
  }

  if (user) {
    return <UserInfo user={user} onLogout={handleLogout} />
  }

  return (
    <div className="app-container">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Django Auth App</h1>
          <p>Welcome! Please sign in or create an account.</p>
        </div>
        
        {showSignup ? (
          <Signup 
            onSuccess={handleLogin}
            onSwitchToLogin={() => setShowSignup(false)}
          />
        ) : (
          <Login 
            onSuccess={handleLogin}
            onSwitchToSignup={() => setShowSignup(true)}
          />
        )}
      </div>
    </div>
  )
}

export default App

