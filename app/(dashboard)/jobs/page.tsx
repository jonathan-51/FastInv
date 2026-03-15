'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getJobs, updateJob, deleteJob } from '@/lib/storage'
import { Job } from './types'
import './jobs.css'

export default function JobsListingPage() {
    const [jobs, setJobs] = useState<Job[]>([])

    useEffect(() => {
        setJobs(getJobs())
    }, [])

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-NZ', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
    }

    const statusOptions = ['quoted', 'in_progress', 'completed', 'invoiced']

    const handleStatusChange = (jobId: string, status: string) => {
        updateJob(jobId, { status })
        setJobs(getJobs())
    }

    const handleDelete = (jobId: string) => {
        deleteJob(jobId)
        setJobs(getJobs())
    }

    return (
        <div style={{ padding: '36px' }}>
            <h1 style={{ fontSize: '36px', fontWeight: '600', margin: '12px', color: 'var(--text)' }}>Jobs</h1>

            <div className='jobs-table'>
                <h3 className='ticket-headings'>
                    <div>Address</div>
                    <div>Name</div>
                    <div>Phone</div>
                    <div>Email</div>
                    <div>Status</div>
                    <div>Date</div>
                    <div>Remove</div>
                </h3>
                <div>
                    {jobs.length === 0 ? (
                        <p style={{ padding: '24px', color: '#6b7280' }}>No jobs yet. Click "New Job" to get started.</p>
                    ) : (
                        jobs.map((job) => (
                            <Link key={job.id} href={`/jobs/${job.id}`}>
                                <div className='ticket'>
                                    <p>{job.site_address}</p>
                                    <p>{job.customer.name}</p>
                                    <p>{job.customer.phone}</p>
                                    <p>{job.customer.email}</p>
                                    <div className='jobs-status'>
                                        <select
                                            value={job.status}
                                            onChange={(e) => {
                                                handleStatusChange(job.id, e.target.value)
                                                e.preventDefault()
                                                e.stopPropagation()
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                            style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #d1d5db', cursor: 'pointer' }}
                                        >
                                            {statusOptions.map(s => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <p>{formatDate(job.created_at)}</p>
                                    <div
                                        onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            handleDelete(job.id)
                                        }}
                                        style={{ cursor: 'pointer', color: '#ef4444' }}
                                    >
                                        Remove
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
