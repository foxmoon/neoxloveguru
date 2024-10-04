import Image from 'next/image';
import AdvisorResponse from './AdvisorResponse';

export default function AdvisorTabs({ 
  advisors, 
  selectedAdvisor, 
  setSelectedAdvisor, 
  responses, 
  maverickOpinion, 
  consensusAdvice, 
  isLoading, 
  currentAdvisorIndex,
  unreadAdvice // 新增这个prop
}) {
  return (
    <div>
      <div className="flex space-x-2 mb-4 overflow-x-auto">
        {advisors.map((advisor, index) => (
          <button
            key={advisor.name}
            className={`flex flex-col items-center p-2 rounded-t-lg ${
              selectedAdvisor === advisor.name ? 'bg-white' : 'bg-gray-200'
            } relative`} // 添加 relative 定位
            onClick={() => setSelectedAdvisor(advisor.name)}
          >
            <Image
              src={advisor.image}
              alt={advisor.name}
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="mt-1 text-xs capitalize">{advisor.name}</span>
            {unreadAdvice[advisor.name] && (
              <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
            )}
          </button>
        ))}
      </div>
      <div className="bg-white p-4 rounded-b-lg">
        {selectedAdvisor && (
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
        )}
      </div>
    </div>
  );
}
