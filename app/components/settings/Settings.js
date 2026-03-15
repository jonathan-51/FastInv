'use client'
import './Settings.css'
import { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { SettingsProfile } from './components/SettingsProfile';
import { SettingsOrganization } from './components/SettingsOrganization';
import { SettingsCustomFields } from './components/SettingsCustomFields';

export default function Settings() {

    const { isSettingsOpen, setIsSettingsOpen } = useSettings();
    const [activeTab, setActiveTab] = useState('profile')

    if (!isSettingsOpen) return null



  const tabs = [
        { id: 'profile', label: 'Profile' },
        { id: 'organization', label: 'Organization' },
        { id: 'customfields', label: 'Custom Fields' },
        { id: 'billing', label: 'Billing' },
    ]

  return (
    <div className="setting-overlay" onClick={() => setIsSettingsOpen(false)}>
        <div className="setting-main" onClick={(e) => e.stopPropagation()}>
            {/* Sidebar */}
            <div className='setting-sidebar'>
                <div className='setting-header'>
                    <h1>Settings</h1>
                    <button className='setting-close' onClick={() => setIsSettingsOpen(false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <nav className='setting-nav'>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`setting-nav-btn ${activeTab === tab.id ? 'active' : ''}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Body */}
            <div className='setting-body'>
                {activeTab === 'profile' && (
                    <SettingsProfile />
                )}

                {activeTab === 'organization' && (
                    <SettingsOrganization/>
                )}

                {activeTab === 'customfields' && (
                    <SettingsCustomFields />
                )}

                {activeTab === 'billing' && (
                    <div className='setting-section'>
                        <h2>Billing & Subscription</h2>
                        <p className='setting-description'>Manage your subscription and payment methods</p>
                        <p className='setting-placeholder'>Billing dashboard coming soon...</p>
                    </div>
                )}

            </div>
        </div>
    </div>
  )
}