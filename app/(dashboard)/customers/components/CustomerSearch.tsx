'use client'

import { useState  } from "react"
import './CustomerSearch.css'
export default function CustomerSearch() {
 const [query,setQuery] = useState('');

 const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    }

    return (
        <div className="customer-search">
            <input
            type="text"
            placeholder="Search customers by address, name, number, email..."
            value={query}
            onChange={handleSearch}/>
        </div>
    )
}