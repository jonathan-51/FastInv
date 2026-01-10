import './PhotoMainImageButtons.css'

export const PhotoMainImageButtons = ({
    images,
    setImages,
    setCurrentImage,
    setImageToReplace,
    imageToReplace,
    currentImage,
    }) => {

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

    // Function that redirects user to element responsible for replacing image
    const currentImageReplace = () => {
        // Stores replaced image temporarily
        setImageToReplace(currentImage)        
        document.getElementById('fileReplace').click();
        
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


    return (
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
    )
}