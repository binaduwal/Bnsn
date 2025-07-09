"use client";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import React, { useState } from "react";

interface StepProps {
  number: number;
  title: string;
  isActive: boolean;
  isCompleted: boolean;
}

const Step: React.FC<StepProps> = ({
  number,
  title,
  isActive,
  isCompleted,
}) => {
  return (
    <div className="flex items-center">
      <div
        className={`
        w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
        ${
          isActive
            ? "bg-blue-500 text-white"
            : isCompleted
            ? "bg-green-500 text-white"
            : "bg-gray-200 text-gray-500"
        }
      `}
      >
        {number}
      </div>
      <span
        className={`ml-2 text-sm ${
          isActive ? "text-blue-500 font-medium" : "text-gray-500"
        }`}
      >
        {title}
      </span>
    </div>
  );
};

const ProjectSetup: React.FC = () => {
  const [projectTitle, setProjectTitle] = useState("");
  const [isCreateBlueprint, setIsCreateBlueprint] = useState(true);
  const [selectedBlueprint, setSelectedBlueprint] = useState("");

  const [currentStep, setCurrentStep] = useState(1);

  const [steps, setSteps] = useState([
    { number: 1, title: "Project Setup", isActive: true, isCompleted: false },
    {
      number: 2,
      title: "Persuasion Vault",
      isActive: false,
      isCompleted: false,
    },
    {
      number: 3,
      title: "Review & Launch",
      isActive: false,
      isCompleted: false,
    },
  ]);

  const handleNextTab = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      setSteps((prevSteps) =>
        prevSteps.map((step, index) => ({
          ...step,
          isActive: index === currentStep,
          isCompleted: index < currentStep,
        }))
      );
    }
  };

  const handlePrevTab = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setSteps((prevSteps) =>
        prevSteps.map((step, index) => ({
          ...step,
          isActive: index === currentStep - 2,
          isCompleted: index < currentStep - 2,
        }))
      );
    }
  };
const vaultItems = [
  { title: "Ads", description: "Generate high-converting ads for Facebook, YouTube, Instagram, TikTok and more that drive traffic an..." },
  { title: "Advertorials", description: "Create curiosity-driven copy that shows benefits without revealing secrets. Ideal for traffic." },
  { title: "Articles", description: "Produce engaging, SEO-optimized content instantly while saving hours of research and writing time." },
  { title: "Bonus Creator", description: "Generate profitable bonus ideas for your products - digital, physical, services that increase conversions." },
  { title: "Book Funnel Upsells", description: "Create high-converting upsell scripts for VSLs or sales pages. BookBuilder members only feature." },
  { title: "Book Ideas", description: "Starting from scratch with no ideas? Start here to discover your topic before moving to BookBuilder." },
  { title: "Book Sales Funnel", description: "Complete book funnel for self-publishers: back cover, sales letters, ads, and more. For BookBuilder only." },
  { title: "BookBuilder", description: "Write complete books in under a day with BookBuilder - from 5,000 to 50,000 words, outline to final draft." },
  { title: "BookBuilder Outline Data", description: "Export BookBuilder outline data - uses up to 15,000 words. Perfect for editing or recreating." },
  { title: "Brand Creator", description: "Create compelling product names for any formulation or business. Always check existing trademarks first." },
  { title: "Emails", description: "Generate high-converting emails for sales, nurture, broadcast, follow-up that boost engagement and more." },
  { title: "Hooks & Big Ideas", description: "Create killer 'big ideas' and lead hooks for ad campaigns, sales letters, VSLs, and more." },
];
  return (
    <div className="h-[calc(100vh-130px)] rounded-lg overflow-y-auto bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Step Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-center space-x-8">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <Step {...step} />
                {index < steps.length - 1 && (
                  <div className="w-16 h-0.5 bg-gray-200"></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Main Content */}
       {currentStep === 1 && <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-800">
              Let's start a project!
              <span className="ml-2 text-gray-400">?</span>
            </h1>
          </div>

          <div className="space-y-6">
            {/* Project Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Title
                <span className="ml-2 text-gray-400">?</span>
              </label>
              <input
                type="text"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder=""
              />
            </div>

            {/* Blueprint Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Blueprint
                <span className="ml-2 text-gray-400">?</span>
              </label>

              {/* Toggle */}
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-sm text-gray-600">Create Blueprint</span>
                <button
                  onClick={() => setIsCreateBlueprint(!isCreateBlueprint)}
                  className={`
                    relative inline-flex h-6 w-11 items-center rounded-full transition-colors 
                    ${isCreateBlueprint ? "bg-blue-500" : "bg-gray-200"}
                  `}
                >
                  <span
                    className={`
                      inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                      ${isCreateBlueprint ? "translate-x-6" : "translate-x-1"}
                    `}
                  />
                </button>
                <span
                  className={`text-sm ${
                    isCreateBlueprint
                      ? "text-gray-600"
                      : "text-blue-500 font-medium"
                  }`}
                >
                  Select Blueprint
                </span>
              </div>

              {/* Blueprint Dropdown */}
              {isCreateBlueprint && (
                <div className="relative">
                  <SearchableSelect
                    onChange={(value) => setSelectedBlueprint(value)}
                    options={[
                      { value: "blueprint1", label: "Blueprint 1" },
                      { value: "blueprint2", label: "Blueprint 2" },
                      { value: "blueprint3", label: "Blueprint 3" },
                    ]}
                    value={selectedBlueprint}
                  />
                </div>
              )}
            </div>

            {/* Continue Button */}
            <div className="flex justify-end pt-6">
              <button
                onClick={handleNextTab}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
              >
                Continue
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>}

         {currentStep === 2 && <div className="bg-white rounded-lg shadow-sm border border-gray-200 py-4 px-4 ">
       <div className=" bg-gray-50  ">
        <div className=" w-full bg-white rounded-xl  p-6">
          <h1 className="text-2xl font-semibold text-center mb-6">Persuasion Vault</h1>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h2 className="text-lg font-medium mb-2 sm:mb-0">Vault Items For Your Project</h2>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search vault items..."
                className="border border-gray-300 rounded px-3 py-2 w-full sm:w-64 text-sm focus:outline-none focus:ring focus:ring-blue-200"
              />
              <button className="bg-white border border-gray-300 rounded p-2 hover:bg-gray-100">
                🔍
              </button>
            </div>
          </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {vaultItems.map((item, idx) => (
         <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer bg-white">
      <h3 className="font-semibold text-lg text-gray-800 mb-1">{item.title}</h3>
      <p className="text-sm text-gray-600">{item.description}</p>
    </div>
      ))}
    </div>
        </div>
      </div>
        {/* Continue Button */}
            <div className="flex justify-end gap-3 pt-6">
                <button
                onClick={handlePrevTab}
                className="px-6 py-2 bg-gray-200 text-gray-900 rounded-lg gap-2 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
              >
                <ChevronLeft size={24} strokeWidth={2}/>
                Back
               
              </button>
              <button
                onClick={handleNextTab}
                className="px-6 py-2 bg-blue-500 text-white gap-2 rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
              >
                Continue
               <ChevronRight size={24} strokeWidth={2}/>
              </button>
            </div>
        </div>}

          {currentStep === 3 && <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-800">
              Let's start a project!
              <span className="ml-2 text-gray-400">?</span>
            </h1>
          </div>

          <div className="space-y-6">
            {/* Project Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Title
                <span className="ml-2 text-gray-400">?</span>
              </label>
              <input
                type="text"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder=""
              />
            </div>

            {/* Blueprint Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Blueprint
                <span className="ml-2 text-gray-400">?</span>
              </label>

              {/* Toggle */}
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-sm text-gray-600">Create Blueprint</span>
                <button
                  onClick={() => setIsCreateBlueprint(!isCreateBlueprint)}
                  className={`
                    relative inline-flex h-6 w-11 items-center rounded-full transition-colors 
                    ${isCreateBlueprint ? "bg-blue-500" : "bg-gray-200"}
                  `}
                >
                  <span
                    className={`
                      inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                      ${isCreateBlueprint ? "translate-x-6" : "translate-x-1"}
                    `}
                  />
                </button>
                <span
                  className={`text-sm ${
                    isCreateBlueprint
                      ? "text-gray-600"
                      : "text-blue-500 font-medium"
                  }`}
                >
                  Select Blueprint
                </span>
              </div>

              {/* Blueprint Dropdown */}
              {isCreateBlueprint && (
                <div className="relative">
                  <SearchableSelect
                    onChange={(value) => setSelectedBlueprint(value)}
                    options={[
                      { value: "blueprint1", label: "Blueprint 1" },
                      { value: "blueprint2", label: "Blueprint 2" },
                      { value: "blueprint3", label: "Blueprint 3" },
                    ]}
                    value={selectedBlueprint}
                  />
                </div>
              )}
            </div>

            {/* Continue Button */}
            <div className="flex justify-end gap-3 pt-6">
                <button
                onClick={handlePrevTab}
                className="px-6 py-2 bg-gray-200 text-gray-900 rounded-lg gap-2 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
              >
                <ChevronLeft size={24} strokeWidth={2}/>
                Back
               
              </button>
              <button
                onClick={handleNextTab}
                className="px-6 py-2 bg-blue-500 text-white gap-2 rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
              >
                Create
               <Plus size={24} strokeWidth={2}/>
              </button>
            </div>
          </div>
        </div>}
      </div>
    </div>
  );
};

export default ProjectSetup;
