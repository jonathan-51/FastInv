'use client'

import { useState } from "react"
import './job.css'
import React from 'react'
import { PhotosTab } from './components/PhotoTab/PhotoTab'
import { MaterialsTab } from "./components/MaterialsTab/MaterialsTab"
import { NotesTab } from "./components/NotesTab/NotesTab"
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

/**
 * Client-side wrapper component that handles all interactive UI logic
 * Receives job data from parent Server Component as props
 */
export default function ClientWrapper({ job, billablesItems, invoiceData }: ClientWrapperProps) {
    // State for tracking which tab is active
    const [isHeadings, setIsHeadings] = useState({
        isBillables: true,
        isPhotos: false,
        isNotes: false,
        isInvoice: false,
    })

    // Handle tab switching
    const handleSectionClick = (section: string) => {
        setIsHeadings({
            isInvoice: section === 'invoice',
            isPhotos: section === 'photos',
            isBillables: section === 'billables',
            isNotes: section === 'notes',
        })
    }

    const initialJobData = {
        ...job,
        billables:billablesItems,
        photos:[],
        notes:''
    }


    return (
        <JobDataProvider initialJobData={initialJobData} initialInvoice={invoiceData}>
            <BillablesProvider>
            <div className="job-page">
                <div className="job-main">
                    <div className="job-header">
                        <h1 className="job-address">{job.site_address}</h1>
                        <div className="job-sections">
                            <button
                                className={`job-section-btn ${isHeadings.isBillables ? 'active' : ''}`}
                                onClick={() => handleSectionClick('billables')}>
                                Billables
                            </button>
                            <button
                                className={`job-section-btn ${isHeadings.isPhotos ? 'active' : ''}`}
                                onClick={() => handleSectionClick('photos')}>
                                Photos
                            </button>
                            <button
                                className={`job-section-btn ${isHeadings.isNotes ? 'active' : ''}`}
                                onClick={() => handleSectionClick('notes')}>
                                Notes
                            </button>
                            <button
                                className={`job-section-btn ${isHeadings.isInvoice ? 'active' : ''}`}
                                onClick={() => handleSectionClick('invoice')}>
                                Invoice
                            </button>
                        </div>
                    </div>
                    <div className="job-content">
                        {isHeadings.isBillables && (
                            <BillablesTab />
                        )}

                        {isHeadings.isPhotos && (
                            <PhotosTab jobID={job.id} orgID={job.org_id} />
                        )}

                        {isHeadings.isNotes && (
                            <NotesTab/>
                        )}

                        {isHeadings.isInvoice && (
                            <InvoiceTab/>
                        )}
                    </div>
                </div>
            </div>
            </BillablesProvider>
        </JobDataProvider>
    )
}
