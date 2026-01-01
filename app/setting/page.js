'use client'
import './setting.css'
import Link from 'next/link';
import { useEffect,useState } from 'react';

export default function Setting() {

    const [isHeadings,setIsHeadings] = useState({
        customfields:true,
        billing:false
    })

    const handleSettingSection = (section) => {
        setIsHeadings({
            customfields: section === 'customfields',
            billing: section === 'billing'
        })
    }

  return (
    <div className='setting-main'>
        <div className='setting-sidebar'>
            <h1 className='pt-4 pb-4 pl-8'>Setting</h1>
            <div className='setting-sidebar-headers'>
                <button style={{textAlign:'left'}} onClick={() => handleSettingSection('customfields')}>Custom Fields</button>
                <button style={{textAlign:'left'}} onClick={() => handleSettingSection('billing')}>Billing</button>
                </div>
        </div>
        <div className='setting-body'>

            {isHeadings.customfields && (
                <div className='setting-customfield'>
                    <h2 className='pt-4 pb-4'>Custom Fields</h2>
                    <div>
                        <h3>Location</h3>
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
  )
}