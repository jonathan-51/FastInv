'use client' // Allows for intereactive features
import Link from 'next/link';
import './entry.css'
// Importing useState function from react library
// Creates a variable that can change and when it changes, automatically renders the page
import { useState } from 'react' 

// function that handles getting customer information
export default function customerInfo() {
  // Object containing 5 useState variables where the initial value is '', setformData is the function that updates the value
  const [formData, setformData] = useState({
    firstname:'',
    lastname:'',
    email:'',
    number:'',
    address:'',
    notes:'',
    date:'',
  })


  const saveAndNavigate = (e) => {
    e.preventDefault()

    const existingJobs = JSON.parse(localStorage.getItem('jobs') || '[]');

    const datePart = new Date().toLocaleDateString('en-NZ',{day:'2-digit',month:'short',year:'numeric'});
    const timePart = new Date().toLocaleTimeString('en-NZ',{hour:'2-digit',minute:'2-digit',hour12:false});
    console.log(datePart);
    console.log(timePart);
    const date = `${datePart} ${timePart}`

    formData.date = date;

    const newJob = {
      id: Date.now(),
      ...formData
    };

    
    //Stores userdata in an object where data is a string
    localStorage.setItem('jobs',JSON.stringify([...existingJobs,newJob]));

    console.log(formData)
  }

  return (
    // px-8 | Padding of 32 px (2 rem)
    // text-2xl | Make text 2x large
    // mb-4 | Bottom Marge 4 pixels
    <div className='flex'>
      <div className="p-8"> 
        
        <h1 className="text-2xl mb-4">Customer Details</h1>
        <div className='customer-name'>
          <div>
            <p>First Name</p>
            <input
              type="text" // Establish Input type
              value={formData["firstname"]} // Confirms if value matches what is displayed in box, will override if different, replacing what is in box with value
              // Activates when input changes, updates value of relative useState variable.
              onChange={(e) => setformData({ 
                ...formData,
                "firstname":e.target.value})}

              // border | width 1px, style solid, color, default(gray)
              // p-2 | 8px
              // rounded | Border Radius 4px (0.25rem)
              // mb-4 | Bottom Margin 16px (1 rem)
              className="border p-2 rounded mb-4"
            />
          </div>
          
          <div>
            <p>Last Name</p>
            <input
              type="text"
              value={formData["lastname"]}
              onChange={(e) => setformData({
                ...formData,
                "lastname":e.target.value})}
              className="border p-2 rounded mb-4"
            />
          </div>
        </div>

        <div>
          <p>Address</p>
          <input
            type="text"
            value={formData["address"]}
            onChange={(e) => setformData({
              ...formData,
              "address":e.target.value})}
            className="border w-full p-2 rounded mb-4"
          />
        </div>
        
        <div className='contact-details'>
          <div>
            <p>Email</p>
            <input
              type="text"
              value={formData["email"]}
              onChange={(e) => setformData({
                ...formData,
                "email":e.target.value})}
              className="border p-2 rounded mb-4"
            />
          </div>

          <div>
            <p>Mobile Number</p>
            <input
              type="text"
              value={formData["number"]}
              onChange={(e) => setformData({
                ...formData,
                "number":e.target.value})}
              className="border p-2 rounded mb-4"
            />
          </div>
        </div>

        <div className='notes'
        //Handles the notes section
        >
        
          <h1 className="text-2xl mb-2">Notes</h1>
          <textarea
          // textarea similar to input but allows for multiple lines
          type="text"
          value={formData["notes"]}
          onChange={(e) => setformData({
            ...formData,
            "notes":e.target.value})}
          className='w-150 h-40 rounded-lg mb-2 px-1 py-1 border'
          />
        </div>

        <div>
          <button
            // runs saving customer data funciton
            onClick={saveAndNavigate}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            <Link href="/jobs">Add Job</Link>
          </button>
        </div>

      </div>

    </div>
    
  )
}
