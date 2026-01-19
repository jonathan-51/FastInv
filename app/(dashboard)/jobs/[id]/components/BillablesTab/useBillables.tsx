'use client'
import React, { createContext, useContext, useState, ReactNode } from "react"

interface BillablesContextType {
    isNewItemOpen: boolean
    setIsNewItemOpen: (value: boolean) => void
    jobID: string
    orgID: string
    billablesItems: any[]
    setBillablesItems: (items: any[]) => void
    addedBillableItem: any
    setAddedBillableItem: (item: any) => void
    selectedItems: Record<string, string[]>
    setSelectedItems: (items: Record<string, string[]>) => void
}

const BillablesContext = createContext<BillablesContextType | undefined>(undefined)

export const BillablesProvider = (
    { children, jobID, orgID, initialBillablesItems, initialSetBillablesItems }: 
    { children: ReactNode, jobID: string, orgID: string, initialBillablesItems?: any[], initialSetBillablesItems?: any }) => {
    const [isNewItemOpen, setIsNewItemOpen] = useState(false)
    const [billablesItems, setBillablesItems] = useState<any[]>(initialBillablesItems || [])
    const [addedBillableItem,setAddedBillableItem] = useState<any>({})
    const [selectedItems, setSelectedItems] = useState<Record<string, string[]>>({})

    return (
        <BillablesContext.Provider value={{ 
            isNewItemOpen, 
            setIsNewItemOpen, 
            jobID, 
            orgID, 
            billablesItems, 
            setBillablesItems,
            addedBillableItem,
            setAddedBillableItem,
            selectedItems,
            setSelectedItems,
             }}>
            {children}
        </BillablesContext.Provider>
    )
}

export const useBillables = () => {
    const context = useContext(BillablesContext)
    if (!context) {
        throw new Error('useBillables must be used within BillablesProvider')
    }
    return context
}
