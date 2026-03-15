'use client'
import './Settings.css'
import { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { SettingsOrganization } from './components/SettingsOrganization';
import { AccountSection } from './components/AccountSection';

export default function Settings() {
    const { isSettingsOpen, setIsSettingsOpen } = useSettings();
    const [activeTab, setActiveTab] = useState('business')

    if (!isSettingsOpen) return null

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
                        <button
                            className={`setting-nav-btn ${activeTab === 'business' ? 'active' : ''}`}
                            onClick={() => setActiveTab('business')}
                        >
                            Business Details
                        </button>
                        <button
                            className={`setting-nav-btn ${activeTab === 'account' ? 'active' : ''}`}
                            onClick={() => setActiveTab('account')}
                        >
                            Account
                        </button>
                    </nav>
                </div>

                {/* Body */}
                <div className='setting-body'>
                    {activeTab === 'business' && <SettingsOrganization />}
                    {activeTab === 'account' && <AccountSection />}
                </div>
            </div>
        </div>
    )
}
