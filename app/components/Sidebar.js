import './Sidebar.css'
import Link from 'next/link';

export default function Sidebar() {

    return (
        <aside className='Sidebar'>
            <div className='side-container'>
                <div 
                className='new-customer'><Link href="/entry">Create</Link>
                </div>
                <div className='side-contents'>
                    <Link href='/'>Home</Link>
                    <Link href="/jobs">Jobs</Link>
                </div>
            </div>

        </aside>
    )
}