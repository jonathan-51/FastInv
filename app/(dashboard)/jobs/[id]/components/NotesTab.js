import React, { useState } from "react";


export const NotesTab = ({}) => {
    // Same as Description and Access Notes, but for Notes
    const [notes_text,setNotesText] = useState('');
    const [notesisEditing,setNotesIsEditing] = useState(false);
    const [notes_temp_text,setNotesTempText] = useState('');

    // Initializing useState variables to handle description
        const [descrip_text,setDescripText] = useState('');
        const [descripisEditing,setDescripIsEditing] = useState(false);
        const [descrip_temp_text,setDescripTempText] = useState('');
    
        // Handles Editing description
        // When edit button is pressed, update temp useState constant with current text in description
        // change description display to edit mode
        const handleDescripEdit = () => {
            setDescripTempText(descrip_text);
            setDescripIsEditing(true);
        }
        // Handles saving description
        // when save button is pressed, update main text with temp text (what the user just edited)
        // change description display to view mode
        const handleDescripSave = () => {
            setDescripText(descrip_temp_text);
            setDescripIsEditing(false)
        }
        // Handles cancelling edit of description
        // updates nothing and returns back to view mode
        const handleDescripCancel = () => {
            setDescripIsEditing(false)
        }
    
        // Same as description but for Access Notes //
        const [access_text,setAccessText] = useState('');
        const [accessisEditing,setAccessIsEditing] = useState(false);
        const [access_temp_text,setAccessTempText] = useState('');
    
        const handleAccessEdit = () => {
            setAccessTempText(access_text);
            setAccessIsEditing(true);
        }
        const handleAccessSave = () => {
            setAccessText(access_temp_text);
            setAccessIsEditing(false)
        }
        const handleAccessCancel = () => {
            setAccessIsEditing(false)
        }

    const handleNotesEdit = () => {
        setNotesTempText(notes_text);
        setNotesIsEditing(true);
    }
    const handleNotesSave = () => {
        setNotesText(notes_temp_text);
        setNotesIsEditing(false)
    }
    const handleNotesCancel = () => {
        setNotesIsEditing(false)
    }
    return (
        <div>
            {descripisEditing ? (
                    <div className="job-description">
                        <div className="job-description-headings">
                            <div>Description</div>
                            <div className="job-description-buttons">
                                <button
                                onClick={handleDescripSave}>
                                    Save
                                </button>
                                <button
                                onClick={handleDescripCancel}>Cancel</button>
                            </div>
                        </div>
                        <input
                        value={descrip_temp_text}
                        onChange={(e) => setDescripTempText(e.target.value)}
                        />
                    </div>
                    ) : (
                    <div className="job-description">
                        <div className="job-description-headings">
                            Description
                            <button
                            className="job-description-buttons"
                            onClick={handleDescripEdit}>
                                Edit
                            </button>
                        </div>
                        <div className="view-mode">
                            {descrip_text === '' ? (
                                <div>Click edit to change this text</div>
                            ):(
                                descrip_text
                            )}
                        </div>
                    </div>
            )}

            {accessisEditing ? (
                    <div className="job-access">
                        <div className="job-access-headings">
                            <div>Access Notes</div>
                            <div className="job-access-buttons">
                                <button
                                onClick={handleAccessSave}>
                                    Save
                                </button>
                                <button
                                onClick={handleAccessCancel}>Cancel</button>
                            </div>
                        </div>
                        <input
                        value={access_temp_text}
                        onChange={(e) => setAccessTempText(e.target.value)}
                        />
                    </div>
                    ) : (
                    <div className="job-access">
                        <div className="job-access-headings">
                            Access Notes
                            <button
                            className="job-access-buttons"
                            onClick={handleAccessEdit}>
                                Edit
                            </button>
                        </div>
                        <div className="view-mode">
                            {access_text === '' ? (
                                <div>Click edit to change this text</div>
                            ):(
                                access_text
                            )}
                        </div>
                    </div>
                    )}

            {notesisEditing ? (
                    <div className="job-notes">
                        <div className="job-notes-headings">
                            <div>Notes</div>
                            <div className="job-notes-buttons">
                                <button
                                onClick={handleNotesSave}>
                                    Save
                                </button>
                                <button
                                onClick={handleNotesCancel}>Cancel</button>
                            </div>
                        </div>
                        <input
                        value={notes_temp_text}
                        onChange={(e) => setNotesTempText(e.target.value)}
                        />
                    </div>
                    ) : (
                    <div className="job-notes">
                        <div className="job-notes-headings">
                            Notes
                            <button
                            className="job-notes-buttons"
                            onClick={handleNotesEdit}>
                                Edit
                            </button>
                        </div>
                        <div className="view-mode">
                            {notes_text === '' ? (
                                <div>Click edit to change this text</div>
                            ):(
                                notes_text
                            )}
                        </div>
                    </div>
                
                )}
            </div>
    )
}