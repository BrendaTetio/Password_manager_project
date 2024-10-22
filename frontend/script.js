// Base URL for API requests
const API_URL = 'http://localhost:3000/api';

// Function to register a new user
async function registerUser() {
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;

    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    alert(data.message);
}

// Function to log in an existing user
async function loginUser() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    alert(data.message);
    if (data.success) {
        // If login is successful, load saved passwords
        loadPasswords();
    }
}

// Function to save a password
async function savePassword() {
    const website = document.getElementById('website').value;
    const username = document.getElementById('username').value; // Corrected ID
    const password = document.getElementById('password').value;

    const response = await fetch(`${API_URL}/save-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ website, username, password }),
    });

    const data = await response.json();
    alert(data.success ? 'Password saved!' : 'Failed to save password.');
    if (data.success) {
        loadPasswords(); // Reload passwords after saving a new one
    }
}

// Function to load and display saved passwords
async function loadPasswords() {
    const response = await fetch(`${API_URL}/get-passwords`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();
    const passwordList = document.getElementById('password-list');
    passwordList.innerHTML = ''; // Clear the list before displaying

    if (data.success) {
        data.data.forEach(password => {
            const listItem = document.createElement('li');
            listItem.textContent = `${password.website} - ${password.username}`;
            passwordList.appendChild(listItem);
        });
    } else {
        alert('Failed to load passwords.');
    }
}

// Function to delete a password
async function deletePassword() {
    const website = document.getElementById('delete-website').value;

    const response = await fetch(`${API_URL}/delete-password`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ website }),
    });

    const data = await response.json();
    alert(data.success ? 'Password deleted!' : 'Failed to delete password.');
    if (data.success) {
        loadPasswords(); // Reload passwords after deletion
    }
}

// Event listeners for form submissions
document.getElementById('register-form').addEventListener('submit', (e) => {
    e.preventDefault();
    registerUser();
});

document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    loginUser();
});

document.getElementById('password-form').addEventListener('submit', (e) => {
    e.preventDefault();
    savePassword();
});

document.getElementById('delete-password-form').addEventListener('submit', (e) => {
    e.preventDefault();
    deletePassword();
});

// Load passwords on page load
window.onload = loadPasswords;
