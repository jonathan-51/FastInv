import './MaterialsSearch.css'

export const MaterialsSearch = ({
    searchContainerRef,
    searchDropDownRef,
    searchQuery,
    setSearchQuery,
    searchResult,
    setSearchResult,
    searchList,
    setSearchList,
    showDropDown,
    setShowDropDown,
    quantityMinusDropDown,
    quantityAddDropDown,
    setItemNotes
    }) => {

    const handleRefactor = (apiData) => {
        return apiData.map(item => ({
            productID:item.id ?? '',
            name:item.title ?? '',
            supplier:item.supplier ?? '',
            sku:item.sku ?? '',
            unit:item.unit ?? '',
            brand:item.brand ?? '',
            category:item.category ?? '',
            description:item.description ?? '',
            currency:item.currency ?? '',
            price:item.pric ?? 0,
        }))
    }

    // Function that handles the change in input in search bar
    const handleSearchChange = async (e) => {
        // Updates and stores user input in variable
        setSearchQuery(e.target.value)
        // Assigns the user input to another variable because UseState variables will only update after the function is called again (delayed by one function call)
        const value = e.target.value
        try {
            const response = await fetch('https://fakestoreapi.com/products')

            // Converting fetch API data into JSON
            const data = await response.json()
            const refactored = handleRefactor(data)
            // Turns user input as well as fetch API data into lower case
            // Checks to see if any of the API data entries include keywords from the user input
            // Creates a new variable that stores all the entries that do have keywords in the form of an array.
            const filtered = refactored.filter(product => product.name.toLowerCase().includes(value.toLowerCase()))
            // If user input is empty, search result variable to empty array
            // Else...
            //      If user has not selected any items, intialize all displayed search result items to have a quantity of 0
            //      Else, for all the current quantity selections for the selected items, sync it with the items in the dropdown.
            if (!value) {
                setSearchResult([])
            } else {
                if (searchList.length === 0) {
                    // Intialize all displayed search result items to have a quantity of 0
                    setSearchResult(filtered.map(item => ({...item,quantity:0})))
                } else {
                    //if the user has previously selected items and changed the quantities, it will sync it with the corresponding item's quantity in the dropdown

                    // Goes through each item sequentially in dropdown menu
                    setSearchResult(filtered.map(itemDropDown => {
                        // Checks if the item is both in the list as well as in the dropdown menu
                        const match = searchList.find(itemList => itemList.productID === itemDropDown.productID)
                        // if match is false -> sets item quantity in the drop down menu to 0
                        // if match is true (item is in both list and dropdown menu) --> change the same item's quantity in dropdown menu to be the same as that in list.
                        return match ? {...itemDropDown, quantity: match.quantity}:{...itemDropDown,quantity:0}}))
                }
            }
            

        } catch (error) {}

    
    }

    // Function that handles selecting a specific item in the search result by clicking its name.
    const selectSearch = (e) => {
        
        // First prevents any duplicate items by checking each item already added with item click via name of item.
        if (searchList.find(item => item.name.trim() === e.target.innerText.trim())) {
            return
        } else {
            // Checks if selected item exists in search result, and temporarily stores it in variable
            const selectedItem = {...searchResult.find(item => item.name.trim() === e.target.innerText.trim()),quantity:1}
            
            // Updates search list variable with selected item.
            setSearchList([...searchList,selectedItem])

            //Updates search result variable with selected item.
            setSearchResult(searchResult.map(item => item.productID === selectedItem.productID ? {...item,quantity:1}:item))

            setItemNotes(array => [...array,{productID:selectedItem.productID,isOpen:false,notes:''}])
        }
        
    }


    return (
        <div className="job-materials-search">
            <div className="job-materials-search-main">
                <input
                ref={searchContainerRef}
                className="job-materials-search-bar"
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}

                placeholder="Search for products..."
                />

                {showDropDown && searchResult.length > 0 && (
                <div className="job-materials-dropdown" onFocus={() => setShowDropDown(true)} ref={searchDropDownRef}>
                    {searchResult.map((item) => (
                        <div
                        className="job-materials-dropdown-items"
                        key={item.productID}
                        >
                        
                            <strong onClick = {selectSearch}>{item.name}</strong>
                            <div className="job-materials-item-quantity-dropdown">
                                <button onClick={() => quantityMinusDropDown(item.productID,-1)}>—</button>
                                <p>{item.quantity}</p>
                                <button onClick={() => quantityAddDropDown(item.productID,1)}>+</button>
                                
                            </div>
                        </div>
                    ))}
                    <p style={{marginLeft:'10px',marginBottom:'15px'}}>Found {searchResult.length} results</p>
                </div>
                )}
            </div>
        </div>
    )
}