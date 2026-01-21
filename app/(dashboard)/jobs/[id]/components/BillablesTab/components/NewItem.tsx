'use client'
import { useState } from 'react';
import './NewItem.css'
import { useBillables } from '../useBillables';
import { useBillablesCategory } from '@/app/context/BillablesContext';
import { addItem } from './actions';
import { useJobData } from '../../../context/JobDataContext';

interface Item {
    description: string;
    type: string;
    quantity: string;
    unit: string;
    unit_price: string;
}

export default function NewItemPopOut() {

    const { jobData} = useJobData()

    const jobID = jobData.id
    const orgID = jobData.org_id

    // Get UI state from custom hook
    const { isNewItemOpen, setIsNewItemOpen } = useBillables()

    const {billableCategoryFields} = useBillablesCategory()
    const { addBillable } = useJobData()

    const [formData, setFormData] = useState<Item>({
        description:'',
        type:'',
        quantity:'',
        unit:'',
        unit_price:'',
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // Create the new billable object
        const newBillable = {
            id: crypto.randomUUID(), // Temporary ID until we get the real one from DB
            description: formData.description,
            type: formData.type,
            quantity: parseFloat(formData.quantity),
            unit: formData.unit,
            unit_price: parseFloat(formData.unit_price),
            amount: parseFloat(formData.quantity) * parseFloat(formData.unit_price),
            job_id: jobID,
            org_id: orgID
        }

        // 1. Add to context immediately (optimistic update - instant UI!)
        addBillable(newBillable)

        // 2. Reset form
        setFormData({
            description: '',
            type: '',
            quantity: '',
            unit: '',
            unit_price: ''
        })

        // 3. Close modal (user sees instant feedback)
        setIsNewItemOpen(false)

        // 4. Save to database in background
        const data = new FormData()
        data.append('description', formData.description)
        data.append('type', formData.type)
        data.append('quantity', formData.quantity)
        data.append('unit', formData.unit)
        data.append('unit_price', formData.unit_price)
        data.append('jobID', jobID)
        data.append('orgID', orgID)

        const result = await addItem(data)

        if (result && result.error) {
            // If there's an error, you might want to remove the optimistic update
            // or show an error message to the user
            console.error('Failed to save item:', result.error)
        }

        // No refetch needed! Context already has the new item
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({...formData,[e.target.name]: e.target.value})
    }

    if (!isNewItemOpen) return null

    return (
        <div className="new-item-overlay" onClick={() => setIsNewItemOpen(false)}>
            <div className="form-card" onClick={(e) => e.stopPropagation()}>
            <form className='form-body' onSubmit={handleSubmit}>
                <div className='form-group'>
                <label className='form-label'>Description</label>
                <div className='input-wrapper'>
                    <input 
                    type="text"
                    name="description"
                    className="form-input"
                    placeholder="e.g. Ball valve 15mm"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    />
                </div>
                </div>

                <div className='form-group'>
                <label className='form-label'>Type</label>
                <div className='input-wrapper'>
                    <select
                    name="type"
                    className="form-input"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    >
                        <option value="">Select a category</option>
                        {billableCategoryFields.map(category => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>
                </div>

                <div className='form-group'>
                <label className='form-label'>Quantity</label>
                <div className='input-wrapper'>
                    <input 
                    type="text"
                    name="quantity"
                    className="form-input"
                    placeholder="e.g. 2,4,7"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                    />
                </div>
                </div>

                <div className='form-group'>
                <label className='form-label'>Unit</label>
                <div className='input-wrapper'>
                    <input 
                    type="text"
                    name="unit"
                    className="form-input"
                    placeholder="e.g. each,m"
                    value={formData.unit}
                    onChange={handleChange}
                    required
                    />
                </div>
                </div>

                <div className='form-group'>
                <label className='form-label'>Unit Price</label>
                <div className='input-wrapper'>
                    <input
                    type="text"
                    name="unit_price"
                    className="form-input"
                    placeholder="e.g. 56.00"
                    value={formData.unit_price}
                    onChange={handleChange}
                    required
                    />
                </div>
                </div>

                <div className='form-actions'>
                    <button type="button" className='form-btn-cancel' onClick={() => setIsNewItemOpen(false)}>Cancel</button>
                    <button type="submit" className='form-btn-submit'>Add Item</button>
                </div>
            </form>
            </div>
        </div>

        
    )
}
