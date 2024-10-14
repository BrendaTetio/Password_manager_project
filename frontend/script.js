document.getElementById('password-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const website = document.getElementById('website').value;
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Send data to backend to save password (using fetch API)
  fetch('http://localhost:3000/api/save-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ website, username, password })
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        addPasswordToUI(website, username, password);
      } else {
        alert('Failed to save password!');
      }
    });
});

// Function to add saved password to the UI
function addPasswordToUI(website, username, password) {
  const passwordList = document.getElementById('passwords');
  const listItem = document.createElement('li');
  listItem.innerHTML = `
    <strong>${website}</strong>: ${username} | ${password}
    <button onclick="deletePassword('${website}')">Delete</button>
  `;
  passwordList.appendChild(listItem);
}

// Function to delete password
function deletePassword(website) {
  fetch(`http://localhost:3000/api/delete-password`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ website })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      location.reload(); // Reload page to reflect changes
    } else {
      alert('Failed to delete password!');
    }
  });
}
