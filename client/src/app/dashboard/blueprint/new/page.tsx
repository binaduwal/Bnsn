"use client";
import React, { useState } from "react";
import { ChevronDown, Loader2, Wand2 } from "lucide-react";
import toast from "react-hot-toast";
import { createBlueprintStream } from "@/services/blueprintApi";
import { useRouter } from "next/navigation";

const CreateBlueprint: React.FC = () => {
  const [blueprintName, setBlueprintName] = useState<string>("");
  const [feedBnsn, setFeedBnsn] = useState<string>("");
  const [selectedOfferType, setSelectedOfferType] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [streamingProgress, setStreamingProgress] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState<boolean>(false);

  const wordCount = feedBnsn
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  const offerTypes = [
    "Product Launch",
    "Service Offering",
    "Course/Training",
    "Consultation",
    "Software/App",
    "E-book/Digital Product",
    "Physical Product",
    "Subscription Service",
  ];
  const router = useRouter();

  const handleSubmitBlueprint = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsStreaming(true);
    setStreamingProgress("");

    try {
      await createBlueprintStream(
        {
          description: feedBnsn,
          title: blueprintName,
          offerType: selectedOfferType,
        },
        (chunk: string) => {
          // Handle progress updates
          setStreamingProgress(prev => prev + chunk);
        },
        (data: any) => {
          // Handle completion
          console.log("Blueprint created:", data);
          router.push(`/dashboard/blueprint/${data._id}`);
        },
        (error: string) => {
          // Handle errors
          toast.error(error);
          setIsStreaming(false);
        }
      );
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  const handleOfferTypeSelect = (offerType: string) => {
    setSelectedOfferType(offerType);
    setIsDropdownOpen(false);
  };

  return (
    <div className="  rounded-lg bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-700 flex items-center gap-2">
            Create your blueprint
            <span className="text-gray-400">?</span>
          </h1>
        </div>

        {/* Blueprint Name */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Blueprint Name
          </label>
          <input
            type="text"
            value={blueprintName}
            onChange={(e) => setBlueprintName(e.target.value)}
            placeholder="What do you want to name this blueprint?"
            className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Feed Ai District Copywrite */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Feed Ai District Copywrite
          </label>
          <div className="relative">
            <textarea
              value={feedBnsn}
              onChange={(e) => setFeedBnsn(e.target.value)}
              placeholder="Tell Ai District Copywrite about your project. You can provide up to 10,000 words, or if you're feeling lazy, just 30 will do. It's best to include details such as what you're selling and who you'd like to sell it to. You can include details about yourself as well. If you have bonuses, testimonials, and offer details, feed them to Ai District Copywrite right here."
              className="w-full h-64 px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              maxLength={10000}
            />
            <div className="absolute bottom-3 right-3 text-sm text-gray-500">
              Words: {feedBnsn.trim() === "" ? 0 : wordCount}
            </div>
          </div>
        </div>

        {/* Offer Type */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Offer Type
          </label>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between"
            >
              <span
                className={
                  selectedOfferType ? "text-gray-900" : "text-gray-500"
                }
              >
                {selectedOfferType || "Select your offer type..."}
              </span>
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </button>

            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                {offerTypes.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleOfferTypeSelect(option)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Streaming Progress */}
        {isStreaming && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-center gap-2 mb-2">
              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                Generating your blueprint...
              </span>
            </div>
            
          </div>
        )}

        {/* Create Magically Button */}
        <div className="text-center">
          <button
            onClick={handleSubmitBlueprint}
            className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Wand2 className="h-5 w-5" />}
            Create Magically
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateBlueprint;
