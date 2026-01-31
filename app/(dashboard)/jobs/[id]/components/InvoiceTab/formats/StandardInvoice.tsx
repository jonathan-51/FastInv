'use client'

import { useInvoice } from '../useInvoice'
import { useJobData } from '../../../context/JobDataContext'
import './StandardInvoice.css'
import { useOrganization } from '@/app/context/OrganizationContext'
import { useEffect } from 'react'



export const StandardInvoice = () => {
    const { jobData, invoice } = useJobData()
    const {
        issuedDate,
        dueDate,
        formatDate,
        calculateTotal,
        calculateTypeTotal
    } = useInvoice()
    const {organization,setOrganization} = useOrganization()

    // Derive data
    const customer = jobData.customer
    const billables = jobData.billables
    const uniqueTypes = [...new Set(billables.map(item => item.type))]
    const invoiceNumber = invoice?.invoice_number || 'INV-2024-0047'
    useEffect(() => {
        console.log(organization)
    },[])

    const handleInvoiceChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    }


    return (
        <div className='invoice-document'>
            {/* Invoice Header */}
            <div className="invoice-doc-header">
                <div className="invoice-doc-company">
                    <span className="invoice-doc-company-name">{organization?.name}</span>
                    <span className="invoice-doc-company-detail">{organization?.street}, {organization?.suburb}</span>
                    <span className="invoice-doc-company-detail">{organization?.city}, {organization?.postcode}</span>
                    <span className="invoice-doc-company-detail">{organization?.email}</span>
                </div>
                <div className="invoice-doc-title-section">
                    <span className="invoice-doc-title">INVOICE</span>
                    <span className="invoice-doc-number">{invoiceNumber}</span>
                </div>
            </div>

            {/* Bill To & Dates */}
            <div className="invoice-doc-billing">
                <div className="invoice-doc-bill-to">
                    <span className="invoice-doc-section-label">BILL TO</span>
                    <span className="invoice-doc-customer-name">{customer.name}</span>
                    <span className="invoice-doc-customer-detail">{jobData.site_address}</span>
                    <span className="invoice-doc-customer-detail">{customer.email}</span>
                </div>
                <div className="invoice-doc-dates">
                    <span className="invoice-doc-date-row">Issue Date: <strong>{formatDate(issuedDate)}</strong></span>
                    <span className="invoice-doc-date-row">Due Date: <strong>{formatDate(dueDate)}</strong></span>
                    <span className="invoice-doc-date-row">Reference: <strong>Bathroom pipe replacement</strong></span>
                </div>
            </div>

            {/* Line Items Table */}
            <div className="invoice-doc-items">
                <div className="invoice-doc-items-header">
                    <span>DESCRIPTION</span>
                    <span></span>
                    <span></span>
                    <span>AMOUNT</span>
                </div>
                {uniqueTypes.map(type => (
                    <div key={type} className="invoice-doc-category-row">
                        <span className="invoice-doc-category-name">{type.toUpperCase()}</span>
                        <span></span>
                        <span></span>
                        <span className="invoice-doc-category-amount">${calculateTypeTotal(type)}</span>
                    </div>
                ))}
            </div>

            {/* Totals Section */}
            <div className="invoice-doc-summary">
                <div className="invoice-doc-totals">
                    <div className="invoice-doc-total-row">
                        <span>Subtotal</span>
                        <span>${calculateTotal()}</span>
                    </div>
                    <div className="invoice-doc-total-row">
                        <span>GST (15%)</span>
                        <span>${(parseFloat(calculateTotal()) * 0.15).toFixed(2)}</span>
                    </div>
                    <div className="invoice-doc-total-row final">
                        <span>Total Due</span>
                        <span>${(parseFloat(calculateTotal()) * 1.15).toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Payment Details */}
            <div className="invoice-doc-payment">
                <div className="invoice-doc-payment-title">PAYMENT DETAILS</div>
                <div className="invoice-doc-payment-grid">
                    <div className="invoice-doc-payment-item">
                        <span className="invoice-doc-payment-label">BANK</span>
                        <span className="invoice-doc-payment-value">ANZ New Zealand</span>
                    </div>
                    <div className="invoice-doc-payment-item">
                        <span className="invoice-doc-payment-label">ACCOUNT NAME</span>
                        <span className="invoice-doc-payment-value">Auckland Plumbing Co.</span>
                    </div>
                </div>
                <div className="invoice-doc-payment-grid">
                <div className="invoice-doc-payment-item">
                    <span className="invoice-doc-payment-label">ACCOUNT NUMBER</span>
                    <span className="invoice-doc-payment-value">01-0123-0456789-00</span>
                </div>
                <div className="invoice-doc-payment-item">
                    <span className="invoice-doc-payment-label">PAYMENT REFERENCE</span>
                    <span className="invoice-doc-payment-value">{invoiceNumber}</span>
                </div>
                </div>
            </div>
        </div>
    )
}