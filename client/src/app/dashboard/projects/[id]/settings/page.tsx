"use client"
import React, { useState } from "react";
import {
  CircleHelp,
  Check,
  ChevronDown,
  Settings,
  Mail,
  Lightbulb,
  MessageSquare,
  Hash,
  Save,
  RotateCcw,
  Info,
} from "lucide-react";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help"
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg z-10 max-w-xs whitespace-normal">
          {content}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
        </div>
      )}
    </div>
  );
};

interface SmartSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; description?: string }[];
  helpText: string;
  icon: React.ReactNode;
  placeholder?: string;
}

const SmartSelect: React.FC<SmartSelectProps> = ({
  label,
  value,
  onChange,
  options,
  helpText,
  icon,
  placeholder = "Select an option...",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          {icon}
          <label className="text-sm font-medium text-gray-700">
            {label}
          </label>
        </div>
        <Tooltip content={helpText}>
          <CircleHelp className="w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors" />
        </Tooltip>
      </div>
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className={`w-full flex items-center justify-between px-4 py-3 border-2 rounded-xl text-sm text-left transition-all duration-200 ${
            isFocused || isOpen
              ? "border-blue-400 bg-blue-50/50 shadow-lg ring-4 ring-blue-100"
              : "border-gray-200 hover:border-gray-300 bg-white"
          }`}
        >
          <span className={selectedOption ? "text-gray-800" : "text-gray-400"}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown 
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 max-h-64 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors first:rounded-t-xl last:rounded-b-xl ${
                  value === option.value ? "bg-blue-50 text-blue-700" : "text-gray-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{option.label}</div>
                    {option.description && (
                      <div className="text-xs text-gray-500 mt-1">{option.description}</div>
                    )}
                  </div>
                  {value === option.value && (
                    <Check className="w-4 h-4 text-blue-600" />
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface ProgressStepProps {
  number: number;
  title: string;
  isCompleted: boolean;
  isActive: boolean;
}

const ProgressStep: React.FC<ProgressStepProps> = ({ number, title, isCompleted, isActive }) => {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
        isCompleted 
          ? "bg-green-100 text-green-700 border-2 border-green-200" 
          : isActive
          ? "bg-blue-100 text-blue-700 border-2 border-blue-200"
          : "bg-gray-100 text-gray-400 border-2 border-gray-200"
      }`}>
        {isCompleted ? <Check className="w-4 h-4" /> : number}
      </div>
      <span className={`text-sm font-medium ${
        isCompleted 
          ? "text-green-700" 
          : isActive 
          ? "text-blue-700" 
          : "text-gray-400"
      }`}>
        {title}
      </span>
    </div>
  );
};

const SettingsPage: React.FC = () => {
  const [focus, setFocus] = useState("");
  const [tone, setTone] = useState("");
  const [quantity, setQuantity] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  const focusOptions = [
    { 
      value: "default", 
      label: "Default", 
      description: "Standard promotional focus" 
    },
    { 
      value: "conversion", 
      label: "High Conversion", 
      description: "Optimized for maximum conversions" 
    },
    { 
      value: "engagement", 
      label: "Engagement", 
      description: "Focus on building relationships" 
    },
    { 
      value: "education", 
      label: "Educational", 
      description: "Provide value and teach" 
    },
  ];

  const toneOptions = [
    { 
      value: "default", 
      label: "Default", 
      description: "Professional and friendly" 
    },
    { 
      value: "casual", 
      label: "Casual", 
      description: "Relaxed and conversational" 
    },
    { 
      value: "professional", 
      label: "Professional", 
      description: "Formal and business-like" 
    },
    { 
      value: "enthusiastic", 
      label: "Enthusiastic", 
      description: "Energetic and exciting" 
    },
    { 
      value: "authoritative", 
      label: "Authoritative", 
      description: "Expert and confident" 
    },
  ];

  const quantityOptions = [
    { 
      value: "3", 
      label: "3 Emails", 
      description: "Quick campaign" 
    },
    { 
      value: "5", 
      label: "5 Emails", 
      description: "Standard campaign" 
    },
    { 
      value: "7", 
      label: "7 Emails", 
      description: "Extended campaign" 
    },
    { 
      value: "10", 
      label: "10 Emails", 
      description: "Comprehensive campaign" 
    },
  ];

  const handleChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (value: string) => {
    setter(value);
    setHasChanges(true);
  };

  const isFormComplete = focus && tone && quantity;
  const completedSteps = [focus, tone, quantity].filter(Boolean).length;

  const handleSubmit = () => {
    if (isFormComplete) {
      // Handle submission
      console.log({ focus, tone, quantity });
      setHasChanges(false);
      alert("Settings saved successfully!");
    }
  };

  const handleReset = () => {
    setFocus("");
    setTone("");
    setQuantity("");
    setHasChanges(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto py-8 px-6">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Promotional Emails Settings
                </h1>
                <p className="text-gray-600 text-sm">
                  Configure your email campaign preferences
                </p>
              </div>
            </div>
            <Tooltip content="Get help with these settings">
              <CircleHelp className="w-6 h-6 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer" />
            </Tooltip>
          </div>
        </div>

        <div className="gap-6">
          {/* Progress Sidebar */}
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="space-y-6">
                {/* Focus */}
                <SmartSelect
                  label="Email Focus"
                  value={focus}
                  onChange={handleChange(setFocus)}
                  options={focusOptions}
                  helpText="Choose the primary goal for your email campaign. This affects the overall strategy and messaging approach."
                  icon={<Lightbulb className="w-4 h-4 text-blue-500" />}
                  placeholder="What's your campaign focus?"
                />

                {/* Tone */}
                <SmartSelect
                  label="Communication Tone"
                  value={tone}
                  onChange={handleChange(setTone)}
                  options={toneOptions}
                  helpText="Select the tone that matches your brand voice and resonates with your audience."
                  icon={<MessageSquare className="w-4 h-4 text-purple-500" />}
                  placeholder="How should we communicate?"
                />

                {/* Quantity */}
                <SmartSelect
                  label="Email Quantity"
                  value={quantity}
                  onChange={handleChange(setQuantity)}
                  options={quantityOptions}
                  helpText="Choose how many emails to include in your promotional sequence. More emails allow for deeper storytelling but require more engagement."
                  icon={<Hash className="w-4 h-4 text-green-500" />}
                  placeholder="How many emails do you need?"
                />

                {/* Preview */}
                {isFormComplete && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900 mb-2">Campaign Preview</h4>
                        <div className="text-sm text-blue-700 space-y-1">
                          <p><strong>Focus:</strong> {focusOptions.find(o => o.value === focus)?.label}</p>
                          <p><strong>Tone:</strong> {toneOptions.find(o => o.value === tone)?.label}</p>
                          <p><strong>Emails:</strong> {quantityOptions.find(o => o.value === quantity)?.label}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSubmit}
                    disabled={!isFormComplete}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-medium transition-all duration-200 ${
                      isFormComplete
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:scale-105"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <Save className="w-4 h-4" />
                    Save Settings
                  </button>
                  
                  {hasChanges && (
                    <button
                      onClick={handleReset}
                      className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reset
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;