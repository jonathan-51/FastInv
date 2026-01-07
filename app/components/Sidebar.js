'use client'

import './Sidebar.css'
import Link from 'next/link';

import { useSettings } from '../context/SettingsContext';

export default function Sidebar() {
    const { setIsSettingsOpen } = useSettings();
    return (
        <aside className='Sidebar'>
            <div className='side-container'>
                <Link href="/entry" 
                className='new-customer'>
                    Create
                </Link>
                <div className='side-contents'>
                    <Link href='/'>Home</Link>
                    <Link href="/jobs">Jobs</Link>

                    <button 
                    style={{textAlign:'left', cursor:'pointer'}} 
                    onClick={() => setIsSettingsOpen(true)}>
                        Settings
                    </button>
                </div>
            </div>

        </aside>
    )
}