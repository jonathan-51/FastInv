'use client'

import { useState } from "react"

export const useInvoice = () => {
    const [issuedDate,setIssuedDate] = useState<string>('')
    const [dueDate,setDueDate] = useState<string>('')
    const [selectedTemplate, setSelectedTemplate] = useState<string>('standard')

    return {
        issuedDate,
        setIssuedDate,
        dueDate,
        setDueDate,
        selectedTemplate,
        setSelectedTemplate
    }
}