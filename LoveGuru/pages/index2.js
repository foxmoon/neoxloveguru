import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { motion } from 'framer-motion';
import AdvisorResponse from '../components/AdvisorResponse';
import ExpandableContent from '../components/ExpandableContent';
import { useAccount } from 'wagmi';
import { useSession } from 'next-auth/react';
import WalletConnection from '../components/WalletConnection';
import MarketSentimentAnalyzer from '../components/MarketSentimentAnalyzer';
import InvestmentSimulator from '../components/InvestmentSimulator';
import RiskAssessor from '../components/RiskAssessor';
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
  const [logs, setLogs] = useState({});
  const [selectedAdvisor, setSelectedAdvisor] = useState(null);

  const advisors = [
    { name: 'romeo', image: '/images/romeo.png' },
    { name: 'yuki', image: '/images/yuki.png' },
    { name: 'emma', image: '/images/emma.png' },
    { name: 'idris', image: '/images/idris.png' },
    { name: 'priyanka', image: '/images/priyanka.png' },
    { name: 'maverick', image: '/images/maverick.png' },
    { name: 'consensus', image: '/images/consensus.png' },
  ];

  const consultAdvisor = async (advisor) => {
    try {
      const response = await fetch('/api/getAdvice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, riskLevel, advisor: advisor.name, marketSentiment }),
      });
      const data = await response.json();
      setResponses(prev => ({ ...prev, [advisor.name]: data.advice }));
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
      setMaverickOpinion(data.advice);
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
      setConsensusAdvice(data.advice);
    } catch (error) {
      console.error('Error generating consensus advice:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResponses({});
    setMaverickOpinion('');
    setConsensusAdvice('');
    setCurrentAdvisorIndex(0);

    // 1. 获取所有常规顾问的建议
    for (const advisor of advisors) {
      await consultAdvisor(advisor);
      setCurrentAdvisorIndex(prev => prev + 1);
    }

    // 2. 获取 Maverick 的反对意见
    await generateMaverickOpinion();

    // 3. 生成综合建议
    await generateConsensusAdvice();

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 to-purple-600">
      <Head>
        <title>Crypto Investment Advisor AI</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-5xl font-bold text-white text-center mb-8">
          Crypto Investment Advisor AI
        </h1>

        <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl p-8 shadow-2xl">
          <WalletConnection />

          <div className="mb-6">
            <label htmlFor="question" className="block text-white text-lg mb-2">Your Investment Question</label>
            <input 
              type="text" 
              id="question"
              value={question} 
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What's your investment query?"
              className="w-full p-3 rounded-lg bg-white bg-opacity-50 placeholder-gray-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="riskLevel" className="block text-white text-lg mb-2">Risk Level</label>
            <select
              id="riskLevel"
              value={riskLevel}
              onChange={(e) => setRiskLevel(e.target.value)}
              className="w-full p-3 rounded-lg bg-white bg-opacity-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              <option value="conservative">Conservative</option>
              <option value="balanced">Balanced</option>
              <option value="aggressive">Aggressive</option>
            </select>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <button 
              type="submit"
              disabled={isConnected ? false : true}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50"
            >
              {isLoading ? 'Consulting...' : (isConnected ? 'Get Investment Advice' : 'Connect Wallet to Submit')}
            </button>
          </form>

          <div className="mt-8">
            <AdvisorTabs 
              advisors={advisors} 
              selectedAdvisor={selectedAdvisor} 
              setSelectedAdvisor={setSelectedAdvisor}
              responses={responses}
              maverickOpinion={maverickOpinion}
              consensusAdvice={consensusAdvice}
              isLoading={isLoading}
              currentAdvisorIndex={currentAdvisorIndex}
            />
          </div>
        </div>
      </div>
    </div>
  );
}