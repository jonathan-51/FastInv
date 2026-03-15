'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { BusinessDetails } from '../(dashboard)/jobs/types'
import { getBusinessDetails, saveBusinessDetails } from '@/lib/storage'

interface BusinessDetailsContextValue {
    businessDetails: BusinessDetails | null
    setBusinessDetails: (details: BusinessDetails) => void
}

const BusinessDetailsContext = createContext<BusinessDetailsContextValue | undefined>(undefined)

export const BusinessDetailsProvider = ({ children }: { children: ReactNode }) => {
    const [businessDetails, setBusinessDetailsState] = useState<BusinessDetails | null>(null)

    useEffect(() => {
        setBusinessDetailsState(getBusinessDetails())
    }, [])

    const setBusinessDetails = (details: BusinessDetails) => {
        setBusinessDetailsState(details)
        saveBusinessDetails(details)
    }

    return (
        <BusinessDetailsContext.Provider value={{ businessDetails, setBusinessDetails }}>
            {children}
        </BusinessDetailsContext.Provider>
    )
}

export const useBusinessDetails = () => {
    const context = useContext(BusinessDetailsContext)
    if (!context) {
        throw new Error('useBusinessDetails must be used within BusinessDetailsProvider')
    }
    return context
}
