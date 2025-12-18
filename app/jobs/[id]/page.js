'use client'
import { useRef, useEffect,useState } from "react"
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

    // Initializing the useState variable to store main image
    const [currentImage,setCurrentImage] = useState(null)


    // Function that handles Image Upload
    const handleImageChange = (e) => {
        // Gets the selected file or files from the input
        const files = Array.from(e.target.files);
        // Creates a temporary blob URL
        const imageURLS = files.map(file => URL.createObjectURL(file))
        // Adds the new image or images to the images array
        setImages([...images, ...imageURLS])
        // Sets the first image selected by user as the current main image
        setCurrentImage(imageURLS[0])
        // Resets path to image so the same image can be uploaded.
        e.target.value = ''

        }
    
    
    // Runs when there is a change in main image and rendering
    // If user replaced main image, removed the replaced imaged from the images array
    useEffect(() => {
        if (imageToReplace !== currentImage) {setImages(images.filter(img => img !== imageToReplace))}
        },[currentImage])
    
    // Initialising useState variable to temporarily store the image about to be replaced
    const [imageToReplace,setImageToReplace] = useState(null)
    
    // Function that redirects user to element responsible for replacing image
    const currentImageReplace = () => {
        // Stores replaced image temporarily
        setImageToReplace(currentImage)        
        document.getElementById('fileReplace').click();
        
    }

    // Function that handles Image Replacement
    const handleImageReplace = (e) => {
        // Grab file inputted from user and create temporary blob
        const file = e.target.files[0];
            const imageURL = URL.createObjectURL(file);
            // Getting index of image about to be replaced from images array
            const imageIndex = images.findIndex(img => img === imageToReplace); 
            // Scans through images array and replaces image with new image
            setImages(images.map((img,i) => (i === imageIndex ? imageURL:img)));
            // Clears useState variable responsible for temporarily storing about to be replaced image
            setImageToReplace(null);
            // Sets new image as main image
            setCurrentImage(imageURL)
            // Clears fake path for newly inputted image
            e.target.value = ''
    }

    // Function that handles Image Removal
    // 1. Sets main image variable to null
    // 2. Scans through the array of images and filters out the image being removed (the current main image being displayed)
    // 3. Changes fake file path of image ensure the same image can be uploaded
    const currentImageRemove = () => {
        //Sets main image variable to null
        setCurrentImage(null);
        //Scans through the array of images and filters out the image being removed (the current main image being displayed)
        setImages(images.filter(img => img !== currentImage))
        //Changes fake file path of image ensure the same image can be uploaded
        document.getElementById('fileInput').value = ''

        // Runs if the image being removed is the first image in the list
        if (images.indexOf(currentImage) === 0) {
            // Changes main image to image right of removed image after being removed
            setCurrentImage(images[images.indexOf(currentImage)+1])
        // Runs if the image being removed is not the first image in the list
        } else {
            // Changes main image to image left of removed image after being removed
            setCurrentImage(images[images.indexOf(currentImage)-1])

        }
    }

    // useState variable responsible for declaring if dragging is allowed
    const [isDragging, setIsDragging] = useState(false)
    // Stores the initial position of mouse movement
    const [startX, setStartX] = useState(0)
    // Initialises the variable responsible for getting scroll scroll position of container
    const [scrollLeft,setScrollLeft] = useState(0)
    // Pointer for scroll to reference to DOM
    const scrollRef = useRef(null)
    // useState variable responsible for declaring if mouse is hovering over container
    const [isHovering, setIsHovering] = useState(false)

    // Handles condition of when mouse is held down in container.
    const handleMouseDown = (e) => {
        // Allows Dragging
        setIsDragging(true);
        // Gets very first initial position of mouse from left edge of container
        setStartX(e.pageX - scrollRef.current.offsetLeft)
        // Gets very first initial position of scroll of container
        setScrollLeft(scrollRef.current.scrollLeft)
    }

    // Handles condition of when mouse is moving
    const handleMouseMove = (e) => {
        // Returns if dragging is not allowed
        if (!isDragging) return;

        // Gets final position of mouse after movement from left edge of container
        const endX = e.pageX - scrollRef.current.offsetLeft;
        // Getting distance  of movement, with a ratio of 1:2.7 || Drag Left = +ve, Drag Right = -ve
        const distance = (startX - endX) * 2.7
        // Storing next iteration's initial position as previous end position
        setStartX(endX)

        // Updates scroll position of container (+ve distance = container moves right || -ve distance = container moves left)
        scrollRef.current.scrollLeft = scrollLeft + distance
        // Temporarily stores updated scroll position, 
        setScrollLeft(scrollRef.current.scrollLeft)

        
    }

    // Handles condition of when mouse button is released in container.
    const handleMouseUp = () => {
        setIsDragging(false);
    }
    

    // Handles condition of when mouse leaves container
    const handleMouseLeave = () => {
        setIsDragging(false);
        setIsHovering(false)
    }


    // Runs only when the hovering state changes (either user enters or leaves container)
    useEffect(() => {
        // Pointing to container that needs scrolling
        const container = scrollRef.current;

        if (!container) return;

        // Function that handles using mouse whell to scroll list of images
        const handleWheel = (e) => {
            e.stopPropagation();
            e.preventDefault();
            // Updates scroll position for each scroll based on vertical direction of mouse scroll
            scrollRef.current.scrollLeft += e.deltaY;
    }   
        // Listens for when scroll wheel is used in container and turns off scrolling for page.
        if (isHovering) {container.addEventListener('wheel',handleWheel, {passive:false})};

        // Re enables scrolling for page
        return () => {
            container.removeEventListener('wheel',handleWheel);
        }

    },[isHovering])

    

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
                        <div className="job-photos-headings">
                            <div>Photos</div>
                            <div>
                                {/* input element that allows user to choose image to upload */}
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                    style={{display:'none'}}
                                    id ="fileInput"
                                />

                                {/* input element that allows user to choose image to replace */}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageReplace}
                                    style={{display:'none'}}
                                    id ="fileReplace"
                                />

                                <label htmlFor="fileInput">Upload</label>
                            </div>
                        </div>

                            <div className="job-image-content">

                                {/* Ternary Function that will display the main image if there is a current image
                                If there isn't a current image, it will display a message telling user to upload an image */}
                                {currentImage ? (
                                <div className="job-image-content">

                                    {/* Displays the main image */}
                                    <div className="job-image-main1">
                                        
                                        <button className="job-image-replace" onClick={currentImageReplace}></button>
                                        <button className="job-image-remove" onClick={currentImageRemove}></button>
                                        <img src={currentImage} alt="Uploaded" style={{maxHeight:'100%',maxWidth:'100%',objectFit: 'contain',objectPosition: 'center'}}/>
                                    </div>
                                    
                                    {/* Displays all the images uploaded below the main image */}
                                    <div 
                                    
                                    className="job-images"
                                    ref ={scrollRef}
                                    onMouseDown={handleMouseDown} 
                                    onMouseMove={handleMouseMove}
                                    onMouseUp={handleMouseUp}
                                    onMouseLeave={handleMouseLeave}
                                    onMouseEnter={() => setIsHovering(true)}
                                    style={{cursor: isDragging ? "grabbing":'grab'}}>
                                        
                                        {images.map((img,index) => (
                                            <div key={index}>
                                                <img 
                                                src={img} 
                                                alt={`Image ${index}`} 
                                                onClick={() => setCurrentImage(img)}
                                                draggable="false"
                                                style={{maxHeight:'100px',maxWidth:'100px',cursor: isDragging ? "grabbing":'pointer'}} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                            :
                            (   
                                
                                <div className="job-image-main2"> 
                                    {/* Displays text advising user to upload an image */}
                                    <label htmlFor="fileInput" className="job-image-upload">
                                        <p style={{color:'#999'}}>Click to upload image</p>
                                    </label>
                                </div>
                            )}

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