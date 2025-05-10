const API_KEY = '058b442bb8347ba4ef40337c60dd4669'; // Replace with your actual GNews.io API key
const newsContainer = document.getElementById('newsContainer');
let currentPage = 1;
const pageSize = 10;
let currentQuery = '';
let isSearching = false;

function fetchNews(page = 1, query = '') {
  const endpoint = query
    ? `https://gnews.io/api/v4/search?q=${query}&lang=en&max=${pageSize}&page=${page}&token=${API_KEY}`
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
        if (page === 1) newsContainer.innerHTML = ''; // Clear the container if it's the first page
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

window.onload = () => {
  fetchNews();
  document.getElementById('loadMoreBtn').addEventListener('click', loadMore);
  document.getElementById('searchBtn').addEventListener('click', searchNews);

  // Mobile Navigation (Hamburger Menu) Code
  const nav = document.querySelector('nav');
  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  hamburger.innerHTML = '&#9776;'; // Hamburger icon

  // Append the hamburger menu to the header
  const header = document.querySelector('header');
  header.appendChild(hamburger);

  // Add a click event to toggle the navigation menu
  hamburger.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
};
