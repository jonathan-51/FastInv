'use client'

import { createContext, useContext, useState, ReactNode } from "react"
import { Billable } from "../../types"

// Define the structure of a photo
interface Photo {
  id: string
  url: string
  created_at: string
  job_id: string
}

// Define the complete job data structure
interface JobData {
  id: string
  site_address: string
  status: string
  created_at: string
  org_id: string
  customer: {
    name: string
    email: string
    phone: string
    address: string
  }
  billables: Billable[]
  photos: Photo[]
  notes?: string
}

// Context value type with helper functions
interface JobDataContextType {
  jobData: JobData
  setJobData: (data: JobData) => void
  // Helper function to update billables
  updateBillables: (billables: Billable[]) => void
  // Helper function to add a single billable
  addBillable: (billable: Billable) => void
  // Helper function to update photos
  updatePhotos: (photos: Photo[]) => void
}

const JobDataContext = createContext<JobDataContextType | undefined>(undefined)

export function JobDataProvider({
  children,
  initialJobData
}: {
  children: ReactNode
  initialJobData: JobData
}) {
  // Stores everything currently known about the current job
  const [jobData, setJobData] = useState<JobData>(initialJobData)

  // Helper function to update just the billables array
  const updateBillables = (billables: Billable[]) => {
    setJobData(prev => ({
      ...prev,
      billables
    }))
  }

  // Helper function to add a single billable (optimistic update)
  const addBillable = (billable: Billable) => {
    setJobData(prev => ({...prev, billables: [...prev.billables, billable]
    }))
  }

  // Helper function to update just the photos array
  const updatePhotos = (photos: Photo[]) => {
    setJobData(prev => ({
      ...prev,
      photos
    }))
  }

  return (
    <JobDataContext.Provider
      value={{
        jobData,
        setJobData,
        updateBillables,
        addBillable,
        updatePhotos
      }}
    >
      {children}
    </JobDataContext.Provider>
  )
}

export function useJobData() {
  const context = useContext(JobDataContext)
  if (!context) {
    throw new Error('useJobData must be used within JobDataProvider')
  }
  return context
}