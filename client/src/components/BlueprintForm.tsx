"use client";

import React, { use, useEffect, useState } from "react";
import {
  Search,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  Sparkles,
  User,
  Award,
  Clock,
  Target,
  BookOpen,
  Save,
  Copy,
  Wand2,
} from "lucide-react";
import toast from "react-hot-toast";
import { Category, getSingleBlueprintApi } from "@/services/blueprintApi";

interface ProgressBarProps {
  current: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full bg-gray-100 rounded-full h-2 mb-6">
      <div
        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${percentage}%` }}
      />
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>
          {current} of {total} completed
        </span>
        <span>{Math.round(percentage)}%</span>
      </div>
    </div>
  );
};

interface QuickTagProps {
  text: string;
  onAdd: () => void;
  icon?: React.ReactNode;
}

const QuickTag: React.FC<QuickTagProps> = ({ text, onAdd, icon }) => {
  return (
    <button
      onClick={onAdd}
      className="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-full text-sm text-blue-700 hover:from-blue-100 hover:to-purple-100 transition-all duration-200 hover:scale-105"
    >
      {icon}
      {text}
      <Plus className="w-3 h-3" />
    </button>
  );
};

interface SmartInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  suggestions?: string[];
  icon?: React.ReactNode;
  type?: "text" | "textarea";
  required?: boolean;
}

const SmartInput: React.FC<SmartInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  suggestions = [],
  icon,
  type = "text",
  required = false,
}) => {
  const [focused, setFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {icon}
        <label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      </div>

      <div className="relative">
        {type === "textarea" ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 200)}
            placeholder={placeholder}
            className={`w-full px-4 py-3 border-2 rounded-xl text-sm transition-all duration-200 resize-none ${
              focused
                ? "border-blue-400 bg-blue-50/50 shadow-lg ring-4 ring-blue-100"
                : "border-gray-200 hover:border-gray-300"
            }`}
            rows={3}
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => {
              setFocused(true);
              if (suggestions.length > 0) setShowSuggestions(true);
            }}
            onBlur={() => {
              setTimeout(() => {
                setFocused(false);
                setShowSuggestions(false);
              }, 200);
            }}
            placeholder={placeholder}
            className={`w-full px-4 py-3 border-2 rounded-xl text-sm transition-all duration-200 ${
              focused
                ? "border-blue-400 bg-blue-50/50 shadow-lg ring-4 ring-blue-100"
                : "border-gray-200 hover:border-gray-300"
            }`}
          />
        )}

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 max-h-40 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50 first:rounded-t-xl last:rounded-b-xl"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface FlexibleTagProps {
  text: string;
  onRemove: () => void;
  onEdit?: (newText: string) => void;
  color?: "blue" | "green" | "purple" | "pink";
}

const FlexibleTag: React.FC<FlexibleTagProps> = ({
  text,
  onRemove,
  onEdit,
  color = "blue",
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(text);

  const colorClasses = {
    blue: "bg-blue-100 text-blue-800 border-blue-200",
    green: "bg-green-100 text-green-800 border-green-200",
    purple: "bg-purple-100 text-purple-800 border-purple-200",
    pink: "bg-pink-100 text-pink-800 border-pink-200",
  };

  const handleSave = () => {
    if (onEdit && editValue.trim() !== text && editValue.trim()) {
      onEdit(editValue.trim());
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div
        className={`inline-flex items-center px-3 py-2 rounded-full border ${colorClasses[color]}`}
      >
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") {
              setEditValue(text);
              setIsEditing(false);
            }
          }}
          onBlur={handleSave}
          className="bg-transparent border-none outline-none text-sm min-w-0 flex-1"
          autoFocus
        />
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-full border ${colorClasses[color]} group hover:shadow-md transition-all duration-200`}
    >
      <span
        className="text-sm cursor-pointer"
        onClick={() => onEdit && setIsEditing(true)}
        title={onEdit ? "Click to edit" : ""}
      >
        {text}
      </span>
      <button
        onClick={onRemove}
        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:text-red-600"
        title="Remove"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
};

interface SimpleCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isCompleted?: boolean;
}

const SimpleCard: React.FC<SimpleCardProps> = ({
  title,
  icon,
  children,
  isCompleted,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div
      className={`bg-white rounded-2xl border-2 transition-all duration-300 ${
        isCompleted
          ? "border-green-200 bg-green-50/30"
          : "border-gray-200 hover:border-blue-200 hover:shadow-lg"
      }`}
    >
      <div
        className="flex items-center justify-between p-6 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isCompleted
                ? "bg-green-100 text-green-600"
                : "bg-blue-100 text-blue-600"
            }`}
          >
            {isCompleted ? <Sparkles className="w-5 h-5" /> : icon}
          </div>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          {isCompleted && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
              ✓ Complete
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </div>

      {isExpanded && <div className="px-6 pb-6 space-y-4">{children}</div>}
    </div>
  );
};

const BlueprintForm: React.FC<{ id: string }> = ({ id }) => {
  const [projectTitle, setProjectTitle] = useState("My Awesome Course");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [position, setPosition] = useState("");
  const [backstory, setBackstory] = useState("");
  const [timeActive, setTimeActive] = useState("");
  const [credentials, setCredentials] = useState<string[]>([]);
  const [beforeStates, setBeforeStates] = useState<string[]>([]);

  // Additional fields from original form
  const [bioPosition, setBioPosition] = useState("");
  const [afterStates, setAfterStates] = useState<string[]>([]);
  const [offers, setOffers] = useState<string[]>([]);
  const [pages, setPages] = useState<string[]>([]);
  const [miscellaneous, setMiscellaneous] = useState<string[]>([]);
  const [training, setTraining] = useState<string[]>([]);
  const [bookBuilder, setBookBuilder] = useState<string[]>([]);
  const [custom, setCustom] = useState<string[]>([]);
  const [buyers, setBuyers] = useState<string[]>([]);
  const [company, setCompany] = useState<string[]>([]);

  // Sample suggestions
  const positionSuggestions = [
    "Founder & CEO",
    "Expert Coach",
    "Industry Leader",
    "Senior Consultant",
    "Thought Leader",
    "Master Trainer",
    "Business Strategist",
  ];

  const credentialSuggestions = [
    "Certified Professional",
    "PhD in Business",
    "20+ Years Experience",
    "Best-selling Author",
    "Industry Award Winner",
    "Featured Speaker",
  ];

  const beforeSuggestions = [
    "Struggling with productivity",
    "Overwhelmed entrepreneur",
    "Burnt-out professional",
    "Confused beginner",
    "Stressed business owner",
    "Procrastinating student",
  ];

  const addCredential = (text: string) => {
    if (text && !credentials.includes(text)) {
      setCredentials([...credentials, text]);
    }
  };

  const addBeforeState = (text: string) => {
    if (text && !beforeStates.includes(text)) {
      setBeforeStates([...beforeStates, text]);
    }
  };

  const addAfterState = (text: string) => {
    if (text && !afterStates.includes(text)) {
      setAfterStates([...afterStates, text]);
    }
  };

  const addOffer = (text: string) => {
    if (text && !offers.includes(text)) {
      setOffers([...offers, text]);
    }
  };

  const addPage = (text: string) => {
    if (text && !pages.includes(text)) {
      setPages([...pages, text]);
    }
  };

  const addMisc = (text: string) => {
    if (text && !miscellaneous.includes(text)) {
      setMiscellaneous([...miscellaneous, text]);
    }
  };

  const addTraining = (text: string) => {
    if (text && !training.includes(text)) {
      setTraining([...training, text]);
    }
  };

  const addBookBuilder = (text: string) => {
    if (text && !bookBuilder.includes(text)) {
      setBookBuilder([...bookBuilder, text]);
    }
  };

  const addCustom = (text: string) => {
    if (text && !custom.includes(text)) {
      setCustom([...custom, text]);
    }
  };

  const addBuyer = (text: string) => {
    if (text && !buyers.includes(text)) {
      setBuyers([...buyers, text]);
    }
  };

  const addCompany = (text: string) => {
    if (text && !company.includes(text)) {
      setCompany([...company, text]);
    }
  };

  const getCompletionCount = () => {
    let count = 0;
    if (firstName) count++;
    if (lastName) count++;
    if (position) count++;
    if (backstory) count++;
    if (timeActive) count++;
    if (credentials.length > 0) count++;
    if (beforeStates.length > 0) count++;
    if (bioPosition) count++;
    if (afterStates.length > 0) count++;
    if (offers.length > 0) count++;
    if (pages.length > 0) count++;
    if (miscellaneous.length > 0) count++;
    if (training.length > 0) count++;
    if (bookBuilder.length > 0) count++;
    if (custom.length > 0) count++;
    if (buyers.length > 0) count++;
    if (company.length > 0) count++;
    return count;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Wand2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <input
                type="text"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                className="text-xl font-bold bg-transparent border-none outline-none text-gray-800 placeholder-gray-400"
                placeholder="Give your course a name..."
              />
              <p className="text-sm text-gray-500">Blueprint Builder</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200">
              <Copy className="w-5 h-5" />
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Progress */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Your Progress
          </h2>
          <ProgressBar current={getCompletionCount()} total={17} />
        </div>

        {/* Personal Info Card */}
        <SimpleCard
          title="Biography"
          icon={<User className="w-5 h-5" />}
          isCompleted={Boolean(firstName && lastName && position)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SmartInput
              label="First Name"
              value={firstName}
              onChange={setFirstName}
              placeholder="What should we call you?"
              icon={<User className="w-4 h-4 text-blue-500" />}
              required
            />
            <SmartInput
              label="Last Name"
              value={lastName}
              onChange={setLastName}
              placeholder="Your family name"
              icon={<User className="w-4 h-4 text-blue-500" />}
              required
            />
          </div>

          <SmartInput
            label="Bio Position"
            value={bioPosition}
            onChange={setBioPosition}
            placeholder="Your specific role or position in bio"
            icon={<Award className="w-4 h-4 text-purple-500" />}
          />

          <SmartInput
            label="Your Title/Position"
            value={position}
            onChange={setPosition}
            placeholder="How do you want to be known?"
            suggestions={positionSuggestions}
            icon={<Award className="w-4 h-4 text-purple-500" />}
          />
        </SimpleCard>

        {/* Buyers Card */}
        <SimpleCard
          title="Buyers"
          icon={<User className="w-5 h-5" />}
          isCompleted={buyers.length > 0}
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Who are the people buying your course? Define your ideal
              customers.
            </p>

            <div className="flex flex-wrap gap-2">
              {buyers.map((buyer, index) => (
                <FlexibleTag
                  key={index}
                  text={buyer}
                  onRemove={() =>
                    setBuyers(buyers.filter((_, i) => i !== index))
                  }
                  onEdit={(newText) => {
                    const updated = [...buyers];
                    updated[index] = newText;
                    setBuyers(updated);
                  }}
                  color="blue"
                />
              ))}
            </div>

            <div className="space-y-2">
              <p className="text-xs text-gray-500">Quick suggestions:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Entrepreneurs",
                  "Small Business Owners",
                  "Freelancers",
                  "Consultants",
                  "Coaches",
                ].map((suggestion, index) => (
                  <QuickTag
                    key={index}
                    text={suggestion}
                    onAdd={() => addBuyer(suggestion)}
                    icon={<User className="w-3 h-3" />}
                  />
                ))}
              </div>
            </div>
          </div>
        </SimpleCard>

        {/* Company Card */}
        <SimpleCard
          title="Company"
          icon={<Target className="w-5 h-5" />}
          isCompleted={company.length > 0}
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Information about your company or organization.
            </p>

            <div className="flex flex-wrap gap-2">
              {company.map((item, index) => (
                <FlexibleTag
                  key={index}
                  text={item}
                  onRemove={() =>
                    setCompany(company.filter((_, i) => i !== index))
                  }
                  onEdit={(newText) => {
                    const updated = [...company];
                    updated[index] = newText;
                    setCompany(updated);
                  }}
                  color="green"
                />
              ))}
            </div>

            <div className="space-y-2">
              <p className="text-xs text-gray-500">Common items:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Founded 2020",
                  "Remote Team",
                  "Global Reach",
                  "Award Winner",
                ].map((suggestion, index) => (
                  <QuickTag
                    key={index}
                    text={suggestion}
                    onAdd={() => addCompany(suggestion)}
                    icon={<Target className="w-3 h-3" />}
                  />
                ))}
              </div>
            </div>
          </div>
        </SimpleCard>

        {/* Offers Card */}
        <SimpleCard
          title="Offers"
          icon={<Sparkles className="w-5 h-5" />}
          isCompleted={offers.length > 0}
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              What do you offer to your students? Your products, services, or
              solutions.
            </p>

            <div className="flex flex-wrap gap-2">
              {offers.map((offer, index) => (
                <FlexibleTag
                  key={index}
                  text={offer}
                  onRemove={() =>
                    setOffers(offers.filter((_, i) => i !== index))
                  }
                  onEdit={(newText) => {
                    const updated = [...offers];
                    updated[index] = newText;
                    setOffers(updated);
                  }}
                  color="purple"
                />
              ))}
            </div>

            <div className="space-y-2">
              <p className="text-xs text-gray-500">Popular offers:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Online Course",
                  "1-on-1 Coaching",
                  "Group Program",
                  "Certification",
                  "Masterclass",
                ].map((suggestion, index) => (
                  <QuickTag
                    key={index}
                    text={suggestion}
                    onAdd={() => addOffer(suggestion)}
                    icon={<Sparkles className="w-3 h-3" />}
                  />
                ))}
              </div>
            </div>
          </div>
        </SimpleCard>

        {/* Pages Card */}
        <SimpleCard
          title="Pages"
          icon={<BookOpen className="w-5 h-5" />}
          isCompleted={pages.length > 0}
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              What pages or sections will be part of your course or website?
            </p>

            <div className="flex flex-wrap gap-2">
              {pages.map((page, index) => (
                <FlexibleTag
                  key={index}
                  text={page}
                  onRemove={() => setPages(pages.filter((_, i) => i !== index))}
                  onEdit={(newText) => {
                    const updated = [...pages];
                    updated[index] = newText;
                    setPages(updated);
                  }}
                  color="blue"
                />
              ))}
            </div>

            <div className="space-y-2">
              <p className="text-xs text-gray-500">Common pages:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Home",
                  "About",
                  "Course Overview",
                  "Pricing",
                  "Contact",
                  "FAQ",
                ].map((suggestion, index) => (
                  <QuickTag
                    key={index}
                    text={suggestion}
                    onAdd={() => addPage(suggestion)}
                    icon={<BookOpen className="w-3 h-3" />}
                  />
                ))}
              </div>
            </div>
          </div>
        </SimpleCard>

        {/* After States Card */}
        <SimpleCard
          title="After"
          icon={<Target className="w-5 h-5" />}
          isCompleted={afterStates.length > 0}
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              What will your students achieve or become after taking your
              course?
            </p>

            <div className="flex flex-wrap gap-2">
              {afterStates.map((state, index) => (
                <FlexibleTag
                  key={index}
                  text={state}
                  onRemove={() =>
                    setAfterStates(afterStates.filter((_, i) => i !== index))
                  }
                  onEdit={(newText) => {
                    const updated = [...afterStates];
                    updated[index] = newText;
                    setAfterStates(updated);
                  }}
                  color="green"
                />
              ))}
            </div>

            <div className="space-y-2">
              <p className="text-xs text-gray-500">Transformation outcomes:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Confident expert",
                  "Productive professional",
                  "Successful entrepreneur",
                  "Skilled practitioner",
                ].map((suggestion, index) => (
                  <QuickTag
                    key={index}
                    text={suggestion}
                    onAdd={() => addAfterState(suggestion)}
                    icon={<Target className="w-3 h-3" />}
                  />
                ))}
              </div>
            </div>
          </div>
        </SimpleCard>

        {/* Training Card */}
        <SimpleCard
          title="Training"
          icon={<BookOpen className="w-5 h-5" />}
          isCompleted={training.length > 0}
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              What training methods, modules, or learning formats will you use?
            </p>

            <div className="flex flex-wrap gap-2">
              {training.map((item, index) => (
                <FlexibleTag
                  key={index}
                  text={item}
                  onRemove={() =>
                    setTraining(training.filter((_, i) => i !== index))
                  }
                  onEdit={(newText) => {
                    const updated = [...training];
                    updated[index] = newText;
                    setTraining(updated);
                  }}
                  color="purple"
                />
              ))}
            </div>

            <div className="space-y-2">
              <p className="text-xs text-gray-500">Training formats:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Video Lessons",
                  "Live Sessions",
                  "Worksheets",
                  "Quizzes",
                  "Case Studies",
                  "Group Calls",
                ].map((suggestion, index) => (
                  <QuickTag
                    key={index}
                    text={suggestion}
                    onAdd={() => addTraining(suggestion)}
                    icon={<BookOpen className="w-3 h-3" />}
                  />
                ))}
              </div>
            </div>
          </div>
        </SimpleCard>

        {/* BookBuilder Card */}
        <SimpleCard
          title="BookBuilder"
          icon={<BookOpen className="w-5 h-5" />}
          isCompleted={bookBuilder.length > 0}
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Elements for building your course book or materials.
            </p>

            <div className="flex flex-wrap gap-2">
              {bookBuilder.map((item, index) => (
                <FlexibleTag
                  key={index}
                  text={item}
                  onRemove={() =>
                    setBookBuilder(bookBuilder.filter((_, i) => i !== index))
                  }
                  onEdit={(newText) => {
                    const updated = [...bookBuilder];
                    updated[index] = newText;
                    setBookBuilder(updated);
                  }}
                  color="blue"
                />
              ))}
            </div>

            <div className="space-y-2">
              <p className="text-xs text-gray-500">Book elements:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Introduction",
                  "Chapters",
                  "Exercises",
                  "Summary",
                  "Resources",
                  "Bibliography",
                ].map((suggestion, index) => (
                  <QuickTag
                    key={index}
                    text={suggestion}
                    onAdd={() => addBookBuilder(suggestion)}
                    icon={<BookOpen className="w-3 h-3" />}
                  />
                ))}
              </div>
            </div>
          </div>
        </SimpleCard>

        {/* Miscellaneous Card */}
        <SimpleCard
          title="Miscellaneous"
          icon={<Plus className="w-5 h-5" />}
          isCompleted={miscellaneous.length > 0}
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Any other important details, notes, or elements for your course.
            </p>

            <div className="flex flex-wrap gap-2">
              {miscellaneous.map((item, index) => (
                <FlexibleTag
                  key={index}
                  text={item}
                  onRemove={() =>
                    setMiscellaneous(
                      miscellaneous.filter((_, i) => i !== index)
                    )
                  }
                  onEdit={(newText) => {
                    const updated = [...miscellaneous];
                    updated[index] = newText;
                    setMiscellaneous(updated);
                  }}
                  color="pink"
                />
              ))}
            </div>

            <div className="space-y-2">
              <p className="text-xs text-gray-500">Additional items:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Bonus Materials",
                  "Community Access",
                  "Email Support",
                  "Lifetime Updates",
                ].map((suggestion, index) => (
                  <QuickTag
                    key={index}
                    text={suggestion}
                    onAdd={() => addMisc(suggestion)}
                    icon={<Plus className="w-3 h-3" />}
                  />
                ))}
              </div>
            </div>
          </div>
        </SimpleCard>

        {/* Custom Card */}
        <SimpleCard
          title="Custom"
          icon={<Wand2 className="w-5 h-5" />}
          isCompleted={custom.length > 0}
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Custom fields and unique elements specific to your course or
              business.
            </p>

            <div className="flex flex-wrap gap-2">
              {custom.map((item, index) => (
                <FlexibleTag
                  key={index}
                  text={item}
                  onRemove={() =>
                    setCustom(custom.filter((_, i) => i !== index))
                  }
                  onEdit={(newText) => {
                    const updated = [...custom];
                    updated[index] = newText;
                    setCustom(updated);
                  }}
                  color="purple"
                />
              ))}
            </div>

            <div className="space-y-2">
              <p className="text-xs text-gray-500">Add your own:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Special Feature",
                  "Unique Approach",
                  "Proprietary Method",
                  "Exclusive Content",
                ].map((suggestion, index) => (
                  <QuickTag
                    key={index}
                    text={suggestion}
                    onAdd={() => addCustom(suggestion)}
                    icon={<Wand2 className="w-3 h-3" />}
                  />
                ))}
              </div>
            </div>
          </div>
        </SimpleCard>

        {/* Credentials Card */}
        <SimpleCard
          title="Your Credentials"
          icon={<Award className="w-5 h-5" />}
          isCompleted={credentials.length > 0}
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              What makes you qualified to teach this? Add your expertise,
              certifications, or achievements.
            </p>

            <div className="flex flex-wrap gap-2">
              {credentials.map((credential, index) => (
                <FlexibleTag
                  key={index}
                  text={credential}
                  onRemove={() =>
                    setCredentials(credentials.filter((_, i) => i !== index))
                  }
                  onEdit={(newText) => {
                    const updated = [...credentials];
                    updated[index] = newText;
                    setCredentials(updated);
                  }}
                  color="purple"
                />
              ))}
            </div>

            <div className="space-y-2">
              <p className="text-xs text-gray-500">Quick suggestions:</p>
              <div className="flex flex-wrap gap-2">
                {credentialSuggestions.map((suggestion, index) => (
                  <QuickTag
                    key={index}
                    text={suggestion}
                    onAdd={() => addCredential(suggestion)}
                    icon={<Award className="w-3 h-3" />}
                  />
                ))}
              </div>
            </div>
          </div>
        </SimpleCard>

        {/* Story Card */}
        <SimpleCard
          title="Your Story"
          icon={<BookOpen className="w-5 h-5" />}
          isCompleted={backstory.length > 0}
        >
          <SmartInput
            label="Your Backstory"
            value={backstory}
            onChange={setBackstory}
            placeholder="What's your story? What led you to create this course? Keep it personal and authentic..."
            icon={<BookOpen className="w-4 h-4 text-green-500" />}
            type="textarea"
          />

          <SmartInput
            label="Time in Field"
            value={timeActive}
            onChange={setTimeActive}
            placeholder="How long have you been doing this?"
            icon={<Clock className="w-4 h-4 text-blue-500" />}
          />
        </SimpleCard>

        {/* Audience Card */}
        <SimpleCard
          title="Your Audience"
          icon={<Target className="w-5 h-5" />}
          isCompleted={beforeStates.length > 0}
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              What problems or situations are your students dealing with before
              they find your course?
            </p>

            <div className="flex flex-wrap gap-2">
              {beforeStates.map((state, index) => (
                <FlexibleTag
                  key={index}
                  text={state}
                  onRemove={() =>
                    setBeforeStates(beforeStates.filter((_, i) => i !== index))
                  }
                  onEdit={(newText) => {
                    const updated = [...beforeStates];
                    updated[index] = newText;
                    setBeforeStates(updated);
                  }}
                  color="pink"
                />
              ))}
            </div>

            <div className="space-y-2">
              <p className="text-xs text-gray-500">Common pain points:</p>
              <div className="flex flex-wrap gap-2">
                {beforeSuggestions.map((suggestion, index) => (
                  <QuickTag
                    key={index}
                    text={suggestion}
                    onAdd={() => addBeforeState(suggestion)}
                    icon={<Target className="w-3 h-3" />}
                  />
                ))}
              </div>
            </div>
          </div>
        </SimpleCard>

        {/* Completion Message */}
        {getCompletionCount() === 17 && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-2xl p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              🎉 Amazing! Your blueprint is complete!
            </h3>
            <p className="text-gray-600">
              You've built a solid foundation for your course. Ready to move to
              the next step?
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlueprintForm;
