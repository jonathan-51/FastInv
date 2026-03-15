'use client'
import { useState } from 'react'
import { useLocation } from '@/app/context/LocationContext'
import { useStatus } from '@/app/context/StatusContext'
import { useBillablesCategory } from '@/app/context/BillablesContext'

// Icon components
const EditIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
)

const CheckIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
)

const CloseIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
)

const TrashIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
)

const PlusIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
)

interface EditableListProps {
    title: string
    description: string
    items: string[]
    onUpdate: (items: string[]) => void
    minItems?: number
}

const EditableList = ({ title, description, items, onUpdate, minItems = 0 }: EditableListProps) => {
    const [editingIndex, setEditingIndex] = useState<number | null>(null)
    const [editValue, setEditValue] = useState('')
    const [isAdding, setIsAdding] = useState(false)
    const [newValue, setNewValue] = useState('')

    const handleEdit = (index: number) => {
        setEditValue(items[index])
        setEditingIndex(index)
    }

    const handleSave = (index: number) => {
        if (editValue.trim() && editValue !== items[index]) {
            const newItems = [...items]
            newItems[index] = editValue.trim()
            onUpdate(newItems)
        }
        setEditingIndex(null)
        setEditValue('')
    }

    const handleCancel = () => {
        setEditingIndex(null)
        setEditValue('')
    }

    const handleDelete = (index: number) => {
        if (items.length > minItems) {
            const newItems = items.filter((_, i) => i !== index)
            onUpdate(newItems)
        }
    }

    const handleAdd = () => {
        if (newValue.trim() && !items.includes(newValue.trim())) {
            onUpdate([...items, newValue.trim()])
            setNewValue('')
            setIsAdding(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, action: () => void, cancel: () => void) => {
        if (e.key === 'Enter') {
            action()
        } else if (e.key === 'Escape') {
            cancel()
        }
    }

    return (
        <div className="setting-customfield-section">
            <div className="setting-customfield-header">
                <div>
                    <h3>{title}</h3>
                    <p>{description}</p>
                </div>
                <button
                    className="setting-customfield-add-btn"
                    onClick={() => setIsAdding(true)}
                    disabled={isAdding || editingIndex !== null}
                >
                    <PlusIcon />
                    Add
                </button>
            </div>
            <div className="setting-customfield-list">
                {items.map((item, index) => (
                    <div key={`${item}-${index}`} className="setting-customfield-item">
                        {editingIndex === index ? (
                            <>
                                <input
                                    type="text"
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(e, () => handleSave(index), handleCancel)}
                                    autoFocus
                                    className="setting-customfield-input"
                                />
                                <div className="setting-customfield-actions">
                                    <button
                                        className="setting-icon-btn setting-icon-btn-save"
                                        onClick={() => handleSave(index)}
                                        title="Save"
                                    >
                                        <CheckIcon />
                                    </button>
                                    <button
                                        className="setting-icon-btn setting-icon-btn-cancel"
                                        onClick={handleCancel}
                                        title="Cancel"
                                    >
                                        <CloseIcon />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <span className="setting-customfield-value">{item}</span>
                                <div className="setting-customfield-actions">
                                    <button
                                        className="setting-icon-btn setting-icon-btn-edit"
                                        onClick={() => handleEdit(index)}
                                        disabled={editingIndex !== null || isAdding}
                                        title="Edit"
                                    >
                                        <EditIcon />
                                    </button>
                                    <button
                                        className="setting-icon-btn setting-icon-btn-delete"
                                        onClick={() => handleDelete(index)}
                                        disabled={items.length <= minItems || editingIndex !== null || isAdding}
                                        title="Delete"
                                    >
                                        <TrashIcon />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
                {isAdding && (
                    <div className="setting-customfield-item setting-customfield-item-new">
                        <input
                            type="text"
                            value={newValue}
                            onChange={(e) => setNewValue(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, handleAdd, () => { setIsAdding(false); setNewValue('') })}
                            placeholder={`New ${title.toLowerCase().slice(0, -1)}...`}
                            autoFocus
                            className="setting-customfield-input"
                        />
                        <div className="setting-customfield-actions">
                            <button
                                className="setting-icon-btn setting-icon-btn-save"
                                onClick={handleAdd}
                                disabled={!newValue.trim()}
                                title="Add"
                            >
                                <CheckIcon />
                            </button>
                            <button
                                className="setting-icon-btn setting-icon-btn-cancel"
                                onClick={() => { setIsAdding(false); setNewValue('') }}
                                title="Cancel"
                            >
                                <CloseIcon />
                            </button>
                        </div>
                    </div>
                )}
                {items.length === 0 && !isAdding && (
                    <div className="setting-customfield-empty">
                        No items added yet
                    </div>
                )}
            </div>
        </div>
    )
}

export const SettingsCustomFields = () => {
    const { locationFields, setLocationFields } = useLocation()
    const { statusFields, setStatusFields } = useStatus()
    const { billableCategoryFields, setBillableCategoryFields } = useBillablesCategory()

    return (
        <div className="setting-section">
            <h2>Custom Fields</h2>
            <p className="setting-description">Customize dropdown options for your jobs</p>

            <div className="setting-customfield-container">
                <EditableList
                    title="Locations"
                    description="Areas where you provide services"
                    items={locationFields}
                    onUpdate={setLocationFields}
                />

                <EditableList
                    title="Statuses"
                    description="Job progress stages"
                    items={statusFields}
                    onUpdate={setStatusFields}
                    minItems={1}
                />

                <EditableList
                    title="Billable Categories"
                    description="Types of billable items"
                    items={billableCategoryFields}
                    onUpdate={setBillableCategoryFields}
                    minItems={1}
                />
            </div>
        </div>
    )
}
