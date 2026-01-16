import React from "react";
import './PhotosGallery.css'

export const PhotosGallery = ({
        images,
        scrollRef,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        handleMouseLeave,
        isHovering,
        setIsHovering,
        isDragging,
        setCurrentImage,
        isSelectedImages,
        setIsSelectedImages}) => {

    const toggleSelectImage = (image) => {
        if (isSelectedImages.includes(image)) {
            setIsSelectedImages([...isSelectedImages.filter(img => img !== image)])
        } else {
            setIsSelectedImages([...isSelectedImages, image])
        }
    }

    return (
        <div
            className="job-images"
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={() => setIsHovering(true)}>

            {images.length === 0 ? (
                <div className="job-images-empty">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                    <p>No photos yet</p>
                    <p style={{ fontSize: '13px' }}>Upload photos to see them here</p>
                </div>
            ) : (
                images.map((img, index) => (
                    <div key={index} className="job-images-image-wrapper">
                        <img
                            src={img}
                            alt={`Image ${index + 1}`}
                            onClick={() => setCurrentImage(img)}
                            draggable="false"
                            className="job-images-image"
                            style={{cursor:"pointer"}}
                        />
                        <div
                            className="job-images-image-selectbox"
                            style={{
                                backgroundColor: isSelectedImages.includes(img) ? 'var(--selected-surface)' : 'rgba(255, 255, 255, 0.9)'
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleSelectImage(img);
                            }}>
                            {isSelectedImages.includes(img) ? '✓' : ''}
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}