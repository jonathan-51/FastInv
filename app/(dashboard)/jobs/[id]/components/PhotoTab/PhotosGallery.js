import React from "react";
import './PhotosGallery.css'

export const PhotosGallery = ({
        images,
        scrollRef,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        handleMouseLeave,
        setIsHovering,
        isDragging,
        setCurrentImage,
        isSelectedImages,
        setIsSelectedImages}) => {
        

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
    
    return (
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
    )
}