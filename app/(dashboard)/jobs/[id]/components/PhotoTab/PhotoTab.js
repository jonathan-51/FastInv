import React from "react";
import { usePhotos } from "./usePhotos";
import { PhotosGallery } from "./PhotosGallery";
import { PhotoMainImageButtons } from "./PhotoMainImageButtons";
import { PhotosGalleryButtons } from "./PhotosGalleryButtons";
import { uploadPhoto } from "./actions";

import './PhotoTab.css'

export const PhotosTab = ({jobID,orgID}) => {

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

    return (
        <div className="job-photos">
            <div className="job-photos-toolbar">
                <PhotoMainImageButtons
                    jobID={jobID} 
                    orgID={orgID}
                    images={images}
                    setImages={setImages}
                    setCurrentImage={setCurrentImage}
                    setImageToReplace={setImageToReplace}
                    imageToReplace={imageToReplace}
                    currentImage={currentImage}
                />
                <PhotosGalleryButtons
                    images={images}
                    setImages={setImages}
                    isSelectedImages={isSelectedImages}
                    setIsSelectedImages={setIsSelectedImages}
                    currentImage={currentImage}
                    setCurrentImage={setCurrentImage}
                />
            </div>

            <div className="job-image-content">
                {currentImage ? (
                    <div className="job-image-main1">
                        <img src={currentImage} alt="Uploaded" />
                    </div>
                ) : (
                    <div className="job-image-main2">
                        <label htmlFor="fileInput" className="job-image-upload">
                            <div className="job-image-upload-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                </svg>
                            </div>
                            <div className="job-image-upload-text">
                                <p><span>Click to upload</span> or drag and drop</p>
                                <p>PNG, JPG up to 10MB</p>
                            </div>
                        </label>
                    </div>
                )}

                <PhotosGallery
                    images={images}
                    scrollRef={scrollRef}
 
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