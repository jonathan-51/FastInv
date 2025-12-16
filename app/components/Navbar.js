import Link from 'next/link';
import './Navbar.css';

export default function Navbar() {
    return (
        <nav className='Navbar'> 
        
            <div className='nav-container'>
                <div className='nav-logo'>
                    <Link 
                    // Link to homepage by clicking on logo
                    href="/">
                    
                    MyApp
                    </Link>
                </div>

                <div className='nav-contents'>
                </div>
            </div>
        </nav>
    )
}