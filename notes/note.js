const noteTitleInput = document.getElementById("note-title-input");
const noteInput = document.getElementById("note-input");
const addNoteBtn = document.getElementById("add-note-btn");
const notesList = document.getElementById("notes-list");
const noNotesMessage = document.getElementById("no-notes-message");
const saveNotification = document.getElementById("save-notification");
const deleteModal = document.getElementById("delete-modal");
const cancelDeleteBtn = document.getElementById("cancel-delete");
const confirmDeleteBtn = document.getElementById("confirm-delete");

// In-memory storage for the demo
let notesStorage = [];
let noteToDelete = -1; // Track which note is being deleted

// Function to get notes from localStorage
function getNotes() {
  const notes = localStorage.getItem("modern-notepad-notes");
  return notes ? JSON.parse(notes) : [];
}

// Function to save notes to localStorage
function saveNotes(notes) {
  localStorage.setItem("modern-notepad-notes", JSON.stringify(notes));
}

// Function to show the save notification
function showSaveNotification() {
  saveNotification.classList.add("show");
  setTimeout(() => {
    saveNotification.classList.remove("show");
  }, 3000);
}

// Function to display notes
function displayNotes() {
  const notes = getNotes();
  notesList.innerHTML = "";

  if (notes.length === 0) {
    noNotesMessage.style.display = "block";
  } else {
    noNotesMessage.style.display = "none";
    notes.forEach((note, index) => {
      const noteCard = document.createElement("div");
      noteCard.classList.add("note-card");
      noteCard.dataset.index = index;

      // Note Header
      const noteHeader = document.createElement("div");
      noteHeader.classList.add("note-header");

      const noteTitle = document.createElement("h3");
      noteTitle.classList.add("note-title");
      noteTitle.textContent = note.title || "Untitled Note";

      const toggleIcon = document.createElement("span");
      toggleIcon.classList.add("toggle-icon");
      toggleIcon.innerHTML = "&#8250;"; // Right chevron

      noteHeader.appendChild(noteTitle);
      noteHeader.appendChild(toggleIcon);

      // Note Content
      const noteContent = document.createElement("div");
      noteContent.classList.add("note-content");

      const noteText = document.createElement("p");
      noteText.classList.add("note-text");
      noteText.textContent = note.text;

      const noteDate = document.createElement("span");
      noteDate.classList.add("note-date");
      noteDate.textContent = new Date(note.timestamp).toLocaleString();

      noteContent.appendChild(noteText);
      noteContent.appendChild(noteDate);

      // Delete Button
      const deleteButton = document.createElement("button");
      deleteButton.classList.add("delete-btn");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", (e) => {
        e.stopPropagation();
        showDeleteConfirmation(index);
      });

      noteCard.appendChild(noteHeader);
      noteCard.appendChild(noteContent);
      noteCard.appendChild(deleteButton);
      notesList.appendChild(noteCard);

      // Add click listener to toggle expansion
      noteCard.addEventListener("click", () => {
        noteCard.classList.toggle("expanded");
      });
    });
  }
}

// Function to add a new note
function addNote() {
  const noteTitle = noteTitleInput.value.trim();
  const noteText = noteInput.value.trim();

  if (noteText) {
    const notes = getNotes();
    const newNote = {
      title: noteTitle,
      text: noteText,
      timestamp: new Date().toISOString(),
    };
    notes.unshift(newNote);
    saveNotes(notes);
    noteTitleInput.value = "";
    noteInput.value = "";
    displayNotes();
    showSaveNotification();
  } else {
    alert("Please write something before saving your note!");
  }
}

// Function to show delete confirmation modal
function showDeleteConfirmation(index) {
  noteToDelete = index;
  deleteModal.classList.add("show");
  document.body.style.overflow = "hidden"; // Prevent background scrolling
}

// Function to hide delete confirmation modal
function hideDeleteConfirmation() {
  deleteModal.classList.remove("show");
  document.body.style.overflow = "auto";
  noteToDelete = -1;
}

// Function to delete a note
function deleteNote(index) {
  let notes = getNotes();
  notes.splice(index, 1);
  saveNotes(notes);
  displayNotes();
  hideDeleteConfirmation();
}

// Event Listeners
addNoteBtn.addEventListener("click", addNote);
cancelDeleteBtn.addEventListener("click", hideDeleteConfirmation);
confirmDeleteBtn.addEventListener("click", () => {
  if (noteToDelete !== -1) {
    deleteNote(noteToDelete);
  }
});

// Close modal when clicking outside
deleteModal.addEventListener("click", (e) => {
  if (e.target === deleteModal) {
    hideDeleteConfirmation();
  }
});

// Close modal with Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && deleteModal.classList.contains("show")) {
    hideDeleteConfirmation();
  }
});

// Initial display
document.addEventListener("DOMContentLoaded", displayNotes);
