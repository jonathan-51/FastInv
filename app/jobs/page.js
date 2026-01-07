'use client'
import Link from 'next/link';
import { useEffect,useRef,useState } from 'react';
import './jobs.css';


export default function customers() {

    // initializing useState variable to store all job entries
    const [jobs, setJobs] = useState([])

    // Getting information sent from new customer form, converting string back into object
    // updating jobs object with new job entry after each render
    useEffect(() => {
        const savedJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
        setJobs(savedJobs);

        
    },[])

    // Initializing useState variable to store all selected jobs
    const [selectedJobs,setSelectedJobs] = useState([]);

    // Function that handles selecting all rows
    const selectAllRows = () => {
        if (selectedJobs.length === jobs.length) {
            setSelectedJobs([])
        } else {
            const unselectedJobs = jobs.map(job => job.id).filter(id => !selectedJobs.includes(id))
            setSelectedJobs([...selectedJobs,...unselectedJobs])
        }

    }

    // Function that handles removing all selected jobs
    const removeAllSelectedJobs = () => {

        if (selectedJobs.length === jobs.length && selectedJobs.length > 0) {
            setJobs([])
        } else {
            return
        }

    }

    // reference variable that remains constant between renders
    const isFirstRender = useRef(true)
    // Handles updating cached jobs when jobs are removed.
    useEffect(() => {

        // prevents code from running for the first render (prevents removing newly created job ticket)
        if (isFirstRender.current) {
            isFirstRender.current = false
            return
        }

        localStorage.setItem('jobs',JSON.stringify(jobs)); 

    },[jobs])

    return (
        <div className='contents'>
            <h1 className='pt-4 pb-4 pl-8 text-2xl'>Jobs</h1>
            <div>
                <h3 className='ticket-headings'>
                    <div className='jobs-select'
                    onClick={selectAllRows}
                    style={{backgroundColor:selectedJobs.length === jobs.length && selectedJobs.length > 0 ? 'var( --selected-surface)':'var(--surface-1)'}}>
                        {selectedJobs.length === jobs.length && selectedJobs.length > 0 ? '✓' : ''}
                    </div>
                    <div className='jobs-address'>Address</div>
                    <div className='jobs-name'>Name</div>
                    <div className='jobs-number'>Number</div>
                    <div className='jobs-email'>Email</div>
                    <div className='jobs-date'>Date</div>
                    <div className='jobs-remove' style={{cursor:selectedJobs.length === jobs.length && selectedJobs.length > 0 ? 'pointer':'',userSelect:'none'}} onClick={removeAllSelectedJobs}>Remove</div>
                </h3>
                <div
                // if the number of entries stored in jobs is zero, will display message
                // else
                // iterate through all different jobs stored in jobs variable with iterable object job
                // creating link to dynamic segment, differentiated only by job id
                // key={job.id} labels each job ticket with its unqiue job id, allows for easy changes to specific job tickets if required.

                className='jobs-table'
                >
                    {jobs.length === 0 ? (
                        <p>No Jobs yet. Add one to get started</p>
                    ) : (
                        jobs.map((job) => (
                            <Link key={job.id} href={`/jobs/${job.id}`}>
                            <div key={job.id} className='ticket' style={{backgroundColor:selectedJobs.includes(job.id) ? 'var( --selected-surface)':'var(--surface-1)'}}>
                                <div className='jobs-ticket-select' 
                                onClick={(e) => {
                                    selectedJobs.includes(job.id) ? setSelectedJobs(selectedJobs.filter(id => id !== job.id)):setSelectedJobs([...selectedJobs,job.id])
                                    e.preventDefault();
                                    e.stopPropagation()}}>
                                    {selectedJobs.includes(job.id) ? '✓' : ''}
                                </div>
                                <p>{job.address}</p>
                                <p>{job.firstname} {job.lastname}</p>
                                <p>{job.number}</p>
                                <p>{job.email}</p>
                                <p>{job.date}</p>
                                <div onClick={(e) => {
                                    setJobs(jobs.filter(i => i.id !== job.id));
                                    e.preventDefault();
                                    e.stopPropagation()}}>Remove</div>
                            </div>
                            </Link>
                        ))
                    )}

                </div>
            </div>
        </div>
    )
} 