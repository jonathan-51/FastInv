'use client'

import { useContext, createContext, useState } from "react"

const StatusContext = createContext();

export function StatusProvider({children}) {
    const [statusFields,setStatusFields] = useState(["Planned","Used"])

    return (
        <StatusContext.Provider value = {{statusFields,setStatusFields}}>
            {children}
        </StatusContext.Provider>
    )
}

export function useStatus() {
    return useContext(StatusContext)
}