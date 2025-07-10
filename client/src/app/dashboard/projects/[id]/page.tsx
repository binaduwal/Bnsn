"use client"

import type React from "react"
import { useState } from "react"
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
} from "lucide-react"
import InlineTextEditor from "@/components/ui/InlineTextEditor"

interface EmailCampaignStats {
  wordsLeft: number
  totalWords: number
}

interface EmailCampaignUIProps {
  campaignName?: string
  stats?: EmailCampaignStats
  onSave?: () => void
  onPreview?: () => void
  onSend?: () => void
}

const EmailCampaignUI: React.FC<EmailCampaignUIProps> = ({
  campaignName = "Promotional Email Generator",
  stats = { wordsLeft: 97340, totalWords: 100000 },
  onSave,
  onPreview,
  onSend,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [currentCampaignName, setCurrentCampaignName] = useState(campaignName)
  const [emailContent, setEmailContent] = useState("")

  const handleNameEdit = () => {
    setIsEditing(true)
  }

  const handleNameSave = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditing(false)
    }
  }

  const handleNameBlur = () => {
    setIsEditing(false)
  }

  const progressPercentage = ((stats.totalWords - stats.wordsLeft) / stats.totalWords) * 100

  return (
    <div className="flex flex-col  bg-gray-50">
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
                    onChange={(e) => setCurrentCampaignName(e.target.value)}
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
                  <span className="font-medium text-blue-600 ml-1">{stats.wordsLeft.toLocaleString()}</span>
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
      <main className="flex-1 overflow-hidden">
        <div className="h-full p-6">
          {/* Warning Banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-medium mb-1">Important Notice</p>
              <p>
                Do not copy text into the editor. Always fact-check claims and output as AI can hallucinate. We do not
                guarantee compliant copy.
              </p>
            </div>
          </div>

          {/* Editor Container */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[calc(100vh-480px)] ">
              <InlineTextEditor initialContent="<p>Start writing your email <b>content</b> </p>" placeholder="Start crafting your promotional email..." onChange={(value)=>console.log('data',value)} />
          </div>
        </div>
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
  )
}

export default EmailCampaignUI
