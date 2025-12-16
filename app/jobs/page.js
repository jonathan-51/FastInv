'use client'
import Link from 'next/link';
import { useEffect,useState } from 'react';
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

    return (
        <div className='contents'>
            <h1 className='pt-4 pb-4 pl-8 text-2xl'>Jobs</h1>
            <div>
                <div className='ticket-headings'>
                    
                    <div className='address'>Address</div>
                    <div className='name'>Name</div>
                    <div className='number'>Number</div>
                    <div className='email'>Email</div>
                    <div className='date'>Date</div>
                </div>
                <div
                // if the number of entries stored in jobs is zero, will display message
                // else
                // iterate through all different jobs stored in jobs variable with iterable object job
                // creating link to dynamic segment, differentiated only by job id
                // key={job.id} labels each job ticket with its unqiue job id, allows for easy changes to specific job tickets if required.
                >
                    {jobs.length === 0 ? (
                        <p>No Jobs yet. Add one to get started</p>
                    ) : (
                        jobs.map((job) => (
                            <Link key={job.id} href={`/jobs/${job.id}`}>
                            <div key={job.id} className='ticket'>
                                <div>{job.address}</div>
                                <div>{job.firstname} {job.lastname}</div>
                                <div>{job.number}</div>
                                <div>{job.email}</div>
                                <div>{job.date}</div>
                            </div>
                            </Link>
                        ))
                    )}

                </div>
            </div>
        </div>
    )
} 