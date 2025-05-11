const newsContainer = document.getElementById('newsContainer');
let currentPage = 1;
const pageSize = 10;
let currentQuery = '';
let isSearching = false;

// Fetch news from API
function fetchNews(page = 1, query = '') {
  const endpoint = `/api/news?page=${page}&query=${encodeURIComponent(query)}&pageSize=${pageSize}&nocache=${Date.now()}`;

  fetch(endpoint)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText} (status code: ${response.status})`);
      }
      return response.json();
    })
    .then(data => {
      if (data && data.articles && data.articles.length > 0) {
        if (page === 1) {
          newsContainer.innerHTML = '';
        }
        displayNews(data.articles);
        document.getElementById('loadMoreBtn').style.display = 'block';
      } else {
        if (page === 1) {
          displayError("No news found. Try a different keyword.");
        }
        document.getElementById('loadMoreBtn').style.display = 'none';
      }
    })
    .catch(error => {
      console.error('Error fetching news:', error);
      displayError("Sorry, we couldn't fetch the news. Please try again later.");
    });
}

// Display news cards
function displayNews(articles) {
  articles.forEach(article => {
    const card = document.createElement('div');
    card.className = 'news-card';
    card.innerHTML = `
      <img src="${article.image || 'https://via.placeholder.com/300'}" alt="News Image">
      <h3>${article.title}</h3>
      <p>${article.description || ''}</p>
      <a href="${article.url}" target="_blank">Read More</a>
    `;
    newsContainer.appendChild(card);
  });
}

// Display error message
function displayError(message) {
  newsContainer.innerHTML = `
    <div class="error-message">
      <img src="https://cdn-icons-png.flaticon.com/512/564/564619.png" alt="Error" style="width: 60px; margin-bottom: 10px;">
      <p>${message}</p>
    </div>
  `;
}

// Search handler
function searchNews() {
  const query = document.getElementById('searchInput').value.trim();
  if (!query) return;
  currentPage = 1;
  currentQuery = query;
  isSearching = true;
  fetchNews(currentPage, currentQuery);
}

// Load more handler
function loadMore() {
  currentPage++;
  fetchNews(currentPage, isSearching ? currentQuery : '');
}

// Clear search state
function resetToHome() {
  currentPage = 1;
  currentQuery = '';
  isSearching = false;
  document.getElementById('searchInput').value = '';
  newsContainer.innerHTML = '';
  fetchNews(currentPage);
}

// Initialize
window.onload = () => {
  resetToHome();

  document.getElementById('loadMoreBtn').addEventListener('click', loadMore);
  document.getElementById('searchBtn').addEventListener('click', searchNews);

  // Optional: clear search if clicking logo or back to home
  const logo = document.querySelector('.logo');
  if (logo) {
    logo.addEventListener('click', resetToHome);
  }

  // Hamburger nav
  const nav = document.querySelector('nav');
  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  hamburger.innerHTML = '&#9776;';
  document.querySelector('header').appendChild(hamburger);
  hamburger.addEventListener('click', () => nav.classList.toggle('open'));
};
