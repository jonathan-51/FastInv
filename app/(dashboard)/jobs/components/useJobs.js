import { useStatus } from "@/app/context/StatusContext";
import React, { useEffect, useState, useRef } from "react"

export const useJobs = () => {

    



    const [openJobsStatusID,setOpenJobsStatusID] = useState(null)
    const { statusFields,setStatusFields } = useStatus();
    const statusDropDownRef = useRef(null);
    const jobsStatusButton = useRef({});
    const [currentJobsStatus,setCurrentJobsStatus] = useState({});





return {
    openJobsStatusID,
    setOpenJobsStatusID,
    jobsStatusButton,
    currentJobsStatus,
    setCurrentJobsStatus,
    statusFields,
    setStatusFields
}}