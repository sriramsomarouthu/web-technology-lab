class Course {
  constructor(courseName, instructor) {
    this.courseName = courseName;
    this.instructor = instructor;
  }

  displayCourse() {
    const output = document.getElementById("output");
    output.innerHTML += `
      <span class="label">Course Details:</span><br>
      Course: ${this.courseName}, Instructor: ${this.instructor}
      <br><br>
    `;
    console.log(`Course: ${this.courseName}, Instructor: ${this.instructor}`);
  }
}

// Create course object
let course1 = new Course("Machine Learning", "Dr. Ajith");
course1.displayCourse();

// Promise for enrollment
let enrollCourse = new Promise((resolve, reject) => {
  let seatsAvailable = true;

  if (seatsAvailable)
    resolve("Enrollment Successful");
  else
    reject("Course Full");
});

// Handle Promise result
enrollCourse
  .then(msg => {
    console.log(msg);
    const output = document.getElementById("output");
    output.innerHTML += `
      <span class="label">Enrollment Status:</span><br>
      <span class="success">✅ ${msg}</span>
    `;
  })
  .catch(err => {
    console.log(err);
    const output = document.getElementById("output");
    output.innerHTML += `
      <span class="label">Enrollment Status:</span><br>
      <span class="error">❌ ${err}</span>
    `;
  });