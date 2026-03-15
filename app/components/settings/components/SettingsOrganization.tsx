'use client'
import { useOrganization } from "@/app/context/OrganizationContext"
import React from "react"
import { useState, useEffect } from "react"
import { updateOrganization } from "@/app/(dashboard)/jobs/actions"
import { useSettings } from "../useSettings"
import { Organization } from "@/app/(dashboard)/jobs/types"
import { useBillablesCategory } from "@/app/context/BillablesContext"


// Icon components
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

export const SettingsOrganization = () => {
    const { organization, setOrganization } = useOrganization()
    const { billableCategoryFields, typeMarkups, setTypeMarkup, getTypeMarkup } = useBillablesCategory()

    const {
        editingField,
        setEditingField,
        currentValue,
        setCurrentValue,
        initialValue,
        setInitialValue,} = useSettings()

    const [isSaving, setIsSaving] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState(billableCategoryFields[0] || 'Labour')
    const [editingMarkup, setEditingMarkup] = useState(false)
    const [markupValue, setMarkupValue] = useState('')

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
        if (e.key === 'Enter') {
            handleMarkupSave()
        } else if (e.key === 'Escape') {
            handleMarkupCancel()
        }
    }

    useEffect(() => {
        if (!organization) return
        setInitialValue(organization)
        setCurrentValue(organization)
    }, [organization])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!organization || !currentValue) return
        setCurrentValue({...currentValue, [e.target.name]: e.target.value})
    }

    const handleSaveInput = async (field: keyof Organization) => {
        if (!organization || !currentValue) return
        setIsSaving(true)

        const result = await updateOrganization(field, currentValue[field], organization.id)
        if (result.error) {
            setIsSaving(false)
            return
        }
        setOrganization({ ...organization, [field]: currentValue[field] })
        setInitialValue(currentValue)
        setEditingField(null)
        setIsSaving(false)
    }

    const handleCancelInput = () => {
        if (!organization) return
        setCurrentValue(initialValue)
        setEditingField(null)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field: keyof Organization) => {
        if (e.key === 'Enter') {
            handleSaveInput(field)
        } else if (e.key === 'Escape') {
            handleCancelInput()
        }
    }

    return (
        <div className='setting-section'>
            <h2>Organization Settings</h2>
            <p className='setting-description'>Manage your organization details</p>

            <div className='setting-form'>
                <div className='setting-form-group'>
                    <label>Organization Name</label>
                    {editingField === 'name' ? (
                        <div className="setting-editable-row">
                            <input
                                type="text"
                                name="name"
                                placeholder="ABC Construction"
                                value={currentValue?.name || ''}
                                onChange={handleInputChange}
                                onKeyDown={(e) => handleKeyDown(e, 'name')}
                                autoFocus
                            />
                            <div className="setting-action-buttons">
                                <button
                                    className="setting-icon-btn setting-icon-btn-save"
                                    onClick={() => handleSaveInput('name')}
                                    disabled={isSaving}
                                    title="Save"
                                >
                                    <CheckIcon />
                                </button>
                                <button
                                    className="setting-icon-btn setting-icon-btn-cancel"
                                    onClick={handleCancelInput}
                                    disabled={isSaving}
                                    title="Cancel"
                                >
                                    <CloseIcon />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="setting-editable-row">
                            <span className="setting-value">{currentValue?.name}</span>
                            <button
                                className="setting-icon-btn setting-icon-btn-edit"
                                onClick={() => setEditingField('name')}
                                disabled={editingField !== null}
                                title="Edit"
                            >
                                <EditIcon />
                            </button>
                        </div>
                    )}
                </div>

                <div className='setting-form-group'>
                    <label>Country</label>
                    <select
                        name="country"
                        value={currentValue?.country || 'New Zealand'}
                        onChange={async (e) => {
                            if (!organization || !currentValue) return
                            const newValue = e.target.value
                            setCurrentValue({...currentValue, country: newValue})
                            await updateOrganization('country', newValue, organization.id)
                            setOrganization({...organization, country: newValue})
                        }}
                        className="setting-select"
                        disabled={editingField !== null}
                    >
                        <option value="New Zealand">New Zealand</option>
                        <option value="Australia">Australia</option>
                    </select>
                </div>

                <div className='setting-form-group'>
                    <label>Street Address</label>
                    {editingField === 'street' ? (
                        <div className="setting-editable-row">
                            <input
                                type="text"
                                name="street"
                                placeholder="123 Windmill Street"
                                value={currentValue?.street || ''}
                                onChange={handleInputChange}
                                onKeyDown={(e) => handleKeyDown(e, 'street')}
                                autoFocus
                            />
                            <div className="setting-action-buttons">
                                <button
                                    className="setting-icon-btn setting-icon-btn-save"
                                    onClick={() => handleSaveInput('street')}
                                    disabled={isSaving}
                                    title="Save"
                                >
                                    <CheckIcon />
                                </button>
                                <button
                                    className="setting-icon-btn setting-icon-btn-cancel"
                                    onClick={handleCancelInput}
                                    disabled={isSaving}
                                    title="Cancel"
                                >
                                    <CloseIcon />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="setting-editable-row">
                            <span className="setting-value" >{currentValue?.street}</span>
                            <button
                                className="setting-icon-btn setting-icon-btn-edit"
                                onClick={() => setEditingField('street')}
                                disabled={editingField !== null}
                                title="Edit"
                            >
                                <EditIcon />
                            </button>
                        </div>
                    )}
                </div>

                <div className='setting-form-group'>
                    <label>Suburb</label>
                    {editingField === 'suburb' ? (
                        <div className="setting-editable-row">
                            <input
                                type="text"
                                name="suburb"
                                placeholder="New Windsor"
                                value={currentValue?.suburb || ''}
                                onChange={handleInputChange}
                                onKeyDown={(e) => handleKeyDown(e, 'suburb')}
                                autoFocus
                            />
                            <div className="setting-action-buttons">
                                <button
                                    className="setting-icon-btn setting-icon-btn-save"
                                    onClick={() => handleSaveInput('suburb')}
                                    disabled={isSaving}
                                    title="Save"
                                >
                                    <CheckIcon />
                                </button>
                                <button
                                    className="setting-icon-btn setting-icon-btn-cancel"
                                    onClick={handleCancelInput}
                                    disabled={isSaving}
                                    title="Cancel"
                                >
                                    <CloseIcon />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="setting-editable-row">
                            <span className="setting-value" >{currentValue?.suburb}</span>
                            <button
                                className="setting-icon-btn setting-icon-btn-edit"
                                onClick={() => setEditingField('suburb')}
                                disabled={editingField !== null}
                                title="Edit"
                            >
                                <EditIcon />
                            </button>
                        </div>
                    )}
                </div>  

                {currentValue?.country === 'New Zealand' && (
                    <div className='setting-form-group'>
                        <label>City</label>
                        {editingField === 'city' ? (
                            <div className="setting-editable-row">
                                <input
                                    type="text"
                                    name="city"
                                    placeholder="Auckland"
                                    value={currentValue?.city || ''}
                                    onChange={handleInputChange}
                                    onKeyDown={(e) => handleKeyDown(e, 'city')}
                                    autoFocus
                                />
                                <div className="setting-action-buttons">
                                    <button
                                        className="setting-icon-btn setting-icon-btn-save"
                                        onClick={() => handleSaveInput('city')}
                                        disabled={isSaving}
                                        title="Save"
                                    >
                                        <CheckIcon />
                                    </button>
                                    <button
                                        className="setting-icon-btn setting-icon-btn-cancel"
                                        onClick={handleCancelInput}
                                        disabled={isSaving}
                                        title="Cancel"
                                    >
                                        <CloseIcon />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="setting-editable-row">
                                <span className="setting-value">{currentValue?.city}</span>
                                <button
                                    className="setting-icon-btn setting-icon-btn-edit"
                                    onClick={() => setEditingField('city')}
                                    disabled={editingField !== null}
                                    title="Edit"
                                >
                                    <EditIcon />
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {currentValue?.country === 'Australia' && (
                    <div className='setting-form-group'>
                        <label>State</label>
                        {editingField === 'state' ? (
                            <div className="setting-editable-row">
                                <select
                                    name="state"
                                    value={currentValue?.state || ''}
                                    onChange={async (e) => {
                                        if (!organization || !currentValue) return
                                        const newValue = e.target.value
                                        setCurrentValue({...currentValue, state: newValue})
                                        await updateOrganization('state', newValue, organization.id)
                                        setOrganization({...organization, state: newValue})
                                        setEditingField(null)
                                    }}
                                    autoFocus
                                    className="setting-select"
                                >
                                    <option value="">Select state</option>
                                    <option value="NSW">NSW</option>
                                    <option value="VIC">VIC</option>
                                    <option value="QLD">QLD</option>
                                    <option value="SA">SA</option>
                                    <option value="WA">WA</option>
                                    <option value="TAS">TAS</option>
                                    <option value="NT">NT</option>
                                    <option value="ACT">ACT</option>
                                </select>
                                <button
                                    className="setting-icon-btn setting-icon-btn-cancel"
                                    onClick={handleCancelInput}
                                    disabled={isSaving}
                                    title="Cancel"
                                >
                                    <CloseIcon />
                                </button>
                            </div>
                        ) : (
                            <div className="setting-editable-row">
                                <span className="setting-value">{currentValue?.state}</span>
                                <button
                                    className="setting-icon-btn setting-icon-btn-edit"
                                    onClick={() => setEditingField('state')}
                                    disabled={editingField !== null}
                                    title="Edit"
                                >
                                    <EditIcon />
                                </button>
                            </div>
                        )}
                    </div>
                )}

                <div className='setting-form-group'>
                    <label>Postcode</label>
                    {editingField === 'postcode' ? (
                        <div className="setting-editable-row">
                            <input
                                type="text"
                                name="postcode"
                                placeholder="0212"
                                value={currentValue?.postcode || ''}
                                onChange={handleInputChange}
                                onKeyDown={(e) => handleKeyDown(e, 'postcode')}
                                autoFocus
                            />
                            <div className="setting-action-buttons">
                                <button
                                    className="setting-icon-btn setting-icon-btn-save"
                                    onClick={() => handleSaveInput('postcode')}
                                    disabled={isSaving}
                                    title="Save"
                                >
                                    <CheckIcon />
                                </button>
                                <button
                                    className="setting-icon-btn setting-icon-btn-cancel"
                                    onClick={handleCancelInput}
                                    disabled={isSaving}
                                    title="Cancel"
                                >
                                    <CloseIcon />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="setting-editable-row">
                            <span className="setting-value" >{currentValue?.postcode}</span>
                            <button
                                className="setting-icon-btn setting-icon-btn-edit"
                                onClick={() => setEditingField('postcode')}
                                disabled={editingField !== null}
                                title="Edit"
                            >
                                <EditIcon />
                            </button>
                        </div>
                    )}
                </div>

                <div className='setting-form-group'>
                    <label>Email</label>
                    {editingField === 'email' ? (
                        <div className="setting-editable-row">
                            <input
                                type="email"
                                name="email"
                                placeholder="info@aklplumbing.co.nz"
                                value={currentValue?.email || ''}
                                onChange={handleInputChange}
                                onKeyDown={(e) => handleKeyDown(e, 'email')}
                                autoFocus
                            />
                            <div className="setting-action-buttons">
                                <button
                                    className="setting-icon-btn setting-icon-btn-save"
                                    onClick={() => handleSaveInput('email')}
                                    disabled={isSaving}
                                    title="Save"
                                >
                                    <CheckIcon />
                                </button>
                                <button
                                    className="setting-icon-btn setting-icon-btn-cancel"
                                    onClick={handleCancelInput}
                                    disabled={isSaving}
                                    title="Cancel"
                                >
                                    <CloseIcon />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="setting-editable-row">
                            <span className="setting-value" >{currentValue?.email}</span>
                            <button
                                className="setting-icon-btn setting-icon-btn-edit"
                                onClick={() => setEditingField('email')}
                                disabled={editingField !== null}
                                title="Edit"
                            >
                                <EditIcon />
                            </button>
                        </div>
                    )}
                </div>

                {/* Payment Details Section */}
                <div className="setting-section-divider" style={{ gridColumn: '1 / -1' }}>
                    <span>Payment Details</span>
                </div>

                <div className='setting-form-group'>
                    <label>Bank Name</label>
                    {editingField === 'bank_name' ? (
                        <div className="setting-editable-row">
                            <input
                                type="text"
                                name="bank_name"
                                placeholder="ANZ New Zealand"
                                value={currentValue?.bank_name || ''}
                                onChange={handleInputChange}
                                onKeyDown={(e) => handleKeyDown(e, 'bank_name')}
                                autoFocus
                            />
                            <div className="setting-action-buttons">
                                <button
                                    className="setting-icon-btn setting-icon-btn-save"
                                    onClick={() => handleSaveInput('bank_name')}
                                    disabled={isSaving}
                                    title="Save"
                                >
                                    <CheckIcon />
                                </button>
                                <button
                                    className="setting-icon-btn setting-icon-btn-cancel"
                                    onClick={handleCancelInput}
                                    disabled={isSaving}
                                    title="Cancel"
                                >
                                    <CloseIcon />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="setting-editable-row">
                            <span className="setting-value">{currentValue?.bank_name || <span className="setting-empty">Not set</span>}</span>
                            <button
                                className="setting-icon-btn setting-icon-btn-edit"
                                onClick={() => setEditingField('bank_name')}
                                disabled={editingField !== null}
                                title="Edit"
                            >
                                <EditIcon />
                            </button>
                        </div>
                    )}
                </div>

                <div className='setting-form-group'>
                    <label>Account Name</label>
                    {editingField === 'account_name' ? (
                        <div className="setting-editable-row">
                            <input
                                type="text"
                                name="account_name"
                                placeholder="Your Business Name"
                                value={currentValue?.account_name || ''}
                                onChange={handleInputChange}
                                onKeyDown={(e) => handleKeyDown(e, 'account_name')}
                                autoFocus
                            />
                            <div className="setting-action-buttons">
                                <button
                                    className="setting-icon-btn setting-icon-btn-save"
                                    onClick={() => handleSaveInput('account_name')}
                                    disabled={isSaving}
                                    title="Save"
                                >
                                    <CheckIcon />
                                </button>
                                <button
                                    className="setting-icon-btn setting-icon-btn-cancel"
                                    onClick={handleCancelInput}
                                    disabled={isSaving}
                                    title="Cancel"
                                >
                                    <CloseIcon />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="setting-editable-row">
                            <span className="setting-value">{currentValue?.account_name || <span className="setting-empty">Not set</span>}</span>
                            <button
                                className="setting-icon-btn setting-icon-btn-edit"
                                onClick={() => setEditingField('account_name')}
                                disabled={editingField !== null}
                                title="Edit"
                            >
                                <EditIcon />
                            </button>
                        </div>
                    )}
                </div>

                <div className='setting-form-group' style={{ gridColumn: '1 / -1' }}>
                    <label>Account Number</label>
                    {editingField === 'account_number' ? (
                        <div className="setting-editable-row">
                            <input
                                type="text"
                                name="account_number"
                                placeholder="01-0123-0456789-00"
                                value={currentValue?.account_number || ''}
                                onChange={handleInputChange}
                                onKeyDown={(e) => handleKeyDown(e, 'account_number')}
                                autoFocus
                            />
                            <div className="setting-action-buttons">
                                <button
                                    className="setting-icon-btn setting-icon-btn-save"
                                    onClick={() => handleSaveInput('account_number')}
                                    disabled={isSaving}
                                    title="Save"
                                >
                                    <CheckIcon />
                                </button>
                                <button
                                    className="setting-icon-btn setting-icon-btn-cancel"
                                    onClick={handleCancelInput}
                                    disabled={isSaving}
                                    title="Cancel"
                                >
                                    <CloseIcon />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="setting-editable-row">
                            <span className="setting-value">{currentValue?.account_number || <span className="setting-empty">Not set</span>}</span>
                            <button
                                className="setting-icon-btn setting-icon-btn-edit"
                                onClick={() => setEditingField('account_number')}
                                disabled={editingField !== null}
                                title="Edit"
                            >
                                <EditIcon />
                            </button>
                        </div>
                    )}
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
                                    <button
                                        className="setting-icon-btn setting-icon-btn-save"
                                        onClick={handleMarkupSave}
                                        title="Save"
                                    >
                                        <CheckIcon />
                                    </button>
                                    <button
                                        className="setting-icon-btn setting-icon-btn-cancel"
                                        onClick={handleMarkupCancel}
                                        title="Cancel"
                                    >
                                        <CloseIcon />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="setting-editable-row">
                                <span className="setting-value setting-markup-value">
                                    {((getTypeMarkup(selectedCategory) - 1) * 100).toFixed(0)}%
                                </span>
                                <button
                                    className="setting-icon-btn setting-icon-btn-edit"
                                    onClick={handleMarkupEdit}
                                    disabled={editingField !== null}
                                    title="Edit"
                                >
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