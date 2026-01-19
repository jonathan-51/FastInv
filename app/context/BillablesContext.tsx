'use client'
import { createContext, useContext, useState, ReactNode } from "react"

interface BillablesCategoryContextType {
    billableCategoryFields: string[]
    setBillableCategoryFields: (value: string[]) => void
}

const BillablesCategoryContext = createContext<BillablesCategoryContextType | undefined>(undefined)

export const BillablesCategoryProvider = ({ children }: { children: ReactNode }) => {
    const [billableCategoryFields, setBillableCategoryFields] = useState(['Labour', 'Materials', 'Fees'])

    return (
        <BillablesCategoryContext.Provider value={{ billableCategoryFields, setBillableCategoryFields }}>
            {children}
        </BillablesCategoryContext.Provider>
    )
}

export const useBillablesCategory = () => {
    const context = useContext(BillablesCategoryContext)
    if (!context) {
        throw new Error('useBillablesCategory must be used within BillablesCategoryProvider')
    }
    return context
}
