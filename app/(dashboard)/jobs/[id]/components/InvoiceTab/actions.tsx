'use server'
import { createServerSupabaseClient } from "@/lib/supabase"

export async function updateInvoiceDates(
    invoiceID: string,
    issuedDate: string,
    dueDate: string
) {
    const supabase = await createServerSupabaseClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (!user || authError) {
        return { error: 'Unauthorized' }
    }

    const { data, error } = await supabase
        .from('invoices')
        .update({
            issued_date: issuedDate || null,
            due_date: dueDate || null
        })
        .eq('id', invoiceID)
        .select()
        .single()

    if (error) {
        console.error(error.message)
        return { error: 'Failed to update invoice dates' }
    }

    return data
}

