'use client'

import './invoices.css'

export default function invoicesPage() {
    
    return (
        <div className="invoices-main">
            <div className="invoices-header">
                <span>invoices</span>
                <button className='invoices-filter-chips'>All</button>
                <button className='invoices-filter-chips'>Draft</button>
                <button className='invoices-filter-chips'>Sent</button>
                <button className='invoices-filter-chips'>Paid</button>
                <button className='invoices-filter-chips'>Overdue</button>
                <div></div>
                <button className='invoices-new-invoices-btn' style={{textAlign:'right'}}>+ New invoice</button>

            </div>

            <div className="invoices-content">
                <div className="invoices-sidebar">side</div>
                <div className="invoices-body">
                    <div className="invoices-body-header">
                        <button className='invoices-body-header-new-invoices-button'>Send invoice</button>
                        <button className='invoices-body-header-buttons'>Edit</button>
                        <button className='invoices-body-header-buttons'>Download PDF</button>
                        <div></div>
                        <button className='invoices-body-header-buttons'>More</button>
                    </div>
                    <div className="invoices-body-main">
                        <div className='invoices-body-main-invoices'></div>
                    </div>
                </div>
            </div>
        </div>
    )
}