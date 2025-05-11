const newsContainer = document.getElementById('newsContainer');
let currentPage = 1;
const pageSize = 10;
let currentQuery = '';
let isSearching = false;
let allArticles = [];

// Fetch news using the /api/news serverless function
function fetchNews(page = 1, query = '') {
  const endpoint = `/api/news?page=${page}&query=${encodeURIComponent(query)}&pageSize=${pageSize}`;

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
          allArticles = [];
        }
        allArticles = allArticles.concat(data.articles);
        displayNews(data.articles);
        saveState();
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

// Display each article
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

// Display error
function displayError(message) {
  newsContainer.innerHTML = `
    <div class="error-message">
      <img src="https://cdn-icons-png.flaticon.com/512/564/564619.png" alt="Error" style="width: 60px; margin-bottom: 10px;">
      <p>${message}</p>
    </div>
  `;
}

// Save state in localStorage
function saveState() {
  localStorage.setItem('currentPage', currentPage);
  localStorage.setItem('currentQuery', currentQuery);
  localStorage.setItem('isSearching', JSON.stringify(isSearching));
  localStorage.setItem('allArticles', JSON.stringify(allArticles));
}

// Load state from localStorage
function loadState() {
  const storedPage = localStorage.getItem('currentPage');
  const storedQuery = localStorage.getItem('currentQuery');
  const storedIsSearching = localStorage.getItem('isSearching');
  const storedArticles = localStorage.getItem('allArticles');

  if (storedPage) currentPage = parseInt(storedPage);
  if (storedQuery) currentQuery = storedQuery;
  if (storedIsSearching) isSearching = JSON.parse(storedIsSearching);
  if (storedArticles) {
    allArticles = JSON.parse(storedArticles);
    displayNews(allArticles);
  }
}

// Search button click
function searchNews() {
  const query = document.getElementById('searchInput').value.trim();
  if (!query) return;
  currentPage = 1;
  currentQuery = query;
  isSearching = true;
  fetchNews(currentPage, currentQuery);
}

// Load more button click
function loadMore() {
  currentPage++;
  fetchNews(currentPage, isSearching ? currentQuery : '');
}

// Initialize page
window.onload = () => {
  loadState();
  if (allArticles.length === 0) {
    fetchNews(currentPage, currentQuery);
  }

  document.getElementById('loadMoreBtn').addEventListener('click', loadMore);
  document.getElementById('searchBtn').addEventListener('click', searchNews);

  // Hamburger nav toggle
  const nav = document.querySelector('nav');
  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  hamburger.innerHTML = '&#9776;';
  const header = document.querySelector('header');
  header.appendChild(hamburger);
  hamburger.addEventListener('click', () => nav.classList.toggle('open'));
};
