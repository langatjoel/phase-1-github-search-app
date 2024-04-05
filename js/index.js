const { use } = require("chai");

document.getElementById('searchForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const searchInput = document.getElementById('searchInput').value.trim();
    if (searchInput === '') return;

    const users = await searchUsers(searchInput);
    displayUsers(users);
});

async function searchUsers(username) {
    const response = await fetch(`https://api.github.com/search/users?q=${username}`, {
        headers: {
            'Accept': 'application/vnd.github.v3+json'
        }
    });
    const data = await response.json();
    return data.items; // Return an array of user objects
}

function displayUsers(users) {
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = '';

    users.forEach(user => {
        const userElement = document.createElement('div');
        userElement.innerHTML = `
            <div>
                <img src="${user.avatar_url}" alt="User Avatar" width="50" height="50">
                <a href="${user.html_url}" target="_blank">${user.login}</a>
            </div>
        `;
        userElement.addEventListener('click', async function() {
            const repositories = await getUserRepositories(user.login);
            displayRepositories(repositories);
        });
        searchResults.appendChild(userElement);
    });
}

async function getUserRepositories(username) {
    const response = await fetch(`https://api.github.com/users/${username}/repos`, {
        headers: {
            'Accept': 'application/vnd.github.v3+json'
        }
    });
    const repositories = await response.json();
    return repositories;
}

function displayRepositories(repositories) {
    const userRepositories = document.getElementById('userRepositories');
    userRepositories.innerHTML = '';

    repositories.forEach(repo => {
        const repoElement = document.createElement('div');
        repoElement.textContent = repo.full_name;
        userRepositories.appendChild(repoElement);
    });
}
