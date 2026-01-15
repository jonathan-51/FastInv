'use client'
import Link from 'next/link';
import { useEffect,useRef,useState } from 'react';
import './jobs.css';
import { useJobs } from './components/useJobs';
import JobSearch from './components/JobSearch';
import UserStatus from '@/app/components/UserStatus';
import { getJobs, updateJobStatus } from './actions';


export default function JobsPage() {
    
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-NZ', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
    }

    const {
        openJobsStatusID,
        setOpenJobsStatusID,
        jobsStatusButton,
        currentJobsStatus,
        setCurrentJobsStatus,
        statusFields,
        setStatusFields
    } = useJobs()

    // initializing useState variable to store all job entries
    const [jobs, setJobs] = useState([])

    


    // Getting information sent from new customer form, converting string back into object
    // updating jobs object with new job entry after each render
    useEffect(() => {

        const gettingJobs = async () => {
            const savedJobs = await getJobs()
            setJobs(savedJobs);

            setCurrentJobsStatus(savedJobs.reduce((acc,job) => {
                acc[job.id] = job.status

                return acc
                },{})
            )

            console.log(savedJobs)    
        }
        
        gettingJobs()
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
        <div className='contents' style={{padding: '32px'}}>
            <h1 style={{fontSize: '36px', fontWeight: '600', margin: '12px', color: 'var(--text)'}}>Jobs</h1>
            <JobSearch/>
            <div className='jobs-table'>
                <h3 className='ticket-headings'>
                    <div className='jobs-select'
                    onClick={selectAllRows}
                    style={{backgroundColor:selectedJobs.length === jobs.length && selectedJobs.length > 0 ? 'var( --selected-surface)':'var(--surface-1)'}}>
                        {selectedJobs.length === jobs.length && selectedJobs.length > 0 ? '✓' : ''}
                    </div>
                    <div>Address</div>
                    <div>Name</div>
                    <div>Number</div>
                    <div>Email</div>
                    <div>Status</div>
                    <div>Date</div>
                    <div className='jobs-remove' style={{cursor:selectedJobs.length === jobs.length && selectedJobs.length > 0 ? 'pointer':'',userSelect:'none'}} onClick={removeAllSelectedJobs}>Remove</div>
                </h3>
                <div>
                    {jobs.length === 0 ? (
                        <p>No Jobs yet. Add one to get started</p>
                    ) : (
                        jobs.map((job) => (
                            <Link key={job.id} href={`/jobs/${job.id}`}>
                            <div className='ticket' style={{backgroundColor:selectedJobs.includes(job.id) ? 'var( --selected-surface)':'var(--surface-1)'}}>
                                <div className='jobs-ticket-select'
                                onClick={(e) => {
                                    selectedJobs.includes(job.id) ? setSelectedJobs(selectedJobs.filter(id => id !== job.id)):setSelectedJobs([...selectedJobs,job.id])
                                    e.preventDefault();
                                    e.stopPropagation()}}>
                                    {selectedJobs.includes(job.id) ? '✓' : ''}
                                </div>
                                <p>{job.site_address}</p>
                                <p>{job.customer.name}</p>
                                <p>{job.customer.phone}</p>
                                <p>{job.customer.email}</p>
                                <div className='jobs-status' style={{marginRight:"5px",marginLeft:"5px"}}>
                                    <div className='jobs-status-button'
                                    style={{maxWidth:'150px'}}
                                    onClick={(e) => {
                                        setOpenJobsStatusID(openJobsStatusID === job.id ? null:job.id)
                                        e.preventDefault()
                                        e.stopPropagation()}}
                                    ref = {(element) => jobsStatusButton.current[job.id] = element}>
                                        {currentJobsStatus[job.id] ? currentJobsStatus[job.id]:''}

                                        {openJobsStatusID === job.id && (
                                        <div className='jobs-status-dropdown'>
                                            {statusFields.map((status) => (
                                            <div
                                            key={status}
                                            onClick={async () => {
                                                const result = await updateJobStatus(job.id,status)
                                                if (!result.error) {
                                                    setCurrentJobsStatus({...currentJobsStatus,[job.id]:status})    
                                                }
                                                }}>
                                                {status}
                                            </div>
                                        ))}
                                        </div>
                                        )}

                                    </div>

                                </div>
                                <p>{formatDate(job.created_at)}</p>
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
            <UserStatus/>
        </div>
    )
} 