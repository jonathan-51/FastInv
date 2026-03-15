'use client'
import { Customer,Job,Billable } from "@/app/(dashboard)/jobs/types"


interface Props {
    customer: Customer
    jobData: Job
    billables: Billable[]
    formatDate: (date: string) => string
    formatDaysUntilDue: () => number
    calculateTotal: () => string
    calculateTypeTotal: (type: string) => string
    issuedDate: string
    dueDate: string
}

export const InvoiceLeftSideBar = ({
    jobData,
    customer,
    billables,
    formatDate,
    formatDaysUntilDue,
    calculateTotal,
    calculateTypeTotal,
    issuedDate,
    dueDate
    }: Props) => {

    const uniqueTypes = [...new Set(billables.map(item => item.type))]

    return (
        <div className='invoice-content-left-side'>
            {/* Customer Card */}
            <div className='invoice-content-left-side-card'>
                <span className="invoice-card-header">Customer</span>
                <span className="invoice-card-name">{customer.name}</span>
                <span className="invoice-card-detail">{jobData.site_address}</span>
                <span className="invoice-card-detail">{customer.email}</span>
                <span className="invoice-card-detail">{customer.phone}</span>
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
    )
}