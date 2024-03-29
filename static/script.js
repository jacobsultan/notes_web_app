// creating a new note, receives the input text 
document.addEventListener('DOMContentLoaded', () => {
    const noteForm = document.getElementById('note_form');
    const noteInput = document.getElementById('note_input');
    if (noteForm && noteInput) {
        noteForm.addEventListener('submit', function(e) {
            const noteText = noteInput.value.trim();
            if (!noteText) {
                e.preventDefault(); // Prevent the creation of an empty note
                alert('Note content cannot be blank.');
            }
        });
    }
});

//edit button listener to see which note is to be edited
document.querySelectorAll('.edit-button').forEach(button => {
    button.addEventListener('click', function() {
        const noteId = button.getAttribute('data-note-id');
        toggleEditForm(noteId);
        adjustNotePositions(noteId); // Call the function to adjust note positions
    });
});

// Showing the edit button text form which is hidden before a note is chosen to be edited
function toggleEditForm(noteId) {
    const form = document.getElementById(`edit-form-${noteId}`);
    if (form.style.display === "none" || form.style.display === "") {
        form.style.display = "block";
    } else {
        form.style.display = "none";
    }
}

// Function to adjust note positions to fit new text form in there by getting new dimensions
function adjustNotePositions(noteId) {
    const form = document.getElementById(`edit-form-${noteId}`);
    const formHeight = form.offsetHeight;
    const notesBelow = document.querySelectorAll(`.note-container:not(#edit-form-${noteId})`);

    notesBelow.forEach(note => {
        const noteTop = note.offsetTop;

        if (noteTop >= form.offsetTop && noteTop < form.offsetTop + formHeight) {
            const newTop = noteTop + formHeight;
            note.style.top = `${newTop}px`;
        }
    });
}


// Bin link to disrupt going to the bin if its empty
document.addEventListener('DOMContentLoaded', function() {
    const binLink = document.getElementById('bin-link');
    if (binLink){
        binLink.addEventListener('click', function(e) {
            fetch('/check-bin')
                .then(response => response.json())
                .then(data => {
                    if (data.is_empty) {
                        e.preventDefault(); 
                        alert('Bin is empty!');
                    }
                })
        });
    }
});

// Archive link to disrupt going to the archive if its empty
document.addEventListener('DOMContentLoaded', function() {
    const archiveLink = document.getElementById('archive-link');
    if (archiveLink){
        archiveLink.addEventListener('click', function(e) {
            fetch('/check-archive')
                .then(response => response.json())
                .then(data => {
                    if (data.is_empty) {
                        e.preventDefault(); // Only prevent the default behavior if the bin is empty
                        alert('Archive is empty!');
                    }
                })
        });
    }
});



// confirmation of deleting a note
function confirmDelete() {
    return confirm('Are you certain you want to delete this permanently?');
}

//removing a note to be deleted if confirmed to be deleted first
function deleteNote(noteId) {
    if (confirmDelete()) {
        fetch(`/note/${noteId}/delete-note/`, { method: 'DELETE' })
            .then(response => {
                if (response.ok) {
                    location.reload();
                } else {
                    alert('Failed to delete the note.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while deleting the note.');
            });
    }
}

// Confirmation before deleting all notes in the bin
function confirmEmptyTrash() {
    return confirm("Selecting 'Yes' will permenantly delete all notes in your bin (this is irreversible)")
}

// Resizing new note box with the amount of input text
function resizeTextarea() {
    const textarea = document.getElementById('expandingTextarea');
    textarea.style.height = 'auto'; // Reset height to auto to calculate new height
    textarea.style.height = textarea.scrollHeight + 'px'; // Set the new height based on content of new text
}

// load masonry library, for the notes grid to slot into each other 
document.addEventListener('DOMContentLoaded', function() {
    var masonryContainers = document.querySelectorAll('.notes-grid');
    masonryContainers.forEach(function(container) {
      var masonry = new Masonry(container, {
        itemSelector: '.masonry-item',
        columnWidth: '.masonry-item',
        gutter: 10,
        percentPosition: true
      });
    });
  });
