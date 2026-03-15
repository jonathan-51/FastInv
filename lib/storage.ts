import { Job, Billable, Invoice, BusinessDetails, Customer } from '@/app/(dashboard)/jobs/types'

const KEYS = {
    jobs: 'fastinv_jobs',
    billables: (jobId: string) => `fastinv_billables_${jobId}`,
    invoice: (jobId: string) => `fastinv_invoice_${jobId}`,
    business: 'fastinv_business',
}

// --- Jobs ---

export function getJobs(): Job[] {
    const data = localStorage.getItem(KEYS.jobs)
    return data ? JSON.parse(data) : []
}

export function getJob(id: string): Job | null {
    const jobs = getJobs()
    return jobs.find(j => j.id === id) || null
}

export function createJob(customer: Customer, siteAddress: string): Job {
    const job: Job = {
        id: crypto.randomUUID(),
        site_address: siteAddress,
        status: 'quoted',
        created_at: new Date().toISOString(),
        customer,
    }
    const jobs = getJobs()
    jobs.push(job)
    localStorage.setItem(KEYS.jobs, JSON.stringify(jobs))
    return job
}

export function updateJob(id: string, updates: Partial<Job>): Job | null {
    const jobs = getJobs()
    const index = jobs.findIndex(j => j.id === id)
    if (index === -1) return null
    jobs[index] = { ...jobs[index], ...updates }
    localStorage.setItem(KEYS.jobs, JSON.stringify(jobs))
    return jobs[index]
}

export function deleteJob(id: string): void {
    const jobs = getJobs().filter(j => j.id !== id)
    localStorage.setItem(KEYS.jobs, JSON.stringify(jobs))
    localStorage.removeItem(KEYS.billables(id))
    localStorage.removeItem(KEYS.invoice(id))
}

// --- Billables ---

export function getBillables(jobId: string): Billable[] {
    const data = localStorage.getItem(KEYS.billables(jobId))
    return data ? JSON.parse(data) : []
}

export function addBillable(jobId: string, billable: Omit<Billable, 'id' | 'job_id'>): Billable {
    const newBillable: Billable = {
        ...billable,
        id: crypto.randomUUID(),
        job_id: jobId,
    }
    const billables = getBillables(jobId)
    billables.push(newBillable)
    localStorage.setItem(KEYS.billables(jobId), JSON.stringify(billables))
    return newBillable
}

export function updateBillable(jobId: string, id: string, updates: Partial<Billable>): Billable | null {
    const billables = getBillables(jobId)
    const index = billables.findIndex(b => b.id === id)
    if (index === -1) return null
    billables[index] = { ...billables[index], ...updates }
    localStorage.setItem(KEYS.billables(jobId), JSON.stringify(billables))
    return billables[index]
}

export function deleteBillable(jobId: string, id: string): void {
    const billables = getBillables(jobId).filter(b => b.id !== id)
    localStorage.setItem(KEYS.billables(jobId), JSON.stringify(billables))
}

// --- Invoice ---

export function getInvoice(jobId: string): Invoice | null {
    const data = localStorage.getItem(KEYS.invoice(jobId))
    return data ? JSON.parse(data) : null
}

export function createInvoice(jobId: string): Invoice {
    const invoice: Invoice = {
        id: crypto.randomUUID(),
        job_id: jobId,
        invoice_number: generateInvoiceNumber(),
        status: 'draft',
        issued_date: new Date().toISOString().split('T')[0],
        due_date: '',
        total: '0',
        created_at: new Date().toISOString(),
    }
    localStorage.setItem(KEYS.invoice(jobId), JSON.stringify(invoice))
    return invoice
}

export function updateInvoice(jobId: string, updates: Partial<Invoice>): Invoice | null {
    const invoice = getInvoice(jobId)
    if (!invoice) return null
    const updated = { ...invoice, ...updates }
    localStorage.setItem(KEYS.invoice(jobId), JSON.stringify(updated))
    return updated
}

// --- Business Details ---

export function getBusinessDetails(): BusinessDetails | null {
    const data = localStorage.getItem(KEYS.business)
    return data ? JSON.parse(data) : null
}

export function saveBusinessDetails(details: BusinessDetails): void {
    localStorage.setItem(KEYS.business, JSON.stringify(details))
}

// --- Helpers ---

function generateInvoiceNumber(): string {
    const year = new Date().getFullYear()
    const jobs = getJobs()
    let maxNum = 0
    for (const job of jobs) {
        const inv = getInvoice(job.id)
        if (inv?.invoice_number) {
            const match = inv.invoice_number.match(/INV-\d+-(\d+)/)
            if (match) maxNum = Math.max(maxNum, parseInt(match[1]))
        }
    }
    return `INV-${year}-${String(maxNum + 1).padStart(4, '0')}`
}
