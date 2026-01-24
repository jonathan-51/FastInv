'use client'

import './InvoiceTab.css'
import { useJobData } from '../../context/JobDataContext'
import { updateInvoiceDates } from './actions'
import { storeInvoice } from '../../actions'
import { useInvoice } from './useInvoice'
import { useEffect } from 'react'


export const InvoiceTab = () => {
    const { jobData, invoice, setInvoice, updateInvoiceDates: updateInvoiceDatesContext } = useJobData()
    const customer = jobData.customer
    const billables = jobData.billables
    const uniqueTypes = [...new Set(billables.map(item => item.type))]

    const {
        issuedDate,
        setIssuedDate,
        dueDate,
        setDueDate
    } = useInvoice()

    useEffect(() => {
        if (invoice) {
            setIssuedDate(invoice.issued_date || new Date().toISOString().split('T')[0])
            setDueDate(invoice.due_date || new Date().toISOString().split('T')[0])
        }
    },[invoice])

    // Auto-save dates to DB after user stops changing (debounced 500ms)
    useEffect(() => {
        if (!invoice) return

        const timeoutId = setTimeout(async () => {
            // Check if dates changed from what's in the invoice
            if (issuedDate !== invoice.issued_date || dueDate !== invoice.due_date) {
                // Call server action to update DB
                const result = await updateInvoiceDates(invoice.id, issuedDate, dueDate)

                if (!result.error) {
                    // Update context with new dates
                    updateInvoiceDatesContext(issuedDate, dueDate)
                }
            }
        }, 5000)

        return () => clearTimeout(timeoutId)
    }, [issuedDate, dueDate])

    // Format date from YYYY-MM-DD to DD/MM/YYYY
    const formatDate = (dateString: string) => {
        if (!dateString) return ''
        const [year, month, day] = dateString.split('-')
        return `${day}/${month}/${year}`
    }
        
    const changeIssuedDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIssuedDate(e.target.value)
    }

    const changeDueDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDueDate(e.target.value)
    }

    const formatDaysUntilDue = () => {
        if (!issuedDate || !dueDate) return 0

        // Parse dates (dates are in YYYY-MM-DD format)
        const todayDate = new Date()
        todayDate.setHours(0,0,0,0)

        const dueDateObj = new Date(dueDate)

        // Calculate difference in milliseconds, then convert to days
        const diffInMs = dueDateObj.getTime() - todayDate.getTime()
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

        return diffInDays
    }

    const calculateTotal = () => {
        return billables.reduce((sum,item) => sum + (item.quantity*item.unit_price),0).toFixed(2)
    }

    const calculateTypeTotal = (type:string) => {
        const categoryItems = billables.filter(item => item.type === type)
        return categoryItems.reduce((sum,item) => sum + (item.quantity*item.unit_price),0).toFixed(2)
    }

    const generateInvoice = async () => {
        const invoice_data = {
            org_id:jobData.org_id,
            job_id:jobData.id,
            customer_id:jobData.customer.id,
            invoice_number:'',
            status:'',
            issued_date:'',
            due_date:'',
            total:parseFloat(calculateTotal()),
        }

        const result = await storeInvoice(invoice_data)

        if (result.error) {

        } else {
            setInvoice(result)
        }
    }

    return (
        invoice ? (
        <div className="invoice-main">
            <div className="invoice-header">
                <span className="invoice-header-title">Invoice</span>
                <span className="invoice-header-number">INV-2024-0047</span>
                <div className="invoice-header-status sent">SENT</div>
                <div></div>
                <button className="invoice-header-btn invoice-header-btn-secondary">Edit</button>
                <button className="invoice-header-btn invoice-header-btn-primary">Mark Paid</button>
            </div>
            <div className="invoice-content">
                <div className='invoice-content-left-side'>
                    {/* Customer Card */}
                    <div className='invoice-content-left-side-card'>
                        <span className="invoice-card-header">Customer</span>
                        <span className="invoice-card-name">{customer.name}</span>
                        <span className="invoice-card-detail">{jobData.site_address}</span>
                        <span className="invoice-card-detail">{customer.email}</span>
                        <span className="invoice-card-detail">{customer.phone}</span>
                    </div>

                    {/* Linked Job Card */}
                    <div className='invoice-content-left-side-card'>
                        <span className="invoice-card-header">Linked Job</span>
                        <span className="invoice-card-name">Job Description</span>
                        <span className="invoice-card-detail">Job Completion Date</span>
                    </div>

                    {/* Price Summary */}
                    <div className='invoice-content-left-side-price-summary'>
                        <span className="invoice-price-summary-header">Total Amount</span>
                        <span className="invoice-price-summary-total">${calculateTotal()}</span>
                        {uniqueTypes.map(type => {
                            const total_type_price = calculateTypeTotal(type)
                            return (
                                <div key={type} className="invoice-price-summary-row">
                                    <span>{type}</span>
                                    <span>${total_type_price}</span>
                                </div>
                            )
                        })}
                    </div>

                    {/* Dates Card */}
                    <div className='invoice-content-left-side-card'>
                        <span className="invoice-card-header">Timeline</span>
                        <div className="invoice-date-row">
                            <span>Issued</span>
                            <span>{formatDate(issuedDate)}</span>
                        </div>
                        <div className="invoice-date-row">
                            <span>Due</span>
                            <span>{formatDate(dueDate)}</span>
                        </div>
                        <div className="invoice-due-badge">{formatDaysUntilDue() === 1 ? `${formatDaysUntilDue()} day until due`:`${formatDaysUntilDue()} days until due`} </div>
                    </div>
                </div>


                <div className='invoice-content-middle'>
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
                </div>

                <div className='invoice-content-right-side'>
                    <span className="invoice-action-section-title">Actions</span>
                    <button className="invoice-action-btn invoice-action-btn-primary">Send Email</button>
                    <button className="invoice-action-btn invoice-action-btn-secondary">Preview Invoice</button>
                    <button className="invoice-action-btn invoice-action-btn-secondary">Download PDF</button>
                    <div className="invoice-action-divider"></div>
                    <div className="invoice-date-input-wrapper">
                        <span>Issue Date</span>
                        <input
                            type="date"
                            defaultValue={issuedDate}
                            className="invoice-date-input"
                            onChange={(e) => changeIssuedDate(e)}
                        />
                    </div>

                    <div className="invoice-date-input-wrapper">
                        <span>Payment Terms</span>
                        <input
                            type="date"
                            defaultValue={dueDate}
                            className="invoice-date-input"
                            onChange={(e) => changeDueDate(e)}
                        />
                    </div>
                    <div></div>
                </div>
            </div>
        </div>
        ) : (
            <div className="invoice-empty-state">
                <div className="invoice-empty-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                        <polyline points="10 9 9 9 8 9"/>
                    </svg>
                </div>
                <h3 className="invoice-empty-title">No invoice yet</h3>
                <p className="invoice-empty-description">
                    Create an invoice from the billable items you've added to this job.
                </p>
                <button className="invoice-empty-btn" onClick={generateInvoice}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                    </svg>
                    Generate Invoice
                </button>
            </div>
        )
    )
}
