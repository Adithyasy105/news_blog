const newsContainer = document.getElementById('newsContainer');
let currentPage = 1;
const pageSize = 10;
let currentQuery = '';
let isSearching = false;
let allArticles = [];

// Fetch news via serverless function
function fetchNews(page = 1, query = '') {
  const endpoint = `/api/getNews?page=${page}&query=${encodeURIComponent(query)}&pageSize=${pageSize}`;

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

function displayError(message) {
  newsContainer.innerHTML = `<p class="error-message">${message}</p>`;
}

function saveState() {
  localStorage.setItem('currentPage', currentPage);
  localStorage.setItem('currentQuery', currentQuery);
  localStorage.setItem('isSearching', JSON.stringify(isSearching));
  localStorage.setItem('allArticles', JSON.stringify(allArticles));
}

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

function searchNews() {
  const query = document.getElementById('searchInput').value.trim();
  if (!query) return;
  currentPage = 1;
  currentQuery = query;
  isSearching = true;
  fetchNews(currentPage, currentQuery);
}

function loadMore() {
  currentPage++;
  fetchNews(currentPage, isSearching ? currentQuery : '');
}

window.onload = () => {
  loadState();
  if (allArticles.length === 0) {
    fetchNews(currentPage, currentQuery);
  }

  document.getElementById('loadMoreBtn').addEventListener('click', loadMore);
  document.getElementById('searchBtn').addEventListener('click', searchNews);

  const nav = document.querySelector('nav');
  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  hamburger.innerHTML = '&#9776;';
  const header = document.querySelector('header');
  header.appendChild(hamburger);
  hamburger.addEventListener('click', () => nav.classList.toggle('open'));
};
