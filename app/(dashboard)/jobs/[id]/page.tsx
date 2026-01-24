import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase'
import { getBillableItems } from './components/BillablesTab/components/actions'
import ClientWrapper from './ClientWrapper'
import './job.css'
import { getJobDetailPage,getInvoiceByJobID } from './actions'


/**
 * Server Component that fetches job data directly from database
 * Runs on the server, so data is available immediately on page load
 */
export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {

    const { id } = await params
    const [job, invoiceData] = await Promise.all([getJobDetailPage(id),getInvoiceByJobID(id)])

    // If job not found, show error page
    if (!job || 'error' in job || invoiceData.error) {
        return (
            <div className="job-page job-state-container">
                <div className="job-error">
                    <div className="job-error-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                    </div>
                    <h2 className="job-error-title">Job Not Found</h2>
                    <p className="job-error-message">The job you're looking for doesn't exist or you don't have permission to view it.</p>
                    <a href="/jobs" className="job-error-link">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: '18px', height: '18px'}}>
                            <line x1="19" y1="12" x2="5" y2="12" />
                            <polyline points="12 19 5 12 12 5" />
                        </svg>
                        Back to Jobs
                    </a>
                </div>
            </div>
        )
    }

    // Fetch billable items for this job
    const billablesItems = await getBillableItems({
        jobID: job.id,
        orgID: job.org_id
    })

    // Handle case where getBillableItems returns an error object
    const billables = Array.isArray(billablesItems) ? billablesItems : []

    // Pass data to Client Component (including invoice data)
    return <ClientWrapper job={job} billablesItems={billables} invoiceData={invoiceData.data} />
}
