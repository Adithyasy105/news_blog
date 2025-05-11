export default async function handler(req, res) {
  const { query = '*', page = 1, pageSize = 10 } = req.query;
  const API_KEY = process.env.GNEWS_API_KEY;

  if (!API_KEY) {
    console.error("Missing GNEWS_API_KEY in environment variables");
    return res.status(500).json({ message: "Server error: Missing API key." });
  }

  const endpoint = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&max=${pageSize}&page=${page}&token=${API_KEY}`;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`GNews API error: ${response.status} - ${errorBody}`);
      return res.status(response.status).json({ message: "Error from GNews API" });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error("Unexpected error fetching news:", err);
    res.status(500).json({ message: "Unexpected server error while fetching news." });
  }
}
