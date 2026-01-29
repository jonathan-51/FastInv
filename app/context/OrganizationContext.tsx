'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { Organization } from '../(dashboard)/jobs/types'

interface OrganizationContextValue {
    organization: Organization | null
    setOrganization: (org: Organization | null) => void
}

const OrganizationContext = createContext<OrganizationContextValue | undefined>(undefined)

interface OrganizationProviderProps {
    children: ReactNode
    initialOrganization?: Organization | null
}

export const OrganizationProvider = ({ children, initialOrganization = null }: OrganizationProviderProps) => {
    const [organization, setOrganization] = useState<Organization | null>(initialOrganization)

    return (
        <OrganizationContext.Provider value={{ organization, setOrganization }}>
            {children}
        </OrganizationContext.Provider>
    )
}

export const useOrganization = () => {
    const context = useContext(OrganizationContext)
    if (!context) {
        throw new Error('useOrganization must be used within OrganizationProvider')
    }
    return context
}
