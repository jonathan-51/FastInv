'use server'

import { createServerSupabaseClient } from "@/lib/supabase"
import { time } from "node:console"

export async function uploadPhoto(formData:FormData) {
    const supabase = await createServerSupabaseClient()

    // Get Authorized user

    const { data: { user }, error:authError} = await supabase.auth.getUser()

    if (!user || authError) {
        return { error: 'Unauthorized'}
    }

    const file = formData.get('file') as File
    const jobID = formData.get('jobID') as string
    const orgID = formData.get('orgID') as string

    if (!file || !jobID) {
        return { error: 'Missing file or job ID'}
    }

    // Create unique file path: org_id/job_id/timestamp_filename
    const timestamp = Date.now()
    const filePath = `${orgID}/${jobID}/${timestamp}_${file.name}`

    // Upload to Storage Bucket
    const { data: storageData, error: storageError } = await supabase.storage
        .from('job-photos')
        .upload(filePath,file,{
            cacheControl:'3600',
            upsert:false
        })

    if (storageError) {
        return { error: storageError.message }
    }

    // Get Public URL
    const { data: { publicUrl } } = supabase.storage
        .from('job-photos')
        .getPublicUrl(filePath)

    // Insert into photos table
    const { data, error } = await supabase
        .from('job_photos')
        .insert({
            org_id:orgID,
            job_id:jobID,
            file_path:filePath,
            file_name:file.name,
            content_type:file.type,
            size_bytes:file.size,
            created_by:user.id
        })
        .select()
        .single()

    if (error) {
        return { error: error.message}
    }

    if (!data) {
        return {error:'No data found'}
    }

    return {
        data: {
            ...data,
            publicUrl
        }
    }
}   

export async function getPhotos(jobID: string) {
    const supabase = await createServerSupabaseClient()


    const { data: { user }, error:authError } = await supabase.auth.getUser()

    if (!user || authError) {
        return {error: 'Unauthorized'}
    }

    const { data,error } = await supabase
        .from('job_photos')
        .select('*')
        .eq('job_id',jobID)
        .order('created_at', {ascending:false})

    if (error) {
        return { error: error.message}
    }

    // Add public URLs to each photo
    const photosWithUrls = data.map(photo => ({
        ...photo,
        publicUrl: supabase.storage
            .from('job_photos')
            .getPublicUrl(photo.file_path).data.publicUrl
    }))

    return { data: photosWithUrls}
}

export async function deletePhoto(photoID: string, filePath: string) {
    const supabase = await createServerSupabaseClient()

    const { data: { user },error:authError } = await supabase.auth.getUser()

    if (!user || authError) {
        return { error: 'Unauthorized'}
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
        .from('job-photos')
        .remove([filePath])

    if (storageError) {
        return { error: storageError.message}
    }

    // Delete from database
    const { error } = await supabase
        .from('job_photos')
        .delete()
        .eq('id', photoID)

    if (error) {
        return { error: error.message}
    }

    return { sucess:true }
}