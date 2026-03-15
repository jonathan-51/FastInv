'use client'

import { useState } from "react"
import './job.css'
import { BillablesTab } from "./components/BillablesTab/BillablesTab"
import { InvoiceTab } from "./components/InvoiceTab/InvoiceTab"
import { JobDataProvider } from "./context/JobDataContext"
import { BillablesProvider } from "./components/BillablesTab/useBillables"
import { Job, Billable, Invoice } from "../types"

interface ClientWrapperProps {
    job: Job
    billablesItems: Billable[]
    invoiceData: Invoice | null
}

export default function ClientWrapper({ job, billablesItems, invoiceData }: ClientWrapperProps) {
    const [activeTab, setActiveTab] = useState<'billables' | 'invoice'>('billables')

    const initialJobData = {
        ...job,
        billables: billablesItems,
        photos: [],
        notes: '',
        invoice: invoiceData || null
    }

    return (
        <JobDataProvider initialJobData={initialJobData}>
            <BillablesProvider>
                <div className="job-page">
                    <div className="job-main">
                        <div className="job-header">
                            <h1 className="job-address">{job.site_address}</h1>
                            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                                <button
                                    onClick={() => setActiveTab('billables')}
                                    style={{
                                        padding: '6px 16px',
                                        borderRadius: '6px',
                                        border: '1px solid #d1d5db',
                                        background: activeTab === 'billables' ? '#3B2A22' : 'white',
                                        color: activeTab === 'billables' ? 'white' : '#374151',
                                        cursor: 'pointer',
                                        fontWeight: 500,
                                    }}
                                >
                                    Billables
                                </button>
                                <button
                                    onClick={() => setActiveTab('invoice')}
                                    style={{
                                        padding: '6px 16px',
                                        borderRadius: '6px',
                                        border: '1px solid #d1d5db',
                                        background: activeTab === 'invoice' ? '#3B2A22' : 'white',
                                        color: activeTab === 'invoice' ? 'white' : '#374151',
                                        cursor: 'pointer',
                                        fontWeight: 500,
                                    }}
                                >
                                    Invoice
                                </button>
                            </div>
                        </div>
                        <div className="job-content">
                            {activeTab === 'billables' && <BillablesTab />}
                            {activeTab === 'invoice' && <InvoiceTab />}
                        </div>
                    </div>
                </div>
            </BillablesProvider>
        </JobDataProvider>
    )
}
