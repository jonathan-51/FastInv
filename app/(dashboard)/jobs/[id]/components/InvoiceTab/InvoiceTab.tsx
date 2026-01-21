'use client'

import './InvoiceTab.css'
import { useJobData } from '../../context/JobDataContext'



export const InvoiceTab = () => {
    const { jobData } = useJobData()
    const customer = jobData.customer



    return (
        <div className="invoice-main">
            <div className="invoice-header">
                <span>Invoice</span>
                <span>INV-2024-0047</span>
                <div>SENT</div>
                <div></div>
                <button>Edit</button>
                <button>Mark Paid</button>
            </div>
            <div className="invoice-content">
                <div className='invoice-content-left-side'>
                    <div>
                        <div>
                            <span>{customer.name}</span>
                        </div>
                        <span>{customer.address}</span>
                        <span>{customer.email}</span>
                        <span>{customer.phone}</span>
                    </div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <div className='invoice-content-middle'></div>
                <div className='invoice-content-right-side'></div>
            </div>
        </div>
    )
}