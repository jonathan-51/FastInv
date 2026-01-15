'use client'
import { useRef, useEffect,useState, use } from "react"
import { useParams } from "next/navigation";
import './job.css'
import React from 'react'
import { PhotosTab } from './components/PhotoTab/PhotoTab';
import { MaterialsTab } from "./components/MaterialsTab/MaterialsTab";
import { NotesTab } from "./components/NotesTab";
import { BillablesTab } from "./components/BillablesTab/BillablesTab";
import { InvoiceTab } from "./components/InvoiceTab/InvoiceTab";
// Import server action to fetch jobs from database
import { getJobs } from '../actions';

export default function JobDetailPage() {
    // Get the dynamic route parameter from the URL
    const params = useParams();

    // Extract job ID from URL params (UUID string from database, not parsed as integer)
    // Example: /jobs/550e8400-e29b-41d4-a716-446655440000
    const jobID = params.id;

    // State to store the current job's data fetched from database
    const [job,setJob] = useState(null)

    // Loading state to show loading UI while fetching job from database
    const [loading, setLoading] = useState(true)
    
    // Initializing variable that keeps tract of dropdown state, only exists if true.
    const [showDropDown,setShowDropDown] = useState(false);



    const [isHeadings,setIsHeadings] = useState({
        isBillables: true,
        isPhotos: false,
        isNotes: false,
        isInvoice: false,
    })

    const handleSectionClick = (section) => {
        setIsHeadings({
            isInvoice: section === 'invoice',
            isPhotos: section === 'photos',
            isBillables: section === 'billables',
            isNotes: section === 'notes',
        })

        // Prevents dropdown from automatically showing when switching to materials tab.
        if (!isHeadings.isMaterials) {
            setShowDropDown(false)
        }
    }

    const [refactoredData,setRefactoredData] = useState({
        productID:'',
        name:'',
        supplier:'',
        sku:'',
        unit:'',
        brand:'',
        category:'',
        description:'',
        currency:'',
        price:null,
        location:'',
        status:'',
        notes:'',
    })

    const [selectedRefactoredData,setSelectedRefactoredData] = useState({
        productID:'',
        name:'',
        quantity:null,
        sku:'',
        unit:'',
        price:null,
        currency:'',
        supplier:'',

    })

    // Fetch job data from database when component mounts or jobID changes
    // This replaces the previous localStorage approach with a database query
    useEffect(() => {
        const fetchJob = async () => {
            // Set loading to true before fetching
            setLoading(true);

            // Call server action to get all jobs from database (includes JOIN with customers table)
            const jobs = await getJobs();

            // If jobs were successfully fetched (no error)
            if (jobs && !jobs.error) {
                // Find the specific job matching the URL parameter
                // Compare as strings since UUIDs from database are strings
                const foundJob = jobs.find(j => j.id === jobID);
                setJob(foundJob);

            }

            // Set loading to false after fetch completes
            setLoading(false);
        };

        fetchJob();
    },[jobID]); // Re-run effect if jobID changes

    // Show loading state while fetching job from database
    // This prevents showing blank page during fetch
    if (loading) {
        return (
            <div className="job-page job-state-container">
                <div className="job-loading">
                    <div className="job-loading-spinner"></div>
                    <p className="job-loading-text">Loading job details...</p>
                </div>
            </div>
        );
    }

    // Show "Job not found" message if no job matches the ID after loading completes
    // This handles cases where job doesn't exist or user lacks permission
    if (!loading && !job) {
        return (
            <div className="job-page job-state-container">
                <div className="job-error">
                    <div className="job-error-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                    </div>
                    <h2 className="job-error-title">Job Not Found</h2>
                    <p className="job-error-message">The job you're looking for doesn't exist or you don't have permission to view it.</p>
                    <a href="/jobs" className="job-error-link">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: '18px', height: '18px'}}>
                            <line x1="19" y1="12" x2="5" y2="12" />
                            <polyline points="12 19 5 12 12 5" />
                        </svg>
                        Back to Jobs
                    </a>
                </div>
            </div>
        );
    }

    // Job was found - render the full job details page
    return (
        <div  className="job-page">

            <div className="job-main">
                <div className="job-address">
                    {/* Display job address - check both field names for backwards compatibility */}
                    {job.site_address || job.site_address}
                </div>
                <div className="job-sections">
                    <button onClick={() => handleSectionClick('billables')}>Billables</button>
                    <button onClick={() => handleSectionClick('photos')}>Photos</button>
                    <button onClick={() => handleSectionClick('notes')}>Notes</button>
                    <button onClick={() => handleSectionClick('invoice')}>Invoice</button>

                </div>
                <div className="job-content">

                    {isHeadings.isBillables && (
                        <BillablesTab/>
                    )}

                    {/*Displays images section */}
                    {isHeadings.isPhotos && (
                        <PhotosTab/>
                    )}

                    {isHeadings.isNotes && (
                        <NotesTab/>
                    )}

                    {isHeadings.isInvoice && (
                        <InvoiceTab/>
                    )}


                </div>
            </div>


        </div>
    )

    
}