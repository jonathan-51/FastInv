import React, { useState, useRef, useEffect } from "react";
import { useMaterials } from "./useMaterials";
import { MaterialsSearch } from "./MaterialsSearch";


export const MaterialsTab = ({showDropDown,setShowDropDown}) => {

    const {
    // Search
    searchQuery,
    setSearchQuery,
    searchResult,
    setSearchResult,
    searchContainerRef,
    searchDropDownRef,
    searchList,
    setSearchList,

    // Selection
    selectedRows,
    setSelectedRows,

    // Location
    locationFields,
    setLocationFields,
    openLocationDropDownID,
    setOpenLocationDropDownID,
    locationDropDownRef,
    locationButtonRef,
    currentLocations,
    setCurrentLocations,

    // Status
    statusFields,
    setStatusFields,
    openStatusDropDownID,
    setOpenStatusDropDownID,
    statusDropDownRef,
    statusButtonRef,
    currentStatuses,
    setCurrentStatuses,

    // Notes
    itemNotes,
    setItemNotes,
    isOpenNoteValid,
    selectedNotes,
    selectedNotesItem
    } = useMaterials({setShowDropDown,showDropDown})


    // Function that handles removing a specfici item in the list.
    const removeItem = (productID) => {

        // Checks to see if items exist in the list
        if (searchList.length > 0) {
            // Updates list variable with all the items in the list except for the item being removed.
            setSearchList(searchList.filter(item => item.productID !== productID))
            // Resets the removed items quantity in the dropdown menu to 0 by scanning through all search result items until one matches with item being removed.
            setSearchResult(searchResult.map(item => 
                item.productID === productID
                ? {...item,quantity:0}
                :item))
            setSelectedRows(selectedRows.filter(item => item !== productID))
        } else {
            return
        }
        
    }

    // Function that handles increasing quantity in dropdown
    const quantityAddDropDown = (productID,amount) => {

        // Scans through all search result items until it matches with item being altered,
        setSearchResult(searchResult.map(item => 
            item.productID === productID 
            // If item matches, increase its item quantity by 1. 0 in first argument is the minimum
            // If item doesn't match, do nothing.
            ? { ...item, quantity: Math.max(0, item.quantity + amount) } 
            : item
        ))


        // Checks to see if the item's quantity being changed in the dropdown menu already exists in the list or not.
        if (!(searchList.find(item => item.productID === productID))) {
            // If item doesn't exist in the list, add item into variable that stores alls list items as well as change the quantity of selected item to 1.
            const selectedItem = searchResult.find(item => item.productID === productID)
            setSearchList([...searchList,{...selectedItem,quantity:1}])
        } else {
            // If item already exists in the list, scan through list variable for the specfic item and increase its quantity by 1.
            // For all items that don't match the selected item's ID, do nothing.
            setSearchList(searchList.map(item => 
            item.productID === productID 
            ? { ...item, quantity: Math.max(0, item.quantity + amount) } 
            : item
            ))
        }
    }

    const quantityMinusDropDown = (productID,amount) => {

        setSearchResult(searchResult.map(item => 
            item.productID === productID 
            ? { ...item, quantity: Math.max(0, item.quantity + amount) } 
            : item
        ))


        setSearchList(searchList.map(item => 
        item.productID === productID 
        ? { ...item, quantity: Math.max(0, item.quantity + amount) } 
        : item
        ))
        
    }

    const quantityinput = (productID,value) => {


        if (value !== '' && isNaN(Number(value))) {
            return;  // reject non-numbers
        }

        const qtyinput = value === '' ? '' : parseInt(value);

        setSearchResult(searchResult.map(item => 
            item.productID === productID 
            ? { ...item, quantity: qtyinput } 
            : item
        ))


        setSearchList(searchList.map(item => 
        item.productID === productID 
        ? { ...item, quantity: qtyinput } 
        : item
        ))  
        
        

        
        
    }

    

    // Function that handles selecting rows
    const toggleRow = (productID) => {

        // Checks to see if selected row already exists in the array or not.
        
        if (selectedRows.includes(productID)) {
            // If row already exists, remove from array
            setSelectedRows(selectedRows.filter(item => item !== productID))
        } else {
            // If row doesn't exist, add to array
            setSelectedRows([...selectedRows,productID]);
        }
    }

    // Function that handles selection ALL ROWS AT ONCE
    const toggleAllRows = () => {

        if (selectedRows.length === searchList.length) {
            setSelectedRows([])
        } else {
            const unselectedRows = searchList.filter(item => !selectedRows.includes(item.productID)).map(item => item.productID)

            setSelectedRows([...selectedRows,...unselectedRows])
        }
        
    }

    // Function that handles removing all selected rows
    const removeAllSelectedItems = () => {

        // Checks if user has selected any rows
        if (selectedRows.length > 0) {
            // Temporarily store selected rows
            const tempSelectedRows = selectedRows;
            // Create a new array without the selected rows (removing the selected rows from the array)
            setSearchList([...searchList.filter(item => !selectedRows.includes(item.productID))])
            // Reset selected Row array
            setSelectedRows([])

            // Resets the quantity of respective removed item in dropdown
            // Checks to see if there are items in SearchResult array
            if (searchResult) {
                // Checks to see if the selected items exist in the search result array, and will reset quantity to 0 if exists.
                setSearchResult(searchResult.map(item => tempSelectedRows.includes(item.productID) ? ({ ...item, quantity:0}):item))

            }
            
        }
    }

    const displayCurrentLocation = (id,location) => {
        setCurrentLocations({...currentLocations,[id]:location})
    }

    // Function that handles expanding the user selected notes
    const handlesNotesExpansion = (id) => {
        setItemNotes(itemNotes.map(item_notes => id === item_notes.productID ? {...item_notes,isOpen:true}:item_notes))

    }

    return (
        <div className="job-materials">
            
            <MaterialsSearch
            searchContainerRef={searchContainerRef}
            searchDropDownRef={searchDropDownRef}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchResult={searchResult}
            setSearchResult={setSearchResult}
            searchList={searchList}
            setSearchList={setSearchList}
            showDropDown={showDropDown}
            setShowDropDown={setShowDropDown}
            quantityMinusDropDown={quantityMinusDropDown}
            quantityAddDropDown={quantityAddDropDown}
            setItemNotes={setItemNotes}
            />

            <div
        
            className="job-materials-list">
                <div className="job-materials-list-table-headers">
                    <div 
                    className="job-materials-item-header-select"
                    onClick={() => {toggleAllRows()}}>
                        <div className="job-materials-item-select-box">
                        {selectedRows.length === searchList.length && searchList.length > 0 ? '✓' : ''}
                        </div>
                    </div>

                    <div className="header"><strong className="header-name">Name</strong></div>
                    <div className="header"><strong className="header-quantity">Quantity</strong></div>
                    <div className="header"><strong className="header-location">Location</strong></div>
                    <div className="header"><strong className="header-status">Status</strong></div>
                    <div className="header"><strong className="header-notes">Notes</strong></div>
                    <div className="header">
                        <strong 
                        className="header-remove" style={{cursor:'pointer'}}
                        onClick={removeAllSelectedItems}>Remove</strong>
                    </div>

                </div>

                <div className="job-materials-list-table-body">
                {searchList.length > 0 ? (
                    searchList.map((item) => {
                        const isSelected = selectedRows.includes(item.productID);
                        const isSelectedStyle = {backgroundColor:isSelected ? 'var(--selected-surface)':'var(--surface-1)'}
                        return (
                        <div 
                        className="job-materials-list-table-body-row"
                        key={item.productID}
                        style={isSelectedStyle}>
                        
                        
                            <div className="job-materials-item-body-select">
                                <div 
                                onClick={() => toggleRow(item.productID)} 
                                className="job-materials-item-select-box"
                                style={isSelectedStyle}>
                                    {isSelected ? '✓' : ''}
                                </div>
                            </div>
                            
                            <div 
                            style={isSelectedStyle}>
                                {item.name}
                            </div>
                            
                            <div 
                            className="job-materials-item-quantity"
                            style={isSelectedStyle}>
                                <div className="job-materials-item-quantity-buttons">
                                <button 
                                style={{height:'100%',flex:'1',cursor:'pointer',userSelect:'none',fontSize:'20px'}} 
                                onClick={() => quantityMinusDropDown(item.productID,-1)}>
                                    —
                                </button>
                                
                                <input 
                                style={{width:`${String(item.quantity).length + 1}ch`,display:'flex',textAlign:"center",justifyContent:"center"}} 
                                type="text" 
                                inputMode="numeric"
                                value={item.quantity} 
                                onChange={(e) => quantityinput(item.productID,e.target.value)}
                                onBlur={(e) => {if (e.target.value === '') {quantityinput(item.productID,0)}}}/>

                                <button 
                                style={{paddingRight:'15px',height:'100%',flex:'1',cursor:'pointer',userSelect:'none',fontSize:'20px'}} 
                                onClick={() => quantityAddDropDown(item.productID,1)}>
                                    +
                                </button>
                                </div>
                            </div>

                            <div 
                            className="job-materials-item-location"
                            style={isSelectedStyle}>
                                <div 
                                className="job-materials-item-button"
                                onClick={() => setOpenLocationDropDownID(openLocationDropDownID == item.productID ? null:item.productID)}
                                ref={(element) => locationButtonRef.current[item.productID] = element}>

                                    {currentLocations[item.productID] ? currentLocations[item.productID]:''}

                                    {openLocationDropDownID == item.productID && (
                                        <div className="job-materials-item-dropdown" ref={locationDropDownRef}>
                                            {locationFields.map((location) => (
                                                <div
                                                key={location} 
                                                onClick={() => displayCurrentLocation(item.productID,location)}>
                                                    {location}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    
                                </div>
                            </div>

                            <div 
                            className="job-materials-item-status"
                            style={isSelectedStyle}>
                                <div
                                className="job-materials-item-button"
                                onClick={() => setOpenStatusDropDownID(openStatusDropDownID === item.productID ? null:item.productID)}
                                ref={(element) => statusButtonRef.current[item.productID] = element}>

                                    {currentStatuses[item.productID] ? currentStatuses[item.productID]:''}

                                    {openStatusDropDownID === item.productID && (
                                        <div className="job-materials-item-dropdown" ref={statusDropDownRef}>
                                            {statusFields.map((status) => (
                                                <div
                                                key={status}
                                                onClick={() => setCurrentStatuses({...currentStatuses,[item.productID]:status})}>
                                                    {status}
                                                </div>
                                            ))}

                                        </div>
                                    )}

                                </div>
                            </div>

                            <div 
                            className="job-materials-item-notes"
                            style={isSelectedStyle}
                            onClick={() => handlesNotesExpansion(item.productID)}>
                                <div style={{cursor:'pointer'}}>Notes</div>
                            </div>
                                
                            
                            {searchList.length > 0 && isOpenNoteValid && (
                                <div 
                                className="jobs-materials-item-notes-overlay"
                                onClick={() => {setItemNotes(itemNotes.map(item_notes => item_notes.isOpen ? {...item_notes,isOpen:false}:item_notes))}}>
                                    <div 
                                    className="jobs-materials-item-notes-main">
                                        <div className="jobs-materials-item-notes-main-header">{selectedNotesItem.name}</div>
                                        <div className="jobs-materials-item-notes-main-body"></div>
                                        <div className="jobs-materials-item-notes-main-save">
                                            <div>Cancel</div>
                                            <div>Save</div>
                                        </div>
                                        

                                    </div>
                                </div>
                            )}
                            

                            <button 
                            className="job-materials-item-remove" onClick={() => removeItem(item.productID)}
                            style={isSelectedStyle}>
                                <p style={{cursor:'pointer'}}>Remove</p>
                            </button>
                        
                        </div>
                        )
                    })
                ):(
                    <p>Please Add Item</p>
                    
                    )}</div>

            </div>
            
        </div>
    )
}