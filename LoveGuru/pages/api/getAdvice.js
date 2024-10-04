import OpenAI from "openai";

// 创建一个函数来获取特定顾问的 API 配置
const getAdvisorConfig = (advisor) => {
  // 将顾问名称转换为大写并获取第一个单词
  const advisorKey = advisor.toUpperCase().split(' ')[0];
  
  // 尝试获取特定顾问的端点
  let endpoint = process.env[`${advisorKey}_ENDPOINT`];
  
  // 如果没有找到特定顾问的端点，使用默认端点
  if (!endpoint) {
    console.warn(`No specific endpoint found for advisor: ${advisor}. Using default endpoint.`);
    endpoint = process.env.DEFAULT_LLM_ENDPOINT;
  }
  
  if (!endpoint) {
    throw new Error(`No endpoint found for advisor: ${advisor} and no default endpoint set.`);
  }
  
  console.log(`Advisor: ${advisor}, Endpoint: ${endpoint}`);

  return {
    apiKey: process.env.LLM_API_KEY,
    baseURL: endpoint,
  };
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { question, riskLevel, advisor, marketSentiment } = req.body;
      
      console.log(`Received request for advisor: ${advisor}`);
      console.log(`Question: ${question}`);
      console.log(`Risk Level: ${riskLevel}`);
      console.log(`Market Sentiment: ${marketSentiment}`);
      
      const config = getAdvisorConfig(advisor);
      console.log(`Using endpoint: ${config.baseURL}`);

      if (!config.baseURL) {
        throw new Error(`Invalid endpoint for advisor: ${advisor}`);
      }

      const openai = new OpenAI({
        apiKey: config.apiKey,
        baseURL: config.baseURL,
        defaultHeaders: { 'Content-Type': 'application/json' },
      });

      const prompts = {
        romeo: `You are Romeo Martinez, a Spanish pop singer known for passionate love songs. Provide advice for the question: "${question}". Emphasize passion, romance, and bold expressions of love. Incorporate music and dance in your advice.`,
        yuki: `You are Yuki Tanaka, a renowned Japanese romance novelist. Provide advice for the question: "${question}". Focus on subtle expressions, small details, and the beauty of slow-developing relationships.`,
        emma: `You are Emma Watson, a British actress and feminist. Provide advice for the question: "${question}". Emphasize equality, respect, communication, and the importance of maintaining individuality in relationships.`,
        idris: `You are Idris Elba, a British actor with African roots. Provide advice for the question: "${question}". Focus on family values, cultural fusion, long-term commitment, and showing love through actions.`,
        priyanka: `You are Priyanka Chopra, a Bollywood and Hollywood actress. Provide advice for the question: "${question}". Blend Eastern and Western perspectives, emphasize destined love, family approval, and creative pursuit methods.`
      };

      const prompt = prompts[advisor.toLowerCase()] || `You are ${advisor}, a dating expert. Provide advice for the question: "${question}". Consider the risk level (${riskLevel}) and current dating trends (${marketSentiment}). Give specific and helpful dating advice.`;

      console.log(`Sending request to LLM with prompt: ${prompt.substring(0, 100)}...`);

      const completion = await openai.completions.create({
        model: "phi", // 或者根据顾问选择不同的模型
        prompt: prompt,
        max_tokens: 150,
      });

      const advice = completion.choices[0].text.trim();
      console.log(`Received advice: ${advice.substring(0, 100)}...`);

      res.status(200).json({ advice });
    } catch (error) {
      console.error('Error in getAdvice:', error);
      res.status(500).json({ 
        error: 'Failed to get advice', 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}