'use client'

import './Sidebar.css'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Briefcase,
    Settings as SettingsIcon,
    Plus,
} from 'lucide-react';

import { useSettings } from '../context/SettingsContext';

export default function Sidebar() {
    const pathname = usePathname();
    const { setIsSettingsOpen } = useSettings();

    return (
        <aside className='Sidebar'>
            <div className='side-container'>

                {/* Primary Action Button */}
                <Link href='/jobs/new' className='new-job-button'>
                    <Plus size={20} />
                    <span>New Job</span>
                </Link>

                {/* Main Navigation */}
                <nav className='sidebar-nav'>
                    <div className='nav-section'>
                        <Link
                            href='/'
                            className={`nav-link ${pathname === '/' || pathname === '/jobs' ? 'active' : ''}`}
                        >
                            <Briefcase size={20} />
                            <span>Jobs</span>
                        </Link>
                    </div>

                    <div className='nav-section' style={{marginTop:'16px'}}>
                        <button
                            className={`nav-link ${pathname.includes('settings') ? 'active' : ''}`}
                            onClick={() => setIsSettingsOpen(true)}
                        >
                            <SettingsIcon size={20} />
                            <span>Settings</span>
                        </button>
                    </div>
                </nav>
            </div>
        </aside>
    )
}
