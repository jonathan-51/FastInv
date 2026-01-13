'use client'
import './organization.css'
import { useState } from "react"
import { OnboardingOrganizationPage } from './actions'
import { useRouter } from 'next/navigation'
import { JoinOrganization } from './actions'

export default function OrganizationPage() {

    const router = useRouter();

    const [formData,setFormData] = useState({
        name:'',
        email:'',
        country:'',
        phone:'',
        address:'',
        industry:'',
        tax_number:'',
        invite_code:'',

    })
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null)
    const [isNewBusinessProfile,setIsNewBusinessProfile] = useState(true)
    const [inputtedInviteCode, setInputtedInviteCode] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({...formData,[e.target.name]:e.target.value})
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)

        console.log(formData)

        const result = await OnboardingOrganizationPage(formData)

        if (result.error) {
            setError(result.error)
            setIsSubmitting(false)
        } else {
            // Success - redirect to dashboard or next onboarding step
            window.location.href = '/'
        }
    }

    const handleCodeSubmit = async (e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null)

        const result = await JoinOrganization(inputtedInviteCode)

        if (result.error) {
            setError(result.error)
            setIsSubmitting(false)
        } else {
            // Success - redirect to dashboard or next onboarding step
            window.location.href = '/'
        }

    }

  return (
    <main className='organization-page'>
        <div className='organization-header'>
            <div className='organization-logo'>TradeFlow</div>
            <h1 className='organization-title'>Set up your business</h1>
            <p className='organization-subtitle'>
                Create a new business profile or join an existing one to get started with TradeFlow
            </p>
        </div>

        <div className='organization-card-headers'>
            <span
                className={isNewBusinessProfile ? 'active' : ''}
                onClick={() => setIsNewBusinessProfile(true)}
            >
                Create New Business Profile
            </span>
            <span
                className={!isNewBusinessProfile ? 'active' : ''}
                onClick={() => setIsNewBusinessProfile(false)}
            >
                Join Existing Business
            </span>
        </div>

        <div className='organization-card'>
            {isNewBusinessProfile ? (
                <form className='organization-card-content' onSubmit={handleSubmit}>
                    <div className='form-group'>
                        <label className='form-label' htmlFor='name'>
                            Business Name (Display Name) *
                        </label>
                        <input
                            id='name'
                            name='name'
                            type='text'
                            className='form-input'
                            value={formData.name}
                            placeholder='Smith Plumbing'
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className='form-group'>
                        <label className='form-label' htmlFor='country'>
                            Country *
                        </label>
                        <select
                            id='country'
                            name='country'
                            className='form-input form-select'
                            value={formData.country}
                            onChange={handleChange}
                            required
                        >
                            <option value=''>Select a country</option>
                            <option value='AU'>Australia</option>
                            <option value='NZ'>New Zealand</option>
                        </select>
                    </div>

                    <div className='form-group'>
                        <label className='form-label' htmlFor='email'>
                            Primary Contact Email
                        </label>
                        <input
                            id='email'
                            name='email'
                            type='email'
                            className='form-input'
                            value={formData.email}
                            onChange={handleChange}
                            placeholder='contact@smithplumbing.com'
                        />
                    </div>

                    <div className='form-group'>
                        <label className='form-label' htmlFor='phone'>
                            Primary Phone Number
                        </label>
                        <input
                            id='phone'
                            name='phone'
                            type='tel'
                            className='form-input'
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder='+61 400 000 000'
                        />
                    </div>

                    <div className='form-group form-full-width'>
                        <label className='form-label' htmlFor='address'>
                            Registered Business Address
                        </label>
                        <input
                            id='address'
                            name='address'
                            type='text'
                            className='form-input'
                            value={formData.address}
                            onChange={handleChange}
                            placeholder='123 Main Street, Sydney NSW 2000'
                        />
                    </div>

                    <div className='form-group'>
                        <label className='form-label' htmlFor='industry'>
                            Industry
                        </label>
                        <select
                            id='industry'
                            name='industry'
                            value={formData.industry}
                            onChange={handleChange}
                            className='form-input form-select'
                        >
                            <option value=''>Select an industry</option>
                            <option value='plumbing'>Plumbing</option>
                            <option value='electrical'>Electrical</option>
                            <option value='carpentry'>Carpentry</option>
                            <option value='painting'>Painting</option>
                            <option value='landscaping'>Landscaping</option>
                            <option value='hvac'>HVAC</option>
                            <option value='other'>Other</option>
                        </select>
                    </div>

                    <div className='form-group'>
                        <label className='form-label' htmlFor='tax_number'>
                            Tax/Registration Number
                        </label>
                        <input
                            id='tax_number'
                            name='tax_number'
                            type='text'
                            className='form-input'
                            value={formData.tax_number}
                            onChange={handleChange}
                            placeholder='ABN 12 345 678 901'
                        />
                    </div>

                    {error && (
                        <div className='form-group form-full-width'>
                            <div className="error-message">{error}</div>
                        </div>
                    )}

                    <div className='form-group form-full-width'>
                        <button
                            type="submit"
                            className="submit-button"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="spinner" />
                                    Creating business profile...
                                </>
                            ) : (
                                'Create Business Profile'
                            )}
                        </button>
                    </div>
                </form>
            ) : (
                <div className='join-code-container'>
                    <h2 className='join-code-title'>Join Existing Business</h2>
                    <p className='join-code-description'>
                        Enter the invitation code provided by your business administrator to join their TradeFlow workspace
                    </p>
                    <div className='join-code-input form-group'>
                        <label className='form-label' htmlFor='organization-join-code'>
                            Invitation Code
                        </label>
                        <input
                            id='organization-join-code'
                            name='organization-join-code'
                            type='text'
                            className='form-input'
                            value={inputtedInviteCode}
                            onChange={(e) => setInputtedInviteCode(e.target.value)}
                            maxLength={12}
                            placeholder='ABCD-1234-EFGH'
                            required
                        />
                    </div>
                    {error && (
                        <div className="error-message" style={{ marginBottom: '16px' }}>
                            {error}
                        </div>
                    )}
                    <button
                        type="submit"
                        className="submit-button"
                        onClick={handleCodeSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <div className="spinner" />
                                Joining business...
                            </>
                        ) : (
                            'Join Business'
                        )}
                    </button>
                </div>
            )}
        </div>
    </main>
  );
}
