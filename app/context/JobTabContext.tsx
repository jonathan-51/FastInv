'use client'
import { createContext, useContext, useState, ReactNode } from "react"

interface TabState {
    isBillables: boolean
    isPhotos: boolean
    isNotes: boolean
    isInvoice: boolean
}

interface JobTabContextType {
    isHeadings: TabState
    setIsHeadings: React.Dispatch<React.SetStateAction<TabState>>
}

const JobTabContext = createContext<JobTabContextType | undefined>(undefined)

export const JobTabProvider = ({ children }: { children: ReactNode }) => {
    const [isHeadings, setIsHeadings] = useState<TabState>({
            isBillables: true,
            isPhotos: false,
            isNotes: false,
            isInvoice: false,
        })
    return (
        <JobTabContext.Provider value={{ isHeadings, setIsHeadings }}>
            {children}
        </JobTabContext.Provider>
    )
}

export const useJobTabs = () => {
    const context = useContext(JobTabContext)
    if (!context) {
        throw new Error('useJobTabs must be used within JobTabsProvider')
    }
    return context
}
