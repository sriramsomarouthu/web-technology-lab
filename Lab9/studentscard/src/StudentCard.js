import React from "react";

function StudentCard(props) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-md w-72">
      <h2 className="text-xl font-semibold mb-3">Student Details</h2>

      <p><strong>Name:</strong> {props.name}</p>
      <p><strong>Department:</strong> {props.department}</p>
      <p><strong>Marks:</strong> {props.marks}</p>
    </div>
  );
}

export default StudentCard;
