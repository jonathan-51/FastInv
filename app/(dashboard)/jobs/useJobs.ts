import { useStatus } from "@/app/context/StatusContext"
import { useEffect, useState, useRef } from "react"

export const useJobs = () => {
    const [openJobsStatusID, setOpenJobsStatusID] = useState<string | null>(null)
    const { statusFields, setStatusFields } = useStatus()
    const statusDropDownRef = useRef<HTMLDivElement | null>(null)
    const jobsStatusButton = useRef<Record<string, HTMLDivElement | null>>({})
    const [currentJobsStatus, setCurrentJobsStatus] = useState<Record<string, string>>({})

    return {
        openJobsStatusID,
        setOpenJobsStatusID,
        jobsStatusButton,
        currentJobsStatus,
        setCurrentJobsStatus,
        statusFields,
        setStatusFields
    }
}
