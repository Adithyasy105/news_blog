const API_KEY = '058b442bb8347ba4ef40337c60dd4669';
const newsContainer = document.getElementById('newsContainer');
let currentPage = 1;
const pageSize = 10;
let currentQuery = '';
let isSearching = false;
let allArticles = []; // For storing loaded articles

// Fetch from API
function fetchNews(page = 1, query = '') {
  const endpoint = query
    ? `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&max=${pageSize}&page=${page}&token=${API_KEY}`
    : `https://gnews.io/api/v4/top-headlines?lang=en&max=${pageSize}&page=${page}&token=${API_KEY}`;

  fetch(endpoint)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText} (status code: ${response.status})`);
      }
      return response.json();
    })
    .then(data => {
      if (data && data.articles) {
        if (page === 1) {
          newsContainer.innerHTML = '';
          allArticles = [];
        }
        allArticles = allArticles.concat(data.articles);
        saveState();
        displayNews(data.articles);
      } else {
        displayError("No news found. Please try again later.");
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

// Error handler
function displayError(message) {
  newsContainer.innerHTML = `<p class="error-message">${message}</p>`;
}

// Save session state
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

// On page load
window.onload = () => {
  loadState();
  if (allArticles.length === 0) {
    fetchNews(currentPage, currentQuery);
  }

  document.getElementById('loadMoreBtn').addEventListener('click', loadMore);
  document.getElementById('searchBtn').addEventListener('click', searchNews);

  // Hamburger menu
  const nav = document.querySelector('nav');
  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  hamburger.innerHTML = '&#9776;';
  const header = document.querySelector('header');
  header.appendChild(hamburger);
  hamburger.addEventListener('click', () => nav.classList.toggle('open'));
};
