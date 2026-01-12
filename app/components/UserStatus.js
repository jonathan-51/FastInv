'use client'

import { createClient } from "@/lib/supabase"
import { useEffect, useState } from "react"

export default function UserStatus() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        // Get initial session
        const getUser = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            setUser(session?.user ?? null)
            setLoading(false)
        }

        getUser()

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [])

    if (loading) {
        return <div>Loading...</div>
    }

    if (!user) {
        return <div>Not logged in</div>
    }

    return (
        <div>
            <p>Logged in as: {user.email}</p>
        </div>
    )
}
