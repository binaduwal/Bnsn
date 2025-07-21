"use client";

import type React from "react";
import { use, useEffect, useState } from "react";
import {
  ChevronDown,
  Settings,
  Edit3,
  Eye,
  ShoppingCart,
  Save,
  Send,
  Copy,
  MoreHorizontal,
  AlertTriangle,
  Plus,
  Trash2,
  ArrowUp,
  Loader,
} from "lucide-react";
import InlineTextEditor from "@/components/ui/InlineTextEditor";
import {
  Category,
  generateProjectApi,
  generateProjectStreamApi,
  singleProjectApi,
} from "@/services/projectApi";
import CampaignAccordion from "@/components/CampainAccordion";
import EditableTitle from "@/components/ui/EditableTitle";
import ContentGenerationSection from "@/components/ContentGenerationSection";
import { createCategoryValueApi, Field } from "@/services/categoryApi";
import toast from "react-hot-toast";

interface EmailCampaignStats {
  wordsLeft: number;
  totalWords: number;
}

interface EmailCampaignUIProps {
  campaignName?: string;
  stats?: EmailCampaignStats;
  onSave?: () => void;
  onPreview?: () => void;
  onSend?: () => void;
  params: Promise<{ id: string }>;
}

export interface Campaign {
  id: string;
  title: string;
  slug: string;
  dropDownTitle: string;
  isActive?: boolean;
}

const EmailCampaignUI: React.FC<EmailCampaignUIProps> = ({
  campaignName = "Promotional Email Generator",
  stats = { wordsLeft: 97340, totalWords: 100000 },
  onSave,
  onPreview,
  onSend,
  params,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentCampaignName, setCurrentCampaignName] = useState(campaignName);
  const [emailContent, setEmailContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // New streaming states
  const [streamingProgress, setStreamingProgress] = useState(0);
  const [streamingMessage, setStreamingMessage] = useState("");
  const [generatedContent, setGeneratedContent] = useState<{
    blueprintValues?: any[];
    fieldValue?: any[];
    aiContent?: string;
  }>({});
  const [streamingData, setStreamingData] = useState<any[]>([]);

  const handleNameEdit = () => {
    setIsEditing(true);
  };

  const handleNameSave = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditing(false);
    }
  };

  const handleNameBlur = () => {
    setIsEditing(false);
  };

  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(
    "Promotional Emails"
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>("");
  const [mainTitle, setMainTitle] = useState("Email Campaign");
  const [categories, setCategories] = useState<Category[]>([]);
  const [blueprintId, setBlueprintId] = useState<string | undefined>(undefined);
  const id = use(params).id;
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: "1",
      title: "Promotional Emails",
      slug: "promotional-emails",
      dropDownTitle: "Promotional Email Generator",
      isActive: true,
    },
    {
      id: "2",
      title: "Content Emails",
      slug: "content-emails",
      dropDownTitle: "Content Email Generator",
      isActive: false,
    },
  ]);

  useEffect(() => {
    fetchSingleProject();
  }, [id]);

  const fetchSingleProject = async () => {
    const response = await singleProjectApi(id);
    setCategories(response.data.categoryId);
    setBlueprintId(response?.data?.blueprintId);
    console.log("first", response);
  };

  const handleCampaignSelect = (campaignTitle: string) => {
    setSelectedCampaign(
      selectedCampaign === campaignTitle ? null : campaignTitle
    );
  };

  const handleCategoryChange = (id: string) => {
    setSelectedCategory(id);
  };

  const handleCampaignUpdate = (oldTitle: string, newTitle: string) => {
    setCampaigns((prev) =>
      prev.map((camp) =>
        camp.title === oldTitle ? { ...camp, title: newTitle } : camp
      )
    );

    // Update selectedCampaign if it was the one being edited
    if (selectedCampaign === oldTitle) {
      setSelectedCampaign(newTitle);
    }
  };

  const handleAddCampaign = () => {
    const newCampaign: Campaign = {
      id: Date.now().toString(),
      title: "New Campaign",
      slug: "new-campaign",
      dropDownTitle: "New Campaign Generator",
      isActive: false,
    };
    setCampaigns((prev) => [...prev, newCampaign]);
  };

  const progressPercentage =
    ((stats.totalWords - stats.wordsLeft) / stats.totalWords) * 100;

  const getSelectedCampaignFields = (): Field[] => {
    if (!categories?.[0]?.subCategories) return [];

    // Find the subcategory that contains the selected campaign
    const targetSubCategory = categories[0].subCategories.find((subCategory) =>
      subCategory.thirdCategories?.some(
        (third) => third._id === selectedCategory
      )
    );

    if (!targetSubCategory) return [];

    // Find the specific third category
    const targetThirdCategory = targetSubCategory.thirdCategories?.find(
      (third) => third._id === selectedCategory
    );

    return targetThirdCategory?.fields || [];
  };

  // Handle streaming data from backend
  const handleStreamData = (data: any) => {
    switch (data.type) {
      case "progress":
        setStreamingProgress(data.progress || 0);
        setStreamingMessage(data.message || "Processing...");
        break;

      case "data":
        setStreamingData((prev) => [...prev, data]);
        if (data.key === "blueprintValues") {
          setGeneratedContent((prev) => ({
            ...prev,
            blueprintValues: data.value,
          }));
        } else if (data.key === "fieldValue") {
          setGeneratedContent((prev) => ({ ...prev, fieldValue: data.value }));
        } else if (data.key === "aiContent") {
          setGeneratedContent((prev) => ({ ...prev, aiContent: data.value }));
        }
        if (data.progress) {
          setStreamingProgress(data.progress);
        }
        break;

      case "complete":
        setStreamingProgress(100);
        setStreamingMessage("Generation completed successfully!");
        if (data.data) {
          setGeneratedContent(data.data);
        }
        toast.success("Project generated successfully!");
        break;

      case "error":
        toast.error(data.message || "An error occurred");
        setStreamingMessage(data.message || "Generation failed");
        break;

      default:
        console.log("Unknown stream data type:", data.type, data);
    }
  };

  // Updated streaming generate function
  const handleGenerateProject = async () => {
    setIsGenerating(true);
    setStreamingProgress(0);
    setStreamingMessage("Starting generation...");
    setGeneratedContent({});
    setStreamingData([]);

    try {
      const response = await generateProjectStreamApi({
        category: categories[0]._id,
        project: id,
        values: fieldValues,
        blueprintId,
      });

      // Check if response body exists
      if (!response.body) {
        throw new Error("Response body is not available for streaming");
      }

      const reader = response.body.getReader(); // ✅ Fixed: Use response.body.getReader()
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          // Process any remaining data in buffer
          if (buffer.trim()) {
            try {
              const data = JSON.parse(buffer);
              handleStreamData(data);
            } catch (e) {
              console.warn("Error parsing final buffer:", e, "Buffer:", buffer);
            }
          }
          break;
        }

        // Decode the chunk and add to buffer
        buffer += decoder.decode(value, { stream: true });

        // Split by newlines to process complete JSON objects
        const lines = buffer.split("\n");

        // Keep the last incomplete line in buffer
        buffer = lines.pop() || "";

        // Process each complete line
        for (const line of lines) {
          const trimmedLine = line.trim();
          if (trimmedLine) {
            try {
              const data = JSON.parse(trimmedLine);
              handleStreamData(data);
            } catch (e) {
              console.error("Error parsing JSON:", e, "Line:", trimmedLine);
            }
          }
        }
      }
    } catch (error: any) {
      console.error("Streaming error:", error);
      toast.error(error.message || "Generation failed");
      setStreamingMessage("Generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  const [fieldValues, setFieldValues] = useState<{ [key: string]: string }>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleFieldChange = (fieldId: string, value: string) => {
    setFieldValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const campaignFields = getSelectedCampaignFields();
  const hasFields = campaignFields.length > 0;

  return (
    <div className="bg-gray-50 flex">
      {/* Left Sidebar */}
      <aside className="w-80 max-h-[calc(100vh-120px)] bg-white border-r border-gray-200 flex flex-col shadow-sm">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <EditableTitle title={mainTitle} onSave={setMainTitle} />
        </div>

        {/* Campaigns Section */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Campaigns {selectedCampaign}
            </h3>
            <CampaignAccordion
              campaigns={categories}
              onCategoryChange={handleCategoryChange}
              selectedCampaign={selectedCampaign}
              onCampaignSelect={handleCampaignSelect}
              onCampaignUpdate={handleCampaignUpdate}
            />
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-2">
            <button className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors">
              <Eye className="w-4 h-4 inline mr-2" />
              View All
            </button>
            <button
              onClick={handleAddCampaign}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Add
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {/* Blueprint Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span className="text-sm font-medium text-blue-600">
                Blueprint: Productivity Course Demo
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                Active
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          <div className="flex flex-col bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 shadow-sm">
              <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                  {/* Breadcrumb and Title */}
                  <div className="flex items-center space-x-3">
                    <nav className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>Promotional Emails</span>
                      <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                    </nav>

                    <div className="flex items-center space-x-2">
                      {isEditing ? (
                        <input
                          type="text"
                          value={currentCampaignName}
                          onChange={(e) =>
                            setCurrentCampaignName(e.target.value)
                          }
                          onKeyDown={handleNameSave}
                          onBlur={handleNameBlur}
                          className="text-lg font-semibold text-gray-900 bg-transparent border-b-2 border-blue-500 focus:outline-none"
                          autoFocus
                        />
                      ) : (
                        <h1
                          className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
                          onClick={handleNameEdit}
                        >
                          {currentCampaignName}
                        </h1>
                      )}

                      <button
                        onClick={handleNameEdit}
                        className="p-1 rounded hover:bg-gray-100 transition-colors"
                        title="Edit campaign name"
                      >
                        <Edit3 className="w-4 h-4 text-gray-400" />
                      </button>

                      <button
                        onClick={onPreview}
                        className="p-1 rounded hover:bg-gray-100 transition-colors"
                        title="Preview email"
                      >
                        <Eye className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>

                  {/* Stats and Actions */}
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-gray-600">
                        Words Left:
                        <span className="font-medium text-blue-600 ml-1">
                          {stats.wordsLeft.toLocaleString()}
                        </span>
                      </div>

                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                    </div>

                    <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                      <ShoppingCart className="w-5 h-5 text-gray-500" />
                    </button>

                    <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                      <Settings className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
              {campaignFields.length > 0 ? (
                <div className="max-w-4xl mx-auto p-3">
                  {campaignFields.map((field, index) => (
                    <div
                      key={field._id}
                      className={`group relative transition-all duration-200`}
                    >
                      <div className="bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors">
                        {/* Header with label and required indicator */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <label className="text-base font-semibold text-gray-800">
                              {field.fieldName}
                            </label>
                          </div>
                          <div className="text-sm text-gray-400 font-mono">
                            #{index + 1}
                          </div>
                        </div>

                        {/* Input Field */}
                        <div className="relative">
                          {field.fieldType === "text" && (
                            <div className="relative">
                              <input
                                type="text"
                                value={
                                  fieldValues[
                                    `${field.fieldName}-${field._id}`
                                  ] || ""
                                }
                                onChange={(e) =>
                                  handleFieldChange(
                                    `${field.fieldName}-${field._id}`,
                                    e.target.value
                                  )
                                }
                                onFocus={() => setFocusedField(field._id)}
                                onBlur={() => setFocusedField(null)}
                                placeholder={`Enter ${field.fieldName.toLowerCase()}`}
                                className={`w-full px-4 py-3 border-2 rounded-lg text-gray-700 placeholder-gray-400 
                          transition-all duration-200 focus:outline-none focus:ring-0
                          border-gray-200 hover:border-gray-300`}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Generate Button Section with Streaming UI */}
                  <div className="flex flex-col items-center mt-4 space-y-4">
                    {/* Progress Bar (shown when generating) */}
                    {isGenerating && (
                      <div className="w-full max-w-md">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>{streamingMessage}</span>
                          <span>{streamingProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${streamingProgress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Generate Button */}
                    <button
                      disabled={isGenerating}
                      onClick={handleGenerateProject}
                      className="py-2 px-4 rounded-lg bg-blue-500 flex items-center justify-center text-white hover:bg-blue-700 duration-200 capitalize max-w-max disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isGenerating ? (
                        <div className="flex items-center gap-3">
                          <span>Generating</span>
                          <Loader className="size-5 animate-spin" />
                        </div>
                      ) : (
                        "Click Magic Button"
                      )}
                    </button>
                  </div>

                  {/* Generated Content Display */}
                  {(generatedContent.aiContent ||
                    generatedContent.blueprintValues) && (
                    <div className="w-full max-w-4xl mx-auto mt-6 p-6 bg-white rounded-lg border border-gray-200">
                      <h2 className="text-xl font-bold mb-4 text-gray-800">
                        Generated Content
                      </h2>

                      {/* AI Generated Content */}
                      {generatedContent.aiContent && (
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold mb-2 text-gray-700">
                            AI Generated Email:
                          </h3>
                          <div className="bg-gray-50 p-4 rounded-lg ">
                            {/* <div className="whitespace-pre-wrap text-gray-800">
                              {generatedContent.aiContent}
                            </div> */}
                            <div
                              className="prose prose-sm sm:prose lg:prose-lg max-w-none text-gray-800"
                              dangerouslySetInnerHTML={{
                                __html: generatedContent.aiContent,
                              }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <ContentGenerationSection />
              )}
            </main>

            {/* Footer Actions */}
            <footer className="bg-white border-t border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={onSave}
                    className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Draft</span>
                  </button>

                  <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors">
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </button>

                  <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <MoreHorizontal className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={onPreview}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                  >
                    Preview
                  </button>

                  <button
                    onClick={onSend}
                    className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!emailContent.trim()}
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Campaign</span>
                  </button>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmailCampaignUI;
