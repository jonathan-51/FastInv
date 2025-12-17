'use client'
import { use, useEffect,useState } from "react"
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

    // Handling Images

    // Initialising useState array variable that will store all uploaded images.
    const [images, setImages] = useState([])


    // Function that handles Image Upload
    // 1. Gets the selected file from the input
    // 2. Creates a temporary blob URL
    // 3. Adds the new image to the images array
    // 4. Sets it as the current main image
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageURL = URL.createObjectURL(file)
            setImages([...images,imageURL])
            setCurrentImage(imageURL)
        }
    }


    //**NOTE: NEED to removed the replaced image at the image gallery at the bottom */
    // Function that handles Image replacement
    // Redirects user to element responsible for file input to open image picker dialog
    const currentImageReplace = () => {
        document.getElementById('fileInput').click()
    }

    //**NOTE: After image is removed, change main image to the image on the left, right now it is displaying no main image. */
    // Function that handles Image Removal
    // 1. Sets main image variable to null
    // 2. Scans through the array of images and filters out the image being removed (the current main image being displayed)
    // 3. Changes fake file path of image ensure the same image can be uploaded
    const currentImageRemove = () => {
        setCurrentImage(null);
        setImages(images.filter(img => img !== currentImage))
        document.getElementById('fileInput').value = ''
    }

    // Initializing the useState variable to store main image
    const [currentImage,setCurrentImage] = useState(null)

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

                    {/*Displays images section */}
                    <div className="job-photos">
                        <p>Photos</p>
                            {/* input element that allows user to choose image to upload */}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{display:'none'}}
                                id ="fileInput"
                            />

                            <label htmlFor="fileInput">Upload</label>

                            <div className="job-image-content">

                                {/* Ternary Function that will display the main image if there is a current image
                                If there isn't a current image, it will display a message telling user to upload an image */}
                                {currentImage ? (
                                <div className="job-image-main">
                                    
                                    <button className="job-image-replace" onClick={currentImageReplace}></button>
                                    <button className="job-image-remove" onClick={currentImageRemove}></button>
                                    <img src={currentImage} alt="Uploaded" style={{maxHeight:'100%',maxWidth:'100%'}}/>
                                </div>
                            )
                            :
                            (
                            <div className="job-image-main">
                                <label htmlFor="fileInput" className="job-image-upload">
                                    <p style={{color:'#999'}}>Click to upload image</p>
                                </label>
                            </div>
                            )}

                            {/* Displays all the images uploaded below the main image */}
                            <div className="job-images">
                                
                                {images.map((img,index) => (
                                    <div key={index}>
                                        <img 
                                        src={img} 
                                        alt={`Image ${index}`} 
                                        onClick={() => setCurrentImage(img)}
                                        style={{maxHeight:'100px',maxWidth:'100px',cursor:'pointer'}} />
                                    </div>
                                ))}
                            </div>

                        </div>
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