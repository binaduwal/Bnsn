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

} from "lucide-react";
import InlineTextEditor from "@/components/ui/InlineTextEditor";
import {
  Category,
  generateProjectStreamApi,
  generateProjectApi,
  singleProjectApi,
  updateProjectCategoryApi,
} from "@/services/projectApi";
import CampaignAccordion from "@/components/CampainAccordion";
import EditableTitle from "@/components/ui/EditableTitle";
import { Field } from "@/services/categoryApi";
import toast from "react-hot-toast";
import { updateCategoryValueApi } from "@/services/blueprintApi";
import { getWordCountApi } from "@/services/authApi";
import { marked } from "marked";
import { Drawer } from "@/components/ui/Drawer";
import useCategory from "@/hooks/useCategory";

export interface Campaign {
  id: string;
  title: string;
  slug: string;
  dropDownTitle: string;
  isActive?: boolean;
}

interface ContentGeneratorUIProps {
  params: Promise<{ id: string }>;
}

const ContentGeneratorUI: React.FC<ContentGeneratorUIProps> = ({ params }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [currentCampaignName, setCurrentCampaignName] = useState(
    "Content Generator"
  );
  const { category } = useCategory({ level: 0, type: "project" })
  const [isGenerating, setIsGenerating] = useState(false);

  const [streamingAiContent, setStreamingAiContent] = useState<string>("");
  const [isAiStreaming, setIsAiStreaming] = useState<boolean>(false);
  const [stats, setStats] = useState({ wordsLeft: 100000, totalWords: 100000 });

  // New streaming states
  const [streamingProgress, setStreamingProgress] = useState(0);
  const [streamingMessage, setStreamingMessage] = useState("");
  const [currentEmailIndex, setCurrentEmailIndex] = useState(0);
  const [totalEmails, setTotalEmails] = useState(0);
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
    "Content Campaign"
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>("");
  const [mainTitle, setMainTitle] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [blueprintId, setBlueprintId] = useState<string | undefined>(undefined);
  const [fieldValues, setFieldValues] = useState<{ [key: string]: string }>({});
  const [addingCategory, setAddingCategory] = useState<string[]>([]);

  const id = use(params).id;

  useEffect(() => {
    fetchSingleProject();
    fetchWordCount();
  }, [id]);

  const fetchWordCount = async () => {
    try {
      const response = await getWordCountApi();
      setStats({
        wordsLeft: response.data.wordsLeft,
        totalWords: response.data.totalWords,
      });
    } catch (error) {
      console.error("Error fetching word count:", error);
    }
  };


  const handleAddSelected = async () => {
    try {
      const res = await updateProjectCategoryApi(id, addingCategory);
      // toast.success("Selected categories added successfully");
      console.log('response', res)
    } catch (error: any) {
      toast.error(error.message || "Failed to add selected categories");
    }
  }

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

  // Cleanup effect for streaming states
  useEffect(() => {
    return () => {
      // Cleanup streaming states when component unmounts
      setIsGenerating(false);
      setIsAiStreaming(false);
      setStreamingAiContent("");
      setStreamingProgress(0);
      setStreamingMessage("");
    };
  }, []);

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

  // Function to determine if current category is email-related
  const isEmailCategory = (): boolean => {
    if (!selectedCategory || !categories?.length) return false;

    // Find the selected category
    for (const category of categories) {
      if (category.subCategories) {
        for (const subCategory of category.subCategories) {
          if (subCategory.thirdCategories) {
            for (const thirdCategory of subCategory.thirdCategories) {
              if (thirdCategory._id === selectedCategory) {
                const title = thirdCategory.title?.toLowerCase() || '';
                // Check if the category title contains email-related keywords
                return title.includes('email') ||
                  title.includes('promotional') ||
                  title.includes('content email') ||
                  title.includes('email generator');
              }
            }
          }
        }
      }
    }
    return false;
  };

  const handleCategoryClick = (catId: string) => {
    if (addingCategory.includes(catId)) {
      setAddingCategory(addingCategory.filter(id => id !== catId));
    } else {
      setAddingCategory(prev => [...prev, catId]);
    }
  };
  const handleSelectAll = () => {
    if (addingCategory.filter(cat => !categories.find(cate => cat == cate._id)).length === category.filter(cat => !categories.find(cate => cat._id == cate._id)).length) {
      setAddingCategory([]);
    } else {
      setAddingCategory(category.filter(cat => !categories.find(cate => cat._id == cate._id)).map(cat => cat._id));
    }
  };

  // Function to get the current category title
  const getCurrentCategoryTitle = (): string => {
    if (!selectedCategory || !categories?.length) return '';

    for (const category of categories) {
      if (category.subCategories) {
        for (const subCategory of category.subCategories) {
          if (subCategory.thirdCategories) {
            for (const thirdCategory of subCategory.thirdCategories) {
              if (thirdCategory._id === selectedCategory) {
                return thirdCategory.title || '';
              }
            }
          }
        }
      }
    }
    return '';
  };

  // Handle streaming data from backend
  const handleStreamData = (data: any) => {
    console.log("Received stream data:", data); // Debug log

    switch (data.type) {
      case "test":
        console.log("Streaming test successful:", data);
        break;

      case "progress":
        setStreamingProgress(data.progress || 0);
        setStreamingMessage(data.message || "Processing...");

        // Start AI streaming when AI generation begins
        if (data.message?.includes("Generating AI content")) {
          setIsAiStreaming(true);
          setStreamingAiContent(""); // Reset streaming content

          // Set email-specific tracking only for email categories
          if (isEmailCategory()) {
            setCurrentEmailIndex(0); // Start from 0, will be updated when first email separator is found
            setTotalEmails(10); // We're generating 10 emails
          }
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
        // Use functional update to prevent stale state issues
        setStreamingAiContent((prev) => {
          const newContent = prev + data.content;

          // Track progress based on category type
          if (isEmailCategory()) {
            // Track email progress by looking for email separators and extracting the actual email number
            const emailMatches = newContent.match(/<!-- Email (\d+) -->/g);
            if (emailMatches) {
              // Extract the highest email number found
              const emailNumbers = emailMatches.map(match => {
                const numberMatch = match.match(/<!-- Email (\d+) -->/);
                return numberMatch ? parseInt(numberMatch[1]) : 0;
              });

              const currentEmail = Math.max(...emailNumbers);
              setCurrentEmailIndex(currentEmail);
              setStreamingMessage(`Generating email ${currentEmail} of 10...`);
            } else {
              // Fallback: detect if we're in the middle of generating content
              const htmlBlocks = newContent.match(/<html[^>]*>/gi);
              if (htmlBlocks && htmlBlocks.length > 0) {
                const estimatedEmail = Math.min(htmlBlocks.length, 10);
                setCurrentEmailIndex(estimatedEmail);
                setStreamingMessage(`Generating email ${estimatedEmail} of 10...`);
              }
            }
          } else {
            // For non-email categories, show generic progress
            const categoryTitle = getCurrentCategoryTitle();
            setStreamingMessage(`Generating ${categoryTitle}...`);
          }

          return newContent;
        });

        if (data.progress) {
          setStreamingProgress(data.progress);
        }
        break;

      case "complete":
        setStreamingProgress(100);
        setStreamingMessage("Generation completed successfully!");
        setIsAiStreaming(false); // Ensure streaming mode is off
        setStreamingAiContent(""); // Clear streaming content

        if (data.data) {
          setGeneratedContent(data.data);

          // Update word count if provided
          if (data.data.wordCount) {
            setStats({
              wordsLeft: data.data.wordCount.wordsLeft,
              totalWords: stats.totalWords, // Keep the same total
            });
          }
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

  // Simple debug function to log all raw data
  const debugStreaming = async () => {
    console.log("=== DEBUGGING STREAMING ===");
    try {
      const response = await generateProjectStreamApi({
        category: categories[0]._id,
        currentCategory: selectedCategory || "",
        project: id,
        values: fieldValues,
        blueprintId,
      });

      console.log("Response:", response);
      console.log("Response status:", response.status);
      console.log("Response headers:", Object.fromEntries(response.headers.entries()));

      if (!response.body) {
        console.error("No response body");
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let totalData = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          console.log("=== STREAM ENDED ===");
          console.log("Total data received:", totalData);
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        totalData += chunk;
        console.log("Raw chunk:", chunk);
        console.log("Chunk length:", chunk.length);
        console.log("Chunk bytes:", Array.from(value).map(b => b.toString(16).padStart(2, '0')).join(' '));
      }
    } catch (error) {
      console.error("Debug streaming failed:", error);
    }
  };


  // Updated streaming generate function
  const handleGenerateProject = async () => {
    setIsGenerating(true);
    setStreamingProgress(0);
    setStreamingMessage("Starting generation...");
    setGeneratedContent({});
    setStreamingAiContent(""); // Reset streaming content

    // Add timeout for streaming - increased to 5 minutes
    const timeoutId = setTimeout(() => {
      console.warn("Streaming timeout reached");
      setIsGenerating(false);
      setIsAiStreaming(false);
      setStreamingMessage("Generation timed out");
      toast.error("Generation timed out. Please try again.");
    }, 300000); // 5 minutes timeout

    let retryCount = 0;
    const maxRetries = 2;

    const attemptStreaming = async (): Promise<void> => {
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
        let lastUpdateTime = Date.now();
        let totalChunks = 0;
        let lastActivityTime = Date.now();

        while (true) {
          const { done, value } = await reader.read();
          totalChunks++;
          lastActivityTime = Date.now(); // Update activity time

          if (done) {
            console.log("Stream completed after", totalChunks, "chunks");
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
          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk;

          // Throttle UI updates to prevent freezing - only log every 10 chunks
          const now = Date.now();
          if (now - lastUpdateTime > 100 && totalChunks % 10 === 0) { // Update every 100ms and every 10 chunks
            console.log(`Chunk ${totalChunks}: ${chunk.length} chars`);
            lastUpdateTime = now;
          }

          // Process complete lines more efficiently
          const lines = buffer.split("\n");
          buffer = lines.pop() || ""; // Keep incomplete line in buffer

          // Process each complete line
          for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine && trimmedLine.startsWith("data: ")) {
              try {
                const jsonData = trimmedLine.slice(6); // Remove "data: " prefix
                const data = JSON.parse(jsonData);
                handleStreamData(data);
              } catch (e) {
                // Only log parsing errors for non-empty lines
                if (trimmedLine.length > 10) {
                  console.error("Error parsing SSE data:", e, "Line:", trimmedLine);
                }
              }
            } else if (trimmedLine && trimmedLine !== "") {
              // Try to parse as regular JSON in case it's not SSE format
              try {
                const data = JSON.parse(trimmedLine);
                handleStreamData(data);
              } catch (e) {
                // Not JSON, ignore silently
              }
            }
          }

          // Prevent memory buildup by limiting buffer size
          if (buffer.length > 10000) {
            console.warn("Buffer too large, truncating");
            buffer = buffer.slice(-5000); // Keep last 5000 chars
          }

          // Check for inactivity timeout (30 seconds without data)
          if (Date.now() - lastActivityTime > 30000) {
            console.warn("No data received for 30 seconds, checking connection...");
            setStreamingMessage("Checking connection...");
          }
        }
      } catch (error: any) {
        console.error("Streaming error:", error);

        // Retry logic for connection issues
        if (retryCount < maxRetries && (
          error.message?.includes('timeout') ||
          error.message?.includes('network') ||
          error.message?.includes('connection')
        )) {
          retryCount++;
          setStreamingMessage(`Connection failed, retrying (${retryCount}/${maxRetries})...`);
          console.log(`Retrying streaming attempt ${retryCount}/${maxRetries}`);

          // Wait 2 seconds before retrying
          await new Promise(resolve => setTimeout(resolve, 2000));
          return attemptStreaming();
        }

        throw error; // Re-throw if max retries reached or different error
      }
    };

    try {
      await attemptStreaming();
    } catch (error: any) {
      console.error("All streaming attempts failed:", error);

      // Try fallback to non-streaming API
      try {
        setStreamingMessage("Streaming failed, trying fallback...");
        const fallbackResponse = await generateProjectApi({
          category: categories[0]._id,
          project: id,
          values: fieldValues,
          blueprintId: blueprintId || "",
        });

        setGeneratedContent(fallbackResponse);
        setStreamingProgress(100);
        setStreamingMessage("Generation completed successfully!");
        toast.success("Project generated successfully!");
      } catch (fallbackError: any) {
        console.error("Fallback also failed:", fallbackError);
        toast.error(error.message || "Generation failed");
        setStreamingMessage("Generation failed");
      }
    } finally {
      clearTimeout(timeoutId);
      setIsGenerating(false);
      setIsAiStreaming(false);
    }
  };

  const renderAiContent = () => {
    // Show streaming content if AI is currently streaming
    const contentToShow = isAiStreaming
      ? streamingAiContent
      : generatedContent.aiContent;

    if (!contentToShow && !isAiStreaming) return null;

    const isEmail = isEmailCategory();

    // Debug logging
    console.log("Content to show:", contentToShow);
    console.log("Is email category:", isEmail);
    console.log("Content length:", contentToShow?.length);

    // Check if content is empty or just contains empty HTML tags
    const cleanContent = contentToShow?.replace(/<[^>]*>/g, '').trim();
    if (!cleanContent && !isAiStreaming) {
      return (
        <div className="mb-6">
          <div className="bg-gray-50 border-gray-200 rounded-lg p-6">
            <div className="text-center text-gray-500">
              <p>No content generated yet. Please try generating again.</p>
            </div>
          </div>
        </div>
      );
    }

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

        <div className="bg-gray-50 border-gray-200 rounded-lg">
          <div className="space-y-10">
            {isAiStreaming ? (
              // Show streaming content in real-time
              isEmail ? (
                <StreamingEmailPreview content={streamingAiContent} />
              ) : (
                <StreamingContentPreview content={streamingAiContent} />
              )
            ) : (
              // Show final parsed content
              isEmail ? (
                parseMultipleEmails(contentToShow || "").map((email, idx) => (
                  <EmailCard key={idx} email={email} index={idx} />
                ))
              ) : (
                <ContentCard content={contentToShow || ""} />
              )
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

    if (partialContent.length > 0) {
      return (
        <>
          {partialContent.map((email, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded-lg p-6 shadow"
            >
              {email.title && (
                <h2 className="text-xl font-semibold mb-2">{email.title}</h2>
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

              {email.body && (
                <div className="prose max-w-none">
                  <div
                    dangerouslySetInnerHTML={{
                      __html:
                        email.body +
                        (idx === partialContent.length - 1
                          ? '<span class="animate-pulse">|</span>'
                          : ""),
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </>
      );
    }

    // If no emails parsed, show as generic content
    const cleanContent = cleanHtmlContent(content);

    return (
      <div className="border border-gray-200 rounded-lg p-6 shadow">
        <div className="prose max-w-none">
          <div
            dangerouslySetInnerHTML={{
              __html: cleanContent + '<span class="animate-pulse">|</span>',
            }}
          />
        </div>
      </div>
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
            try {
              const parsedHtml = parse(email.body || "");
              navigator.clipboard.writeText(parsedHtml);
              toast.success("Copied to clipboard");
            } catch (error) {
              console.error("Error copying to clipboard:", error);
              toast.error("Failed to copy to clipboard");
            }
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
        initialContent={email.body || ""}
        onChange={(value) => { }}
      />
    </div>
  );

  // Component for streaming non-email content
  // Unified content cleaning function for consistency
  const cleanHtmlContent = (content: string): string => {
    // First, clean any HTML document structure if present
    let cleanedContent = content
      // Remove markdown code blocks and backticks
      .replace(/```html\s*/gi, '')
      .replace(/```\s*/gi, '')
      .replace(/`/g, '')
      // Remove HTML document structure
      .replace(/<html[^>]*>/gi, '')
      .replace(/<\/html>/gi, '')
      .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '')
      .replace(/<body[^>]*>/gi, '')
      .replace(/<\/body>/gi, '')
      // Remove any leading/trailing whitespace and newlines
      .trim();

    // Check if content looks like markdown (starts with # or contains markdown patterns)
    const isMarkdown = /^#\s|^\*\s|^-\s|^>\s|^\d+\.\s/.test(cleanedContent) ||
      /\*\*.*\*\*|\*.*\*|\[.*\]\(.*\)/.test(cleanedContent);

    if (isMarkdown) {
      try {
        // Convert markdown to HTML - handle both sync and async versions
        const result = marked(cleanedContent);
        return typeof result === 'string' ? result : cleanedContent;
      } catch (error) {
        console.error("Error converting markdown to HTML:", error);
        return cleanedContent; // Return original if conversion fails
      }
    }

    return cleanedContent;
  };

  const StreamingContentPreview: React.FC<{ content: string }> = ({
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

    // Use unified cleaning function
    const cleanContent = cleanHtmlContent(content);

    return (
      <div className="border border-gray-200 rounded-lg p-6 shadow">
        <div className="prose max-w-none">
          <div
            dangerouslySetInnerHTML={{
              __html: cleanContent + '<span class="animate-pulse">|</span>',
            }}
          />
        </div>
      </div>
    );
  };

  // Component for final non-email content
  const ContentCard: React.FC<{ content: string }> = ({ content }) => {
    // Use unified cleaning function for consistency
    const cleanContent = cleanHtmlContent(content);

    return (
      <div className="border relative border-gray-200 flex flex-col gap-1 rounded-lg p-6 shadow">
        <div className="absolute top-0 right-0">
          <button
            onClick={() => {
              try {
                const parsedHtml = parse(cleanContent || "");
                navigator.clipboard.writeText(parsedHtml);
                toast.success("Copied to clipboard");
              } catch (error) {
                console.error("Error copying to clipboard:", error);
                toast.error("Failed to copy to clipboard");
              }
            }}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>

        <InlineTextEditor
          className="p-0"
          initialContent={cleanContent || ""}
          onChange={(value) => { }}
        />
      </div>
    );
  };

  // Helper function to parse streaming emails (partial content)
  const parseStreamingContent = (content: string) => {
    const emails: ParsedEmail[] = [];

    // Check if content contains HTML structure
    const hasHtmlStructure = /<html[^>]*>/i.test(content) || /<body[^>]*>/i.test(content);

    if (!hasHtmlStructure) {
      // If no HTML structure, treat as plain text
      return [{
        title: "",
        subject: "",
        preheader: "",
        body: content
      }];
    }

    // Split by potential email separators or HTML blocks
    const emailBlocks = content.split(/(?=<!-- Email \d+ -->|<\/html>|<\/body>)/gi).filter(block => block.trim());

    emailBlocks.forEach((block, index) => {
      // Extract email number from separator if present
      const emailNumberMatch = block.match(/<!-- Email (\d+) -->/);
      const emailNumber = emailNumberMatch ? parseInt(emailNumberMatch[1]) : index + 1;

      // Extract title
      const titleMatch = block.match(/<title[^>]*>(.*?)<\/title>/i);
      const title = titleMatch ? titleMatch[1].trim() : `Email ${emailNumber}`;

      // Extract subject from comments
      const subjectMatch = block.match(/<!--\s*Subject:\s*(.*?)\s*-->/i);
      const subject = subjectMatch ? subjectMatch[1].trim() : "Email Subject";

      // Extract preheader from comments
      const preheaderMatch = block.match(/<!--\s*Preheader:\s*(.*?)\s*-->/i);
      const preheader = preheaderMatch ? preheaderMatch[1].trim() : "";

      // Extract body content - be more flexible
      let body = "";
      const bodyMatch = block.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      if (bodyMatch) {
        body = bodyMatch[1].trim();
      } else {
        // If no body tag, try to extract content from the block
        // Use unified cleaning function for consistency
        body = cleanHtmlContent(block);
      }

      if (body && body.length > 10) { // Only add if there's meaningful content
        emails.push({
          title,
          subject,
          preheader,
          body,
        });
      }
    });

    // If no emails were parsed, return the content as a single item
    if (emails.length === 0 && content.trim()) {
      return [{
        title: "Generated Content",
        subject: "",
        preheader: "",
        body: content
      }];
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
    if (!rawHtml || rawHtml.trim() === "") {
      return [];
    }

    // Split by email separators or complete HTML blocks
    const emailBlocks = rawHtml.split(/(?=<!-- Email \d+ -->|<\/html>)/gi).filter(block => block.trim());

    const emails: ParsedEmail[] = emailBlocks.map((block, index) => {
      // Extract email number from separator if present
      const emailNumberMatch = block.match(/<!-- Email (\d+) -->/);
      const emailNumber = emailNumberMatch ? parseInt(emailNumberMatch[1]) : index + 1;

      // Extract title
      const titleMatch = block.match(/<title[^>]*>(.*?)<\/title>/i);
      const title = titleMatch ? titleMatch[1].trim() : `Email ${emailNumber}`;

      // Extract subject from comments
      const subjectMatch = block.match(/<!--\s*Subject:\s*(.*?)\s*-->/i);
      const subject = subjectMatch ? subjectMatch[1].trim() : "Email Subject";

      // Extract preheader from comments
      const preheaderMatch = block.match(/<!--\s*Preheader:\s*(.*?)\s*-->/i);
      const preheader = preheaderMatch ? preheaderMatch[1].trim() : "";

      // Extract body content - use the same approach as streaming
      let body = "";
      const bodyMatch = block.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      if (bodyMatch) {
        body = bodyMatch[1].trim();
      } else {
        // If no body tag, try to extract content from the block
        // Use unified cleaning function for consistency
        body = cleanHtmlContent(block);
      }

      return {
        title,
        subject,
        preheader,
        body,
      };
    });

    // Filter out emails without meaningful body content
    const filteredEmails = emails.filter((email) => email.body && email.body.length > 10);

    // If no emails were parsed, return the content as a single item
    if (filteredEmails.length === 0 && rawHtml.trim()) {
      return [{
        title: "Generated Content",
        subject: "",
        preheader: "",
        body: rawHtml
      }];
    }

    return filteredEmails;
  }, []);

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
    if (!html || typeof html !== 'string') {
      return "";
    }

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      return doc.body.textContent || doc.body.innerText || html;
    } catch (error) {
      console.error("Error parsing HTML:", error);
      return html; // Return original content if parsing fails
    }
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

            <button onClick={() => setDrawerOpen(true)} className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4 inline mr-2" />
              Add
            </button>
          </div>
        </div>
      </aside>

      <Drawer title="Add Category" isOpen={drawerOpen} height="full" onClose={() => setDrawerOpen(false)}>
        <div className="bg-white h-full flex flex-col">
          {/* Header with search and controls */}
          <div className="p-6 border-b border-gray-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Add Categories</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Select categories to add to your collection
                </p>
              </div>
              <div className="text-sm text-gray-500">
                {addingCategory.length} selected
              </div>
            </div>


            {/* Quick actions */}
            <div className="flex items-center justify-between">
              <button
                onClick={handleSelectAll}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                {addingCategory.length === category.filter(cat => !categories.find(cate => cat._id == cate._id)).length ? 'Deselect All' : 'Select All'}
              </button>
              <div className="text-sm text-gray-500">
                {category.filter(cat => !categories.find(cate => cat._id == cate._id)).length} categories available
              </div>
            </div>
          </div>

          {/* Categories grid */}
          <div className="flex-1 max-h-[calc(100vh-350px)] overflow-y-auto p-6">
            {category.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 text-gray-300">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.5-1.01-6-2.709M6.343 6.343A8 8 0 004.5 10.5M17.657 6.343A8 8 0 0019.5 10.5" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
                <p className="text-gray-500">Try adjusting your search terms</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {category.filter(cat => !categories.find(cate => cat._id == cate._id)).map((cat) => {
                  const isSelected = addingCategory.includes(cat._id);
                  return (
                    <div
                      key={cat._id}
                      onClick={() => handleCategoryClick(cat._id)}
                      className={`
                    group relative p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md
                    ${isSelected
                          ? 'bg-blue-50 border-blue-300 shadow-sm'
                          : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                        }
                  `}
                    >
                      {/* Selection indicator */}
                      <div className={`
                    absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200
                    ${isSelected
                          ? 'bg-blue-600 border-blue-600'
                          : 'border-gray-300 group-hover:border-gray-400'
                        }
                  `}>
                        {isSelected && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>

                      {/* Content */}
                      <div className="pr-8">
                        <h3 className={`
                      font-semibold text-lg mb-2 transition-colors
                      ${isSelected ? 'text-blue-900' : 'text-gray-900'}
                    `}>
                          {cat.title}
                        </h3>
                        <p className={`
                      text-sm leading-relaxed transition-colors
                      ${isSelected ? 'text-blue-700' : 'text-gray-600'}
                    `}>
                          {cat.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer with actions */}
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {addingCategory.length > 0 && (
                  <span className="font-medium">
                    {addingCategory.length} categor{addingCategory.length === 1 ? 'y' : 'ies'} selected
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  disabled={addingCategory.length === 0}
                  onClick={handleAddSelected}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 disabled:hover:shadow-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Add Selected ({addingCategory.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      </Drawer>

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
                        title={isEmailCategory() ? "Preview email" : "Preview content"}
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
                <div className="max-w-7xl space-y-3 mx-auto p-3">
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
                        {isEmailCategory() && currentEmailIndex > 0 && totalEmails > 0 && (
                          <div className="mt-2 text-xs text-gray-500 text-center">
                            Email {currentEmailIndex} of {totalEmails}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Generate Button */}
                    <div className="relative mb-8 flex gap-4">

                      <button
                        disabled={isGenerating}
                        onClick={handleGenerateProject}
                        className="py-2 px-4 rounded-lg bg-blue-500 flex items-center justify-center text-white hover:bg-blue-700 duration-200 capitalize max-w-max disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="flex items-center gap-3">
                          {isGenerating ? (
                            <>
                              <Loader className="w-6 h-6 animate-spin" />
                              <span className="text-lg">
                                {isEmailCategory() ? "Generating Emails..." : "Generating Content..."}
                              </span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                              <span className="text-lg">Generate Content</span>
                            </>
                          )}
                        </div>
                      </button>


                    </div>
                  </div>

                  {/* Generated Content Display */}
                  {(generatedContent.aiContent ||
                    generatedContent.blueprintValues) && (
                      <div className="w-full max-w-7xl mx-auto mt-6 p-6 bg-white rounded-lg border border-gray-200">
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


                  {campaignFields.length == 0 && <div className="relative mb-8 flex gap-4">

                    <button
                      disabled={isGenerating}
                      onClick={handleGenerateProject}
                      className="py-2 px-4 rounded-lg bg-blue-500 flex items-center justify-center text-white hover:bg-blue-700 duration-200 capitalize max-w-max disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex items-center gap-3">

                        <>
                          <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                          <span className="text-lg">Generate Content</span>
                        </>

                      </div>
                    </button>


                  </div>}

                  {/* Progress Section */}
                  {generatedContent.aiContent?.length == 0 && isGenerating && (
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
                    <div className="w-full max-w-7xl mx-auto">
                      <div className=" backdrop-blur-sm rounded-2xl transform animate-fadeIn">
                        {/* <div className="flex items-center gap-3 mb-6">
                          <div className="p-2 bg-gradient-to-r from-green-400 to-teal-500 rounded-lg">
                            <CheckCircle className="w-6 h-6 text-white" />
                          </div>
                          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                            Generated Content
                          </h2>
                        </div> */}

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

export default ContentGeneratorUI;
