import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { question, riskLevel, marketSentiment, advisorResponses } = req.body;

    try {
      const openai = new OpenAI({
        apiKey: process.env.LLM_API_KEY,
        baseURL: process.env.DEFAULT_LLM_ENDPOINT,
      });

      console.log('Using endpoint:', process.env.DEFAULT_LLM_ENDPOINT);

      const completion = await openai.completions.create({
        model: "phi",  // or the model you're using on your default endpoint
        prompt: `You are Maverick, a contrarian relationship advisor. Provide advice that challenges conventional wisdom about love and relationships.

Question: ${question}
Other Advisors' Opinions: ${JSON.stringify(advisorResponses)}

Your contrarian advice:`,
        max_tokens: 150,
      });

      const maverickAdvice = completion.choices[0].text.trim();
      
      const formattedAdvice = `
## Maverick's Contrarian Advice

${maverickAdvice}

---

*Remember, this is a contrarian view. Always consider multiple perspectives before making investment decisions.*
      `;

      console.log('Maverick advice:', formattedAdvice);
      res.status(200).json({ advice: formattedAdvice });
    } catch (error) {
      console.error('Error in getMaverickOpinion:', error);
      res.status(500).json({ error: 'Failed to get Maverick opinion', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}