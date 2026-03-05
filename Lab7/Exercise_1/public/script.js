const api = "http://localhost:5000/api/notes";

function loadNotes() {

fetch(api)
.then(res => res.json())
.then(data => {

let html = "";

data.forEach(note => {

html += `
<div class="note">
<h4>${note.title}</h4>
<p>${note.subject}</p>
<p>${note.description}</p>

<button onclick="deleteNote('${note._id}')">Delete</button>

<button onclick="editNote('${note._id}')">Edit</button>
</div>
`;

});

document.getElementById("notes").innerHTML = html;

});

}

function addNote(){

const title = document.getElementById("title").value;
const subject = document.getElementById("subject").value;
const description = document.getElementById("description").value;

fetch(api,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({title,subject,description})
})
.then(()=>loadNotes());

}

function deleteNote(id){

fetch(api+"/"+id,{
method:"DELETE"
})
.then(()=>loadNotes());

}

function editNote(id){

const newTitle = prompt("Enter new title");
const newDesc = prompt("Enter new description");

fetch(api+"/"+id,{
method:"PUT",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
title:newTitle,
description:newDesc
})
})
.then(()=>loadNotes());

}

loadNotes();