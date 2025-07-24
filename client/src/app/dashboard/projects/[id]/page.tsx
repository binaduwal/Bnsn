"use client";

import type React from "react";
import { use, useCallback, useEffect, useState } from "react";
import {
  ChevronDown,
  Settings,
  Edit3,
  Eye,
  ShoppingCart,
  Save,
  Copy,
  Plus,
  Loader,
  Sparkles,
  Zap,
  CheckCircle,
} from "lucide-react";
import InlineTextEditor from "@/components/ui/InlineTextEditor";
import {
  Category,
  generateProjectStreamApi,
  singleProjectApi,
} from "@/services/projectApi";
import CampaignAccordion from "@/components/CampainAccordion";
import EditableTitle from "@/components/ui/EditableTitle";
import { Field } from "@/services/categoryApi";
import toast from "react-hot-toast";
import { updateCategoryValueApi } from "@/services/blueprintApi";

export interface Campaign {
  id: string;
  title: string;
  slug: string;
  dropDownTitle: string;
  isActive?: boolean;
}

interface EmailCampaignUIProps {
  params: Promise<{ id: string }>;
}

const EmailCampaignUI: React.FC<EmailCampaignUIProps> = ({ params }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentCampaignName, setCurrentCampaignName] = useState(
    "Promotional Email Generator"
  );

  const [isGenerating, setIsGenerating] = useState(false);

  const [streamingAiContent, setStreamingAiContent] = useState<string>("");
  const [isAiStreaming, setIsAiStreaming] = useState<boolean>(false);
  const stats = { wordsLeft: 97340, totalWords: 100000 };

  // New streaming states
  const [streamingProgress, setStreamingProgress] = useState(0);
  const [streamingMessage, setStreamingMessage] = useState("");
  const [generatedContent, setGeneratedContent] = useState<{
    blueprintValues?: any[];
    fieldValue?: any[];
    aiContent?: string;
  }>({});

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
  const [mainTitle, setMainTitle] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [blueprintId, setBlueprintId] = useState<string | undefined>(undefined);
  const [fieldValues, setFieldValues] = useState<{ [key: string]: string }>({});

  const id = use(params).id;

  useEffect(() => {
    fetchSingleProject();
  }, [id]);

  useEffect(() => {
    setFieldValues({})
    const fieldValue = getFieldValue();

    console.log("fieldValue", fieldValue);

    const values = fieldValue?.value.forEach((item: any) => {
      setFieldValues((prev) => ({ ...prev, [item.key]: item.value[0] }));
    });

    setGeneratedContent({
      ...generatedContent,
      aiContent: fieldValue ? fieldValue.isAiGeneratedContent : "",
    });
  }, [selectedCategory, categories]);

  const fetchSingleProject = async () => {
    const response = await singleProjectApi(id);
    setCategories(response.data.categoryId);
    setSelectedCategory(
      response.data?.categoryId[0]?.subCategories[0]?.thirdCategories[0]?._id
    );
    setSelectedCampaign(response.data?.categoryId[0]?.subCategories[0]?.title);
    setMainTitle(response.data?.categoryId[0]?.title);

    setCurrentCampaignName(response.data?.categoryId[0]?.title);

    setBlueprintId(response?.data?.blueprintId._id);
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
    // Update selectedCampaign if it was the one being edited
    if (selectedCampaign === oldTitle) {
      setSelectedCampaign(newTitle);
    }
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

        // Start AI streaming when AI generation begins
        if (data.message?.includes("Generating AI content")) {
          setIsAiStreaming(true);
          setStreamingAiContent(""); // Reset streaming content
        }
        break;

      case "data":
        if (data.key === "blueprintValues") {
          setGeneratedContent((prev) => ({
            ...prev,
            blueprintValues: data.value,
          }));
        } else if (data.key === "fieldValue") {
          setGeneratedContent((prev) => ({ ...prev, fieldValue: data.value }));
        } else if (data.key === "aiContent") {
          // Final AI content received
          setGeneratedContent((prev) => ({ ...prev, aiContent: data.value }));
          setIsAiStreaming(false); // Stop streaming mode
          setStreamingAiContent(""); // Clear streaming content
        }
        if (data.progress) {
          setStreamingProgress(data.progress);
        }
        break;

      // NEW: Handle real-time AI content chunks
      case "ai_chunk":
        setStreamingAiContent((prev) => prev + data.content);
        if (data.progress) {
          setStreamingProgress(data.progress);
        }
        break;

      case "complete":
        setStreamingProgress(100);
        setStreamingMessage("Generation completed successfully!");
        setIsAiStreaming(false); // Ensure streaming mode is off

        if (data.data) {
          setGeneratedContent(data.data);
        }
        toast.success("Project generated successfully!");
        break;

      case "error":
        toast.error(data.message || "An error occurred");
        setStreamingMessage(data.message || "Generation failed");
        setIsAiStreaming(false); // Stop streaming on error
        setStreamingAiContent(""); // Clear streaming content
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

    try {
      const response = await generateProjectStreamApi({
        category: categories[0]._id,
        currentCategory: selectedCategory || "",
        project: id,
        values: fieldValues,
        blueprintId,
      });

      // Check if response body exists
      if (!response.body) {
        throw new Error("Response body is not available for streaming");
      }

      const reader = response.body.getReader();
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

  const renderAiContent = () => {
    // Show streaming content if AI is currently streaming
    const contentToShow = () => {
      return isAiStreaming
        ? streamingAiContent
        : generatedContent.aiContent;
    }

    if (!contentToShow && !isAiStreaming) return null;

    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          {isAiStreaming && (
            <div className="flex items-center gap-1 text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm">Generating...</span>
            </div>
          )}
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="space-y-10">
            {isAiStreaming ? (
              // Show streaming content in real-time
              <StreamingEmailPreview content={streamingAiContent} />
            ) : (
              // Show final parsed emails
              parseMultipleEmails(contentToShow() || "").map((email, idx) => (
                <EmailCard key={idx} email={email} index={idx} />
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  const StreamingEmailPreview: React.FC<{ content: string }> = ({
    content,
  }) => {
    if (!content.trim()) {
      return (
        <div className="border border-gray-200 rounded-lg p-6 shadow">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      );
    }

    // Try to parse partial emails for better preview
    const partialContent = parseStreamingContent(content);

    return (
      <>
        {partialContent.map((content, idx) => (
          <div
            key={idx}
            className="border border-gray-200 rounded-lg p-6 shadow"
          >

            {content.subject && (
              <p className="text-base text-gray-600 mb-1">
                <strong>Subject:</strong> {content.subject}
              </p>
            )}

            {content.preheader && (
              <p className="text-sm text-gray-600 mb-4">
                <strong>Preheader:</strong> {content.preheader}
              </p>
            )}

            {content.body && (
              <div className="prose max-w-none">
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      content.body +
                      (idx === partialContent.length - 1
                        ? '<span class="animate-pulse">|</span>'
                        : ""),
                  }}
                />
              </div>
            )}
          </div>
        ))}

        {/* Show raw streaming content if no emails parsed yet */}
        {partialContent.length === 0 && (
          <div className="border border-gray-200 rounded-lg p-6 shadow">
            <div className="text-sm text-gray-600 font-mono whitespace-pre-wrap">
              {content}
              <span className="animate-pulse">|</span>
            </div>
          </div>
        )}
      </>
    );
  };

  // Component for final email cards
  const EmailCard: React.FC<{ email: any; index: number }> = ({
    email,
    index,
  }) => (
    <div className="border relative border-gray-200 flex flex-col gap-1 rounded-lg p-6 shadow">
      <div className="absolute top-0 right-0">
        <button 
          onClick={() => {
            const parsedHtml = parse(email.body);
            navigator.clipboard.writeText(parsedHtml);
            toast.success("Copied to clipboard");
          }}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Copy className="w-4 h-4" />
        </button>
      </div>
      {email.title && (
        <h2 className="text-xl  font-semibold mb-2">{email.title}</h2>
      )}

      {email.subject && (
        <p className="text-base text-gray-600 mb-1">
          <strong>Subject:</strong> {email.subject}
        </p>
      )}

      {email.preheader && (
        <p className="text-sm text-gray-600 mb-4">
          <strong>Preheader:</strong> {email.preheader}
        </p>
      )}

      <InlineTextEditor
        className="p-0"
        initialContent={email.body}
        onChange={(value) => { }}
      />
    </div>
  );

  // Helper function to parse streaming emails (partial content)
 const parseStreamingContent = (content: string) => {
  const emails: ParsedEmail[] = [];

  const isHTML = /<html[^>]*>/i.test(content);

  if (isHTML) {
    // Extract <title>
    const titleMatch = content.match(/<title[^>]*>(.*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : "Website Page";

    // Extract <h1> as subject
    const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/i);
    const subject = h1Match ? h1Match[1].trim() : "Web Page Content";

    // Try extracting hero text <p> directly below <h1>
    const preheaderMatch = content.match(/<h1[^>]*>.*?<\/h1>\s*<p[^>]*>(.*?)<\/p>/i);
    const preheader = preheaderMatch ? preheaderMatch[1].trim() : "";

    // The entire body as fallback "body"
    const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    const body = bodyMatch ? bodyMatch[1].trim() : content.trim();

    emails.push({
      title,
      subject,
      preheader,
      body,
    });
  }

  return emails;
};


  const handleSave = async () => {
    try {
      const response = await updateCategoryValueApi({
        id: selectedCategory || "",
        isAiGeneratedContent: generatedContent.aiContent,
      });

      console.log(response);
      toast.success("Saved successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to save");
    }
    console.log("save");
  };

  interface ParsedEmail {
    title: string | undefined;
    subject: string | undefined;
    preheader: string | undefined;
    body: string | undefined;
  }

  const parseMultipleEmails = useCallback((rawHtml: string): ParsedEmail[] => {
    const emailBlocks = rawHtml.split(/<\/html>/gi).filter(Boolean); // Split by </html>

    const emails: ParsedEmail[] = emailBlocks.map((block, index) => {
      const titleMatch = block.match(/<title>(.*?)<\/title>/i);
      const subjectMatch = block.match(/<!--\s*Subject:\s*(.*?)\s*-->/i);
      const preheaderMatch = block.match(/<!--\s*Preheader:\s*(.*?)\s*-->/i);
      const bodyMatch = block.match(/<body[^>]*>([\s\S]*?)<\/body>/i);

      return {
        title: titleMatch?.[1]?.trim() || undefined,
        subject: subjectMatch?.[1]?.trim() || undefined,
        preheader: preheaderMatch?.[1]?.trim() || undefined,
        body: bodyMatch?.[1]?.trim() || undefined,
      };
    });

    console.log(
      "emails",
      emails.filter((email) => email.body)
    );
    return emails.filter((email) => email.body);
  }, [generatedContent.aiContent])

  const handleFieldChange = (fieldId: string, value: string) => {
    setFieldValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const getFieldValue = () => {
    if (!selectedCategory) return undefined;
    if (categories.length === 0) return undefined;

    for (const category of categories) {
      if (category.subCategories) {
        for (const subCategory of category.subCategories) {
          if (subCategory.thirdCategories) {
            for (const thirdCategory of subCategory.thirdCategories) {
              if (thirdCategory._id === selectedCategory) {
                return thirdCategory.fieldValue;
              }
            }
          }
        }
      }
    }
    return undefined;
  };

  const parse = (html: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    return doc.body.textContent || doc.body.innerText || "";
  };

  const campaignFields = getSelectedCampaignFields();

  return (
    <div className="bg-gray-50 flex">
      {/* Left Sidebar */}
      <aside className="w-80 min-h-[calc(100vh-120px)]  bg-white border-r border-gray-200 flex flex-col shadow-sm">
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
              selectedCategory={selectedCategory}
              selectedCampaign={selectedCampaign}
              onCampaignSelect={handleCampaignSelect}
              onCampaignUpdate={handleCampaignUpdate}
            />
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t sticky bottom-0 border-gray-200 bg-gray-50">
          <div className="flex gap-2">
            <button className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors">
              <Eye className="w-4 h-4 inline mr-2" />
              View All
            </button>
            <button className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
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
        <div className="flex-1  overflow-hidden">
          <div className="flex flex-col bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 shadow-sm">
              <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                  {/* Breadcrumb and Title */}
                  <div className="flex items-center space-x-3">
                    <nav className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>{currentCampaignName}</span>
                      <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                    </nav>
                    {/* campaign name */}
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
            <main className="flex-1  min-h-[calc(100vh-320px)] overflow-y-auto">
              {campaignFields.length > 0 ? (
                <div className="max-w-4xl space-y-3 mx-auto p-3">
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
                                  fieldValues?.[field.fieldName] ||
                                  getFieldValue()?.value[0]?.value[0] ||
                                  ""
                                }
                                onChange={(e) =>
                                  handleFieldChange(
                                    `${field.fieldName}`,
                                    e.target.value
                                  )
                                }
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
                    <div className="relative mb-8">

                      <button
                        disabled={isGenerating}
                        onClick={handleGenerateProject}
                        className="py-2 px-4 rounded-lg bg-blue-500 flex items-center justify-center text-white hover:bg-blue-700 duration-200 capitalize max-w-max disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="flex items-center gap-3">
                          {isGenerating ? (
                            <>
                              <Loader className="w-6 h-6 animate-spin" />
                              <span className="text-lg">Generating Magic...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                              <span className="text-lg">Click Magic Button</span>
                            </>
                          )}
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Generated Content Display */}
                  {(generatedContent.aiContent ||
                    generatedContent.blueprintValues) && (
                      <div className="w-full max-w-4xl mx-auto mt-6 p-6 bg-white rounded-lg border border-gray-200">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">
                          Generated Content
                        </h2>

                        {/* AI Generated Content */}

                        {(streamingAiContent || generatedContent.aiContent) &&
                          renderAiContent()}
                      </div>
                    )}
                </div>
              ) : (
                <div className="min-h-[70vh]  flex flex-col justify-center items-center p-8">


                  {/* Magic Button */}
                  <div className="relative mb-8">

                    <button
                      disabled={isGenerating}
                      onClick={handleGenerateProject}
                      className="py-2 px-4 rounded-lg bg-blue-500 flex items-center justify-center text-white hover:bg-blue-700 duration-200 capitalize max-w-max disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex items-center gap-3">
                        {isGenerating ? (
                          <>
                            <Loader className="w-6 h-6 animate-spin" />
                            <span className="text-lg">Generating Magic...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                            <span className="text-lg">Click Magic Button</span>
                          </>
                        )}
                      </div>
                    </button>
                  </div>

                  {/* Progress Section */}
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

                  {/* Generated Content */}
                  {(generatedContent.aiContent || generatedContent.blueprintValues) && (
                    <div className="w-full max-w-4xl mx-auto">
                      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8  border border-white/20 transform animate-fadeIn">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-2 bg-gradient-to-r from-green-400 to-teal-500 rounded-lg">
                            <CheckCircle className="w-6 h-6 text-white" />
                          </div>
                          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                            Generated Content
                          </h2>
                        </div>

                        {(streamingAiContent || generatedContent.aiContent) && renderAiContent()}
                      </div>
                    </div>
                  )}

                  <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
                </div>
              )}
            </main>

            {/* Footer Actions */}
            <footer className="bg-white sticky bottom-0   border-t border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save</span>
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
