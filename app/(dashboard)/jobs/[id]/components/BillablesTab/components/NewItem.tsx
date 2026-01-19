'use client'
import { useState,useEffect } from 'react';
import './NewItem.css'
import { useBillables } from '../useBillables';
import { useBillablesCategory } from '@/app/context/BillablesContext';
import { addItem, getBillableItems } from './actions';

interface Item {
    description: string;
    type: string;
    quantity: string;
    unit: string;
    unit_price: string;
}

export default function NewItemPopOut() {
    const { isNewItemOpen, 
            setIsNewItemOpen,
            jobID,
            orgID,
            billablesItems,
            setBillablesItems,
            addedBillableItem,
            setAddedBillableItem } = useBillables()
    const {billableCategoryFields} = useBillablesCategory()

    const [formData, setFormData] = useState<Item>({
        description:'',
        type:'',
        quantity:'',
        unit:'',
        unit_price:'',
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const data = new FormData()
        data.append('description', formData.description)
        data.append('type', formData.type)
        data.append('quantity', formData.quantity)
        data.append('unit', formData.unit)
        data.append('unit_price', formData.unit_price)
        data.append('jobID', jobID)
        data.append('orgID', orgID)

        const result = await addItem(data)

        if (result && !result.error) {
            console.log(result)
            setIsNewItemOpen(false)
            // Refetch all items from DB
            const items = await getBillableItems({ jobID, orgID })
            if (Array.isArray(items)) {
                setBillablesItems(items)
            }
        }
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
