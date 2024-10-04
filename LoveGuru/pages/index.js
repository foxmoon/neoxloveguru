import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useAccount } from 'wagmi';
import { useSession } from 'next-auth/react';
import WalletConnection from '../components/WalletConnection';
import AdvisorResponse from '../components/AdvisorResponse';  // 添加这行
import ExpandableContent from '../components/ExpandableContent';
import { buyCoffee } from '../utils/coffeeUtils';
import AdvisorTabs from '../components/AdvisorTabs';

export default function Home() {
  const [question, setQuestion] = useState('');
  const [riskLevel, setRiskLevel] = useState('moderate');
  const [marketSentiment, setMarketSentiment] = useState('neutral');
  const [responses, setResponses] = useState({});
  const [maverickOpinion, setMaverickOpinion] = useState('');
  const [consensusAdvice, setConsensusAdvice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentAdvisorIndex, setCurrentAdvisorIndex] = useState(0);
  const { address, isConnected } = useAccount();
  const { data: session } = useSession();
  const [selectedAdvisor, setSelectedAdvisor] = useState(null);
  const [unreadAdvice, setUnreadAdvice] = useState({});

  const advisors = [
    { name: 'Romeo Martinez', image: '/images/romeo1.png', role: 'Latin Passion Expert' },
    { name: 'Yuki Tanaka', image: '/images/yuki1.png', role: 'Subtle Romance Guru' },
    { name: 'Emma Watson', image: '/images/emma1.png', role: 'Rational Love Coach' },
    { name: 'Idris Elba', image: '/images/idris1.png', role: 'Modern Tradition Advisor' },
    { name: 'Priyanka Chopra', image: '/images/priyanka1.png', role: 'Bollywood Romance Expert' },
    { name: 'maverick', image: '/images/maverick1.png', role: 'Unconventional Love Strategist' },
    { name: 'consensus', image: '/images/consensus1.png', role: 'Collective Wisdom Synthesizer' },
  ];

  const formatResponse = (response, advisorName) => {
    return `
# ${advisorName}'s Advice
    { name: 'zulu', image: '/images/zulu.jpg' },
${response}
    { name: 'consensus', image: '/images/consensus.jpg' },
---

*This is an AI-generated response. Always conduct your own research before making decisions.*
    `;
  };

  const consultAdvisor = async (advisor) => {
    try {
      const response = await fetch('/api/getAdvice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, riskLevel, advisor: advisor.name, marketSentiment }),
      });
      const data = await response.json();
      setResponses(prev => ({
        ...prev,
        [advisor.name]: formatResponse(data.advice, advisor.name)
      }));
      // 更新未读状态
      setUnreadAdvice(prev => ({
        ...prev,
        [advisor.name]: true
      }));
    } catch (error) {
      console.error(`Error consulting ${advisor.name}:`, error);
    }
  };

  const generateMaverickOpinion = async () => {
    try {
      const response = await fetch('/api/getMaverickOpinion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, riskLevel, marketSentiment, advisorResponses: responses }),
      });
      const data = await response.json();
      if (data.advice) {
        setMaverickOpinion(data.advice);
        // 更新未读状态
        setUnreadAdvice(prev => ({
          ...prev,
          maverick: true
        }));
        console.log("Maverick opinion set:", data.advice);
      } else {
        console.error('No advice received from Maverick');
      }
    } catch (error) {
      console.error('Error generating Maverick opinion:', error);
    }
  };

  const generateConsensusAdvice = async () => {
    try {
      const response = await fetch('/api/getConsensusAdvice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, riskLevel, marketSentiment, advisorResponses: responses, maverickOpinion }),
      });
      const data = await response.json();
      if (data.advice) {
        setConsensusAdvice(data.advice);
        // 更新未读状态
        setUnreadAdvice(prev => ({
          ...prev,
          consensus: true
        }));
        console.log("Consensus advice set:", data.advice);
      } else {
        console.error('No advice received from Consensus');
      }
    } catch (error) {
      console.error('Error generating consensus advice:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) {
      alert("Please enter a question");
      return;
    }

    const confirmBuyCoffee = window.confirm("AI advisors need coffee to stay energized. Would you like to buy them a coffee for 0.0001 GAS?");
    if (!confirmBuyCoffee) {
      return;
    }

    const coffeeSuccess = await buyCoffee();
    if (!coffeeSuccess) {
      return;
    }

    // Clear all unread statuses
    setUnreadAdvice({});

    setIsLoading(true);
    setResponses({});
    setMaverickOpinion('');
    setConsensusAdvice('');
    setCurrentAdvisorIndex(0);

    try {
      // 1. Get advice from all regular advisors
      for (const advisor of advisors.slice(0, 5)) {
        await consultAdvisor(advisor);
        setCurrentAdvisorIndex(prev => prev + 1);
      }

      // 2. Get Maverick's contrarian opinion
      await generateMaverickOpinion();

      // 3. Generate consensus advice
      await generateConsensusAdvice();

      console.log("All opinions generated:", { responses, maverickOpinion, consensusAdvice });
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdvisorClick = (advisorName) => {
    setSelectedAdvisor(advisorName);
    setUnreadAdvice(prevState => ({
      ...prevState,
      [advisorName]: false
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 to-purple-600 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        <Head>
          <title>Love Guru AI</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="p-8">
        <nav className="flex justify-between items-center p-4 bg-white">
          <span className="text-6xl font-bold text-purple-600 font-latin">NeoX Love Guru</span>
          <div className="flex space-x-4">
           
            <WalletConnection />

          </div>
        </nav>
      
      

        <section>
  {/* Container */}
  <div className="mx-auto w-full max-w-7xl px-5 py-16 md:px-10 md:py-20">
    {/* Component */}
    <div className="grid items-center gap-8 sm:gap-20 lg:grid-cols-2 lg:gap-5">
      <div>
        <h2 className="mb-6 max-w-2xl text-3xl font-bold md:mb-10 md:text-5xl lg:mb-12">
          AI-Powered Dating Advice at Your Fingertips
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Get personalized relationship guidance from our diverse AI Love Guru Squad
        </p>
        {/* List */}
        <ul className="grid max-w-lg grid-cols-2 gap-4">
          <li className="flex items-center">
            <img
              src="https://assets.website-files.com/6458c625291a94a195e6cf3a/6458c625291a9473e2e6cf65_tick-circle.svg"
              alt=""
              className="mr-2 h-8 w-8"
            />
            <p className="text-sm sm:text-base">More than 5 AI Expert Love Gurus</p>
          </li>
          <li className="flex items-center">
            <img
              src="https://assets.website-files.com/6458c625291a94a195e6cf3a/6458c625291a9473e2e6cf65_tick-circle.svg"
              alt=""
              className="mr-2 h-8 w-8"
            />
            <p className="text-sm sm:text-base">Personalized Advice</p>
          </li>
          <li className="flex items-center">
            <img
              src="https://assets.website-files.com/6458c625291a94a195e6cf3a/6458c625291a9473e2e6cf65_tick-circle.svg"
              alt=""
              className="mr-2 h-8 w-8"
            />
            <p className="text-sm sm:text-base">Contrarian View</p>
          </li>
          <li className="flex items-center">
            <img
              src="https://assets.website-files.com/6458c625291a94a195e6cf3a/6458c625291a9473e2e6cf65_tick-circle.svg"
              alt=""
              className="mr-2 h-8 w-8"
            />
            <p className="text-sm sm:text-base">Consensus Opinion</p>
          </li>
        </ul>
        {/* Divider */}
        <div className="mb-10 mt-10 w-full max-w-lg border-b border-gray-300"></div>
        
        {/* NeoX Support Section */}
        <div className="mt-8">
          <h3 className="text-2xl font-bold text-purple-600 mb-4">Love Guru: Powered by NeoX</h3>
      
          <ul className="space-y-4">
           
         
       
          
          </ul>
        </div>
      </div>
      <div>
        <img
          src="/images/allguru.jpg" // 假设您有一张顾问合
          alt="Dating Advisors"
          className="mx-auto inline-block h-full w-full max-w-2xl"
        />
      </div>
    </div>
  </div>
</section>

<section>
  {/* Container */}
  <div className="mx-auto w-full px-5 py-12 md:px-10 md:py-16 lg:py-20">
    {/* Heading */}
    <h2 className="mx-auto mb-12 text-center text-3xl font-extrabold md:mb-20 md:text-5xl">
      Get Your Love Advice in 4 Easy Steps
    </h2>
    {/* How it Works */}
    <div className="mx-auto grid max-w-2xl grid-cols-1 gap-6">
      {/* Item 1 */}
      <div className="flex flex-row items-center gap-6 rounded-[60px] border border-solid bg-gray-100 px-6 py-4 transition hover:bg-black hover:text-white">
        <div className="flex h-20 w-20 flex-none flex-col items-center justify-center rounded-full bg-white">
          <img
            src="https://assets.website-files.com/646f65e37fe0275cfb808405/646f66cdeeb4ddfdae25a274_CodepenLogo.svg"
            alt="Connect Wallet Icon"
            className="inline-block"
          />
        </div>
        <div className="flex flex-col items-start gap-2.5">
          <h5 className="text-base font-bold md:text-xl">
            Connect your wallet
          </h5>
          <p className="text-gray-500">
            Secure and anonymous access to our AI advisors. Your privacy is our top priority.
          </p>
        </div>
      </div>
      {/* Item 2 */}
      <div className="flex flex-row items-center gap-6 rounded-[60px] border border-solid bg-gray-100 px-6 py-4 transition hover:bg-black hover:text-white">
        <div className="flex h-20 w-20 flex-none flex-col items-center justify-center rounded-full bg-white">
          <img
            src="https://assets.website-files.com/646f65e37fe0275cfb808405/646f66cdeeb4ddfdae25a28e_GitlabLogo.svg"
            alt="Choose Openness Icon"
            className="inline-block"
          />
        </div>
        <div className="flex flex-col items-start gap-2.5">
          <h5 className="text-base font-bold md:text-xl">
            Choose your openness level
          </h5>
          <p className="text-gray-500">
            Tailor advice to your comfort zone. Our AI adapts to your preferences for personalized guidance.
          </p>
        </div>
      </div>
      {/* Item 3 */}
      <div className="flex flex-row items-center gap-6 rounded-[60px] border border-solid bg-gray-100 px-6 py-4 transition hover:bg-black hover:text-white">
        <div className="flex h-20 w-20 flex-none flex-col items-center justify-center rounded-full bg-white">
          <img
            src="https://assets.website-files.com/646f65e37fe0275cfb808405/646f66cdeeb4ddfdae25a274_CodepenLogo.svg"
            alt="Enter Question Icon"
            className="inline-block"
          />
        </div>
        <div className="flex flex-col items-start gap-2.5">
          <h5 className="text-base font-bold md:text-xl">
            Enter your relationship question
          </h5>
          <p className="text-gray-500">
            Get specific advice for your unique situation. Our AI experts are ready to address your concerns.
          </p>
        </div>
      </div>
      {/* Item 4 */}
      <div className="flex flex-row items-center gap-6 rounded-[60px] border border-solid bg-gray-100 px-6 py-4 transition hover:bg-black hover:text-white">
        <div className="flex h-20 w-20 flex-none flex-col items-center justify-center rounded-full bg-white">
          <img
            src="https://assets.website-files.com/646f65e37fe0275cfb808405/646f66cdeeb4ddfdae25a28e_GitlabLogo.svg"
            alt="Get Advice Icon"
            className="inline-block"
          />
        </div>
        <div className="flex flex-col items-start gap-2.5">
          <h5 className="text-base font-bold md:text-xl">Click "Ask" for expert advice</h5>
          <p className="text-gray-500">
            Receive insights from multiple AI relationship experts. Get comprehensive advice to navigate your love life.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>
          
          <div className="mt-8 bg-white rounded-3xl shadow-lg p-6">
          <h2 className="text-3xl font-bold text-purple-800 mb-4">Choose Your Openness Level</h2>            
            <select
              value={riskLevel}
              onChange={(e) => setRiskLevel(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 mb-4"
            >
              <option value="conservative">Conservative</option>
              <option value="balanced">Balanced</option>
              <option value="aggressive">Aggressive</option>
            </select>

            <div className="flex items-center bg-gray-100 rounded-full p-2 mb-4">
              <input 
                type="text" 
                placeholder="Ask your dating question...How to date with a girl who is a Virgo?"
                className="flex-grow bg-transparent outline-none px-4"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
              <button 
                className="bg-pink-500 text-white rounded-full px-6 py-2 hover:bg-pink-600 transition duration-300"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? 'Asking...' : 'Ask'}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {advisors.map((advisor) => (
              <div
                key={advisor.name}
                className={`relative cursor-pointer ${
                  selectedAdvisor === advisor.name ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => handleAdvisorClick(advisor.name)}
              >
                <Image
                  src={advisor.image}
                  alt={advisor.name}
                  width={100}
                  height={100}
                  className="rounded-full"
                />
                <p className="text-center mt-2">{advisor.name}</p>
                {unreadAdvice[advisor.name] && (
                  <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></div>
                )}
              </div>
            ))}
          </div>

          {selectedAdvisor && (
            <div className="mt-8">
              <AdvisorResponse
                advisor={advisors.find(a => a.name === selectedAdvisor)}
                response={
                  selectedAdvisor === 'maverick'
                    ? maverickOpinion
                    : selectedAdvisor === 'consensus'
                    ? consensusAdvice
                    : responses[selectedAdvisor]
                }
                isLoading={isLoading && currentAdvisorIndex === advisors.findIndex(a => a.name === selectedAdvisor)}
              />
            </div>
          )}
        </div>

        
      </div>
    </div>
  );
}