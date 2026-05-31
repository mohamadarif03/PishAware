export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { pesan } = req.body;
    
    const apiKey = process.env.GEMINI_API_KEY; 
    
    if (!apiKey) {
      return res.status(500).json({ error: 'API Key tidak ditemukan di server.' });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const geminiResponse = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: pesan }] }]
      })
    });

    if (!geminiResponse.ok) {
        throw new Error(`Gemini API Error: ${geminiResponse.statusText}`);
    }

    const data = await geminiResponse.json();
    const teksBalasan = data.candidates[0].content.parts[0].text;

    return res.status(200).json({ balasan: teksBalasan });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Terjadi kesalahan di server' });
  }
}
