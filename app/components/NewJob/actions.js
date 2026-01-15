'use server'

import { createServerSupabaseClient } from "@/lib/supabase"

export async function NewJob(formData) {

    const name = formData.name;
    const email = formData.email
    const phone = formData.phone;
    const job_address = formData.job_address;
    const customer = formData.customer

    // Get the server-side Supabase client with cookie access
    const supabase = await createServerSupabaseClient()

    const { data: { user },error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return { error: "You must be logged in to join an organization"}
    }

    if (!name) {
        return { error: "Name is required."}
    }

    // Getting org_id for current authenticated user
    const { data: orgData, error:orgError} = await supabase
        .from('memberships')
        .select('org_id')
        .eq('user_id',user.id)
        .limit(1)

    if (orgError) {
        console.error("Error finding organization",orgError)
        return { error: "Failed to create new job. Please try again."}
    }

    if (!orgData || orgData.length === 0) {
        return { error: "Failed to create new job. Please try again." }
    }

    // organization ID
    const organization = orgData[0]

    const { data:customerData, error:customerError} = await supabase
        .from('customers')
        .insert({
            org_id:organization.org_id,
            name,
            email:email || null,
            phone: phone || null,
            address:null
        })
        .select('id')
        .single()

    if (customerError) {
        console.error("Error inserting customer",customerError)
        return { error: "Failed to create new job. Please try again."}
    }

    if (!customerData) {
        return { error: "Failed to create new job. Please try again."}
    }

    const { error:jobsError } = await supabase
        .from('jobs')
        .insert({
            org_id:organization.org_id,
            customer_id:customerData.id,
            title:name,
            site_address:job_address
        })

    if (jobsError) {
        console.error("Error inserting job",jobsError)
        return { error: "Failed to create new job. Please try again."}
    }
    return { success:true }
}