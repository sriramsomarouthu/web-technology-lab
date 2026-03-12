// Define the student object
const student = {
  id: 101,
  name: "Sriram",
  department: "SCOPE",
  marks: 91
};

// Object destructuring
const { id, name, department, marks } = student;

// Spread operator - add grade property
const updatedStudent = {
  ...student,
  grade: "A"
};

// Display in HTML
const output = document.getElementById("output");

output.innerHTML = `
  <span class="label">Destructured Values:</span><br>
  ${id} &nbsp; ${name} &nbsp; ${department} &nbsp; ${marks}
  <br><br>
  <span class="label">Updated Student Object:</span><br>
  { id: ${updatedStudent.id}, name: '${updatedStudent.name}', 
    department: '${updatedStudent.department}', 
    marks: ${updatedStudent.marks}, 
    grade: '${updatedStudent.grade}' }
`;