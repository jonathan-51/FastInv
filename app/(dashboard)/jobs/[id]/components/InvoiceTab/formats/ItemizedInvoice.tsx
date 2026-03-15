'use client'

import { useInvoice } from '../useInvoice'
import { useJobData } from '../../../context/JobDataContext'
import './ItemizedInvoice.css'
import { useBusinessDetails } from '@/app/context/BusinessDetailsContext'

export const ItemizedInvoice = () => {
    const { jobData } = useJobData()
    const {
        formatDate,
        calculateTotal,
        calculateTypeTotal
    } = useInvoice()

    const issuedDate = jobData.invoice?.issued_date || ''
    const dueDate = jobData.invoice?.due_date || ''
    const { businessDetails } = useBusinessDetails()
    // Derive data
    const customer = jobData.customer
    const billables = jobData.billables
    const uniqueTypes = [...new Set(billables.map(item => item.type))]
    const invoiceNumber = jobData.invoice?.invoice_number || 'INV-2024-0047'

    return (
        <div>
            <div className='invoice-document'>
                {/* Invoice Header */}
                <div className="invoice-doc-header">
                    <div className="invoice-doc-company">
                        <span className="invoice-doc-company-name">{businessDetails?.name}</span>
                        <span className="invoice-doc-company-detail">{businessDetails?.street}, {businessDetails?.suburb}</span>
                        <span className="invoice-doc-company-detail">{businessDetails?.city}, {businessDetails?.postcode}</span>
                        <span className="invoice-doc-company-detail">{businessDetails?.email}</span>
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
                            <span className="invoice-doc-payment-value">{businessDetails?.bank_name}</span>
                        </div>
                        <div className="invoice-doc-payment-item">
                            <span className="invoice-doc-payment-label">ACCOUNT NAME</span>
                            <span className="invoice-doc-payment-value">{businessDetails?.account_name}</span>
                        </div>
                    </div>
                    <div className="invoice-doc-payment-grid">
                    <div className="invoice-doc-payment-item">
                        <span className="invoice-doc-payment-label">ACCOUNT NUMBER</span>
                        <span className="invoice-doc-payment-value">{businessDetails?.account_number}</span>
                    </div>
                    <div className="invoice-doc-payment-item">
                        <span className="invoice-doc-payment-label">PAYMENT REFERENCE</span>
                        <span className="invoice-doc-payment-value">{invoiceNumber}</span>
                    </div>
                </div>
            </div>
            </div>



            {/* Page 2 - Detailed Line Items Breakdown */}
            <div className='invoice-document' style={{}}>
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
                        <span className="invoice-doc-number">{invoiceNumber}</span>
                    </div>
                </div>

                {/* Detailed Line Items Table */}
                <div className="invoice-doc-items">
                    <div className="invoice-doc-items-header-detailed">
                        <span>DESCRIPTION</span>
                        <span>QTY</span>
                        <span>PRICE</span>
                        <span>AMOUNT</span>
                    </div>

                    {uniqueTypes.map(type => {
                        const categoryItems = billables.filter(item => item.type === type)
                        return (
                            <div key={type}>
                                {/* Category Header */}
                                <div className="invoice-doc-category-header">
                                    <span>{type.toUpperCase()}</span>
                                </div>

                                {/* Individual Line Items */}
                                {categoryItems.map((item, index) => (
                                    <div key={`${type}-${index}`} className="invoice-doc-line-item">
                                        <span className="invoice-doc-item-description">{item.description}</span>
                                        <span className="invoice-doc-item-qty">{item.quantity}</span>
                                        <span className="invoice-doc-item-price">${item.unit_price.toFixed(2)}</span>
                                        <span className="invoice-doc-item-amount">${(item.quantity * item.unit_price).toFixed(2)}</span>
                                    </div>
                                ))}

                                {/* Category Subtotal */}
                                <div className="invoice-doc-category-subtotal">
                                    <span>{type.toUpperCase()} SUBTOTAL</span>
                                    <span></span>
                                    <span></span>
                                    <span>${calculateTypeTotal(type)}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Footer Note */}
                <div className="invoice-doc-footer-note">
                    <span>Please refer to page 1 for payment details and total amount due.</span>
                </div>
            </div>
        </div>
    )
}