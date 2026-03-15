'use client'

import { useState, useEffect } from 'react'
import { getUser, signIn, signUp, signOut, fetchBusinessFromSupabase, syncBusinessToSupabase } from '@/lib/supabaseSync'
import { useBusinessDetails } from '@/app/context/BusinessDetailsContext'
import type { User } from '@supabase/supabase-js'

export const AccountSection = () => {
    const { businessDetails, setBusinessDetails } = useBusinessDetails()
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSignUp, setIsSignUp] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [syncing, setSyncing] = useState(false)
    const [syncMessage, setSyncMessage] = useState<string | null>(null)

    useEffect(() => {
        getUser().then(u => {
            setUser(u)
            setLoading(false)
        })
    }, [])

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        const result = isSignUp
            ? await signUp(email, password)
            : await signIn(email, password)

        if (result.error) {
            setError(result.error)
        } else if (result.user) {
            setUser(result.user)
            setEmail('')
            setPassword('')

            // On login, fetch business details from Supabase and merge
            const remote = await fetchBusinessFromSupabase()
            if (remote) {
                setBusinessDetails(remote)
            }
        }
    }

    const handleSignOut = async () => {
        await signOut()
        setUser(null)
    }

    const handleSync = async () => {
        if (!businessDetails) return
        setSyncing(true)
        setSyncMessage(null)

        const success = await syncBusinessToSupabase(businessDetails)
        setSyncMessage(success ? 'Synced successfully' : 'Sync failed')
        setSyncing(false)

        setTimeout(() => setSyncMessage(null), 3000)
    }

    const handlePull = async () => {
        setSyncing(true)
        setSyncMessage(null)

        const remote = await fetchBusinessFromSupabase()
        if (remote) {
            setBusinessDetails(remote)
            setSyncMessage('Pulled from cloud')
        } else {
            setSyncMessage('No data found in cloud')
        }
        setSyncing(false)

        setTimeout(() => setSyncMessage(null), 3000)
    }

    if (loading) return null

    return (
        <div className='setting-section' style={{ textAlign: 'center' }}>
            <h2>Account</h2>
            <p className='setting-description'>
                Optionally sign in to back up your business details to the cloud.
                The app works fully without an account.
            </p>

            {user ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                    <div style={{ padding: '12px 16px', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                        Signed in as <strong>{user.email}</strong>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            onClick={handleSync}
                            disabled={syncing}
                            style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#3B2A22', color: 'white', cursor: 'pointer', opacity: syncing ? 0.5 : 1 }}
                        >
                            {syncing ? 'Syncing...' : 'Push to Cloud'}
                        </button>
                        <button
                            onClick={handlePull}
                            disabled={syncing}
                            style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #d1d5db', background: 'white', cursor: 'pointer', opacity: syncing ? 0.5 : 1 }}
                        >
                            Pull from Cloud
                        </button>
                        <button
                            onClick={handleSignOut}
                            style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #d1d5db', background: 'white', cursor: 'pointer', marginLeft: 'auto' }}
                        >
                            Sign Out
                        </button>
                    </div>

                    {syncMessage && (
                        <div style={{ padding: '8px 12px', background: '#f9fafb', borderRadius: '6px', fontSize: '14px', color: '#374151' }}>
                            {syncMessage}
                        </div>
                    )}
                </div>
            ) : (
                <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px', maxWidth: '360px', margin: '16px auto 0' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500, fontSize: '14px' }}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #d1d5db' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500, fontSize: '14px' }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #d1d5db' }}
                        />
                    </div>

                    {error && (
                        <div style={{ padding: '8px 12px', background: '#fef2f2', borderRadius: '6px', color: '#dc2626', fontSize: '14px' }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#3B2A22', color: 'white', cursor: 'pointer', fontWeight: 500 }}
                    >
                        {isSignUp ? 'Create Account' : 'Sign In'}
                    </button>

                    <button
                        type="button"
                        onClick={() => { setIsSignUp(!isSignUp); setError(null) }}
                        style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '14px', textAlign: 'left' }}
                    >
                        {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
                    </button>
                </form>
            )}
        </div>
    )
}
