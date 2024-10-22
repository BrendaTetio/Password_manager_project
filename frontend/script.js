// Base URL for API requests
const API_URL = 'http://localhost:3000/api';

// Function to save a password
async function savePassword() {
    const website = document.getElementById('website').value;
    const username = document.getElementById('username').value;
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
    const passwordList = document.getElementById('passwords');
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

// Event listener for form submission
document.getElementById('save-password-form').addEventListener('submit', (e) => {
    e.preventDefault();
    savePassword();
});

// Load passwords on page load
window.onload = loadPasswords;