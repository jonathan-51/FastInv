import Link from 'next/link';
import './Navbar.css';

export default function Navbar() {
    return (
        <nav className='Navbar'> 
        
            <div className='nav-container'>
                {/* Logo Area */}
                <div className='logo'>
                    <h2>TradeFlow</h2>
                </div>

                <div className='nav-contents'>
                </div>
            </div>
        </nav>
    )
}