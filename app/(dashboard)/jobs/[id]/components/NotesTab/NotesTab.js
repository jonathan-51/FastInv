import React, { useState } from "react";
import './NotesTab.css';

export const NotesTab = () => {
    const [notes, setNotes] = useState([]);
    const [selectedNoteId, setSelectedNoteId] = useState(null);
    const [isAddingNote, setIsAddingNote] = useState(false);
    const [newNoteTitle, setNewNoteTitle] = useState('');
    const [newNoteContent, setNewNoteContent] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');

    const selectedNote = notes.find(note => note.id === selectedNoteId);

    const quickAddCategories = [
        'Access',
        'Customer',
        'Materials',
        'Safety',
        'Follow-up'
    ];

    const handleQuickAdd = (category) => {
        setNewNoteTitle(category);
        setIsAddingNote(true);
    };

    const handleAddNote = () => {
        if (!newNoteTitle.trim()) return;

        const newNote = {
            id: Date.now(),
            title: newNoteTitle.trim(),
            content: newNoteContent.trim(),
            createdAt: new Date().toLocaleDateString('en-AU', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            })
        };

        setNotes([newNote, ...notes]);
        setSelectedNoteId(newNote.id);
        setNewNoteTitle('');
        setNewNoteContent('');
        setIsAddingNote(false);
    };

    const handleCancelAdd = () => {
        setIsAddingNote(false);
        setNewNoteTitle('');
        setNewNoteContent('');
    };

    const handleStartEdit = () => {
        if (!selectedNote) return;
        setEditTitle(selectedNote.title);
        setEditContent(selectedNote.content);
        setIsEditing(true);
    };

    const handleSaveEdit = () => {
        setNotes(notes.map(note =>
            note.id === selectedNoteId
                ? { ...note, title: editTitle.trim(), content: editContent.trim() }
                : note
        ));
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    const handleDeleteNote = () => {
        const noteIndex = notes.findIndex(note => note.id === selectedNoteId);
        const newNotes = notes.filter(note => note.id !== selectedNoteId);
        setNotes(newNotes);

        // Select next note or previous if deleting last
        if (newNotes.length > 0) {
            const nextIndex = Math.min(noteIndex, newNotes.length - 1);
            setSelectedNoteId(newNotes[nextIndex].id);
        } else {
            setSelectedNoteId(null);
        }
        setIsEditing(false);
    };

    return (
        <div className="notes-tab">
            {/* Sidebar */}
            <div className="notes-sidebar">
                <div className="notes-sidebar-header">
                    <h2 className="notes-sidebar-title">Notes</h2>
                    <button
                        className="notes-sidebar-add"
                        onClick={() => setIsAddingNote(true)}
                        title="Add note">
                        +
                    </button>
                </div>

                {notes.length === 0 && (
                    <div className="notes-quick-add">
                        <p className="notes-quick-add-label">Quick add</p>
                        <div className="notes-quick-add-buttons">
                            {quickAddCategories.map((category) => (
                                <button
                                    key={category}
                                    className="notes-quick-add-btn"
                                    onClick={() => handleQuickAdd(category)}>
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="notes-sidebar-list">
                    {notes.length === 0 && !isAddingNote ? (
                        <div className="notes-sidebar-empty">
                            No notes yet
                        </div>
                    ) : (
                        notes.map((note) => (
                            <div
                                key={note.id}
                                className={`notes-sidebar-item ${selectedNoteId === note.id ? 'active' : ''}`}
                                onClick={() => {
                                    setSelectedNoteId(note.id);
                                    setIsEditing(false);
                                }}>
                                <span className="notes-sidebar-item-title">{note.title}</span>
                                <span className="notes-sidebar-item-date">{note.createdAt}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Main content */}
            <div className="notes-content">
                {isAddingNote ? (
                    <div className="notes-content-form">
                        <input
                            type="text"
                            className="notes-form-title"
                            placeholder="Note title"
                            value={newNoteTitle}
                            onChange={(e) => setNewNoteTitle(e.target.value)}
                            autoFocus
                        />
                        <textarea
                            className="notes-form-content"
                            placeholder="Write your note here..."
                            value={newNoteContent}
                            onChange={(e) => setNewNoteContent(e.target.value)}
                        />
                        <div className="notes-form-actions">
                            <button
                                className="notes-form-save"
                                onClick={handleAddNote}
                                disabled={!newNoteTitle.trim()}>
                                Save Note
                            </button>
                            <button
                                className="notes-form-cancel"
                                onClick={handleCancelAdd}>
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : selectedNote ? (
                    isEditing ? (
                        <div className="notes-content-form">
                            <input
                                type="text"
                                className="notes-form-title"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                autoFocus
                            />
                            <textarea
                                className="notes-form-content"
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                            />
                            <div className="notes-form-actions">
                                <button
                                    className="notes-form-save"
                                    onClick={handleSaveEdit}
                                    disabled={!editTitle.trim()}>
                                    Save
                                </button>
                                <button
                                    className="notes-form-cancel"
                                    onClick={handleCancelEdit}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="notes-content-view">
                            <div className="notes-content-header">
                                <h2 className="notes-content-title">{selectedNote.title}</h2>
                                <span className="notes-content-date">{selectedNote.createdAt}</span>
                            </div>
                            <div className="notes-content-body">
                                {selectedNote.content || <span className="notes-content-empty">No content</span>}
                            </div>
                            <div className="notes-content-actions">
                                <button
                                    className="notes-action-edit"
                                    onClick={handleStartEdit}>
                                    Edit
                                </button>
                                <button
                                    className="notes-action-delete"
                                    onClick={handleDeleteNote}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    )
                ) : (
                    <div className="notes-content-placeholder">
                        <p>Select a note to view</p>
                        <p className="notes-content-placeholder-hint">or click + to create a new note</p>
                    </div>
                )}
            </div>
        </div>
    );
};
