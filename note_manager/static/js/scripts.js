const apiUrl = 'http://127.0.0.1:8000/api/notes/';

async function fetchNotes() {
    const response = await fetch(apiUrl);
    const notes = await response.json();
    const notesDiv = document.getElementById('notes');
    notesDiv.innerHTML = '';
    notes.forEach(note => {
        notesDiv.innerHTML += `<div class="note">
            <h3>${note.title}</h3>
            <p>${note.content}</p>
            <button class="btn btn-danger" onclick="deleteNote(${note.id})">Удалить</button>
        </div>`;
    });
}

async function createNote() {
    const title = document.getElementById('note-title').value;
    const content = document.getElementById('note-content').value;

    await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
    });

    document.getElementById('note-title').value = '';
    document.getElementById('note-content').value = '';
    fetchNotes();
}

async function deleteNote(id) {
    await fetch(`${apiUrl}${id}/`, {
        method: 'DELETE',
    });
    fetchNotes(); 
}

fetchNotes();
