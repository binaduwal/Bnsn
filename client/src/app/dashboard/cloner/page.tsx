'use client';
import React, { useState } from 'react';
import { ChevronDown, Wand2 } from 'lucide-react';

const CopyCloning: React.FC = () => {
  const [selectedBlueprint, setSelectedBlueprint] = useState<string>('');
  const [copyText, setCopyText] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const wordCount = copyText.trim().split(/\s+/).filter(word => word.length > 0).length;

  const blueprintOptions = [
    'Email Campaign',
    'Social Media Post',
    'Blog Article',
    'Product Description',
    'Landing Page',
    'Press Release'
  ];

  const handleBlueprintSelect = (blueprint: string) => {
    setSelectedBlueprint(blueprint);
    setIsDropdownOpen(false);
  };

  return (
    <div className="rounded-lg bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-700 mb-4">
            Wanna clone some copy?
          </h1>
          <p className="text-gray-600">
            Copy and paste up to 2,500 words of any copy you like in the box below. BNSN will create a version just for you.
          </p>
        </div>

        {/* Blueprint Dropdown */}
        <div className="mb-6">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between"
            >
              <span className={selectedBlueprint ? 'text-gray-900' : 'text-gray-500'}>
                {selectedBlueprint || 'Select a blueprint (required)...'}
              </span>
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                {blueprintOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleBlueprintSelect(option)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Text Area */}
        <div className="mb-4">
          <textarea
            value={copyText}
            onChange={(e) => setCopyText(e.target.value)}
            placeholder="Enter the copy you want to clone here."
            className="w-full h-80 px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            maxLength={2500}
          />
        </div>

        {/* Word Count */}
        <div className="flex justify-end mb-6">
          <span className="text-sm text-red-500">
            Words: {wordCount}
          </span>
        </div>

        {/* Magic Button */}
        <div className="text-center">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium inline-flex items-center gap-2">
            Click This Magic Button
            <Wand2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CopyCloning;