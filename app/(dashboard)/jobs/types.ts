export interface Customer {
    id: string
    name: string
    email: string
    phone: string
    address: string
}

export interface Job {
    id: string
    site_address: string
    status: string
    created_at: string
    customer: Customer
}

export interface Billable {
    id: string
    description: string
    type: string
    quantity: number
    unit: string
    unit_price: number
    amount: number
    job_id: string
}

export interface Invoice {
    id: string
    job_id: string
    invoice_number: string
    status: string
    issued_date: string
    due_date: string
    total: string
    created_at: string
}

export interface BusinessDetails {
    name: string
    email: string
    phone: string
    street: string
    suburb: string
    city: string
    postcode: string
    tax_number: string
    bank_name: string
    account_name: string
    account_number: string
}