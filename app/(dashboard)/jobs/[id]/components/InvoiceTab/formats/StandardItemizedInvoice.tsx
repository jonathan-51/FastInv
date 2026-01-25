'use client'

import './StandardItemizedInvoice.css'
import { Customer, Billable, Job } from '../../../../types'

interface StandardItemizedInvoiceProps {
    customer: Customer
    jobData: Job
    billables: Billable[]
    uniqueTypes: string[]
    issuedDate: string
    dueDate: string
    formatDate: (dateString: string) => string
    calculateTotal: () => string
    invoiceNumber: string
}

export const StandardItemizedInvoice = ({
    customer,
    jobData,
    billables,
    uniqueTypes,
    issuedDate,
    dueDate,
    formatDate,
    calculateTotal,
    invoiceNumber
}: StandardItemizedInvoiceProps) => {

    return (
    <div className='invoice-document'>
        {/* Invoice Header */}
        <div className="invoice-doc-header">
            <div className="invoice-doc-company">
                <span className="invoice-doc-company-name">Auckland Plumbing Co.</span>
                <span className="invoice-doc-company-detail">123 Trade Street, Penrose</span>
                <span className="invoice-doc-company-detail">Auckland, 1061</span>
                <span className="invoice-doc-company-detail">info@akldplumbing.co.nz</span>
            </div>
            <div className="invoice-doc-title-section">
                <span className="invoice-doc-title">INVOICE</span>
                <span className="invoice-doc-number">INV-2024-0047</span>
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
                    <span className="invoice-doc-payment-value">INV-2024-0047</span>
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