"use client";
import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  HelpCircle,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getAllBlueprintApi } from "@/services/blueprintApi";
import useCategory from "@/hooks/useCategory";
import { createProjectApi } from "@/services/projectApi";

const CreateProject: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [projectTitle, setProjectTitle] = useState("");
  const [selectedMode, setSelectedMode] = useState<"create" | "select">(
    "create"
  );
  const [selectedCategory, setSelectedCategory] = useState<
    { id: string; title: string }[]
  >([]);
  const [selectedBlueprint, setSelectedBlueprint] = useState<{
    id: string;
    title: string;
  }>();
  const [projectDetails, setProjectDetails] = useState("");
  const [offerType, setOfferType] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [allBlueprint, setAllBlueprint] = useState<
    { id: string; label: string }[]
  >([]);
  const router = useRouter();
  const steps = [
    { id: 1, title: "Project Setup", description: "Basic project information" },
    { id: 2, title: "Persuasion Vault", description: "Content generation" },
    { id: 3, title: "Review & Launch", description: "Final review and launch" },
  ];

  useEffect(() => {
    fetchBlueprint();
  }, []);

  const handleCategoryClick = (categoryData: { id: string; title: string }) => {
    setSelectedCategory((prevSelected) => {
      if (prevSelected.find((dta) => dta.id == categoryData.id)) {
        return prevSelected.filter((item) => item.id !== categoryData.id);
      } else {
        return [...prevSelected, categoryData];
      }
    });
  };

  const offerTypes = [
    "Product Launch",
    "Service Offering",
    "Course/Training",
    "Consultation",
    "Software/App",
    "E-book/Digital Product",
    "Physical Product",
    "Subscription Service",
    "Event/Webinar",
    "Coaching Program",
  ];

  const wordCount = projectDetails
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  const getWordCountStatus = () => {
    if (wordCount === 0) return { color: "text-gray-500", icon: null };
    if (wordCount < 30)
      return { color: "text-yellow-600", icon: <AlertCircle size={16} /> };
    if (wordCount >= 30 && wordCount <= 10000)
      return { color: "text-green-600", icon: <CheckCircle size={16} /> };
    return { color: "text-red-600", icon: <AlertCircle size={16} /> };
  };

  const isStep1Valid = () => {
    if (selectedMode === "create") {
      return (
        projectTitle.trim() !== "" &&
        projectDetails.trim() !== "" &&
        offerType !== "" &&
        wordCount >= 30
      );
    } else {
      return projectTitle.trim() !== "" && selectedBlueprint !== undefined;
    }
  };

  const { category } = useCategory({ level: 0, type: "project" });

  const fetchBlueprint = async () => {
    try {
      const res = await getAllBlueprintApi();
      setAllBlueprint(
        res.data.map((itm) => ({ id: itm._id, label: itm.title }))
      );
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const wordStatus = getWordCountStatus();

  const handleOfferTypeSelect = (type: string) => {
    setOfferType(type);
    setIsDropdownOpen(false);
  };

  const handleBlueprintSelect = (blueprint: string) => {
    const selectedBlueprint = allBlueprint.find(
      (blueprintItem) => blueprintItem.id === blueprint
    );
    setSelectedBlueprint({
      id: selectedBlueprint?.id || "",
      title: selectedBlueprint?.label || "",
    });
  };

  const createProject = async () => {
    try {
       console.log("res", );
      const res = await createProjectApi({
        blueprintId: selectedBlueprint?.id || "",
        categoryId: [selectedCategory[0]?.id],
        description: projectDetails,
        name: projectTitle,
      });
     
      toast.success("Project created successfully");
      router.push(`/dashboard/projects/${res.data._id}`);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleContinue = () => {
    if (currentStep < 3 && isStep1Valid()) {
      setCurrentStep(currentStep + 1);
    } else {
      createProject();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <button
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => router.back()}
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 flex items-center space-x-2">
                <span>Let's start a project!</span>
                <HelpCircle size={20} className="text-gray-400" />
              </h1>
              <p className="text-gray-600 mt-1">
                Create a new project from scratch or using a blueprint
              </p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                      step.id === currentStep
                        ? "bg-blue-600 text-white"
                        : step.id < currentStep
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step.id < currentStep ? (
                      <CheckCircle size={16} />
                    ) : (
                      step.id
                    )}
                  </div>
                  <div>
                    <div
                      className={`text-sm font-medium ${
                        step.id === currentStep
                          ? "text-gray-900"
                          : "text-gray-500"
                      }`}
                    >
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      {step.description}
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-px ${
                      step.id < currentStep ? "bg-green-600" : "bg-gray-200"
                    }`}
                  ></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 ">
          {currentStep === 1 && (
            <div className="p-6 space-y-6">
              {/* Project Title */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-900">
                  <span>Project Title</span>
                  <HelpCircle size={16} className="text-gray-400" />
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="Enter your project title"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {projectTitle.trim() === "" && (
                  <p className="text-sm text-red-600">
                    Project title is required
                  </p>
                )}
              </div>

              {/* Blueprint Selection */}
              <div className="space-y-4">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-900">
                  <span>Blueprint</span>
                  <HelpCircle size={16} className="text-gray-400" />
                </label>

                {/* Mode Toggle */}
                <div className="flex items-center space-x-6">
                  <button
                    onClick={() => setSelectedMode("create")}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                      selectedMode === "create"
                        ? "bg-blue-50 border-blue-200 text-blue-700"
                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        selectedMode === "create"
                          ? "border-blue-600"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedMode === "create" && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                    <span>Create Blueprint</span>
                  </button>
                  <button
                    onClick={() => setSelectedMode("select")}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                      selectedMode === "select"
                        ? "bg-blue-50 border-blue-200 text-blue-700"
                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        selectedMode === "select"
                          ? "border-blue-600"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedMode === "select" && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                    <span>Select Blueprint</span>
                  </button>
                </div>

                {/* Blueprint Dropdown for Select Mode */}
                {selectedMode === "select" && (
                  <div className="relative">
                    <select
                      value={selectedBlueprint?.id}
                      onChange={(e) => handleBlueprintSelect(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none"
                    >
                      <option defaultValue={undefined}>Select Blueprint</option>
                      {allBlueprint.map((blueprint) => (
                        <option key={blueprint.id} value={blueprint.id}>
                          {blueprint.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Project Details - Only show for Create Blueprint mode */}
              {selectedMode === "create" && (
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-900">
                    <span>Project Details</span>
                    <HelpCircle size={16} className="text-gray-400" />
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <textarea
                      value={projectDetails}
                      onChange={(e) => setProjectDetails(e.target.value)}
                      placeholder="Tell BNSN about your project. You can provide up to 10,000 words, or if you're feeling lazy, just 30 will do. It's best to include details such as what you're selling and who you'd like to sell it to. You can include details about yourself as well. If you have bonuses, testimonials, and offer details, feed them to BNSN right here."
                      className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      maxLength={10000}
                    />
                    <div className="absolute bottom-3 right-3 flex items-center space-x-2">
                      {wordStatus.icon && (
                        <span className={wordStatus.color}>
                          {wordStatus.icon}
                        </span>
                      )}
                      <span className={`text-sm ${wordStatus.color}`}>
                        {wordCount} / 10,000 words (minimum 30)
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Offer Type - Only show for Create Blueprint mode */}
              {selectedMode === "create" && (
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-900">
                    <span>Offer Type</span>
                    <HelpCircle size={16} className="text-gray-400" />
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex items-center justify-between"
                    >
                      <span
                        className={
                          offerType ? "text-gray-900" : "text-gray-500"
                        }
                      >
                        {offerType || "Select offer type..."}
                      </span>
                      <ChevronDown
                        className={`h-5 w-5 text-gray-400 transition-transform ${
                          isDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {offerTypes.map((type) => (
                          <button
                            key={type}
                            onClick={() => handleOfferTypeSelect(type)}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Validation Message */}
              {!isStep1Valid() && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                  Please complete the required fields for the selected mode
                </div>
              )}
            </div>
          )}

          {/* Step 2 & 3 Placeholder */}
          {currentStep === 2 && (
            <div className="p-6 text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Persuasion Vault
              </h2>
              {category.length === 0 ? (
                <p className="text-gray-600">
                  Content generation step - Coming soon
                </p>
              ) : (
                <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.map((item, index) => (
                    <div
                      onClick={() =>
                        handleCategoryClick({ id: item._id, title: item.title })
                      }
                      className={`p-4  cursor-pointer duration-300 border rounded-lg flex flex-col gap-2 ${
                        selectedCategory.find((data) => data.id === item._id)
                          ? "border-blue-600 bg-blue-50"
                          : "hover:bg-gray-200 border-gray-200"
                      } `}
                      key={index}
                    >
                      <h4 className="text-gray-900 font-semibold text-xl">
                        {item.title}
                      </h4>
                      <p className="text-gray-600 ">{item.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div className="p-6 text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Review & Launch
              </h2>
              <div className=" flex flex-col max-w-2xl mx-auto gap-3">
                {/* title and blueprint */}
                <div className=" flex flex-col border border-gray-100 gap-3 py-4 px-6 rounded-xl shadow-lg bg-white">
                  <div className=" flex flex-col  items-start gap-1.5">
                    <h4 className=" text-xl font-semibold">Project Title</h4>
                    <span className=" text-gray-800">{projectTitle}</span>
                  </div>
                  <div className=" flex flex-col  items-start gap-1.5">
                    <h4 className=" text-xl font-semibold">Blueprint</h4>
                    <span className=" text-gray-800">
                      {selectedBlueprint?.title}
                    </span>
                  </div>
                </div>

                {/* category  */}
                <div className=" flex flex-col border border-gray-100 gap-3 py-4 px-6 rounded-xl shadow-lg bg-white">
                  <div className=" flex flex-col  items-start gap-1.5">
                    <h4 className=" text-xl font-semibold">Selected Assets</h4>
                    <ul className=" ml-6 flex-col flex list-disc ">
                      {selectedCategory.map((cat, i) => (
                        <li key={i}>{cat.title.trim()}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>

            <button
              onClick={handleContinue}
              disabled={!isStep1Valid()}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              <span>Continue</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
