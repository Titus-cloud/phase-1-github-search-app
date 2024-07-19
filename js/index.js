const baseURL = 'https://api.github.com';
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const mainContent = document.getElementById('mainContent');
const toggleSearchTypeBtn = document.getElementById('toggleSearchType');

let currentSearchType = 'user'; // Default search type

searchForm.addEventListener('submit', async function (event) {
  event.preventDefault();
  const searchTerm = searchInput.value.trim();
  if (searchTerm === '') return;

  try {
    let searchURL;
    if (currentSearchType === 'user') {
      searchURL = `${baseURL}/search/users?q=${searchTerm}`;
    } else if (currentSearchType === 'repo') {
      searchURL = `${baseURL}/search/repositories?q=${searchTerm}`;
    }

    const response = await fetch(searchURL, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    if (currentSearchType === 'user') {
      displayUsers(data.items);
    } else if (currentSearchType === 'repo') {
      displayRepos(data.items);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});

toggleSearchTypeBtn.addEventListener('click', function () {
  currentSearchType = currentSearchType === 'user' ? 'repo' : 'user';
  searchInput.placeholder =
    currentSearchType === 'user'
      ? 'Search GitHub users by username'
      : 'Search GitHub repos by keyword';
});

function displayUsers(users) {
  mainContent.innerHTML = '';
  users.forEach((user) => {
    const userElement = document.createElement('div');
    userElement.classList.add('user');
    userElement.innerHTML = `
      <img src="${user.avatar_url}" alt="${user.login} avatar">
      <h3>${user.login}</h3>
      <a href="${user.html_url}" target="_blank">Profile</a>
    `;
    userElement.addEventListener('click', function () {
      fetchUserRepos(user.login);
    });
    mainContent.appendChild(userElement);
  });
}

async function fetchUserRepos(username) {
  try {
    const response = await fetch(`${baseURL}/users/${username}/repos`, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const repos = await response.json();
    displayRepos(repos);
  } catch (error) {
    console.error('Error fetching repos:', error);
  }
}

function displayRepos(repos) {
  mainContent.innerHTML = '';
  repos.forEach((repo) => {
    const repoElement = document.createElement('div');
    repoElement.classList.add('repo');
    repoElement.innerHTML = `
      <h3>${repo.name}</h3>
      <p>${repo.description || 'No description'}</p>
      <a href="${repo.html_url}" target="_blank">View on GitHub</a>
    `;
    mainContent.appendChild(repoElement);
  });
}
