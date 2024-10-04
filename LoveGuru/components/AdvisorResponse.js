import React from 'react';
import Image from 'next/image';
import { marked } from 'marked';

const AdvisorResponse = ({ advisor, response, isLoading }) => {
  const renderMarkdown = (content) => {
    if (!content) return { __html: '' };
    return { __html: marked(content) };
  };

  return (
    <div className="bg-white bg-opacity-75 rounded-lg p-6 shadow-lg">
      <div className="flex items-center mb-4">
        <Image
          src={advisor.image}
          alt={advisor.name}
          width={50}
          height={50}
          className="rounded-full mr-4"
        />
        <h3 className="text-2xl font-bold text-gray-800">
          {advisor.name.charAt(0).toUpperCase() + advisor.name.slice(1)}
        </h3>
      </div>
      {isLoading ? (
        <p className="text-gray-600">Thinking...</p>
      ) : response ? (
        <div 
          className="prose prose-lg text-gray-700 max-w-none"
          dangerouslySetInnerHTML={renderMarkdown(response)}
        />
      ) : (
        <p className="text-gray-600">No advice yet.</p>
      )}
    </div>
  );
};

export default AdvisorResponse;
