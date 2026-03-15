import { createClient } from './supabase'
import { BusinessDetails } from '@/app/(dashboard)/jobs/types'

export async function fetchBusinessFromSupabase(): Promise<BusinessDetails | null> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
        .from('organizations')
        .select('name, email, phone, street, suburb, city, postcode, tax_number, bank_name, account_name, account_number')
        .eq('id', user.id)
        .single()

    if (error || !data) return null
    return data as BusinessDetails
}

export async function syncBusinessToSupabase(details: BusinessDetails): Promise<boolean> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    const { error } = await supabase
        .from('organizations')
        .upsert({ id: user.id, ...details })

        if (error) {
            console.log(error)
        }
    return !error
}

export async function signIn(email: string, password: string) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { user: data?.user || null, error: error?.message || null }
}

export async function signUp(email: string, password: string) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({ email, password })
    return { user: data?.user || null, error: error?.message || null }
}

export async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
}

export async function getUser() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user
}
