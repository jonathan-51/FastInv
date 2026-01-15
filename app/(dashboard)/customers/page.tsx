'use client'

import { useState, useEffect, useRef } from "react"
import Link from 'next/link'
import CustomerSearch from './components/CustomerSearch'
import './customers.css'

interface Customer {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    number: string;
    address: string;
    date: string;
}

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([])
    const [selectedCustomers, setSelectedCustomers] = useState<string[]>([])

    // Load customers from localStorage
    useEffect(() => {
        const savedCustomers = JSON.parse(localStorage.getItem('customers') || '[]')
        setCustomers(savedCustomers)
    }, [])

    // Function that handles selecting all rows
    const selectAllRows = () => {
        if (selectedCustomers.length === customers.length) {
            setSelectedCustomers([])
        } else {
            const unselectedCustomers = customers.map(customer => customer.id).filter(id => !selectedCustomers.includes(id))
            setSelectedCustomers([...selectedCustomers, ...unselectedCustomers])
        }
    }

    // Function that handles removing all selected customers
    const removeAllSelectedCustomers = () => {
        if (selectedCustomers.length === customers.length && selectedCustomers.length > 0) {
            setCustomers([])
        }
    }

    // Reference variable for first render check
    const isFirstRender = useRef(true)

    // Update localStorage when customers change
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            return
        }
        localStorage.setItem('customers', JSON.stringify(customers))
    }, [customers])

    return (
        <div style={{padding: '32px'}}>
            <h1 style={{fontSize: '36px', fontWeight: '600', margin: '12px', color: 'var(--text)'}}>Customers</h1>
            <CustomerSearch/>
            <div className='customers-table'>
                <h3 className='customer-table-headings'>
                    <div className='customer-select'
                    onClick={selectAllRows}
                    style={{backgroundColor: selectedCustomers.length === customers.length && selectedCustomers.length > 0 ? 'var(--selected-surface)' : 'var(--surface-1)'}}>
                        {selectedCustomers.length === customers.length && selectedCustomers.length > 0 ? '✓' : ''}
                    </div>
                    <div>Address</div>
                    <div>Name</div>
                    <div>Number</div>
                    <div>Email</div>
                    <div>Date</div>
                    <div className='customer-remove'
                    style={{cursor: selectedCustomers.length === customers.length && selectedCustomers.length > 0 ? 'pointer' : '', userSelect: 'none'}}
                    onClick={removeAllSelectedCustomers}>Remove</div>
                </h3>
                <div>
                    {customers.length === 0 ? (
                        <p>No Customers yet. Add one to get started</p>
                    ) : (
                        customers.map((customer) => (
                            <Link key={customer.id} href={`/customers/${customer.id}`}>
                                <div className='customer-row'
                                style={{backgroundColor: selectedCustomers.includes(customer.id) ? 'var(--selected-surface)' : 'var(--surface-1)'}}>
                                    <div className='customer-row-select'
                                    onClick={(e) => {
                                        selectedCustomers.includes(customer.id)
                                            ? setSelectedCustomers(selectedCustomers.filter(id => id !== customer.id))
                                            : setSelectedCustomers([...selectedCustomers, customer.id])
                                        e.preventDefault()
                                        e.stopPropagation()
                                    }}>
                                        {selectedCustomers.includes(customer.id) ? '✓' : ''}
                                    </div>
                                    <p>{customer.address}</p>
                                    <p>{customer.firstname} {customer.lastname}</p>
                                    <p>{customer.number}</p>
                                    <p>{customer.email}</p>
                                    <p>{customer.date}</p>
                                    <div onClick={(e) => {
                                        setCustomers(customers.filter(c => c.id !== customer.id))
                                        e.preventDefault()
                                        e.stopPropagation()
                                    }}>Remove</div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
