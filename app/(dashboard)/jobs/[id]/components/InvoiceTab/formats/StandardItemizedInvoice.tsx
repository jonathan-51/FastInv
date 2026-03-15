'use client'

import { useInvoice } from '../useInvoice'
import { useJobData } from '../../../context/JobDataContext'
import './StandardItemizedInvoice.css'
import { useOrganization } from '@/app/context/OrganizationContext'

export const StandardItemizedInvoice = () => {
    const { jobData } = useJobData()
    const {
        formatDate,
        calculateTotal
    } = useInvoice()

    const issuedDate = jobData.invoice?.issued_date || ''
    const dueDate = jobData.invoice?.due_date || ''

    const {organization,setOrganization} = useOrganization()

    // Derive data
    const customer = jobData.customer
    const billables = jobData.billables
    const uniqueTypes = [...new Set(billables.map(item => item.type))]
    const invoiceNumber = jobData.invoice?.invoice_number || 'INV-2024-0047'

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
                <span className="invoice-doc-section-label">Bill To</span>
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

        {/* Line Items */}
        <div className="invoice-doc-items">
            <div className="invoice-doc-items-header">
                <span>Description</span>
                <span>Qty</span>
                <span>Rate</span>
                <span>Amount</span>
            </div>
            {uniqueTypes.map(type => {
                const categoryItems = billables.filter(item => item.type === type)
                return (
                    <div key={type} className="invoice-doc-category">
                        <div className="invoice-doc-category-title">{type}</div>
                        <div>
                        {categoryItems.map(item => (
                            <div key={item.id} className="invoice-doc-item-row">
                                <span>{item.description}</span>
                                <span>{item.quantity} {item.unit}</span>
                                <span>${item.unit_price.toFixed(2)}</span>
                                <span>${(item.quantity*item.unit_price).toFixed(2)}</span>
                            </div>
                        ))}
                        </div>
                    </div>
                )
            })}
        </div>

        {/* Bottom Section: Payment Details + Totals */}
        <div className="invoice-doc-bottom">
            {/* Payment Details */}
            <div className="invoice-doc-payment">
                <div className="invoice-doc-payment-title">Payment Details</div>
                <div className="invoice-doc-payment-grid">
                    <div className="invoice-doc-payment-item">
                        <span className="invoice-doc-payment-label">Bank</span>
                        <span className="invoice-doc-payment-value">ANZ New Zealand</span>
                    </div>
                    <div className="invoice-doc-payment-item">
                        <span className="invoice-doc-payment-label">Account Name</span>
                        <span className="invoice-doc-payment-value">Auckland Plumbing Co.</span>
                    </div>
                </div>
                <div className="invoice-doc-payment-item">
                    <span className="invoice-doc-payment-label">Account Number</span>
                    <span className="invoice-doc-payment-value">01-0123-0456789-00</span>
                </div>
                <div className="invoice-doc-payment-item" style={{marginTop: '16px'}}>
                    <span className="invoice-doc-payment-label">Payment Reference</span>
                    <span className="invoice-doc-payment-value">{invoiceNumber}</span>
                </div>
            </div>
            {/* Totals */}
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
    </div>        
    )
}