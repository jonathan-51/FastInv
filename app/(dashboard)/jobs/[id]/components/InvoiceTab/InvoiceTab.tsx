'use client'

import { useEffect } from 'react'
import { useJobData } from '../../context/JobDataContext'
import { updateInvoice as updateInvoiceStorage } from '@/lib/storage'
import { useInvoice } from './useInvoice'
import { InvoiceHeader } from './components/InvoiceHeader'
import { InvoiceLeftSideBar } from './components/InvoiceLeftSideBar'
import { InvoiceRightSideBar } from './components/InvoiceRightSideBar'
import { InvoiceEmptyState } from './components/InvoiceEmptyState'
import './InvoiceTab.css'

export const InvoiceTab = () => {
    const { jobData, updateInvoiceDates: updateInvoiceDatesContext } = useJobData()
    const customer = jobData.customer
    const billables = jobData.billables

    const {
        // Date state
        issuedDate,                    // Invoice issued date (YYYY-MM-DD)
        setIssuedDate,                 // Setter for issued date
        dueDate,                       // Invoice due date (YYYY-MM-DD)
        setDueDate,                    // Setter for due date

        // Template state
        selectedTemplate,              // Currently selected invoice template
        setSelectedTemplate,           // Setter for template selection

        // Event handlers
        onIssuedDateChange,            // Handler for issued date input change
        onDueDateChange,               // Handler for due date input change

        // Formatting functions
        formatDate,                    // Format YYYY-MM-DD to DD/MM/YYYY
        formatDaysUntilDue,            // Calculate days until due date

        // Calculation functions
        calculateTotal,                // Calculate total from all billables
        calculateTypeTotal,            // Calculate total for specific billable type

        // Actions
        generateInvoice,               // Create new invoice in database
        renderInvoiceTemplate          // Render the selected invoice template
    } = useInvoice()

    // Initialize dates from invoice when it loads
    useEffect(() => {
        if (jobData.invoice) {
            setIssuedDate(jobData.invoice.issued_date || new Date().toISOString().split('T')[0])
            setDueDate(jobData.invoice.due_date || new Date().toISOString().split('T')[0])
        }
    }, [jobData.invoice, setIssuedDate, setDueDate])

    // Auto-save dates to localStorage after user stops changing (debounced 1s)
    useEffect(() => {
        if (!jobData.invoice) return

        const currentInvoice = jobData.invoice
        const timeoutId = setTimeout(() => {
            if (issuedDate !== currentInvoice.issued_date || dueDate !== currentInvoice.due_date) {
                updateInvoiceStorage(jobData.id, { issued_date: issuedDate, due_date: dueDate })
                updateInvoiceDatesContext(issuedDate, dueDate)
            }
        }, 1000)

        return () => clearTimeout(timeoutId)
    }, [issuedDate, dueDate, jobData.invoice, jobData.id, updateInvoiceDatesContext])

    

    if (!jobData.invoice) {
        return <InvoiceEmptyState onGenerate={generateInvoice} />
    }

    return (
        <div className="invoice-main">
            <InvoiceHeader />

            <div className="invoice-content">
                <InvoiceLeftSideBar
                    jobData={jobData}
                    customer={customer}
                    billables={billables}
                    formatDate={formatDate}
                    formatDaysUntilDue={formatDaysUntilDue}
                    calculateTotal={calculateTotal}
                    calculateTypeTotal={calculateTypeTotal}
                    issuedDate={issuedDate}
                    dueDate={dueDate}
                />

                <div className="invoice-content-middle">
                    <div className="invoice-content-middle-wrapper">
                        {renderInvoiceTemplate()}
                    </div>
                </div>

                <InvoiceRightSideBar
                    issuedDate={issuedDate}
                    dueDate={dueDate}
                    selectedTemplate={selectedTemplate}
                    onIssuedDateChange={onIssuedDateChange}
                    onDueDateChange={onDueDateChange}
                    onTemplateChange={setSelectedTemplate}
                />
            </div>
        </div>
    )
}
