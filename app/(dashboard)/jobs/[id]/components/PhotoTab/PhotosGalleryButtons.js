import './PhotosGalleryButtons.css'

export const PhotosGalleryButtons = ({
    images,
    setImages,
    isSelectedImages,
    setIsSelectedImages,
    currentImage,
    setCurrentImage,
    }) => {

    const toggleSelectAllImages = () => {
        if (images.length === isSelectedImages.length) {
            setIsSelectedImages([]);
        } else {
            setIsSelectedImages([...isSelectedImages,...images.filter(img => !isSelectedImages.includes(img))])
        }
    }

    const handleMultiImageRemove = () => {
        if (isSelectedImages.length > 0) {
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
        }
    }

    return (
        <div className="job-multi-image-buttons">
            <div
                className="job-image-multi-select"
                onClick={toggleSelectAllImages}
                style={{
                    backgroundColor: isSelectedImages.length === images.length && isSelectedImages.length > 0 ? 'var(--selected-surface)' : 'var(--surface-1)',
                    cursor: images.length > 0 ? 'pointer' : 'default',
                    opacity: images.length > 0 ? 1 : 0.5
                }}>
                {isSelectedImages.length === images.length && isSelectedImages.length > 0 ? '✓' : ''}
            </div>
            <div
                className="job-image-multi-remove"
                style={{
                    cursor: isSelectedImages.length > 0 ? 'pointer' : 'default',
                    opacity: isSelectedImages.length > 0 ? 1 : 0.5
                }}
                onClick={handleMultiImageRemove}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
                Remove Selected ({isSelectedImages.length})
            </div>
        </div>
    )
}