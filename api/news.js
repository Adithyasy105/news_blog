export default async function handler(req, res) {
  let { query, page = 1, pageSize = 10 } = req.query;
  const API_KEY = process.env.GNEWS_API_KEY;

  if (!API_KEY) {
    console.error("Missing GNEWS_API_KEY in environment variables");
    return res.status(500).json({ message: "Missing API Key" });
  }

  // If query is empty or just whitespace, set a default query
  if (!query || query.trim() === "") {
    const today = new Date().toISOString().split('T')[0]; // e.g. "2025-05-12"
    query = `latest news ${today}`;
  }

  const endpoint = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&max=${pageSize}&page=${page}&token=${API_KEY}`;

  try {
    const response = await fetch(endpoint);

    if (!response.ok) {
      const error = await response.text();
      console.error(`GNews API Error: ${response.status} - ${error}`);
      return res.status(response.status).json({ message: "Error fetching news from GNews" });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}
