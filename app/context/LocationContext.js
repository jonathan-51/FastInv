'use client'

import { createContext, useContext, useState } from "react"

const LocationContext = createContext();

export function LocationProvider({children}) {
    const [locationFields,setlocationFields] = useState(["Warehouse","Vehicle","Supplier"])

    return (
        <LocationContext.Provider value = {{ locationFields, setlocationFields}}>
            {children}
        </LocationContext.Provider>
    )
}

export function useLocation() {
    return useContext(LocationContext)
}