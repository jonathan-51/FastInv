'use client'

import { useState } from "react"

export const useInvoice = () => {
    const [issuedDate,setIssuedDate] = useState<string>('')
    const [dueDate,setDueDate] = useState<string>('')

    return {
        issuedDate,
        setIssuedDate,
        dueDate,
        setDueDate
    }
}