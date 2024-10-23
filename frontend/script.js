document.getElementById('password-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    
    const website = document.getElementById('website').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Send password data to server
    const response = await fetch('/add-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ website, username, password })
    });

    const result = await response.text();
    alert(result);

    // Clear form
    document.getElementById('password-form').reset();

    // Fetch the updated list of passwords
    fetchPasswords();
});

// Fetch and display saved passwords
async function fetchPasswords() {
    const response = await fetch('/passwords');
    const passwords = await response.json();

    const passwordList = document.getElementById('password-list');
    passwordList.innerHTML = '';

    passwords.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `Website: ${item.website}, Username: ${item.username}, Password: ${item.password}`;
        passwordList.appendChild(li);
    });
}

// Fetch passwords on page load
fetchPasswords();