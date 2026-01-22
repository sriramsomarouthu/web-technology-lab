// Requirement 1: Create a structure to store questions and their types
const surveyQuestions = [
    {
        id: "q1",
        text: "What is your full name?",
        type: "text",
        required: true,
        minLength: 3 // Validation rule: Character limit (min)
    },
    {
        id: "q2",
        text: "How satisfied are you with our service?",
        type: "radio",
        options: ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied"],
        required: true
    },
    {
        id: "q3",
        text: "Which features do you use most? (Select at least 2)",
        type: "checkbox",
        options: ["Dashboard", "Reports", "Settings", "Profile", "Messaging"],
        required: true,
        minSelection: 2 // Validation rule: Selection count
    },
    {
        id: "q4",
        text: "Any additional feedback?",
        type: "text",
        required: false, // Optional field
        minLength: 0
    }
];

const surveyContainer = document.getElementById("surveyContainer");
const surveyForm = document.getElementById("surveyForm");

// Requirement 2: Dynamically generate form fields based on question type
function generateForm() {
    surveyQuestions.forEach((question) => {
        // Create container for each question
        const group = document.createElement("div");
        group.classList.add("form-group");
        group.setAttribute("data-id", question.id); // Store ID for validation reference

        // Create Label
        const label = document.createElement("label");
        label.classList.add("question-label");
        label.textContent = question.text + (question.required ? " *" : "");
        group.appendChild(label);

        // Generate Input based on Type
        if (question.type === "text") {
            const input = document.createElement("input");
            input.type = "text";
            input.name = question.id;
            input.classList.add("input-control");
            group.appendChild(input);

        } else if (question.type === "radio" || question.type === "checkbox") {
            question.options.forEach(option => {
                const wrapper = document.createElement("div");
                const input = document.createElement("input");
                input.type = question.type;
                input.name = question.id;
                input.value = option;
                
                const optLabel = document.createElement("label");
                optLabel.textContent = " " + option;

                wrapper.appendChild(input);
                wrapper.appendChild(optLabel);
                group.appendChild(wrapper);
            });
        }

        // Create Error Message Span (Hidden by default)
        const errorSpan = document.createElement("div");
        errorSpan.classList.add("error-message");
        errorSpan.id = `error-${question.id}`;
        group.appendChild(errorSpan);

        // Append group to main container
        surveyContainer.appendChild(group);
    });
}

// Requirements 3, 4, 5, 6: Validation Logic
function validateForm(event) {
    event.preventDefault(); // Prevent actual submission
    let isValid = true;

    // Loop through our data structure to validate against the DOM
    surveyQuestions.forEach((question) => {
        const errorSpan = document.getElementById(`error-${question.id}`);
        let errorMessage = "";
        
        // Get all inputs associated with this question ID
        const inputs = document.querySelectorAll(`input[name="${question.id}"]`);

        // --- Logic for Text Inputs ---
        if (question.type === "text") {
            const value = inputs[0].value.trim();
            
            if (question.required && value === "") {
                errorMessage = "This field is mandatory.";
            } else if (value.length > 0 && question.minLength && value.length < question.minLength) {
                errorMessage = `Please enter at least ${question.minLength} characters.`;
            }
        } 
        
        // --- Logic for Radio Buttons ---
        else if (question.type === "radio") {
            const isChecked = Array.from(inputs).some(input => input.checked);
            if (question.required && !isChecked) {
                errorMessage = "Please select an option.";
            }
        } 
        
        // --- Logic for Checkboxes ---
        else if (question.type === "checkbox") {
            const checkedCount = Array.from(inputs).filter(input => input.checked).length;
            
            if (question.required && checkedCount === 0) {
                errorMessage = "Please select at least one option.";
            } else if (question.minSelection && checkedCount < question.minSelection) {
                errorMessage = `Please select at least ${question.minSelection} options.`;
            }
        }

        // --- Requirement 5: DOM Manipulation for Inline Errors ---
        if (errorMessage) {
            errorSpan.textContent = errorMessage;
            errorSpan.style.display = "block";
            isValid = false;
        } else {
            errorSpan.style.display = "none";
        }
    });

    if (isValid) {
        alert("Form validated successfully! Submitting...");
        // Here you would typically do: surveyForm.submit();
    }
}

// Initialize the builder
generateForm();

// Attach Submit Event Listener
surveyForm.addEventListener("submit", validateForm);