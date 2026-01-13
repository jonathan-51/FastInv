'use server'

import { createServerSupabaseClient } from "@/lib/supabase";


export async function signUp(formData) {

    const supabase = await createServerSupabaseClient()

    console.log(formData)
    const email = formData.email;
    const password = formData.password;
    const name = formData.name;

    if (!email || !password) {
        return { error:'Email and password are required'}
    }

    if (password.length < 6) {
        return {error: 'Password must be at least 6 characters'}
    }

    const { data:authData,error:authError} = await supabase.auth.signUp({
        email,
        password
    })

    if (authError) {
        return { error: authError.message}
    }

    // Creating new user in user table
    await supabase.from('users').insert({
        id: authData.user.id,
        email,
        name
    })



    return { success: true}
}