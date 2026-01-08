
const STORAGE_KEY = "usersList";

const userForm = document.getElementById("userForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const mobileInput = document.getElementById("mobile");
const passwordInput = document.getElementById("password");
const usersTableBody = document.querySelector("#usersTable tbody");
const clearAllBtn = document.getElementById("clearAllBtn");
const messageEl = document.getElementById("message");

// Load users on page load
document.addEventListener("DOMContentLoaded", loadUsersFromStorage);

userForm.addEventListener("submit", function (e) {
  e.preventDefault();
  messageEl.textContent = "";

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const mobile = mobileInput.value.trim();
  const password = passwordInput.value.trim();

  // Validations
  if (!name || !email || !mobile || !password) {
    showMessage("All fields are mandatory");
    return;
  }

  if (!/^\d{10}$/.test(mobile)) {
    showMessage("Mobile number must be 10 digits");
    return;
  }

  if (password.length < 6) {
    showMessage("Password must be at least 6 characters");
    return;
  }

  let users = getUsers();

  // No duplicate emails
  const emailExists = users.some(u => u.email === email);
  if (emailExists) {
    showMessage("Email already registered");
    return;
  }

  const newUser = { id: Date.now(), name, email, mobile, password };
  users.push(newUser);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));

  addUserRow(newUser);
  userForm.reset();
  showMessage("User registered successfully", true);
});

// Clear all users
clearAllBtn.addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  usersTableBody.innerHTML = "";
  showMessage("All users cleared", true);
});

// Helpers
function getUsers() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function loadUsersFromStorage() {
  const users = getUsers();
  usersTableBody.innerHTML = "";
  users.forEach(addUserRow);
}

function addUserRow(user) {
  const tr = document.createElement("tr");
  tr.dataset.id = user.id;

  tr.innerHTML = `
    <td>${user.name}</td>
    <td>${user.email}</td>
    <td>${user.mobile}</td>
    <td><button class="action-btn">Delete</button></td>
  `;

  const deleteBtn = tr.querySelector(".action-btn");
  deleteBtn.addEventListener("click", () => deleteUser(user.id));

  usersTableBody.appendChild(tr);
}

function deleteUser(id) {
  let users = getUsers();
  users = users.filter(u => u.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));

  const row = usersTableBody.querySelector(`tr[data-id="${id}"]`);
  if (row) row.remove();

  showMessage("User deleted successfully", true);
}

function showMessage(text, success = false) {
  messageEl.textContent = text;
  messageEl.style.color = success ? "#388e3c" : "#d32f2f";
}
