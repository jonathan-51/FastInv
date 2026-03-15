'use client'
import './Settings.css'
import { useSettings } from '../../context/SettingsContext';
import { SettingsOrganization } from './components/SettingsOrganization';

export default function Settings() {
    const { isSettingsOpen, setIsSettingsOpen } = useSettings();

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
                        <button className='setting-nav-btn active'>
                            Business Details
                        </button>
                    </nav>
                </div>

                {/* Body */}
                <div className='setting-body'>
                    <SettingsOrganization />
                </div>
            </div>
        </div>
    )
}
