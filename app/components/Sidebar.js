'use client'

import './Sidebar.css'
import Link from 'next/link';

import { useSettings } from '../context/SettingsContext';
import { useNewJob } from '../context/NewJobContext';


export default function Sidebar() {
    const { setIsSettingsOpen } = useSettings();
    const { setIsNewJobOpen } = useNewJob();
    return (
        <aside className='Sidebar'>
            <div className='side-container'>
                <button 
                className='new-customer'
                onClick={() => setIsNewJobOpen(true)}>
                    Create
                </button>
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