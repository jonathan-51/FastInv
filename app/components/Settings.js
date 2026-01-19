'use client'
import './Settings.css'
import Link from 'next/link';
import { useEffect,useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { useLocation } from '../context/LocationContext';
import { useStatus } from '../context/StatusContext';
import { useBillablesCategory } from '../context/BillablesContext';

export default function Settings() {

    const { isSettingsOpen, setIsSettingsOpen } = useSettings();
    const [activeTab, setActiveTab] = useState('profile')

    const {locationFields, setLocationFields} = useLocation()
    const {statusFields,setStatusFields} = useStatus()
    const {billableCategoryFields, setBillableCategoryFields} = useBillablesCategory()

    if (!isSettingsOpen) return null



  const tabs = [
        { id: 'profile', label: 'Profile' },
        { id: 'organization', label: 'Organization' },
        { id: 'team', label: 'Team' },
        { id: 'customfields', label: 'Custom Fields' },
        { id: 'billing', label: 'Billing' },
        { id: 'notifications', label: 'Notifications' },
        { id: 'security', label: 'Security' },
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
                    <div className='setting-section'>
                        <h2>Profile Settings</h2>
                        <p className='setting-description'>Manage your personal information and preferences</p>

                        <div className='setting-form'>
                            <div className='setting-form-group'>
                                <label>Full Name</label>
                                <input type="text" placeholder="John Doe" disabled />
                            </div>
                            <div className='setting-form-group'>
                                <label>Email</label>
                                <input type="email" placeholder="john@example.com" disabled />
                            </div>
                            <div className='setting-form-group'>
                                <label>Phone</label>
                                <input type="tel" placeholder="+1 234 567 8900" disabled />
                            </div>
                            <p className='setting-placeholder'>Coming soon...</p>
                        </div>
                    </div>
                )}

                {activeTab === 'organization' && (
                    <div className='setting-section'>
                        <h2>Organization Settings</h2>
                        <p className='setting-description'>Manage your organization details and preferences</p>

                        <div className='setting-form'>
                            <div className='setting-form-group'>
                                <label>Organization Name</label>
                                <input type="text" placeholder="Acme Corp" disabled />
                            </div>
                            <div className='setting-form-group'>
                                <label>Industry</label>
                                <input type="text" placeholder="Construction" disabled />
                            </div>
                            <p className='setting-placeholder'>Coming soon...</p>
                        </div>
                    </div>
                )}

                {activeTab === 'team' && (
                    <div className='setting-section'>
                        <h2>Team Members</h2>
                        <p className='setting-description'>Invite and manage team members</p>
                        <p className='setting-placeholder'>Team management coming soon...</p>
                    </div>
                )}

                {activeTab === 'customfields' && (
                    <div className='setting-section'>
                        <h2>Custom Fields</h2>
                        <p className='setting-description'>Customize location and status fields for your jobs</p>

                        <div className='setting-customfield-field'>
                            <h3>Location</h3>
                            <div className='setting-customfield-body'>
                                {locationFields.length > 0 ? (
                                    locationFields.map(location => (
                                        <div key={location} className='setting-customfield-body-field'>
                                            {location}
                                        </div>
                                    ))
                                ) : (
                                    <div className='setting-customfield-body-field'>No locations added</div>
                                )}
                            </div>
                        </div>

                        <div className='setting-customfield-field'>
                            <h3>Status</h3>
                            <div className='setting-customfield-body'>
                                {statusFields.map(status => (
                                    <div key={status} className='setting-customfield-body-field'>
                                        {status}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className='setting-customfield-field'>
                            <h3>Billable Categories</h3>
                            <div className='setting-customfield-body'>
                                {billableCategoryFields.map(category => (
                                    <div key={category} className='setting-customfield-body-field'>
                                        {category}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'billing' && (
                    <div className='setting-section'>
                        <h2>Billing & Subscription</h2>
                        <p className='setting-description'>Manage your subscription and payment methods</p>
                        <p className='setting-placeholder'>Billing dashboard coming soon...</p>
                    </div>
                )}

                {activeTab === 'notifications' && (
                    <div className='setting-section'>
                        <h2>Notification Preferences</h2>
                        <p className='setting-description'>Control how you receive notifications</p>
                        <p className='setting-placeholder'>Notification settings coming soon...</p>
                    </div>
                )}

                {activeTab === 'security' && (
                    <div className='setting-section'>
                        <h2>Security Settings</h2>
                        <p className='setting-description'>Manage your password and security preferences</p>
                        <p className='setting-placeholder'>Security settings coming soon...</p>
                    </div>
                )}
            </div>
        </div>
    </div>
  )
}