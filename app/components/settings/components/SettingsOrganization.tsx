'use client'
import { useBusinessDetails } from "@/app/context/BusinessDetailsContext"
import React from "react"
import { useState, useEffect } from "react"
import { BusinessDetails } from "@/app/(dashboard)/jobs/types"
import { useBillablesCategory } from "@/app/context/BillablesContext"

const EditIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
)

const CheckIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
)

const CloseIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
)

const emptyDetails: BusinessDetails = {
    name: '', email: '', phone: '', street: '', suburb: '',
    city: '', postcode: '', tax_number: '', bank_name: '',
    account_name: '', account_number: '',
}

export const SettingsOrganization = () => {
    const { businessDetails, setBusinessDetails } = useBusinessDetails()
    const { billableCategoryFields, typeMarkups, setTypeMarkup, getTypeMarkup } = useBillablesCategory()

    const [editingField, setEditingField] = useState<string | null>(null)
    const [currentValue, setCurrentValue] = useState<BusinessDetails>(emptyDetails)
    const [initialValue, setInitialValue] = useState<BusinessDetails>(emptyDetails)
    const [selectedCategory, setSelectedCategory] = useState(billableCategoryFields[0] || 'Labour')
    const [editingMarkup, setEditingMarkup] = useState(false)
    const [markupValue, setMarkupValue] = useState('')

    useEffect(() => {
        if (businessDetails) {
            setInitialValue(businessDetails)
            setCurrentValue(businessDetails)
        }
    }, [businessDetails])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentValue({ ...currentValue, [e.target.name]: e.target.value })
    }

    const handleSaveInput = (field: keyof BusinessDetails) => {
        const updated = { ...currentValue }
        setBusinessDetails(updated)
        setInitialValue(updated)
        setEditingField(null)
    }

    const handleCancelInput = () => {
        setCurrentValue(initialValue)
        setEditingField(null)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field: keyof BusinessDetails) => {
        if (e.key === 'Enter') handleSaveInput(field)
        else if (e.key === 'Escape') handleCancelInput()
    }

    const handleMarkupEdit = () => {
        const currentMarkup = getTypeMarkup(selectedCategory)
        setMarkupValue(((currentMarkup - 1) * 100).toFixed(0))
        setEditingMarkup(true)
    }

    const handleMarkupSave = () => {
        const percentValue = parseFloat(markupValue) || 0
        const multiplier = 1 + (percentValue / 100)
        setTypeMarkup(selectedCategory, multiplier)
        setEditingMarkup(false)
    }

    const handleMarkupCancel = () => {
        setEditingMarkup(false)
        setMarkupValue('')
    }

    const handleMarkupKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleMarkupSave()
        else if (e.key === 'Escape') handleMarkupCancel()
    }

    const renderField = (label: string, field: keyof BusinessDetails, placeholder: string) => (
        <div className='setting-form-group'>
            <label>{label}</label>
            {editingField === field ? (
                <div className="setting-editable-row">
                    <input
                        type="text"
                        name={field}
                        placeholder={placeholder}
                        value={currentValue[field] || ''}
                        onChange={handleInputChange}
                        onKeyDown={(e) => handleKeyDown(e, field)}
                        autoFocus
                    />
                    <div className="setting-action-buttons">
                        <button className="setting-icon-btn setting-icon-btn-save" onClick={() => handleSaveInput(field)} title="Save">
                            <CheckIcon />
                        </button>
                        <button className="setting-icon-btn setting-icon-btn-cancel" onClick={handleCancelInput} title="Cancel">
                            <CloseIcon />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="setting-editable-row">
                    <span className="setting-value">{currentValue[field] || <span className="setting-empty">Not set</span>}</span>
                    <button className="setting-icon-btn setting-icon-btn-edit" onClick={() => setEditingField(field)} disabled={editingField !== null} title="Edit">
                        <EditIcon />
                    </button>
                </div>
            )}
        </div>
    )

    return (
        <div className='setting-section'>
            <h2>Business Details</h2>
            <p className='setting-description'>These details appear on your invoices</p>

            <div className='setting-form'>
                {renderField('Business Name', 'name', 'ABC Construction')}
                {renderField('Email', 'email', 'info@example.co.nz')}
                {renderField('Phone', 'phone', '021 123 4567')}
                {renderField('Street Address', 'street', '123 Windmill Street')}
                {renderField('Suburb', 'suburb', 'New Windsor')}
                {renderField('City', 'city', 'Auckland')}
                {renderField('Postcode', 'postcode', '0212')}
                {renderField('Tax Number', 'tax_number', '123-456-789')}

                <div className="setting-section-divider" style={{ gridColumn: '1 / -1' }}>
                    <span>Payment Details</span>
                </div>

                {renderField('Bank Name', 'bank_name', 'ANZ New Zealand')}
                {renderField('Account Name', 'account_name', 'Your Business Name')}

                <div className='setting-form-group' style={{ gridColumn: '1 / -1' }}>
                    {renderField('Account Number', 'account_number', '01-0123-0456789-00')}
                </div>

                {/* Markup Settings */}
                <div className="setting-section-divider" style={{ gridColumn: '1 / -1' }}>
                    <span>Pricing</span>
                </div>

                <div className='setting-form-group' style={{ gridColumn: '1 / -1' }}>
                    <label>Billable Item Markup</label>
                    <div className="setting-markup-row">
                        <select
                            className="setting-select setting-markup-select"
                            value={selectedCategory}
                            onChange={(e) => {
                                setSelectedCategory(e.target.value)
                                setEditingMarkup(false)
                            }}
                            disabled={editingMarkup}
                        >
                            {billableCategoryFields.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                        {editingMarkup ? (
                            <div className="setting-editable-row">
                                <div className="setting-markup-input-wrapper">
                                    <input
                                        type="number"
                                        value={markupValue}
                                        onChange={(e) => setMarkupValue(e.target.value)}
                                        onKeyDown={handleMarkupKeyDown}
                                        autoFocus
                                        min="0"
                                        step="1"
                                    />
                                    <span className="setting-markup-suffix">%</span>
                                </div>
                                <div className="setting-action-buttons">
                                    <button className="setting-icon-btn setting-icon-btn-save" onClick={handleMarkupSave} title="Save">
                                        <CheckIcon />
                                    </button>
                                    <button className="setting-icon-btn setting-icon-btn-cancel" onClick={handleMarkupCancel} title="Cancel">
                                        <CloseIcon />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="setting-editable-row">
                                <span className="setting-value setting-markup-value">
                                    {((getTypeMarkup(selectedCategory) - 1) * 100).toFixed(0)}%
                                </span>
                                <button className="setting-icon-btn setting-icon-btn-edit" onClick={handleMarkupEdit} disabled={editingField !== null} title="Edit">
                                    <EditIcon />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
