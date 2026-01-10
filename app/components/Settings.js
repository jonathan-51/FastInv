'use client'
import './Settings.css'
import Link from 'next/link';
import { useEffect,useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { useLocation } from '../context/LocationContext';
import { useStatus } from '../context/StatusContext';

export default function Settings() {

    const { isSettingsOpen, setIsSettingsOpen } = useSettings();
    const [isHeadings,setIsHeadings] = useState({
            customfields:true,
            billing:false
        })

    const {locationFields, setLocationFields} = useLocation()

    const {statusFields,setStatusFields} = useStatus()

    if (!isSettingsOpen) return null


    const handleSettingSection = (section) => {
        setIsHeadings({
            customfields: section === 'customfields',
            billing: section === 'billing'
        })
    }



  return (
    <div className="setting-overlay" onClick={() => setIsSettingsOpen(false)}>
            

            <div className="setting-main" onClick={(e) => e.stopPropagation()}>
                <div className='setting-sidebar'>
                    <h1 className='pt-4 pb-4 pl-8' style={{paddingTop:'16px',paddingBottom:'16px',paddingLeft:'32px'}}>Setting</h1>
                    <div className='setting-sidebar-headers'>
                        <button style={{textAlign:'left'}} onClick={() => handleSettingSection('customfields')}>Custom Fields</button>
                        <button style={{textAlign:'left'}} onClick={() => handleSettingSection('billing')}>Billing</button>
                        </div>
                </div>
                <div className='setting-body'>

                    {isHeadings.customfields && (
                        <div className='setting-customfield'>
                            <h2 className='pt-4 pb-4' style={{paddingTop:'16px',paddingBottom:'16px'}}>Custom Fields</h2>
                            <div className='setting-customfield-field'>
                                
                                <h3>Location</h3>

                                <div className='setting-customfield-body'>
                                    {locationFields.length > 0 ? (
                                        locationFields.map(location => (
                                            <div
                                            key={location}
                                            className='setting-customfield-body-field'>
                                                {location}
                                                
                                            </div>
                                        ))
                                    ):(<p>d</p>)}
                                </div>
                            </div>

                            <div className='setting-customfield-field'>
                                <h3>Status</h3>

                                <div className='setting-customfield-body'>
                                    {statusFields.map(status => (
                                        <div
                                        key={status}
                                        className='setting-customfield-body-field'>
                                            {status}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {isHeadings.billing && (
                        <div className='setting-billing'>
                            <h2 className='pt-4 pb-4 pl-8'>Billing</h2>
                        </div>
                    )}
                    
                </div>
            </div>
    </div>
  )
}