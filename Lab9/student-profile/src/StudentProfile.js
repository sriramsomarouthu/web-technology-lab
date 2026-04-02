import React from "react";

function StudentProfile() {
  // Student details stored in variables
  const name = "Sriram Somarouthu";
  const department = "Computer Science";
  const year = "3rd Year";
  const section = "A";

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg w-80">
      <h1 className="text-2xl font-bold mb-4 text-center">Student Profile</h1>
      
      <p className="mb-2"><strong>Name:</strong> {name}</p>
      <p className="mb-2"><strong>Department:</strong> {department}</p>
      <p className="mb-2"><strong>Year:</strong> {year}</p>
      <p className="mb-2"><strong>Section:</strong> {section}</p>
    </div>
  );
}

export default StudentProfile;