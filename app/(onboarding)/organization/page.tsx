'use client'
import './organization.css'
import { useState } from "react"

export default function OrganizationPage() {

    const [formData,setFormData] = useState({
        business_name:'',
        primary_name:'',
        business_email:'',

    })
    const [isLoading, setIsLoading] = useState(false);
    const [isNewBusinessProfile,setIsNewBusinessProfile] = useState(true)

  return (
    <main>
        <div className='organization-page'>
            <div className='organization-card'>
                <div className='organization-card-headers'>
                    <span onClick={() => setIsNewBusinessProfile(true)}>Create New Business Profile</span>
                    <span onClick={() => setIsNewBusinessProfile(false)}>Link To Existing Business Profile</span>
                </div>
                {isNewBusinessProfile ? (
                <form className='organization-card-content'>
                    <div>
                        <label className='form-label' htmlFor='business-name'>
                            Business Name (Display Name)
                        </label>
                        <input
                        id='business-name'
                        name='business-name'
                        type='text'
                        className='form-input'
                        placeholder='Smith Plumbing'
                        required/>
                    </div>

                    <div>
                        <label className='form-label' htmlFor='country'>
                            Country
                        </label>
                        <select
                        id='country'
                        name='country'
                        className='form-input'
                        required/>
                    </div>

                    <div>
                        <label className='form-label' htmlFor='contact-email'>
                            Primary Contact Email
                        </label>
                        <input
                        id='contact-email'
                        name='contact-email'
                        type='text'
                        className='form-input'
                        />
                    </div>

                    <div>
                        <label className='form-label' htmlFor='contact-number'>
                            Primary Phone Number
                        </label>
                        <input
                        id='contact-number'
                        name='contact-number'
                        type='text'
                        className='form-input'
                        />
                    </div>

                    <div>
                        <label className='form-label' htmlFor='address'>
                            Registered Business Address
                        </label>
                        <input
                        id='address'
                        name='address'
                        type='text'
                        className='form-input'
                        />
                    </div>

                    <div>
                        <label className='form-label' htmlFor='industry'>
                            Industry
                        </label>
                        <select
                        id='industry'
                        name='industry'
                        className='form-input'
                        />
                    </div>

                    <div>
                        <label className='form-label' htmlFor='tax-number'>
                            Tax/Registration Number
                        </label>
                        <input
                        id='tax-number'
                        name='tax-number'
                        type='text'
                        className='form-input'
                        />
                    </div>

                    <div>
                        <label className='form-label' htmlFor='logo'>
                            Logo
                        </label>
                        <input
                        id='logo'
                        name='logo'
                        type='text'
                        className='form-input'
                        />
                    </div>

                    <button
                    type="submit"
                    className="submit-button"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="spinner" />
                        Creating...
                      </>
                    ) : (
                      'Create account'
                    )}
                  </button>

                </form>
                ):(
                    <div>
                        <label className='form-label' htmlFor='organization-join-code'>
                            Enter Code
                        </label>
                        <input
                        id='organization-join-code'
                        name='organization-join-code'
                        type='text'
                        className='form-input'
                        required/>
                    </div>
                )}
                
            </div>
        </div>
      
    </main>
  );
}
