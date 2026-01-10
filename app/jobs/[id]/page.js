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

export default function JobDetailPage() {
    // react hook provided by react.js that takes the dynamic(variable) part of the URL, const params is assigned to this object.
    const params = useParams();
    // getting id for specific dynamic segment and assigning to constant jobID.
    const jobID = parseInt(params.id);

    // Initialising useState variable to hold metadata pertaining to specific job.
    const [job,setJob] = useState(null)
    
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

    // Runs after initial render and whenever the value of jobID changes(which is when the url changes),
    // gets object containing information about job
    // scans through object to see if there is a job id that matches the dynamic segment job id
    // updates job constant with foundJob data, which is the specific job linked to the specific webpage(dynamic segment)
    useEffect(() => {
        const savedJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
        const foundJob = savedJobs.find(c => c.id === jobID);
        setJob(foundJob);
    },[jobID]);

    // since useEffect runs after rendering, initial job value is null, so if statement is required.
    if (job) {
        return (
        <div  className="job-page">
            
            <div className="job-main">
                <div className="job-address">
                    {job.address}
                </div>
                <div className="job-sections">
                    <button onClick={() => handleSectionClick('billables')}>Billables</button>
                    <button onClick={() => handleSectionClick('photos')}>Photos</button>
                    <button onClick={() => handleSectionClick('notes')}>Notes</button>
                    <button onClick={() => handleSectionClick('invoice')}>Invoice</button>

                </div>
                <div className="job-content">

                    {isHeadings.isMaterials && (
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

    return

    
}