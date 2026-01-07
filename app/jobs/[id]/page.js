'use client'
import { useRef, useEffect,useState, use } from "react"
import Link from 'next/link';
import { useParams } from "next/navigation";
import './job.css'
import React from 'react'
import { useLocation } from "@/app/context/LocationContext";
import { useStatus } from "@/app/context/StatusContext";


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


    const [isHeadings,setIsHeadings] = useState({
        isOverview: true,
        isPhotos: false,
        isMaterials: false,
        isNotes: false,
    })

    const handleSectionClick = (section) => {
        setIsHeadings({
            isOverview: section === 'overview',
            isPhotos: section === 'photos',
            isMaterials: section === 'materials',
            isNotes: section === 'notes',
        })

        // Prevents dropdown from automatically showing when switching to materials tab.
        if (!isHeadings.isMaterials) {
            setShowDropDown(false)
        }
    }


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
    
    // Initializing the useState variable to store the user-selected images
    const [isSelectedImages, setIsSelectedImages] = useState([]);

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
    const [startY, setStartY] = useState(0)
    // Initialises the variable responsible for getting scroll scroll position of container
    const [scrollTop,setScrollTop] = useState(0)
    // Pointer for scroll to reference to DOM
    const scrollRef = useRef(null)
    // useState variable responsible for declaring if mouse is hovering over container
    const [isHovering, setIsHovering] = useState(false)

    // Handles condition of when mouse is held down in container.
    const handleMouseDown = (e) => {
        // Allows Dragging
        setIsDragging(true);
        // Gets very first initial position of mouse from top edge of container
        setStartY(e.clientY - scrollRef.current.getBoundingClientRect().top)
        // Gets very first initial position of scroll of container
        setScrollTop(scrollRef.current.scrollTop)
    }

    // Handles condition of when mouse is moving
    const handleMouseMove = (e) => {
        // Returns if dragging is not allowed
        if (!isDragging) return;

        // Gets final position of mouse after movement from left edge of container
        const endY = e.clientY - scrollRef.current.getBoundingClientRect().top;
        // Getting distance  of movement, with a ratio of 1:2.7 || Drag Left = +ve, Drag Right = -ve
        const distance = (startY - endY) * 2
        // Storing next iteration's initial position as previous end position
        setStartY(endY)

        // Updates scroll position of container (+ve distance = container moves right || -ve distance = container moves left)
        scrollRef.current.scrollTop = scrollTop + distance
        // Temporarily stores updated scroll position, 
        setScrollTop(scrollRef.current.scrollTop)

        
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


    // Handles selecting/deselecting all images
    const toggleSelectAllImages = () => {
        if (images.length === isSelectedImages.length) {
            setIsSelectedImages([]);
        } else {
            setIsSelectedImages([...isSelectedImages,...images.filter(img => !isSelectedImages.includes(img))])
        }
    }

    // Handles selecting/deselecting a singular image
    const toggleSelectImage = (image) => {
        
        //Checks if the image is already selected

        //If already selected --> deselect it
        if (isSelectedImages.includes(image)) {
            // Destructuring the selected images array by unpacking the image being unselected, effectively removing it from array.
            // Assign the rest to a separate variable and update the selected images array with the new temp variable.
            setIsSelectedImages([...isSelectedImages.filter(img => img !== image)])
        } else {
            setIsSelectedImages([...isSelectedImages,image])
        }
    }




    const handleMultiImageRemove = () => {

        if (isSelectedImages.length > 0) {
            // Scans through the image array with all stored im ages removes any images if it matches with the selected image. Does it via index
            setImages(images.filter(img => !isSelectedImages.includes(img)))
            setIsSelectedImages([])

            if (!isSelectedImages.includes(currentImage)) {

            }
            else if (images.length === isSelectedImages.length) {
                setCurrentImage(null)
            }
            else {
                setCurrentImage(images.find(img => !isSelectedImages.includes(img)))
            }

        } else {
            return
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
    // Initializing variable that stores user input for search bar
    const [searchQuery, setSearchQuery] = useState('');
    // Initializing variable that stores all the results from the user input
    const [searchResult, SetSearchResult] = useState([]);
    // Initializing variable that keeps tract of dropdown state, only exists if true.
    const [showDropDown,setShowDropDown] = useState(false);
    // Initializing variable that references to container that handles searching (search bar)
    const searchContainerRef = useRef(null);
    // Intializing variable that references to dropdown container
    const searchDropDownRef = useRef(null);
    // Initializing variable that stores all items the user has selected
    const [searchList, SetSearchList] = useState([]);

    const { locationFields,setlocationFields } = useLocation();
    const [openLocationDropDownID, setOpenLocationDropDownID] =  useState(null);
    const locationDropDownRef = useRef(null)
    const locationButtonRef = useRef({})
    const [currentLocations,setCurrentLocations] = useState({})

    const { statusFields,setStatusFields } = useStatus();
    const [openStatusDropDownID, setOpenStatusDropDownID] = useState(null);
    const statusDropDownRef = useRef(null);
    const statusButtonRef = useRef({});
    const [currentStatuses,setCurrentStatuses] = useState({});

    // Initializing variable that controls the display of notes overlay
    const [itemNotes,setItemNotes] = useState([])



    const handleRefactor = (apiData) => {
        return apiData.map(item => ({
            productID:item.id ?? '',
            name:item.title ?? '',
            supplier:item.supplier ?? '',
            sku:item.sku ?? '',
            unit:item.unit ?? '',
            brand:item.brand ?? '',
            category:item.category ?? '',
            description:item.description ?? '',
            currency:item.currency ?? '',
            price:item.pric ?? 0,
        }))
    }

    // Function that handles the change in input in search bar
    const handleSearchChange = async (e) => {
        // Updates and stores user input in variable
        setSearchQuery(e.target.value)
        // Assigns the user input to another variable because UseState variables will only update after the function is called again (delayed by one function call)
        const value = e.target.value
        try {
            const response = await fetch('https://fakestoreapi.com/products')

            // Converting fetch API data into JSON
            const data = await response.json()
            const refactored = handleRefactor(data)
            // Turns user input as well as fetch API data into lower case
            // Checks to see if any of the API data entries include keywords from the user input
            // Creates a new variable that stores all the entries that do have keywords in the form of an array.
            const filtered = refactored.filter(product => product.name.toLowerCase().includes(value.toLowerCase()))
            // If user input is empty, search result variable to empty array
            // Else...
            //      If user has not selected any items, intialize all displayed search result items to have a quantity of 0
            //      Else, for all the current quantity selections for the selected items, sync it with the items in the dropdown.
            if (!value) {
                SetSearchResult([])
            } else {
                if (searchList.length === 0) {
                    // Intialize all displayed search result items to have a quantity of 0
                    SetSearchResult(filtered.map(item => ({...item,quantity:0})))
                } else {
                    //if the user has previously selected items and changed the quantities, it will sync it with the corresponding item's quantity in the dropdown

                    // Goes through each item sequentially in dropdown menu
                    SetSearchResult(filtered.map(itemDropDown => {
                        // Checks if the item is both in the list as well as in the dropdown menu
                        const match = searchList.find(itemList => itemList.productID === itemDropDown.productID)
                        // if match is false -> sets item quantity in the drop down menu to 0
                        // if match is true (item is in both list and dropdown menu) --> change the same item's quantity in dropdown menu to be the same as that in list.
                        return match ? {...itemDropDown, quantity: match.quantity}:{...itemDropDown,quantity:0}}))
                }
            }
            

        } catch (error) {}

    
    }

    // Handles displaying dropdown menu
    useEffect(() => {

        // function that runs when mouse is clicked outside search bar and dropdown menu
        const handleClickOutside = (e) => {
            //searchContainerRef.current --> getting referenced container (search bar)
            //searchDropDownRef.current --> getting referenced container (dropdown menu)
            //e.target --> mouse's position on screen after each render.

            // If mouse click is not in either container, dropdown state change to false
            if (searchContainerRef.current && !searchContainerRef.current.contains(e.target) && (!searchDropDownRef.current || !searchDropDownRef.current.contains(e.target))) {
                setShowDropDown(false)
            } else {
            // If mouse click in either container, turn true
                setShowDropDown(true)
            }
            

        }

        // Listens for mouse click, if detected, run function
        document.addEventListener('mousedown',handleClickOutside);

    },[])


    // Function that handles selecting a specific item in the search result by clicking its name.
    const selectSearch = (e) => {
        
        // First prevents any duplicate items by checking each item already added with item click via name of item.
        if (searchList.find(item => item.name.trim() === e.target.innerText.trim())) {
            return
        } else {
            // Checks if selected item exists in search result, and temporarily stores it in variable
            const selectedItem = {...searchResult.find(item => item.name.trim() === e.target.innerText.trim()),quantity:1}
            
            // Updates search list variable with selected item.
            SetSearchList([...searchList,selectedItem])

            //Updates search result variable with selected item.
            SetSearchResult(searchResult.map(item => item.productID === selectedItem.productID ? {...item,quantity:1}:item))

            setItemNotes(array => [...array,{productID:selectedItem.productID,isOpen:false,notes:''}])
        }
        
    }

    useEffect(() => {
        console.log(searchList)
        console.log(itemNotes)
    },[itemNotes])

    // Function that handles removing a specfici item in the list.
    const removeItem = (productID) => {

        // Checks to see if items exist in the list
        if (searchList.length > 0) {
            // Updates list variable with all the items in the list except for the item being removed.
            SetSearchList(searchList.filter(item => item.productID !== productID))
            // Resets the removed items quantity in the dropdown menu to 0 by scanning through all search result items until one matches with item being removed.
            SetSearchResult(searchResult.map(item => 
                item.productID === productID
                ? {...item,quantity:0}
                :item))
            setSelectedRows(selectedRows.filter(item => item !== productID))
        } else {
            return
        }
        
    }

    // Function that handles increasing quantity in dropdown
    const quantityAddDropDown = (productID,amount) => {

        // Scans through all search result items until it matches with item being altered,
        SetSearchResult(searchResult.map(item => 
            item.productID === productID 
            // If item matches, increase its item quantity by 1. 0 in first argument is the minimum
            // If item doesn't match, do nothing.
            ? { ...item, quantity: Math.max(0, item.quantity + amount) } 
            : item
        ))


        // Checks to see if the item's quantity being changed in the dropdown menu already exists in the list or not.
        if (!(searchList.find(item => item.productID === productID))) {
            // If item doesn't exist in the list, add item into variable that stores alls list items as well as change the quantity of selected item to 1.
            const selectedItem = searchResult.find(item => item.productID === productID)
            SetSearchList([...searchList,{...selectedItem,quantity:1}])
        } else {
            // If item already exists in the list, scan through list variable for the specfic item and increase its quantity by 1.
            // For all items that don't match the selected item's ID, do nothing.
            SetSearchList(searchList.map(item => 
            item.productID === productID 
            ? { ...item, quantity: Math.max(0, item.quantity + amount) } 
            : item
            ))
        }
    }

    const quantityMinusDropDown = (productID,amount) => {

        SetSearchResult(searchResult.map(item => 
            item.productID === productID 
            ? { ...item, quantity: Math.max(0, item.quantity + amount) } 
            : item
        ))


        SetSearchList(searchList.map(item => 
        item.productID === productID 
        ? { ...item, quantity: Math.max(0, item.quantity + amount) } 
        : item
        ))
        
    }

    const quantityinput = (productID,value) => {


        if (value !== '' && isNaN(Number(value))) {
            return;  // reject non-numbers
        }

        const qtyinput = value === '' ? '' : parseInt(value);

        SetSearchResult(searchResult.map(item => 
            item.productID === productID 
            ? { ...item, quantity: qtyinput } 
            : item
        ))


        SetSearchList(searchList.map(item => 
        item.productID === productID 
        ? { ...item, quantity: qtyinput } 
        : item
        ))  
        
        

        
        
    }

    // Initializing useState variable to store selected rows
    const [selectedRows, setSelectedRows] = useState([]);

    // Function that handles selecting rows
    const toggleRow = (productID) => {

        // Checks to see if selected row already exists in the array or not.
        
        if (selectedRows.includes(productID)) {
            // If row already exists, remove from array
            setSelectedRows(selectedRows.filter(item => item !== productID))
        } else {
            // If row doesn't exist, add to array
            setSelectedRows([...selectedRows,productID]);
        }
    }

    // Function that handles selection ALL ROWS AT ONCE
    const toggleAllRows = () => {

        if (selectedRows.length === searchList.length) {
            setSelectedRows([])
        } else {
            const unselectedRows = searchList.filter(item => !selectedRows.includes(item.productID)).map(item => item.productID)

            setSelectedRows([...selectedRows,...unselectedRows])
        }
        
    }

    // Function that handles removing all selected rows
    const removeAllSelectedItems = () => {

        // Checks if user has selected any rows
        if (selectedRows.length > 0) {
            // Temporarily store selected rows
            const tempSelectedRows = selectedRows;
            // Create a new array without the selected rows (removing the selected rows from the array)
            SetSearchList([...searchList.filter(item => !selectedRows.includes(item.productID))])
            // Reset selected Row array
            setSelectedRows([])

            // Resets the quantity of respective removed item in dropdown
            // Checks to see if there are items in SearchResult array
            if (searchResult) {
                // Checks to see if the selected items exist in the search result array, and will reset quantity to 0 if exists.
                SetSearchResult(searchResult.map(item => tempSelectedRows.includes(item.productID) ? ({ ...item, quantity:0}):item))

            }
            
        }
    }



    // Handles displaying dropdown menu
    useEffect(() => {
        if (!openLocationDropDownID) return

        // function that runs when mouse is clicked outside search bar and dropdown menu
        const handleClickOutside = (e) => {
            //searchContainerRef.current --> getting referenced container (search bar)
            //searchDropDownRef.current --> getting referenced container (dropdown menu)
            //e.target --> mouse's position on screen after each render.

            const clickedOnAnyButton = Object.values(locationButtonRef.current).some((button) => button && button.contains(e.target))

            if (clickedOnAnyButton) return;


            if (openLocationDropDownID && locationDropDownRef.current && !locationDropDownRef.current.contains(e.target)) {
                setOpenLocationDropDownID(null)
            }

            

        }

        // Listens for mouse click, if detected, run function
        document.addEventListener('mousedown',handleClickOutside);

    },[openLocationDropDownID])

    const displayCurrentLocation = (id,location) => {
        setCurrentLocations({...currentLocations,[id]:location})
    }

    useEffect(() => {
        if (!openStatusDropDownID) return

        const handleClickOutside = (e) => {

            const clickedOnAnyButton = Object.values(statusButtonRef.current).some((button => button && button.contains(e.target)))

            if (clickedOnAnyButton) return;

            if (openStatusDropDownID && statusDropDownRef.current && !statusDropDownRef.current.contains(e.target)) {
                setOpenStatusDropDownID(null)
            }

        }

        document.addEventListener('mousedown',handleClickOutside)
    },[openStatusDropDownID])


    

    // Function that handles expanding the user selected notes
    const handlesNotesExpansion = (id) => {
        setItemNotes(itemNotes.map(item_notes => id === item_notes.productID ? {...item_notes,isOpen:true}:item_notes))

    }

    // variable that determines if the note can be opened
    const isOpenNoteValid = itemNotes.some((item_notes) => item_notes.isOpen)


    
    // variable that stores the current selected notes
    const selectedNotes = itemNotes.find((item_notes) => item_notes.isOpen)

    const selectedNotesItem = selectedNotes ? searchList.find(item => item.productID === selectedNotes.productID) : null

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


    useEffect(() => {
        console.log(searchList.length > 0)
        console.log(itemNotes.some(item_notes => item_notes.isOpen))
    },[itemNotes])

    // since useEffect runs after rendering, initial job value is null, so if statement is required.
    if (job) {
        return (
        <div  className="job-page">
            
            <div className="job-main">
                <div className="job-address">
                    {job.address}
                </div>
                <div className="job-sections">
                    <button onClick={() => handleSectionClick('overview')}>Overview</button>
                    <button onClick={() => handleSectionClick('photos')}>Photos</button>
                    <button onClick={() => handleSectionClick('materials')}>Materials</button>
                    <button onClick={() => handleSectionClick('notes')}>Notes</button>

                </div>
                <div className="job-content">

                    {/*Displays images section */}
                    {isHeadings.isPhotos && (
                        <div className="job-photos">
                            <div style={{display:'flex'}}>
                                <div className="job-photos-headings">
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
                                    <div className="job-image-buttons">
                                        <button className="job-image-replace" onClick={currentImageReplace}></button>
                                        <button className="job-image-remove" onClick={currentImageRemove}></button>
                                    </div>
                                    
                                </div>
                                <div className="job-multi-image-buttons">
                                    <div 
                                    className="job-image-multi-remove"
                                    style={{cursor:images.length > 0 ? 'pointer':''}}
                                    onClick={handleMultiImageRemove}>
                                    Remove Selected
                                    </div>
                                    <div 
                                    className="job-image-multi-select"
                                    onClick={toggleSelectAllImages}
                                    style={{
                                        backgroundColor:isSelectedImages.length === images.length && isSelectedImages.length > 0 ? 'var(--selected-surface)':'var(--surface-1)',
                                        cursor:images.length > 0 ? 'pointer':'',
                                        userSelect:'none'}}>
                                        {isSelectedImages.length === images.length && isSelectedImages.length > 0 ? '✓' : ''}
                                    </div>
                                </div>
                            </div>
                            <div className="job-image-content">

                                {/* Ternary Function that will display the main image if there is a current image
                                If there isn't a current image, it will display a message telling user to upload an image */}
                                {currentImage ? (
                                <div className="job-image-main1">
                                    {/* Displays the main image */}
                                    <img src={currentImage} alt="Uploaded" style={{maxHeight:'100%',maxWidth:'100%',objectFit: 'contain',objectPosition: 'center'}}/>
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

                            {/* Displays all the images uploaded below the main image */}
                            <div 
                                
                                className="job-images"
                                ref ={scrollRef}
                                onMouseDown={handleMouseDown} 
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseLeave}
                                onMouseEnter={() => setIsHovering(true)}
                                style={{cursor: isDragging ? "grabbing":'pointer'}}>
                                    
                                {images.map((img,index) => (
                                    <div key={index} style={{position:'relative'}}>
                                        <img 
                                        src={img} 
                                        alt={`Image ${index}`} 
                                        onClick={() => setCurrentImage(img)}
                                        draggable="false"
                                        className="job-images-image"
                                        style={{cursor: isDragging ? "grabbing":'pointer'}} />

                                        <div 
                                        className="job-images-image-selectbox"
                                        style={{backgroundColor:isSelectedImages.includes(img) ? 'var( --selected-surface)':'var(--surface-1)'}}
                                        onClick={() => {toggleSelectImage(img)}}>
                                            {isSelectedImages.includes(img) ? '✓' : ''}
                                        </div>

                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    )}
                    
                    {isHeadings.isMaterials && (
                    <div className="job-materials">

                        <div className="job-materials-search">
                            <div className="job-materials-search-main">
                                <input
                                ref={searchContainerRef}
                                className="job-materials-search-bar"
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchChange}

                                placeholder="Search for products..."
                                />

                                {showDropDown && searchResult.length > 0 && (
                                <div className="job-materials-dropdown" onFocus={() => setShowDropDown(true)} ref={searchDropDownRef}>
                                    {searchResult.map((item) => (
                                        <div
                                        className="job-materials-dropdown-items"
                                        key={item.productID}
                                        >
                                        
                                            <strong onClick = {selectSearch}>{item.name}</strong>
                                            <div className="job-materials-item-quantity-dropdown">
                                                <button onClick={() => quantityMinusDropDown(item.productID,-1)}>—</button>
                                                <p>{item.quantity}</p>
                                                <button onClick={() => quantityAddDropDown(item.productID,1)}>+</button>
                                                
                                            </div>
                                        </div>
                                    ))}
                                    <p style={{marginLeft:'10px',marginBottom:'15px'}}>Found {searchResult.length} results</p>
                                </div>
                                )}
                            </div>
                        </div>
                        <div
                    
                        className="job-materials-list">
                            <div className="job-materials-list-table-headers">
                                <div 
                                className="job-materials-item-header-select"
                                onClick={() => {toggleAllRows()}}>
                                    <div className="job-materials-item-select-box">
                                    {selectedRows.length === searchList.length && searchList.length > 0 ? '✓' : ''}
                                    </div>
                                </div>

                                <div className="header"><strong className="header-name">Name</strong></div>
                                <div className="header"><strong className="header-quantity">Quantity</strong></div>
                                <div className="header"><strong className="header-location">Location</strong></div>
                                <div className="header"><strong className="header-status">Status</strong></div>
                                <div className="header"><strong className="header-notes">Notes</strong></div>
                                <div className="header">
                                    <strong 
                                    className="header-remove" style={{cursor:'pointer'}}
                                    onClick={removeAllSelectedItems}>Remove</strong>
                                </div>

                            </div>

                            <div className="job-materials-list-table-body">
                            {searchList.length > 0 ? (
                                searchList.map((item) => {
                                    const isSelected = selectedRows.includes(item.productID);
                                    const isSelectedStyle = {backgroundColor:isSelected ? 'var(--selected-surface)':'var(--surface-1)'}
                                    return (
                                    <div 
                                    className="job-materials-list-table-body-row"
                                    key={item.productID}
                                    style={isSelectedStyle}>
                                    
                                    
                                        <div className="job-materials-item-body-select">
                                            <div 
                                            onClick={() => toggleRow(item.productID)} 
                                            className="job-materials-item-select-box"
                                            style={isSelectedStyle}>
                                                {isSelected ? '✓' : ''}
                                            </div>
                                        </div>
                                        
                                        <div 
                                        style={isSelectedStyle}>
                                            {item.name}
                                        </div>
                                        
                                        <div 
                                        className="job-materials-item-quantity"
                                        style={isSelectedStyle}>
                                            <div className="job-materials-item-quantity-buttons">
                                            <button 
                                            style={{height:'100%',flex:'1',cursor:'pointer',userSelect:'none',fontSize:'20px'}} 
                                            onClick={() => quantityMinusDropDown(item.productID,-1)}>
                                                —
                                            </button>
                                            
                                            <input 
                                            style={{width:`${String(item.quantity).length + 1}ch`,display:'flex',textAlign:"center",justifyContent:"center"}} 
                                            type="text" 
                                            inputMode="numeric"
                                            value={item.quantity} 
                                            onChange={(e) => quantityinput(item.productID,e.target.value)}
                                            onBlur={(e) => {if (e.target.value === '') {quantityinput(item.productID,0)}}}/>

                                            <button 
                                            style={{paddingRight:'15px',height:'100%',flex:'1',cursor:'pointer',userSelect:'none',fontSize:'20px'}} 
                                            onClick={() => quantityAddDropDown(item.productID,1)}>
                                                +
                                            </button>
                                            </div>
                                        </div>

                                        <div 
                                        className="job-materials-item-location"
                                        style={isSelectedStyle}>
                                            <div 
                                            className="job-materials-item-button"
                                            onClick={() => setOpenLocationDropDownID(openLocationDropDownID == item.productID ? null:item.productID)}
                                            ref={(element) => locationButtonRef.current[item.productID] = element}>

                                                {currentLocations[item.productID] ? currentLocations[item.productID]:''}

                                                {openLocationDropDownID == item.productID && (
                                                    <div className="job-materials-item-dropdown" ref={locationDropDownRef}>
                                                        {locationFields.map((location) => (
                                                            <div
                                                            key={location} 
                                                            onClick={() => displayCurrentLocation(item.productID,location)}>
                                                                {location}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                
                                            </div>
                                        </div>

                                        <div 
                                        className="job-materials-item-status"
                                        style={isSelectedStyle}>
                                            <div
                                            className="job-materials-item-button"
                                            onClick={() => setOpenStatusDropDownID(openStatusDropDownID === item.productID ? null:item.productID)}
                                            ref={(element) => statusButtonRef.current[item.productID] = element}>

                                                {currentStatuses[item.productID] ? currentStatuses[item.productID]:''}

                                                {openStatusDropDownID === item.productID && (
                                                    <div className="job-materials-item-dropdown" ref={statusDropDownRef}>
                                                        {statusFields.map((status) => (
                                                            <div
                                                            key={status}
                                                            onClick={() => setCurrentStatuses({...currentStatuses,[item.productID]:status})}>
                                                                {status}
                                                            </div>
                                                        ))}

                                                    </div>
                                                )}

                                            </div>
                                        </div>

                                        <div 
                                        className="job-materials-item-notes"
                                        style={isSelectedStyle}
                                        onClick={() => handlesNotesExpansion(item.productID)}>
                                            <div style={{cursor:'pointer'}}>Notes</div>
                                        </div>
                                         
                                        
                                        {searchList.length > 0 && isOpenNoteValid && (
                                            <div 
                                            className="jobs-materials-item-notes-overlay"
                                            onClick={() => {setItemNotes(itemNotes.map(item_notes => item_notes.isOpen ? {...item_notes,isOpen:false}:item_notes))}}>
                                                <div 
                                                className="jobs-materials-item-notes-main">
                                                    <div className="jobs-materials-item-notes-main-header">{selectedNotesItem.name}</div>
                                                    <div className="jobs-materials-item-notes-main-body"></div>
                                                    <div className="jobs-materials-item-notes-main-save">
                                                        <div>Cancel</div>
                                                        <div>Save</div>
                                                    </div>
                                                    

                                                </div>
                                            </div>
                                        )}
                                        

                                        <button 
                                        className="job-materials-item-remove" onClick={() => removeItem(item.productID)}
                                        style={isSelectedStyle}>
                                            <p style={{cursor:'pointer'}}>Remove</p>
                                        </button>
                                    
                                    </div>
                                    )
                                })
                            ):(
                                <p>Please Add Item</p>
                                
                                )}</div>

                        </div>
                        
                    </div>)}

                    {isHeadings.isNotes && (
                    <div>
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
                    </div>)}
                    
                        
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