export default async function handler(req, res) {
  // 1. Load the key from the server environment
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Server Error: API Key is missing.' });
  }

  // 2. Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 3. Forward the request to Google Gemini (using the 2.5-flash model you selected)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body), // Pass the data from the frontend
      }
    );

    const data = await response.json();

    // 4. Handle errors from Google
    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    // 5. Return the clean data to your website
    return res.status(200).json(data);

  } catch (error) {
    console.error("Backend Error:", error);
    return res.status(500).json({ error: 'Failed to communicate with AI service' });
  }
}
