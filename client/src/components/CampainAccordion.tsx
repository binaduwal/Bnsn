"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, Settings, Pencil, Check, X } from "lucide-react"
import { Campaign } from "@/app/dashboard/projects/[id]/layout"

interface CampaignAccordionProps {
  campaigns: Campaign[]
  selectedCampaign: string | null
  onCampaignSelect: (campaignTitle: string) => void
  onCampaignUpdate: (oldTitle: string, newTitle: string) => void
}

const CampaignAccordion: React.FC<CampaignAccordionProps> = ({
  campaigns,
  selectedCampaign,
  onCampaignSelect,
  onCampaignUpdate,
}) => {
  const router = useRouter()
  const [editingCampaign, setEditingCampaign] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")

  const startEdit = (campaign: Campaign) => {
    setEditingCampaign(campaign.title)
    setEditValue(campaign.title)
  }

  const cancelEdit = () => {
    setEditingCampaign(null)
    setEditValue("")
  }

  const saveEdit = (oldTitle: string) => {
    if (editValue.trim() && editValue.trim() !== oldTitle) {
      onCampaignUpdate(oldTitle, editValue.trim())
    }
    setEditingCampaign(null)
    setEditValue("")
  }

  const handleSettingsClick = (campaignTitle: string) => {
    const slug = campaignTitle.toLowerCase().replace(/\s+/g, "-")
    router.push(`/dashboard/projects/${slug}/settings`)
  }

  const handleCampaignClick = (campaignSlug: string) => {
    router.push(`/dashboard/projects/${campaignSlug}`)
  }

  const handleHeaderClick = (campaignTitle: string) => {
    if (editingCampaign === null) {
      onCampaignSelect(campaignTitle)
    }
  }

  return (
    <div className="space-y-3">
      {campaigns.map((campaign) => (
        <div
          key={campaign.id}
          className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          {/* Accordion Header */}
          <div
            onClick={() => handleHeaderClick(campaign.title)}
            className="p-4 hover:bg-gray-50  transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 flex items-center gap-1">
                {editingCampaign === campaign.title ? (
                  <input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        saveEdit(campaign.title)
                      } else if (e.key === "Escape") {
                        cancelEdit()
                      }
                    }}
                    className="w-32 border border-gray-300 rounded-md px-3 py-1.5 text-sm font-medium text-gray-900 outline-none"
                    autoFocus
                  />
                ) : (
                  <h2 className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors">
                    {campaign.title}
                  </h2>
                )}

                {editingCampaign === campaign.title ? (
                  <div className="flex items-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        saveEdit(campaign.title)
                      }}
                      className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                      title="Save"
                    >
                      <Check className="w-4 h-4 text-green-600" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        cancelEdit()
                      }}
                      className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                      title="Cancel"
                    >
                      <X className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      startEdit(campaign)
                    }}
                    className="p-1.5  rounded-md opacity-100 hover:bg-gray-100 transition-all"
                    title="Edit campaign"
                  >
                    <Pencil className="w-4 h-4 text-gray-400" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSettingsClick(campaign.title)
                  }}
                  className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
                  title="Campaign settings"
                >
                  <Settings className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onCampaignSelect(campaign.title)
                  }}
                  className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
                  title={selectedCampaign === campaign.title ? "Collapse" : "Expand"}
                >
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 hover:text-gray-600 transition-transform duration-200 ${
                      selectedCampaign === campaign.title ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Accordion Content */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              selectedCampaign === campaign.title ? "max-h-32 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="px-4 pb-4">
              <button
                onClick={() => handleCampaignClick(campaign.slug)}
                className="w-full bg-blue-50 border border-blue-200 rounded-lg p-3 hover:bg-blue-100 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-900">{campaign.dropDownTitle}</span>
                  <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-700 transition-colors">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default CampaignAccordion
