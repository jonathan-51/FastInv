import { uploadPhoto } from './actions';
import './PhotoMainImageButtons.css'

export const PhotoMainImageButtons = ({
    images,
    setImages,
    setCurrentImage,
    setImageToReplace,
    imageToReplace,
    currentImage,
    jobID,
    orgID,
    }) => {

    // Function that handles Image Upload
    const handleImageChange = async (e) => {
        const files = Array.from(e.target.files);       // Get selected files

        const uploadPromises = files.map(file => {
            const formData = new FormData()
            formData.append('file',file)
            formData.append('jobID',jobID)
            formData.append('orgID',orgID)

            console.log(formData)

            return uploadPhoto(formData)
        })
        try {
            const results = await Promise.all(uploadPromises)

            // Check for errors in results
            const errors = results.filter(r => r.error)
            if (errors.length > 0) {
                errors.forEach((err, idx) => {
                    console.error(`Upload ${idx + 1} error:`, err.error)
                })
                return
            }

            const uploadedUrls = results.map(result => result.data.publicUrl)
            console.log('Uploaded URLs:', uploadedUrls)
            setImages(prev => [...prev, ...uploadedUrls])
            setCurrentImage(uploadedUrls[0])
            e.target.value = ''
        } catch (err) {
            console.error('Upload failed:', err)
        }

    }

    // Function that handles Image Replacement
    const handleImageReplace = (e) => {
        const file = e.target.files[0];
        const imageURL = URL.createObjectURL(file);
        const imageIndex = images.findIndex(img => img === imageToReplace);
        setImages(images.map((img,i) => (i === imageIndex ? imageURL:img)));
        setImageToReplace(null);
        setCurrentImage(imageURL)
        e.target.value = ''
    }

    // Function that redirects user to element responsible for replacing image
    const currentImageReplace = () => {
        setImageToReplace(currentImage)
        document.getElementById('fileReplace').click();
    }

    // Function that handles Image Removal
    const currentImageRemove = () => {
        setCurrentImage(null);
        setImages(images.filter(img => img !== currentImage))
        document.getElementById('fileInput').value = ''

        if (images.indexOf(currentImage) === 0) {
            setCurrentImage(images[images.indexOf(currentImage)+1])
        } else {
            setCurrentImage(images[images.indexOf(currentImage)-1])
        }
    }

    return (
        <div className="job-photos-headings">
            <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                style={{display:'none'}}
                id="fileInput"
            />

            <input
                type="file"
                accept="image/*"
                onChange={handleImageReplace}
                style={{display:'none'}}
                id="fileReplace"
            />

            <label htmlFor="fileInput" className="job-upload-btn">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Upload Photos
            </label>

            <div className="job-image-buttons">
                <button
                    className="job-image-btn"
                    onClick={currentImageReplace}
                    disabled={!currentImage}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                    Replace
                </button>
                <button
                    className="job-image-btn remove"
                    onClick={currentImageRemove}
                    disabled={!currentImage}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                    Remove
                </button>
            </div>
        </div>
    )
}