export default async function handler(req, res) {
  const { query, page = 1, pageSize = 10 } = req.query;

  const API_KEY = process.env.GNEWS_API_KEY;
  const endpoint = query
    ? `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&max=${pageSize}&page=${page}&token=${API_KEY}`
    : `https://gnews.io/api/v4/top-headlines?lang=en&max=${pageSize}&page=${page}&token=${API_KEY}`;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`GNews API error: ${response.statusText}`);
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error('Serverless fetch error:', err);
    res.status(500).json({ message: 'Error fetching news from GNews API' });
  }
}
