'use client'

import { useState, useEffect, useRef } from "react"
import CustomerSearch from './components/CustomerSearch'
import './customers.css'

interface Customer {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    address: string;
}

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([])
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editForm, setEditForm] = useState<Customer | null>(null)

    // Load customers from localStorage
    useEffect(() => {
        const savedCustomers = JSON.parse(localStorage.getItem('customers') || '[]')
        setCustomers(savedCustomers)
    }, [])

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

    const startEditing = (customer: Customer) => {
        setEditingId(customer.id)
        setEditForm({ ...customer })
    }

    const cancelEditing = () => {
        setEditingId(null)
        setEditForm(null)
    }

    const saveEditing = () => {
        if (!editForm) return
        setCustomers(customers.map(c => c.id === editForm.id ? editForm : c))
        setEditingId(null)
        setEditForm(null)
    }

    const deleteCustomer = (id: string) => {
        setCustomers(customers.filter(c => c.id !== id))
    }

    return (
        <div className="customers-page">
            <h1 className="customers-title">Customers</h1>
            <CustomerSearch />

            {customers.length === 0 ? (
                <div className="customers-empty">
                    <p>No customers yet. Add one to get started.</p>
                </div>
            ) : (
                <div className="customers-list">
                    {customers.map((customer) => (
                        <div key={customer.id} className="customer-card">
                            <div className="customer-info">
                                {editingId === customer.id && editForm ? (
                                    <div className="customer-name-edit">
                                        <input
                                            type="text"
                                            value={editForm.firstname}
                                            onChange={(e) => setEditForm({ ...editForm, firstname: e.target.value })}
                                            placeholder="First name"
                                        />
                                        <input
                                            type="text"
                                            value={editForm.lastname}
                                            onChange={(e) => setEditForm({ ...editForm, lastname: e.target.value })}
                                            placeholder="Last name"
                                        />
                                    </div>
                                ) : (
                                    <div className="customer-name">
                                        {customer.firstname} {customer.lastname}
                                    </div>
                                )}
                                <div className="customer-details">
                                    <div className="customer-detail">
                                        <span className="detail-label">Address</span>
                                        {editingId === customer.id && editForm ? (
                                            <input
                                                type="text"
                                                value={editForm.address}
                                                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                                                placeholder="Address"
                                                className="detail-input"
                                            />
                                        ) : (
                                            <span className="detail-value">{customer.address || '—'}</span>
                                        )}
                                    </div>
                                    <div className="customer-detail">
                                        <span className="detail-label">Email</span>
                                        {editingId === customer.id && editForm ? (
                                            <input
                                                type="email"
                                                value={editForm.email}
                                                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                                placeholder="Email"
                                                className="detail-input"
                                            />
                                        ) : (
                                            <span className="detail-value">{customer.email || '—'}</span>
                                        )}
                                    </div>
                                    <div className="customer-detail">
                                        <span className="detail-label">Phone</span>
                                        {editingId === customer.id && editForm ? (
                                            <input
                                                type="tel"
                                                value={editForm.phone}
                                                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                                placeholder="Phone"
                                                className="detail-input"
                                            />
                                        ) : (
                                            <span className="detail-value">{customer.phone || '—'}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="customer-actions">
                                {editingId === customer.id ? (
                                    <>
                                        <button className="btn-cancel" onClick={cancelEditing}>Cancel</button>
                                        <button className="btn-save" onClick={saveEditing}>Save</button>
                                    </>
                                ) : (
                                    <>
                                        <button className="btn-edit" onClick={() => startEditing(customer)}>Edit</button>
                                        <button className="btn-delete" onClick={() => deleteCustomer(customer.id)}>Delete</button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
