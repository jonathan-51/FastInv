'use server'

import { createServerSupabaseClient } from "@/lib/supabase";


export async function login(formData) {

    const supabase = await createServerSupabaseClient()

    const { data:authData,error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password:formData.password
    });

    if (error) {
        return {error:error.message}
    }

    return { success:true,authData}
}