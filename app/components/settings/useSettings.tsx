'use client'

import { useOrganization } from "@/app/context/OrganizationContext"
import { useState } from "react"

export const useSettings = () => {
    const { organization, setOrganization } = useOrganization()


    const [editingField, setEditingField] = useState<string | null>(null)
    const [initialValue, setInitialValue] = useState(organization)
    const [currentValue, setCurrentValue] = useState(organization)

    return {
        editingField,
        setEditingField,
        initialValue,
        setInitialValue,
        currentValue,
        setCurrentValue,
    }
}