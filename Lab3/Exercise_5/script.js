// --- State Management ---
let currentStage = 0; // 0 index based (0 = Stage 1)
const stages = document.querySelectorAll('.form-stage');
const progressBar = document.getElementById('progress-bar');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// Requirement 6: Store input temporarily in JS object
let formData = {
    name: '',
    email: '',
    username: '',
    password: '',
    communication: ''
};

// --- Initialization ---
updateUI(); // Set initial view

// --- Core Navigation Function ---
// Requirement 2: Control navigation
function changeStage(direction) {
    // If moving forward, validate current stage first
    if (direction === 1 && !validateStage(currentStage)) {
        return; // Requirement 5: Stop navigation if invalid
    }

    // Save data before moving
    if (direction === 1) {
        saveData(currentStage);
    }

    // Update index
    currentStage += direction;

    // Boundary checks
    if (currentStage < 0) currentStage = 0;
    if (currentStage >= stages.length) {
        submitForm(); // Final submission
        return;
    }

    updateUI();
}

// --- UI Updates (DOM Manipulation) ---
// Requirement 4: Show/Hide stages
function updateUI() {
    // 1. Toggle Stage Visibility
    stages.forEach((stage, index) => {
        if (index === currentStage) {
            stage.classList.add('active');
        } else {
            stage.classList.remove('active');
        }
    });

    // 2. Update Buttons
    prevBtn.disabled = (currentStage === 0);
    if (currentStage === stages.length - 1) {
        nextBtn.textContent = "Submit";
        // Populate review stage if we are at the end
        renderReviewStage(); 
    } else {
        nextBtn.textContent = "Next";
    }

    // 3. Update Progress Bar (Requirement 3)
    const progressPercent = ((currentStage + 1) / stages.length) * 100;
    progressBar.style.width = `${progressPercent}%`;
}

// --- Data Handling ---
function saveData(stageIndex) {
    // Map DOM inputs to our JS object
    if (stageIndex === 0) {
        formData.name = document.getElementById('name').value;
        formData.email = document.getElementById('email').value;
    } else if (stageIndex === 1) {
        formData.username = document.getElementById('username').value;
        formData.password = document.getElementById('password').value;
    } else if (stageIndex === 2) {
        formData.communication = document.getElementById('communication').value;
    }
}

function renderReviewStage() {
    const container = document.getElementById('review-content');
    container.innerHTML = `
        <div class="review-data"><strong>Name:</strong> ${formData.name}</div>
        <div class="review-data"><strong>Email:</strong> ${formData.email}</div>
        <div class="review-data"><strong>Username:</strong> ${formData.username}</div>
        <div class="review-data"><strong>Prefers:</strong> ${formData.communication}</div>
    `;
}

// --- Validation Logic ---
// Requirement 1 & 5: Strict validation rules
function validateStage(stageIndex) {
    let isValid = true;
    
    // Helper to show error
    const showError = (id, show) => {
        const el = document.getElementById(id);
        const msg = el.nextElementSibling; // The <small> tag
        if (show) {
            el.classList.add('error');
            msg.style.display = 'block';
            isValid = false;
        } else {
            el.classList.remove('error');
            msg.style.display = 'none';
        }
    };

    // Stage 1 Validation
    if (stageIndex === 0) {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        showError('name', name === '');
        showError('email', !emailRegex.test(email));
    }

    // Stage 2 Validation
    if (stageIndex === 1) {
        const user = document.getElementById('username').value.trim();
        const pass = document.getElementById('password').value;

        showError('username', user === '');
        showError('password', pass.length < 6);
    }

    // Stage 3 Validation
    if (stageIndex === 2) {
        const comm = document.getElementById('communication').value;
        showError('communication', comm === '');
    }

    return isValid;
}

function submitForm() {
    alert("Form Submitted Successfully!\nCheck console for data object.");
    console.log("Final User Data:", formData);
    // Reset or redirect here
    location.reload(); 
}