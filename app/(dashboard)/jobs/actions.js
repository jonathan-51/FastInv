'use server'

import { createServerSupabaseClient } from "@/lib/supabase"


export async function getJobs() {

    const supabase = await createServerSupabaseClient()

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return { error: "You must be logged in to create an organization" }
    }

    const { data:orgData , error:orgError} = await supabase
        .from('memberships')
        .select('org_id')
        .eq('user_id',user.id)
        .limit(1)

    if (orgError) {
        console.error("Error getting org_id",orgError)
        return { error: "Error retrieving organization."}
    }

    if (!orgData || orgData.length === 0) {
        
        return { error: "No organization found for this user."}
    }

    // JOIN query to get jobs with customer data
    const { data:jobsData, error:jobsError} = await supabase
        .from('jobs')
        .select(`*,
            customer:customers (
                id,
                name,
                email,
                phone,
                address
            )
        `)
        .eq('org_id',orgData[0].org_id)
        .order('created_at', { ascending:false })

    if (jobsError) {
        return { error: jobsError}
    }


    
    return jobsData
}

export async function updateJobStatus(jobId,status) {
    const supabase = await createServerSupabaseClient()

    const { data: { user }, error: authError} = await supabase.auth.getUser()

    if (authError || !user) {
        return { error: "Unauthorized"}
    }

    const { data,error } = await supabase
        .from('jobs')
        .update({status:status})
        .eq('id',jobId)

    if (error) {
        return {error: error.message}
    }

    return { success: true }
}

export async function getOrganization() {
    const supabase = await createServerSupabaseClient()

    const { data:{ user },error:authError} = await supabase.auth.getUser()

    if (!user || authError) {
        return {error:'Unauthorized'}
    }

    const { data:orgData , error:orgError} = await supabase
        .from('memberships')
        .select('org_id')
        .eq('user_id',user.id)
        .limit(1)

    if (orgError) {
        console.error("Error getting org_id",orgError)
        return { error: "Error retrieving organization."}
    }

    if (!orgData || orgData.length === 0) {
        
        return { error: "No organization found for this user."}
    }

    const { data:organizationData,error:organizationError} = await supabase
        .from('organizations')
        .select('*')
        .eq('id',orgData[0].org_id)
        .single()

    if (organizationError) {
        return {error:organizationError.message}
    }

    if (!organizationData) {
        return {error:'No organization found for this user'}
    }

    return {data:organizationData}
}

export async function updateOrganization(field,value,org_id) {
    const supabase = await createServerSupabaseClient()

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return { error: "You must be logged in to create an organization" }
    }

    const { data,error } = await supabase
        .from('organizations')
        .update({[field]:value})
        .eq('id',org_id)
        .select()
        .single()

    if (error) {
        console.log(error.message)
        return {error: error.message}
    }

    if(!data) {
        
        return {error:'Error Saving'}
    }

    return { success: true }
}