'use client'

import { useContext, createContext, useState } from "react"

const StatusContext = createContext();

export function StatusProvider({children}) {
    const [statusFields,setStatusFields] = useState(["New","In Progress","Completed","Cancelled"])

    return (
        <StatusContext.Provider value = {{statusFields,setStatusFields}}>
            {children}
        </StatusContext.Provider>
    )
}

export function useStatus() {
    return useContext(StatusContext)
}