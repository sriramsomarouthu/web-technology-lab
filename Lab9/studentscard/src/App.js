
import React from "react";
import StudentCard from "./StudentCard";

function App() {
  // Parent data (multiple students)
  const students = [
    { name: "Sriram", department: "CSE", marks: 85 },
    { name: "Ravi", department: "ECE", marks: 78 },
    { name: "Anjali", department: "IT", marks: 92 },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        Student Cards
      </h1>

      <div className="flex flex-wrap gap-6 justify-center">
        {students.map((student, index) => (
          <StudentCard
            key={index}
            name={student.name}
            department={student.department}
            marks={student.marks}
          />
        ))}
      </div>
    </div>
  );
}

export default App;