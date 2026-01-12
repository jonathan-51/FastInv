import React from "react";
import { useRef, useEffect,useState, use } from "react"
import { usePhotos } from "./usePhotos";
import { PhotosGallery } from "./PhotosGallery";
import { PhotoMainImageButtons } from "./PhotoMainImageButtons";
import { PhotosGalleryButtons } from "./PhotosGalleryButtons";
import './PhotoTab.css'

export const PhotosTab = () => {

    const {
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
    } = usePhotos()

// Handling Images
    

    

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

    return (
        <div className="job-photos">
            
            <div style={{display:'flex'}}>
                <PhotoMainImageButtons
                images={images}
                setImages={setImages}
                setCurrentImage={setCurrentImage}
                setImageToReplace={setImageToReplace}
                imageToReplace={imageToReplace}
                currentImage={currentImage}/>

                <PhotosGalleryButtons
                images={images}
                setImages={setImages}
                isSelectedImages={isSelectedImages}
                setIsSelectedImages={setIsSelectedImages}
                currentImage={currentImage}
                setCurrentImage={setCurrentImage}/>
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
            <PhotosGallery 
            images={images}
            scrollRef={scrollRef}
            handleMouseDown={handleMouseDown}
            handleMouseMove={handleMouseMove}
            handleMouseUp={handleMouseUp}
            handleMouseLeave={handleMouseLeave}
            setIsHovering={setIsHovering}
            isDragging={isDragging}
            setCurrentImage={setCurrentImage}
            isSelectedImages={isSelectedImages}
            setIsSelectedImages={setIsSelectedImages}
            />
        </div>
    </div>
    )
}