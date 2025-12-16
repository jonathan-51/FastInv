'use client'
import { useEffect,useState } from "react"
import Link from 'next/link';
import { useParams } from "next/navigation";
import './job.css'


export default function JobDetailPage() {
    // react hook provided by react.js that takes the dynamic(variable) part of the URL, const params is assigned to this object.
    const params = useParams();
    // getting id for specific dynamic segment and assigning to constant jobID.
    const jobID = parseInt(params.id);

    // Initialising useState variable to hold metadata pertaining to specific job.
    const [job,setJob] = useState(null)
    
    // Runs after initial render and whenever the value of jobID changes(which is when the url changes),
    // gets object containing information about job
    // scans through object to see if there is a job id that matches the dynamic segment job id
    // updates job constant with foundJob data, which is the specific job linked to the specific webpage(dynamic segment)
    useEffect(() => {
        const savedJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
        const foundJob = savedJobs.find(c => c.id === jobID);
        setJob(foundJob);
    },[jobID]);

    // Initializing useState variables to handle description
    const [descrip_text,setDescripText] = useState('');
    const [descripisEditing,setDescripIsEditing] = useState(false);
    const [descrip_temp_text,setDescripTempText] = useState('');

    // Handles Editing description
    // When edit button is pressed, update temp useState constant with current text in description
    // change description display to edit mode
    const handleDescripEdit = () => {
        setDescripTempText(descrip_text);
        setDescripIsEditing(true);
    }
    // Handles saving description
    // when save button is pressed, update main text with temp text (what the user just edited)
    // change description display to view mode
    const handleDescripSave = () => {
        setDescripText(descrip_temp_text);
        setDescripIsEditing(false)
    }
    // Handles cancelling edit of description
    // updates nothing and returns back to view mode
    const handleDescripCancel = () => {
        setDescripIsEditing(false)
    }

    // Same as description but for Access Notes //
    const [access_text,setAccessText] = useState('');
    const [accessisEditing,setAccessIsEditing] = useState(false);
    const [access_temp_text,setAccessTempText] = useState('');

    const handleAccessEdit = () => {
        setAccessTempText(access_text);
        setAccessIsEditing(true);
    }
    const handleAccessSave = () => {
        setAccessText(access_temp_text);
        setAccessIsEditing(false)
    }
    const handleAccessCancel = () => {
        setAccessIsEditing(false)
    }

    // Same as Description and Access Notes, but for Notes
    const [notes_text,setNotesText] = useState('');
    const [notesisEditing,setNotesIsEditing] = useState(false);
    const [notes_temp_text,setNotesTempText] = useState('');

    const handleNotesEdit = () => {
        setNotesTempText(notes_text);
        setNotesIsEditing(true);
    }
    const handleNotesSave = () => {
        setNotesText(notes_temp_text);
        setNotesIsEditing(false)
    }
    const handleNotesCancel = () => {
        setNotesIsEditing(false)
    }


    console.log(params)
    console.log(job)

    // since useEffect runs after rendering, initial job value is null, so if statement is required.
    if (job) {
        return (
        <div className="job-page">
            
            <div className="job-main">
                <div className="job-address">
                    {job.address}
                </div>
                <div className="job-content">

                        {descripisEditing ? (
                            <div className="job-description">
                                <div className="job-description-headings">
                                    <div>Description</div>
                                    <div className="job-description-buttons">
                                        <button
                                        onClick={handleDescripSave}>
                                            Save
                                        </button>
                                        <button
                                        onClick={handleDescripCancel}>Cancel</button>
                                    </div>
                                </div>
                                <input
                                value={descrip_temp_text}
                                onChange={(e) => setDescripTempText(e.target.value)}
                                />
                            </div>
                            ) : (
                            <div className="job-description">
                                <div className="job-description-headings">
                                    Description
                                    <button
                                    className="job-description-buttons"
                                    onClick={handleDescripEdit}>
                                        Edit
                                    </button>
                                </div>
                                <div className="view-mode">
                                    {descrip_text === '' ? (
                                        <div>Click edit to change this text</div>
                                    ):(
                                        descrip_text
                                    )}
                                </div>
                            </div>
                        )}

                    {accessisEditing ? (
                            <div className="job-access">
                                <div className="job-access-headings">
                                    <div>Access Notes</div>
                                    <div className="job-access-buttons">
                                        <button
                                        onClick={handleAccessSave}>
                                            Save
                                        </button>
                                        <button
                                        onClick={handleAccessCancel}>Cancel</button>
                                    </div>
                                </div>
                                <input
                                value={access_temp_text}
                                onChange={(e) => setAccessTempText(e.target.value)}
                                />
                            </div>
                            ) : (
                            <div className="job-access">
                                <div className="job-access-headings">
                                    Access Notes
                                    <button
                                    className="job-access-buttons"
                                    onClick={handleAccessEdit}>
                                        Edit
                                    </button>
                                </div>
                                <div className="view-mode">
                                    {access_text === '' ? (
                                        <div>Click edit to change this text</div>
                                    ):(
                                        access_text
                                    )}
                                </div>
                            </div>
                        )}

                    <div className="job-photos">
                        Photos
                    </div>
                    <div className="job-materials">
                        Materials
                    </div>

                    {notesisEditing ? (
                            <div className="job-notes">
                                <div className="job-notes-headings">
                                    <div>Notes</div>
                                    <div className="job-notes-buttons">
                                        <button
                                        onClick={handleNotesSave}>
                                            Save
                                        </button>
                                        <button
                                        onClick={handleNotesCancel}>Cancel</button>
                                    </div>
                                </div>
                                <input
                                value={notes_temp_text}
                                onChange={(e) => setNotesTempText(e.target.value)}
                                />
                            </div>
                            ) : (
                            <div className="job-notes">
                                <div className="job-notes-headings">
                                    Notes
                                    <button
                                    className="job-notes-buttons"
                                    onClick={handleNotesEdit}>
                                        Edit
                                    </button>
                                </div>
                                <div className="view-mode">
                                    {notes_text === '' ? (
                                        <div>Click edit to change this text</div>
                                    ):(
                                        notes_text
                                    )}
                                </div>
                            </div>
                        )}
                        
                </div>
            </div>

            <div className="job-right">
                <div className="text-2xl mb-6 mt-15">Contact Details</div>
                <div className="job-contact">
                    <div className="job-contact-labels">
                        <div>Main Contact Name</div>
                        <div>Main Number</div>
                        <div>Main Email</div>
                    </div>
                    <div className="job-contact-details">
                        <div>{job.firstname} {job.lastname}</div>
                        <div>{job.number}</div>
                        <div>{job.email}</div>
                    </div>
                </div>
            </div>
        </div>
    )
    }

    return

    
}