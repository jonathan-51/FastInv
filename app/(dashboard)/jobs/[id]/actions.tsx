'use server'
import { createServerSupabaseClient } from "@/lib/supabase"



export async function getJobDetailPage(id:string) {
    const supabase = await createServerSupabaseClient()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return {error: "Unauthorized"}
    }

    // Fetch the specific job by ID with customer data
    const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .select(`
            *,
            customer:customers (
                id,
                name,
                email,
                phone,
                address
            )
        `)
        .eq('id', id)
        .single()

    if (!jobData || jobError ) {
        return {error: "Error retrieving job"}
    }
    return jobData
}

export async function getInvoiceByJobID(jobID:string) {
    const supabase = await createServerSupabaseClient()

    const { data:user,error:authError} = await supabase.auth.getUser()

    if (!user || authError) {
        return {error: "Unauthorized"}
    }

    const { data:invoiceData,error:invoiceError} = await supabase
        .from('invoices')
        .select('*')
        .eq('job_id',jobID)
        .single()

    // PGRST116 is the error code for "no rows returned"
    // This is expected when no invoice exists yet
    if (invoiceError && invoiceError.code === 'PGRST116' ) {
        return { data: null, error: null} // No invoice exists
    }

    if (invoiceError) {
        return { error:invoiceError.message}
    }

    return {data: invoiceData, error:null}
}

export async function storeInvoice(invoiceData: {
    org_id:string
    job_id:string
    customer_id:string
    invoice_number: string
    status: string
    issued_date: string
    due_date: string
    total: number
}) {

    const supabase = await createServerSupabaseClient()

    const { data:{user},error:authError} = await supabase.auth.getUser()

    if (!user || authError) {
        return { error: 'Unauthorized' }
    }

     // Check if invoice already exists for this job
    const { data: existing } = await supabase
    .from('invoices')
    .select()
    .eq('job_id', invoiceData.job_id)
    .single()

    if (existing) {
    return { error: 'Invoice already exists for this job' }

    }

    const { data: receivedInvoiceData, error: receivedInvoiceDataError } = await supabase
        .from('invoices')
        .insert({
            org_id: invoiceData.org_id,
            job_id: invoiceData.job_id,
            customer_id: invoiceData.customer_id,
            invoice_number: invoiceData.invoice_number || null,
            status: invoiceData.status || null,
            issued_date: invoiceData.issued_date || null,
            due_date: invoiceData.due_date || null,
            total: invoiceData.total
        })
        .select()
        .single()

    if (receivedInvoiceDataError) {
        console.error(receivedInvoiceDataError.message)
        return { error: 'Error creating invoice. Please try again.' }
    }

    return receivedInvoiceData
}