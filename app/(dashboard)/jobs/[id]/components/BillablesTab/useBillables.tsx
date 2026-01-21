// useBillables.tsx
'use client'
import { createContext, useContext, useState, ReactNode} from "react"

interface BillablesContextType {
    isNewItemOpen: boolean
    setIsNewItemOpen: (open:boolean) => void
    selectedItems: Record<string, string[]>
    setSelectedItems: (items:Record<string, string[]>) => void
}
const BillablesContext = createContext<BillablesContextType | undefined>(undefined)

export function BillablesProvider({ children }: { children:ReactNode}) {
    // UI state only - no data state (that's in JobDataContext)
    const [isNewItemOpen, setIsNewItemOpen] = useState(false)
    const [selectedItems, setSelectedItems] = useState<Record<string, string[]>>({})

    return (
        <BillablesContext.Provider value={{
        isNewItemOpen,
        setIsNewItemOpen,
        selectedItems,
        setSelectedItems}}>

        {children}

        </BillablesContext.Provider>
    )
}

export const useBillables = () => {
    const context = useContext(BillablesContext)
    if (!context) {
        throw new Error ('useBillables must be used within BillablesProvider')
    }
    return context
}