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