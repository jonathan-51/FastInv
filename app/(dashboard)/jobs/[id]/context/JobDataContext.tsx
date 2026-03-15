'use client'

import { createContext, useContext, useState, ReactNode } from "react"
import { Billable,Invoice } from "../../types"

// Define the complete job data structure
interface JobData {
  id: string
  site_address: string
  status: string
  created_at: string
  customer: {
    id: string
    name: string
    email: string
    phone: string
    address: string
  }
  billables: Billable[]
  photos: never[]
  notes?: string
  invoice: Invoice | null
}



interface JobDataContextType {
  jobData: JobData
  setJobData: (data: JobData) => void
  updateBillables: (billables: Billable[]) => void
  addBillable: (billable: Billable) => void
  removeBillable: (id: string) => void
  updateInvoice: (invoice: Invoice | null) => void
  updateInvoiceDates: (issuedDate: string, dueDate: string) => void
}

const JobDataContext = createContext<JobDataContextType | undefined>(undefined)

export function JobDataProvider({children,initialJobData}: {children: ReactNode,initialJobData: JobData}) {
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

  // Remove a single billable by id
  const removeBillable = (id: string) => {
    setJobData(prev => ({
      ...prev,
      billables: prev.billables.filter(b => b.id !== id)
    }))
  }

  // Helper function to update the invoice
  const updateInvoice = (invoice: Invoice | null) => {
    setJobData(prev => ({
      ...prev,
      invoice
    }))
  }

  // Helper function to update invoice dates
  const updateInvoiceDates = (issuedDate: string, dueDate: string) => {
    setJobData(prev => {
      if (!prev.invoice) return prev
      return {
        ...prev,
        invoice: {
          ...prev.invoice,
          issued_date: issuedDate,
          due_date: dueDate
        }
      }
    })
  }

  return (
    <JobDataContext.Provider
      value={{
        jobData,
        setJobData,
        updateBillables,
        addBillable,
        removeBillable,
        updateInvoice,
        updateInvoiceDates
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