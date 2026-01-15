'use server'

import { createServerSupabaseClient } from "@/lib/supabase"
import crypto from 'crypto'

/**
 * Generate a unique invite code for organization invitations
 * Uses crypto.randomBytes for cryptographically secure random generation
 * Returns a 12-character uppercase code (e.g., "A7X9K2M4BVNQ")
 */
function generateInviteCode(): string {
    return crypto.randomBytes(9).toString('base64url').slice(0, 12).toUpperCase()
}

export async function OnboardingOrganizationPage(formData: {
    name: string;
    email: string;
    country: string;
    phone: string;
    address: string;
    industry: string;
    tax_number: string;
    invite_code: string;
}) {
    const { name, email, country, phone, address, industry, tax_number } = formData;

    // Validate required fields
    if (!name || !country) {
        return { error: "Business Name and Country are required" }
    }

    // Get the server-side Supabase client with cookie access
    const supabase = await createServerSupabaseClient()

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (authError || !user || !session) {
        return { error: "You must be logged in to create an organization" }
    }

    // Generate slug from business name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

    // Generate unique invite code for organization
    const inviteCode = generateInviteCode()

    // Insert organization into Supabase
    const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .insert({
            name,
            slug,
            invite_code: inviteCode,
            email: email || null,
            country,
            phone: phone || null,
            address: address || null,
            industry: industry || null,
            tax_number: tax_number || null,
        })
        .select()
        .single()

    if (orgError) {
        return { error: `Failed to create organization: ${orgError.message || 'Please try again.'}` }
    }

    // Create membership linking user to organization
    const { error: membershipError } = await supabase
        .from('memberships')
        .insert({
            user_id: user.id,
            org_id: orgData.id,
            role: 'owner',
        })

    if (membershipError) {
        return { error: `Failed to link user to organization: ${membershipError.message || 'Please try again.'}` }
    }

    return { data: orgData, success: true }
}

/**
 * Join an existing organization using an invite code
 * Validates the invite code and creates a membership for the user
 */
export async function JoinOrganization(inviteCode: string) {

    // Validate invite code format
    if (!inviteCode || inviteCode.trim().length === 0) {
        return { error: "Invite code is required" }
    }

    // Get the server-side Supabase client with cookie access
    const supabase = await createServerSupabaseClient()

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return { error: "You must be logged in to join an organization" }
    }

    // Find organization by invite code
    const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select('id, name')
        .eq('invite_code', inviteCode.trim().toUpperCase())
        .limit(1)

    if (orgError) {
        return { error: "Failed to validate invite code. Please try again." }
    }

    if (!orgData || orgData.length === 0) {
        return { error: "Invalid invite code. Please check the code and try again." }
    }

    const organization = orgData[0]

    // Check if user is already a member
    const { data: existingMembership } = await supabase
        .from('memberships')
        .select('user_id')
        .eq('user_id', user.id)
        .eq('org_id', organization.id)
        .limit(1)

    if (existingMembership && existingMembership.length > 0) {
        return { error: "You are already a member of this organization" }
    }

    // Create membership
    const { error: membershipError } = await supabase
        .from('memberships')
        .insert({
            user_id: user.id,
            org_id: organization.id,
            role: 'member',
        })

    if (membershipError) {
        return { error: "Failed to join organization. Please try again." }
    }

    return { success: true, organizationName: organization.name }
}