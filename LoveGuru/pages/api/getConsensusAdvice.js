import OpenAI from 'openai';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { question, riskLevel, marketSentiment, advisorResponses, maverickOpinion } = req.body;

    try {
      const openai = new OpenAI({
        apiKey: process.env.LLM_API_KEY,
        baseURL: process.env.DEFAULT_LLM_ENDPOINT,
      });

      console.log('Using endpoint:', process.env.DEFAULT_LLM_ENDPOINT);

      const completion = await openai.completions.create({
        model: "phi",  // or the model you're using on your default endpoint
        prompt: `You are the Consensus, an AI that synthesizes various opinions to provide balanced relationship advice.

Question: ${question}
Advisors' Opinions: ${JSON.stringify(advisorResponses)}
Maverick's Opinion: ${maverickOpinion}

Your consensus advice:`,
        max_tokens: 150,
      });

      const consensusAdvice = completion.choices[0].text.trim();
      
      const formattedAdvice = `
## Consensus Advice

${consensusAdvice}

---

*This advice is a synthesis of various perspectives. Always do your own research before making investment decisions.*
      `;

      console.log('Consensus advice:', formattedAdvice);
      res.status(200).json({ advice: formattedAdvice });
    } catch (error) {
      console.error('Error in getConsensusAdvice:', error);
      res.status(500).json({ error: 'Failed to get Consensus advice', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
