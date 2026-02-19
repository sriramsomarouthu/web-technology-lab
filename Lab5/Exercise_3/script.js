let studentsData = [];

// ================= READ (FETCH API) =================
function loadStudents() {
    fetch("students.json")
        .then(response => response.json())   // response.json()
        .then(data => {
            studentsData = data.students;
            displayStudents();
            showMsg("Students loaded successfully", "green");
        })
        .catch(error => {
            showMsg("Error parsing JSON", "red");
        });
}

// ================= DISPLAY =================
function displayStudents() {
    let tbody = document.querySelector("#studentTable tbody");
    tbody.innerHTML = "";

    if (studentsData.length === 0) {
        showMsg("No student records found", "red");
        return;
    }

    studentsData.forEach(stu => {
        let row = `<tr>
            <td>${stu.id}</td>
            <td>${stu.name}</td>
            <td>${stu.course}</td>
            <td>${stu.marks}</td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

// ================= VALIDATION =================
function validate() {
    if (!sid.value || !sname.value || !scourse.value || !smarks.value) {
        showMsg("All fields are required", "red");
        return false;
    }
    return true;
}

// ================= CREATE =================
function addStudent() {
    if (!validate()) return;

    studentsData.push({
        id: Number(sid.value),
        name: sname.value,
        course: scourse.value,
        marks: Number(smarks.value)
    });

    displayStudents();
    showMsg("Student added", "green");
}

// ================= UPDATE =================
function updateStudent() {
    let found = false;

    studentsData.forEach(stu => {
        if (stu.id == sid.value) {
            stu.course = scourse.value;
            stu.marks = Number(smarks.value);
            found = true;
        }
    });

    found ? showMsg("Student updated", "green")
          : showMsg("Student ID not found", "red");

    displayStudents();
}

// ================= DELETE =================
function deleteStudent() {
    let index = studentsData.findIndex(stu => stu.id == sid.value);

    if (index !== -1) {
        studentsData.splice(index, 1);
        displayStudents();
        showMsg("Student deleted", "green");
    } else {
        showMsg("Student ID not found", "red");
    }
}

// ================= UTIL =================
function showMsg(text, color) {
    let msg = document.getElementById("msg");
    msg.textContent = text;
    msg.style.color = color;
}