'use server'

import { createClient } from "@supabase/supabase-js"
console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('KEY:', process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY?.slice(0, 20) + '...');
const supabase = createClient(

    
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function signUp(formData) {
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

    const { data:authData,error:authError} = await supabase.auth.createUser({
        email,
        password,
        email_confirm:true
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