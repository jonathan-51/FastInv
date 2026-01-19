'use server'

import { createServerSupabaseClient } from "@/lib/supabase"

export async function addItem(formData:FormData) {

    const supabase = await createServerSupabaseClient()

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (!user || authError) {
        return { error:'Unauthorized'}
    }
    
    const description = formData.get('description') as string
    const type = formData.get('type') as string
    const quantity = parseFloat(formData.get('quantity') as string)
    const unit = formData.get('unit') as string
    const unit_price = parseFloat(formData.get('unit_price') as string)
    const jobID = formData.get('jobID') as string
    const orgID = formData.get('orgID') as string


    const { data:billableItemsData,error:billableItemsError} = await supabase
        .from('billable_items')
        .insert({
            job_id:jobID,
            org_id:orgID,
            type,
            description,
            quantity,
            unit,
            unit_price
        })
        .select()
        .single()

    if (billableItemsError) {
        console.error(billableItemsError.message)
        return {error:"Error encountered. Please try again."}
    }

    return billableItemsData
}

export async function getBillableItems({jobID,orgID}:{jobID:string,orgID:string}) {
    const supabase = await createServerSupabaseClient()

    const { data:{ user },error:authError} = await supabase.auth.getUser()

    if (!user || authError) {
        return { error: "Unauthorized"}
    }

    const { data:billableItemsData, error:billableItemsError } = await supabase
        .from('billable_items')
        .select('*')
        .eq('job_id', jobID)
        .eq('org_id', orgID)

    if (billableItemsError) {
        console.error(billableItemsError.message)
        return { error: "Failed to fetch items" }
    }

    return billableItemsData
}