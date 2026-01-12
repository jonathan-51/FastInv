import React, { useEffect, useState, useRef } from "react"

export const usePhotos = () => {

    // Initialising useState array variable that will store all uploaded images.
    const [images, setImages] = useState([])
    // Initializing the useState variable to store main image
    const [currentImage,setCurrentImage] = useState(null)
    // Initializing the useState variable to store the user-selected images
    const [isSelectedImages, setIsSelectedImages] = useState([]);
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
    // Initialising useState variable to temporarily store the image about to be replaced
    const [imageToReplace,setImageToReplace] = useState(null)


    // Runs when there is a change in main image and rendering
    // If user replaced main image, removed the replaced imaged from the images array
    useEffect(() => {
        if (imageToReplace !== currentImage) {setImages(images.filter(img => img !== imageToReplace))}
        },[currentImage])

    // Handles condition of when mouse button is released in container.
    const handleMouseUp = () => {
        setIsDragging(false);
    }
    
    // Handles condition of when mouse leaves container
    const handleMouseLeave = () => {
        setIsDragging(false);
        setIsHovering(false)
    }




    return {
        images,
        setImages,
        currentImage,
        setCurrentImage,
        isSelectedImages,
        setIsSelectedImages,
        isDragging,
        setIsDragging,
        startY,
        setStartY,
        scrollTop,
        setScrollTop,
        scrollRef,
        isHovering,
        setIsHovering,
        imageToReplace,
        setImageToReplace,
        handleMouseUp,
        handleMouseLeave
    }
}