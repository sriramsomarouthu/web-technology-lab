// Simple form validation
document.getElementById("registrationForm").addEventListener("submit", function (event) {
    event.preventDefault(); // stop form from submitting

    const name = document.getElementById("name").value.trim();
    const roll = document.getElementById("roll").value.trim();
    const mobile = document.getElementById("mobile").value.trim();
    const gmail = document.getElementById("gmail").value.trim();

    // Basic checks
    if (name === "") {
        alert("Please enter your Name.");
        return;
    }

    if (roll === "" || isNaN(roll)) {
        alert("Please enter a valid numeric Roll Number.");
        return;
    }

    if (mobile === "" || isNaN(mobile) || mobile.length !== 10) {
        alert("Please enter a valid 10-digit Mobile Number.");
        return;
    }

    // Simple email pattern for Gmail
    const gmailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (gmail === "" || !gmailPattern.test(gmail)) {
        alert("Please enter a valid Gmail ID (example@gmail.com).");
        return;
    }

    // If everything is valid
    alert("Registration successful!");
});
