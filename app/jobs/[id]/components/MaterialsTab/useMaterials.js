import { useLocation } from "@/app/context/LocationContext";
import { useStatus } from "@/app/context/StatusContext";
import React, { useState, useRef, useEffect } from "react";

export const useMaterials = ({setShowDropDown,showDropDown}) => {

    // Initializing variable that stores user input for search bar
    const [searchQuery, setSearchQuery] = useState('');
    // Initializing variable that stores all the results from the user input
    const [searchResult, setSearchResult] = useState([]);
    // Initializing variable that references to container that handles searching (search bar)
    const searchContainerRef = useRef(null);
    // Intializing variable that references to dropdown container
    const searchDropDownRef = useRef(null);
    // Initializing variable that stores all items the user has selected
    const [searchList, setSearchList] = useState([]);

    // Initializing useState variable to store selected rows
    const [selectedRows, setSelectedRows] = useState([]);

    const { locationFields,setLocationFields } = useLocation();
    const [openLocationDropDownID, setOpenLocationDropDownID] =  useState(null);
    const locationDropDownRef = useRef(null)
    const locationButtonRef = useRef({})
    const [currentLocations,setCurrentLocations] = useState({})

    const { statusFields,setStatusFields } = useStatus();
    const [openStatusDropDownID, setOpenStatusDropDownID] = useState(null);
    const statusDropDownRef = useRef(null);
    const statusButtonRef = useRef({});
    const [currentStatuses,setCurrentStatuses] = useState({});

    // Initializing variable that controls the display of notes overlay
    const [itemNotes,setItemNotes] = useState([])
    // variable that determines if the note can be opened
    const isOpenNoteValid = itemNotes.some((item_notes) => item_notes.isOpen)
    // variable that stores the current selected notes
    const selectedNotes = itemNotes.find((item_notes) => item_notes.isOpen)
    const selectedNotesItem = selectedNotes ? searchList.find(item => item.productID === selectedNotes.productID) : null

    // Handles displaying dropdown menu
    useEffect(() => {
        // function that runs when mouse is clicked outside search bar and dropdown menu
        const handleClickOutside = (e) => {
            //searchContainerRef.current --> getting referenced container (search bar)
            //searchDropDownRef.current --> getting referenced container (dropdown menu)
            //e.target --> mouse's position on screen after each render.

            // If mouse click is not in either container, dropdown state change to false
            if (searchContainerRef.current && !searchContainerRef.current.contains(e.target) && (!searchDropDownRef.current || !searchDropDownRef.current.contains(e.target))) {
                setShowDropDown(false)
            } else {
            // If mouse click in either container, turn true
                setShowDropDown(true)
            }
            

        }

        // Listens for mouse click, if detected, run function
        document.addEventListener('mousedown',handleClickOutside);

    },[])

    // Handles displaying dropdown menu
    useEffect(() => {
        if (!openLocationDropDownID) return

        // function that runs when mouse is clicked outside search bar and dropdown menu
        const handleClickOutside = (e) => {
            //searchContainerRef.current --> getting referenced container (search bar)
            //searchDropDownRef.current --> getting referenced container (dropdown menu)
            //e.target --> mouse's position on screen after each render.

            const clickedOnAnyButton = Object.values(locationButtonRef.current).some((button) => button && button.contains(e.target))

            if (clickedOnAnyButton) return;


            if (openLocationDropDownID && locationDropDownRef.current && !locationDropDownRef.current.contains(e.target)) {
                setOpenLocationDropDownID(null)
            }

            

        }

        // Listens for mouse click, if detected, run function
        document.addEventListener('mousedown',handleClickOutside);

    },[openLocationDropDownID])

    useEffect(() => {
        if (!openStatusDropDownID) return

        const handleClickOutside = (e) => {

            const clickedOnAnyButton = Object.values(statusButtonRef.current).some((button => button && button.contains(e.target)))

            if (clickedOnAnyButton) return;

            if (openStatusDropDownID && statusDropDownRef.current && !statusDropDownRef.current.contains(e.target)) {
                setOpenStatusDropDownID(null)
            }

        }

        document.addEventListener('mousedown',handleClickOutside)
    },[openStatusDropDownID])

    return {
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
  };
}