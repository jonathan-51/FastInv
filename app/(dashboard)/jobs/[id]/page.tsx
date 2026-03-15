'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { getJob, getBillables, getInvoice } from '@/lib/storage'
import { Job, Billable, Invoice } from '../types'
import ClientWrapper from './ClientWrapper'
import './job.css'

export default function JobDetailPage() {
    const params = useParams()
    const id = params.id as string

    const [job, setJob] = useState<Job | null>(null)
    const [billables, setBillables] = useState<Billable[]>([])
    const [invoice, setInvoice] = useState<Invoice | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const foundJob = getJob(id)
        if (foundJob) {
            setJob(foundJob)
            setBillables(getBillables(id))
            setInvoice(getInvoice(id))
        }
        setLoading(false)
    }, [id])

    if (loading) return null

    if (!job) {
        return (
            <div className="job-page job-state-container">
                <div className="job-error">
                    <h2 className="job-error-title">Job Not Found</h2>
                    <p className="job-error-message">This job doesn't exist.</p>
                    <a href="/jobs" className="job-error-link">Back to Jobs</a>
                </div>
            </div>
        )
    }

    return <ClientWrapper job={job} billablesItems={billables} invoiceData={invoice} />
}
