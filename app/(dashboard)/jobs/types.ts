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
    status:string
    created_at: string
    org_id: string
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
    org_id: string
}

export interface Invoice {
    id: string
    org_id: string
    job_id: string
    customer_id: string
    invoice_number: string
    status: string
    issued_date: string
    due_date: string
    total: string
    created_at: string
}

export interface Organization {
    id: string
    name:string
    slug:string
    created_at: string
    email:string
    country:string
    phone:string
    industry:string
    tax_number:string
    invite_code:string
    street:string
    suburb:string
    city:string
    state:string
    postcode:string
}