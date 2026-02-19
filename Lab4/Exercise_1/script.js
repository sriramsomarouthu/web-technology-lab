const usernameInput = document.getElementById('username');
const feedback = document.getElementById('feedback');
const loader = document.getElementById('loader');
const submitBtn = document.getElementById('submitBtn');
const form = document.getElementById('registrationForm');

let debounceTimer = null;
let isUsernameAvailable = false;

// Debounce: wait 500ms after user stops typing before checking
usernameInput.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  const value = usernameInput.value.trim();

  // Reset state
  feedback.textContent = '';
  feedback.className = 'feedback';
  loader.classList.add('hidden');
  isUsernameAvailable = false;
  submitBtn.disabled = true;

  if (value.length < 3) {
    if (value.length > 0) {
      feedback.textContent = 'Username must be at least 3 characters.';
      feedback.className = 'feedback taken';
    }
    return;
  }

  debounceTimer = setTimeout(() => {
    checkUsernameAvailability(value);
  }, 500);
});

function checkUsernameAvailability(username) {
  // Show loader
  loader.classList.remove('hidden');
  feedback.textContent = '';
  feedback.className = 'feedback';
  submitBtn.disabled = true;

  // Fetch the local JSON file to simulate a backend call
  fetch('users.json')
    .then(response => {
      if (!response.ok) throw new Error('Failed to load user data.');
      return response.json();
    })
    .then(data => {
      loader.classList.add('hidden');

      const taken = data.takenUsernames.map(u => u.toLowerCase());
      if (taken.includes(username.toLowerCase())) {
        feedback.textContent = '✗ Username already taken.';
        feedback.className = 'feedback taken';
        isUsernameAvailable = false;
        submitBtn.disabled = true;
      } else {
        feedback.textContent = '✓ Username available!';
        feedback.className = 'feedback available';
        isUsernameAvailable = true;
        submitBtn.disabled = false;
      }
    })
    .catch(err => {
      loader.classList.add('hidden');
      feedback.textContent = 'Error checking username. Please try again.';
      feedback.className = 'feedback taken';
      console.error(err);
    });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (!isUsernameAvailable) {
    feedback.textContent = '✗ Please choose an available username before submitting.';
    feedback.className = 'feedback taken';
    return;
  }

  alert(`Registration successful! Welcome, ${usernameInput.value.trim()}!`);
  form.reset();
  feedback.textContent = '';
  feedback.className = 'feedback';
  submitBtn.disabled = true;
  isUsernameAvailable = false;
});