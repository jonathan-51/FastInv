'use client'

import { createContext, useContext, useState } from "react"

const NewJobContext = createContext();

export function NewJobProvider({children}) {
    const [isNewJobOpen,setIsNewJobOpen] = useState(false)

    return (
        <NewJobContext.Provider value = {{ isNewJobOpen, setIsNewJobOpen}}>
            {children}
        </NewJobContext.Provider>
    )
}

export function useNewJob() {
    return useContext(NewJobContext)
}