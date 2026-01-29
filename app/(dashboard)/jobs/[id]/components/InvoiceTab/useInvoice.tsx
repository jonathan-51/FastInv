'use client'

import { useState } from 'react'
import { useJobData } from '../../context/JobDataContext'
import { storeInvoice } from '../../actions'
import { StandardInvoice } from './formats/StandardInvoice'
import { ItemizedInvoice } from './formats/ItemizedInvoice'
import { StandardItemizedInvoice } from './formats/StandardItemizedInvoice'

export const useInvoice = () => {
    // State
    const [issuedDate, setIssuedDate] = useState<string>('')
    const [dueDate, setDueDate] = useState<string>('')
    const [selectedTemplate, setSelectedTemplate] = useState<string>('standard')

    // Context
    const { jobData, setInvoice } = useJobData()
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
        return billables.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0).toFixed(2)
    }

    const calculateTypeTotal = (type: string) => {
        const categoryItems = billables.filter(item => item.type === type)
        return categoryItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0).toFixed(2)
    }

    // Actions
    const generateInvoice = async () => {
        const invoice_data = {
            org_id: jobData.org_id,
            job_id: jobData.id,
            customer_id: jobData.customer.id,
            invoice_number: '',
            status: '',
            issued_date: '',
            due_date: '',
            total: parseFloat(calculateTotal()),
        }

        const result = await storeInvoice(invoice_data)

        if (!result.error) {
            setInvoice(result)
        }
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