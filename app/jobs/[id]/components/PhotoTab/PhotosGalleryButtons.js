import './PhotosGalleryButtons.css'

export const PhotosGalleryButtons = ({
    images,
    setImages,
    isSelectedImages,
    setIsSelectedImages,
    currentImage,
    setCurrentImage,
    }) => {

    // Handles selecting/deselecting all images
    const toggleSelectAllImages = () => {
        if (images.length === isSelectedImages.length) {
            setIsSelectedImages([]);
        } else {
            setIsSelectedImages([...isSelectedImages,...images.filter(img => !isSelectedImages.includes(img))])
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

    return (
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
    )
}