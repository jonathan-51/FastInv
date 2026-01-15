'use client'
import { useState,useEffect } from 'react';
import './NewJob.css'
import { useNewJob } from '@/app/context/NewJobContext';
import { NewJob } from './actions';
import { User } from 'lucide-react';

export default function NewJobPopOut() {

    const { isNewJobOpen, setIsNewJobOpen } = useNewJob();
    const [error,setError] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        job_address: '',
        customer:{}
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isNewCustomer, setIsNewCustomer] = useState(true);
    const [selectedCustomer, setSelectedCustomer] = useState('');

    const handleChange = (e) => {
        setFormData({...formData,[e.target.name]:e.target.value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);



        const result = await NewJob(formData)

        
        if (result.error) {
            setIsSubmitting(false)
        } else {
            console.log("success")
            setIsNewJobOpen(false)

            setFormData({
                name: '',
                email: '',
                phone: '',
                job_address: '',
                customer:{}
            })
        }
        setIsSubmitting(false)

    }


    useEffect(() => {
        if (!isNewJobOpen) {
            setFormData({
                name: '',
                email: '',
                phone: '',
                job_address: '',
                customer:{}
            })
        }
    },[isNewJobOpen])

    useEffect(() => {
        if (isNewCustomer && selectedCustomer !== "") {
            setSelectedCustomer('')
        }
    },[isNewCustomer])
    
    

    if (!isNewJobOpen) return
    
  return (
    <div className="new-job-overlay" onClick={() => setIsNewJobOpen(false)}>
        <div className="form-card" onClick={(e) => e.stopPropagation()}>
        <form className="form-body" onSubmit={handleSubmit}>
            <div className="form-group">
            <label className="form-label">
                Client Name <span className="required">*</span>
            </label>
            <div className="input-wrapper">
                <input
                type="text"
                name="name"
                className="form-input"
                placeholder="e.g. John Smith"
                value={formData.name}
                onChange={handleChange}
                required
                />
                <span className="input-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                </svg>
                </span>
            </div>
            </div>

            <div className="form-group">
            <label className="form-label">
                Email Address <span className="optional">(optional)</span>
            </label>
            <div className="input-wrapper">
                <input
                type="email"
                name="email"
                className="form-input"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                />
                <span className="input-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                </span>
            </div>
            </div>

            <div className="form-group">
            <label className="form-label">
                Phone Number <span className="optional">(optional)</span>
            </label>
            <div className="input-wrapper">
                <input
                type="tel"
                name="phone"
                className="form-input"
                placeholder="0412 345 678"
                value={formData.phone}
                onChange={handleChange}
                />
                <span className="input-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                </span>
            </div>
            </div>

            <div className="form-group">
            <label className="form-label">
                Job Address <span className="required">*</span>
            </label>
            <div className="input-wrapper">
                <textarea
                name="job_address"
                className="form-input form-textarea"
                placeholder="123 Main Street&#10;Sydney NSW 2000"
                value={formData.job_address}
                onChange={handleChange}
                required
                />
                <span className="input-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                </svg>
                </span>
            </div>
            </div>

            <div className="form-group">
            <label className="checkbox-wrapper">
                <input
                type="checkbox"
                className="custom-checkbox"
                checked={isNewCustomer}
                onChange={(e) => setIsNewCustomer(e.target.checked)}
                />
                <span className="checkbox-label">Create new customer profile</span>
            </label>
            </div>

            {!isNewCustomer && (
            <div className="form-group">
                <label className="form-label">
                Select Existing Customer 
                </label>
                <div className="input-wrapper">
                <select
                    className="form-input form-select"
                    value={selectedCustomer}
                    onChange={(e) => setSelectedCustomer(e.target.value)}
                    required={!isNewCustomer}
                >
                    <option value="">-- Select a customer --</option>
                    <option value="1">John Smith - 123 Main St, Sydney</option>
                    <option value="2">Sarah Johnson - 456 Oak Ave, Melbourne</option>
                    <option value="3">Michael Brown - 789 Pine Rd, Brisbane</option>
                    <option value="4">Emma Wilson - 321 Elm St, Perth</option>
                    <option value="5">David Lee - 654 Maple Dr, Adelaide</option>
                </select>
                <span className="input-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                </span>
                </div>
            </div>
            )}

            <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setIsNewJobOpen(false)}>
                Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting || !formData.name}>
                {isSubmitting ? (
                <>
                    <span className="spinner"></span>
                    Saving...
                </>
                ) : (
                'Create Job'
                )}
            </button>
            </div>
        </form>
        </div>



    </div>

    
  )
}
