'use client'

import './Sidebar.css'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Briefcase,
    Settings as SettingsIcon,
    Plus,
    User,
    Users,
    LogOut
} from 'lucide-react';

import { useSettings } from '../context/SettingsContext';
import { useNewJob } from '../context/NewJobContext';
import { createClient } from '@/lib/supabase';
import { useState, useEffect } from 'react';
import { useJobTabs } from '../context/JobTabContext';

export default function Sidebar() {
    const pathname = usePathname();
    const { setIsSettingsOpen } = useSettings();
    const { setIsNewJobOpen } = useNewJob();
    const [user, setUser] = useState(null);
    const supabase = createClient();
    const {isHeadings,setIsHeadings} = useJobTabs()



    useEffect(() => {
        const getUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
        };
        getUser();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = '/login';
    };

    const isActive = (path) => {
        if (path === '/') {
            return pathname === '/';
        }
        return pathname.startsWith(path);
    };

    // Handle tab switching
    const handleSectionClick = (section) => {
        setIsHeadings({
            isInvoice: section === 'invoice',
            isPhotos: section === 'photos',
            isBillables: section === 'billables',
            isNotes: section === 'notes',
        })
    }

    return (
        <aside className='Sidebar'>
            <div className='side-container'>
                

                {/* Primary Action Button */}
                <button
                    className='new-job-button'
                    onClick={() => setIsNewJobOpen(true)}
                >
                    <Plus size={20} />
                    <span>New Job</span>
                </button>

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

                        {/* Job Tabs Dropdown - Only visible when on a job detail page */}
                        {pathname.startsWith('/jobs/') && (
                            <div className='job-tabs-container'>
                                <button 
                                onClick={() => handleSectionClick('billables')} 
                                className={`job-tab-item ${isHeadings.isBillables ? 'active':''}`}>
                                    <span>Billables</span>
                                </button>
                                <button
                                onClick={() => handleSectionClick('photos')} 
                                className={`job-tab-item ${isHeadings.isPhotos ? 'active':''}`}>
                                    <span>Photos</span>
                                </button>
                                <button onClick={() => handleSectionClick('notes')}
                                className={`job-tab-item ${isHeadings.isNotes ? 'active':''}`}>
                                    <span>Notes</span>
                                </button>
                                <button onClick={() => handleSectionClick('invoice')}
                                className={`job-tab-item ${isHeadings.isInvoice ? 'active':''}`}>
                                    <span>Invoice</span>
                                </button>
                            </div>
                        )}
                    </div>

                    <div className='nav-section'>
                        <Link
                        href='/customers'
                        className={`nav-link ${isActive(`/customers`) ? 'active' : ''}`}>

                            <Users size={20}/>
                            <span>Customers</span>

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

                {/* User Profile Section */}
                <div className='sidebar-footer'>
                    <div className='user-info'>
                        <div className='user-avatar'>
                            <User size={16} />
                        </div>
                        <div className='user-details'>
                            <span className='user-email'>{user?.email || 'Loading...'}</span>
                        </div>
                    </div>
                    <button
                        className='logout-button'
                        onClick={handleLogout}
                        title='Logout'
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </aside>
    )
}