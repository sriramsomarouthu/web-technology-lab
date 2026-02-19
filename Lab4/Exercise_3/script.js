let students = []; // In-memory storage

const form = document.getElementById('studentForm');
const messageDiv = document.getElementById('message');
const studentList = document.getElementById('studentList');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');

// Show message
function showMessage(msg, isError = false) {
    messageDiv.textContent = msg;
    messageDiv.className = isError ? 'error' : 'success';
    messageDiv.style.display = 'block';
    setTimeout(() => messageDiv.style.display = 'none', 3000);
}

// Render table
function renderTable() {
    studentList.innerHTML = '';
    students.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.department}</td>
            <td>${student.marks}</td>
            <td>
                <button class="edit-btn" onclick="editStudent(${student.id})">Edit</button>
                <button class="delete-btn" onclick="deleteStudent(${student.id})">Delete</button>
            </td>
        `;
        studentList.appendChild(row);
    });
}

// Load from JSON (simulates AJAX GET)
async function loadStudentsFromJSON() {
    try {
        const response = await fetch('students.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        students = await response.json();
        renderTable();
        showMessage('Students loaded from JSON');
    } catch (error) {
        showMessage('Error loading JSON: ' + error.message, true);
    }
}

// Edit student (populate form)
function editStudent(id) {
    const student = students.find(s => s.id === id);
    if (student) {
        document.getElementById('studentId').value = student.id;
        document.getElementById('name').value = student.name;
        document.getElementById('department').value = student.department;
        document.getElementById('marks').value = student.marks;
        submitBtn.textContent = 'Update Student';
        cancelBtn.classList.remove('hidden');
    }
}

// Delete student (simulates AJAX DELETE)
function deleteStudent(id) {
    if (confirm('Delete this student?')) {
        students = students.filter(s => s.id !== id);
        renderTable();
        showMessage('Student deleted successfully');
    }
}

// Form submit (simulates AJAX POST/PUT)
form.addEventListener('submit', function(e) {
    e.preventDefault();
    const id = parseInt(document.getElementById('studentId').value) || Date.now();
    const name = document.getElementById('name').value;
    const department = document.getElementById('department').value;
    const marks = parseInt(document.getElementById('marks').value);

    if (isNaN(marks) || marks < 0 || marks > 100) {
        showMessage('Marks must be 0-100', true);
        return;
    }

    const studentIndex = students.findIndex(s => s.id === id);
    const student = { id, name, department, marks };

    if (studentIndex > -1) {
        // Update
        students[studentIndex] = student;
        showMessage('Student updated');
    } else {
        // Create
        students.push(student);
        showMessage('Student added');
    }

    form.reset();
    document.getElementById('studentId').value = '';
    submitBtn.textContent = 'Add Student';
    cancelBtn.classList.add('hidden');
    renderTable();
});

// Cancel edit
cancelBtn.onclick = function() {
    form.reset();
    document.getElementById('studentId').value = '';
    submitBtn.textContent = 'Add Student';
    cancelBtn.classList.add('hidden');
};

// Download JSON (simulates save)
function downloadJSON() {
    const dataStr = JSON.stringify(students, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students.json';
    a.click();
    URL.revokeObjectURL(url);
    showMessage('JSON downloaded');
}

// Initial load
loadStudentsFromJSON();