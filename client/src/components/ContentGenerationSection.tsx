import { AlertTriangle } from "lucide-react";
import React from "react";
import InlineTextEditor from "./ui/InlineTextEditor";

function ContentGenerationSection() {
  return (
    <div className="h-full p-6">
      {/* Warning Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-amber-800">
          <p className="font-medium mb-1">Important Notice</p>
          <p>
            Do not copy text into the editor. Always fact-check claims and
            output as AI can hallucinate. We do not guarantee compliant copy.
          </p>
        </div>
      </div>

      {/* Editor Container */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[calc(100vh-480px)] ">
        <InlineTextEditor
          initialContent="<p>Start writing your email <b>content</b> </p>"
          placeholder="Start crafting your promotional email..."
          onChange={(value) => console.log("data", value)}
        />
      </div>
    </div>
  );
}

export default ContentGenerationSection;
