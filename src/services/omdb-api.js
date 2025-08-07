export default async function handler(req, res) {
  try {
    const params = new URLSearchParams({
      ...req.query,
      apikey: process.env.OMDB_KEY,
    });

    const omdbRes = await fetch(`https://www.omdbapi.com/?${params.toString()}`);
    const data = await omdbRes.json();

    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch from OMDb" });
  }
}
