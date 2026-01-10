'use client'

import { useState } from 'react'

export default function AuthTest() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleSignUp = async () => {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const data = await res.json()
    setMessage(JSON.stringify(data, null, 2))
  }

  const handleSignIn = async () => {
    const res = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const data = await res.json()
    setMessage(JSON.stringify(data, null, 2))
  }

  const handleTestCustomers = async () => {
    const res = await fetch('/api/test')
    const data = await res.json()
    setMessage(JSON.stringify(data, null, 2))
  }

  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <h1>Auth Test</h1>
      
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
      />
      
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
      />
      
      <button onClick={handleSignUp} style={{ marginRight: '10px', padding: '8px 16px' }}>
        Sign Up
      </button>
      
      <button onClick={handleSignIn} style={{ marginRight: '10px', padding: '8px 16px' }}>
        Sign In
      </button>
      
      <button onClick={handleTestCustomers} style={{ padding: '8px 16px' }}>
        Test Customers
      </button>
      
      <pre style={{ marginTop: '20px', background: '#f0f0f0', padding: '10px' }}>
        {message}
      </pre>
    </div>
  )
}