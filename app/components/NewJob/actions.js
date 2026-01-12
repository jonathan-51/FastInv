'use server'

import { createClient } from "@supabase/supabase-js"

const supabase = createClient (
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function NewJob(formData) {
    const name = formData.name;
    const email = formData.email;
    const phone = formData.phone;
    const address = formData.address;

    const { data: { user } } = await supabase.auth.getUser()

    if (!name) {
        return { error: "Name is required."}
    }


    if (user) {
      await supabase.from('jobs').insert({
        id: user.id,
        email,
        name,
        phone,
        address
    })  
    }

    

}