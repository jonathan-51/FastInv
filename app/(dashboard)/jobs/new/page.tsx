'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createJob } from '@/lib/storage'

export default function NewJobPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        job_address: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const job = createJob(
            {
                id: crypto.randomUUID(),
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                address: formData.job_address,
            },
            formData.job_address
        )

        router.push(`/jobs/${job.id}`)
    }

    return (
        <div style={{ padding: '32px', maxWidth: '560px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '24px' }}>New Job</h1>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>
                        Client Name <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        placeholder="e.g. John Smith"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #d1d5db' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>
                        Email <span style={{ color: '#9ca3af', fontWeight: 400 }}>(optional)</span>
                    </label>
                    <input
                        type="email"
                        name="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #d1d5db' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>
                        Phone <span style={{ color: '#9ca3af', fontWeight: 400 }}>(optional)</span>
                    </label>
                    <input
                        type="tel"
                        name="phone"
                        placeholder="021 123 4567"
                        value={formData.phone}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #d1d5db' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>
                        Job Address <span style={{ color: 'red' }}>*</span>
                    </label>
                    <textarea
                        name="job_address"
                        placeholder="123 Main Street, Auckland"
                        value={formData.job_address}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #d1d5db', minHeight: '80px', resize: 'vertical' }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        style={{ padding: '8px 20px', borderRadius: '8px', border: '1px solid #d1d5db', background: 'white', cursor: 'pointer' }}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={!formData.name || !formData.job_address}
                        style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: '#3B2A22', color: 'white', cursor: 'pointer', opacity: (!formData.name || !formData.job_address) ? 0.5 : 1 }}
                    >
                        Create Job
                    </button>
                </div>
            </form>
        </div>
    )
}
