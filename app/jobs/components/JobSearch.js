'use client'

import { useState  } from "react"

export default function JobSearch({ onSearch }) {
 const [query,setQuery] = useState('');

 const handleSearch = (e) => {
    const value = e.current.value
    setQuery(value)
    onSearch(value)
    }

    return (
        <div className="job-search">
            <input
            type="text"
            placeholder="Search jobs by address, name, number..."
            value={query}
            onChange={handleSearch}/>
        </div>
    )
}
