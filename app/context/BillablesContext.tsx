'use client'
import { createContext, useContext, useState, ReactNode } from "react"

interface BillablesCategoryContextType {
    billableCategoryFields: string[]
    setBillableCategoryFields: (value: string[]) => void
    typeMarkups: Record<string, number>
    setTypeMarkup: (type: string, markup: number) => void
    getTypeMarkup: (type: string) => number
}

const BillablesCategoryContext = createContext<BillablesCategoryContextType | undefined>(undefined)

export const BillablesCategoryProvider = ({ children }: { children: ReactNode }) => {
    const [billableCategoryFields, setBillableCategoryFields] = useState(['Labour', 'Materials', 'Fees'])
    const [typeMarkups, setTypeMarkups] = useState<Record<string, number>>({
        'Labour': 1.0,
        'Materials': 1.3,
        'Fees': 1.0
    })

    const setTypeMarkup = (type: string, markup: number) => {
        setTypeMarkups(prev => ({ ...prev, [type]: markup }))
    }

    const getTypeMarkup = (type: string) => {
        return typeMarkups[type] ?? 1.0
    }

    return (
        <BillablesCategoryContext.Provider value={{
            billableCategoryFields,
            setBillableCategoryFields,
            typeMarkups,
            setTypeMarkup,
            getTypeMarkup
        }}>
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
