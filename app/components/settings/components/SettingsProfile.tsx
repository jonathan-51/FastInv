'use client'

import { useState, useEffect, useRef } from 'react'

interface Profile {
    fullName: string
    email: string
    phone: string
}

export function SettingsProfile() {
    const [profile, setProfile] = useState<Profile>({
        fullName: '',
        email: '',
        phone: ''
    })
    const [saved, setSaved] = useState(false)
    const isFirstRender = useRef(true)

    // Load profile from localStorage
    useEffect(() => {
        const savedProfile = localStorage.getItem('profile')
        if (savedProfile) {
            setProfile(JSON.parse(savedProfile))
        }
    }, [])

    // Save to localStorage when profile changes
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            return
        }
        localStorage.setItem('profile', JSON.stringify(profile))
        setSaved(true)
        const timer = setTimeout(() => setSaved(false), 2000)
        return () => clearTimeout(timer)
    }, [profile])

    const handleChange = (field: keyof Profile, value: string) => {
        setProfile(prev => ({ ...prev, [field]: value }))
    }

    return (
        <div className='setting-section'>
            <div className='setting-section-header'>
                <div>
                    <h2>Profile Settings</h2>
                    <p className='setting-description'>Manage your personal information</p>
                </div>
                {saved && <span className='setting-saved'>Saved</span>}
            </div>

            <div className='setting-form' style={{ gridTemplateColumns: '1fr' }}>
                <div className='setting-form-group'>
                    <label>Full Name</label>
                    <input
                        type="text"
                        value={profile.fullName}
                        onChange={(e) => handleChange('fullName', e.target.value)}
                        placeholder="Enter your full name"
                    />
                </div>
                <div className='setting-form-group'>
                    <label>Email</label>
                    <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="Enter your email"
                    />
                </div>
                <div className='setting-form-group'>
                    <label>Phone</label>
                    <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        placeholder="Enter your phone number"
                    />
                </div>
            </div>
        </div>
    )
}
