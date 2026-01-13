'use client'

import './Sidebar.css'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Briefcase,
    Settings as SettingsIcon,
    Plus,
    User,
    LogOut
} from 'lucide-react';

import { useSettings } from '../context/SettingsContext';
import { useNewJob } from '../context/NewJobContext';
import { createClient } from '@/lib/supabase';
import { useState, useEffect } from 'react';


export default function Sidebar() {
    const pathname = usePathname();
    const { setIsSettingsOpen } = useSettings();
    const { setIsNewJobOpen } = useNewJob();
    const [user, setUser] = useState(null);
    const supabase = createClient();

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
                            className={`nav-link ${isActive('/') ? 'active' : ''}`}
                        >
                            <Briefcase size={20} />
                            <span>Jobs</span>
                        </Link>
                    </div>

                    <div className='nav-section'>
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