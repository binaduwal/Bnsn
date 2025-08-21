'use client';
import React, { useState, useEffect } from 'react';
import { ChevronDown, FileText, Sparkles, Copy, ArrowRight, Zap } from 'lucide-react';
import { getAllBlueprintApi, BlueprintProps, cloneBlueprintApi } from '@/services/blueprintApi';
import { allCategoryApi } from '@/services/categoryApi';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const CopyCloning: React.FC = () => {
  const [selectedBlueprint, setSelectedBlueprint] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [copyText, setCopyText] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState<boolean>(false);
  const [blueprints, setBlueprints] = useState<BlueprintProps[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCloning, setIsCloning] = useState<boolean>(false);
  const router = useRouter();

  const wordCount = copyText.trim().split(/\s+/).filter(word => word.length > 0).length;
  const isNearLimit = wordCount > 2000;
  const isAtLimit = wordCount >= 2500;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [blueprintsResponse, categoriesResponse] = await Promise.all([
          getAllBlueprintApi(),
          allCategoryApi('project', 1)
        ]);
        setBlueprints(blueprintsResponse.data || []);
        setCategories(categoriesResponse.data || []);
        console.log('Loaded categories:', categoriesResponse.data);
        console.log('Loaded blueprints:', blueprintsResponse.data);
      } catch (error: any) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleBlueprintSelect = (blueprint: BlueprintProps) => {
    setSelectedBlueprint(blueprint._id);
    setIsDropdownOpen(false);
  };

  const handleCategorySelect = (category: any) => {
    setSelectedCategory(category._id);
    setIsCategoryDropdownOpen(false);
  };

  const handleCloneCopy = async () => {
    if (!selectedBlueprint || !copyText.trim()) {
      toast.error('Please select a blueprint and enter copy to clone');
      return;
    }

    setIsCloning(true);
    try {
      // Get the selected blueprint
      const selectedBlueprintData = blueprints.find(b => b._id === selectedBlueprint);
      if (!selectedBlueprintData) {
        throw new Error('Selected blueprint not found');
      }

      // Clone the blueprint with user's modifications using streaming API
      await cloneBlueprintApi(
        selectedBlueprint,
        copyText.trim(),
        `Cloned: ${selectedBlueprintData.title}`,
        (chunk: string) => {
          // Handle progress updates
          console.log('AI Progress:', chunk);
        },
        (data: any) => {
          // Handle completion
          toast.success('Blueprint cloned successfully!');
          router.push(`/dashboard/blueprint/${data._id}`);
        },
        (error: string) => {
          // Handle errors
          toast.error(error);
        }
      );
    } catch (error: any) {
      console.error('Clone error:', error);
      toast.error(error.message || 'Failed to clone blueprint');
    } finally {
      setIsCloning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="w-full mx-auto px-6 py-8">
        {/* Modern Hero Header */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
              <Copy className="w-4 h-4" />
              <span>Quick Clone</span>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-3">
              Clone Blueprint Templates
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Select a blueprint template and paste your copy. Ai District Copywrite will create a new blueprint that includes your custom copy and modifications, preserving the original template structure while adding your content.
            </p>
          </div>

        </div>

        {/* Main Content Card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
            {/* Step Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-center space-x-4">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    selectedBlueprint ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    1
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700">Select Blueprint</span>
                </div>
                <div className="w-8 h-1 bg-gray-200 rounded"></div>
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    copyText.trim() ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    2
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700">Paste Copy</span>
                </div>
                <div className="w-8 h-1 bg-gray-200 rounded"></div>
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    selectedBlueprint && copyText.trim() ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    3
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700">Clone Blueprint</span>
                </div>
              </div>
            </div>
            {/* Blueprint Selection */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Step 1: Select Blueprint Template
              </label>
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full px-4 py-4 text-left bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between hover:border-blue-300 transition-colors"
                >
                  <span className={selectedBlueprint ? 'text-gray-900' : 'text-gray-500'}>
                    {selectedBlueprint ? blueprints.find(b => b._id === selectedBlueprint)?.title : 'Choose a blueprint template...'}
                  </span>
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                    {isLoading ? (
                      <div className="px-4 py-3 text-gray-500">Loading blueprints...</div>
                    ) : blueprints.length === 0 ? (
                      <div className="px-4 py-3 text-gray-500">No blueprints available</div>
                    ) : (
                      blueprints.map((blueprint) => (
                        <button
                          key={blueprint._id}
                          onClick={() => handleBlueprintSelect(blueprint)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 flex items-center gap-3 border-b border-gray-100 last:border-b-0"
                        >
                          <FileText className="w-4 h-4 text-blue-500" />
                          <div className="flex-1 text-left">
                            <div className="font-medium text-gray-900">{blueprint.title}</div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
              
              {/* Selected Blueprint Info */}
              {selectedBlueprint && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">
                      Selected: {blueprints.find(b => b._id === selectedBlueprint)?.title}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Text Area */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Step 2: Paste Your Original Copy
              </label>
              <textarea
                value={copyText}
                onChange={(e) => {
                  const newText = e.target.value;
                  const wordCount = newText.trim().split(/\s+/).filter(word => word.length > 0).length;
                  
                  // Allow up to 2500 words
                  if (wordCount <= 2500 || newText.length < copyText.length) {
                    setCopyText(newText);
                  }
                }}
                placeholder="Paste your original copy here (up to 2,500 words). This will be used to customize the blueprint template with your business details..."
                className="w-full h-80 px-4 py-4 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-700"
              />
            </div>

            {/* Word Count and Info */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Zap className="w-4 h-4 text-blue-500" />
                <span>AI-powered cloning</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Words:</span>
                <span className={`text-sm font-semibold ${isNearLimit ? 'text-orange-500' : isAtLimit ? 'text-red-500' : 'text-green-600'}`}>
                  {wordCount}/2,500
                </span>
              </div>
            </div>

            {/* Cloning Info */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles className="w-3 h-3 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-blue-900 mb-1">What happens when you clone?</h4>
                  <p className="text-sm text-blue-700">
                    The selected blueprint template will be cloned with your custom copy integrated into it. Your content will be preserved in the new blueprint's description, creating a personalized version that combines the original template structure with your specific business content and modifications.
                  </p>
                </div>
              </div>
            </div>

            {/* Magic Button */}
            <div className="text-center">
              <button 
                onClick={handleCloneCopy}
                disabled={!selectedBlueprint || !copyText.trim() || isCloning}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-semibold inline-flex items-center gap-3 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
              >
                {isCloning ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Cloning Copy...
                  </>
                ) : (
                  <>
                                    <Sparkles className="h-5 w-5" />
                Clone Blueprint
                <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CopyCloning;