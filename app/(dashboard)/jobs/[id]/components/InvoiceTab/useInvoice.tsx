'use client'

import { useState } from 'react'
import { useJobData } from '../../context/JobDataContext'
import { createInvoice } from '@/lib/storage'
import { StandardInvoice } from './formats/StandardInvoice'
import { ItemizedInvoice } from './formats/ItemizedInvoice'
import { StandardItemizedInvoice } from './formats/StandardItemizedInvoice'
import { useBillablesCategory } from '@/app/context/BillablesContext'

export const useInvoice = () => {
    // State
    const [issuedDate, setIssuedDate] = useState<string>('')
    const [dueDate, setDueDate] = useState<string>('')
    const [selectedTemplate, setSelectedTemplate] = useState<string>('standard')

    // Context
    const { jobData, updateInvoice } = useJobData()
    const { getTypeMarkup } = useBillablesCategory()
    const billables = jobData.billables

    // Event Handlers
    const onIssuedDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIssuedDate(e.target.value)
    }

    const onDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDueDate(e.target.value)
    }

    // Formatting Functions
    const formatDate = (dateString: string) => {
        if (!dateString) return ''
        const [year, month, day] = dateString.split('-')
        return `${day}/${month}/${year}`
    }

    const formatDaysUntilDue = () => {
        if (!issuedDate || !dueDate) return 0

        const todayDate = new Date()
        todayDate.setHours(0, 0, 0, 0)

        const dueDateObj = new Date(dueDate)
        const diffInMs = dueDateObj.getTime() - todayDate.getTime()
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

        return diffInDays
    }

    // Calculation Functions
    const calculateTotal = () => {
        return billables.reduce((sum, item) => {
            const markup = getTypeMarkup(item.type)
            return sum + (item.quantity * item.unit_price * markup)
        }, 0).toFixed(2)
    }

    const calculateTypeTotal = (type: string) => {
        const categoryItems = billables.filter(item => item.type === type)
        const markup = getTypeMarkup(type)
        return (categoryItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0) * markup).toFixed(2)
    }

    // Actions
    const generateInvoice = () => {
        const invoice = createInvoice(jobData.id)
        updateInvoice(invoice)
    }

    const renderInvoiceTemplate = () => {
        if (selectedTemplate === 'standard') {
            return <StandardInvoice />
        } else if (selectedTemplate === 'standard_itemized') {
            return <StandardItemizedInvoice />
        } else {
            return <ItemizedInvoice />
        }
    }

    return {
        // State
        issuedDate,
        setIssuedDate,
        dueDate,
        setDueDate,
        selectedTemplate,
        setSelectedTemplate,

        // Event Handlers
        onIssuedDateChange,
        onDueDateChange,

        // Formatting
        formatDate,
        formatDaysUntilDue,

        // Calculations
        calculateTotal,
        calculateTypeTotal,

        // Actions
        generateInvoice,
        renderInvoiceTemplate
    }
}