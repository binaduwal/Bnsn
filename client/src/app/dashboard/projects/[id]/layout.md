"use client"

import type React from "react"
import { use, useEffect, useState } from "react"
import { Plus, Eye } from "lucide-react"
import CampaignAccordion from "@/components/CampainAccordion"
import EditableTitle from "@/components/ui/EditableTitle"
import { Category, singleProjectApi } from "@/services/projectApi"
export interface Campaign {
  id: string
  title: string
  slug: string
  dropDownTitle: string
  isActive?: boolean
}

export interface TitleState {
  original: string
  edit: string
}

export interface LayoutProps {
  children: React.ReactNode
  params: Promise<{ id: string }>
}


const Layout: React.FC<LayoutProps> = ({ children,params }) => {
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>("Promotional Emails")
  const [mainTitle, setMainTitle] = useState("Email Campaign")
   const [categories, setCategories] = useState<Category[]>([]);
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
  ])

  useEffect(() => {
    fetchSingleProject();
  }, [id]);

  const fetchSingleProject = async () => {
    const response = await singleProjectApi(id);
    setCategories(response.data.categoryId);
    console.log("first", response);
  };

  const handleCampaignSelect = (campaignTitle: string) => {
    setSelectedCampaign(selectedCampaign === campaignTitle ? null : campaignTitle)
  }

  const handleCampaignUpdate = (oldTitle: string, newTitle: string) => {
    setCampaigns((prev) => prev.map((camp) => (camp.title === oldTitle ? { ...camp, title: newTitle } : camp)))

    // Update selectedCampaign if it was the one being edited
    if (selectedCampaign === oldTitle) {
      setSelectedCampaign(newTitle)
    }
  }

  const handleAddCampaign = () => {
    const newCampaign: Campaign = {
      id: Date.now().toString(),
      title: "New Campaign",
      slug: "new-campaign",
      dropDownTitle: "New Campaign Generator",
      isActive: false,
    }
    setCampaigns((prev) => [...prev, newCampaign])
  }

  return (
    <div className="  bg-gray-50 flex">
      {/* Left Sidebar */}
      <aside className="w-80 max-h-[calc(100vh-120px)] bg-white border-r border-gray-200 flex flex-col shadow-sm">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <EditableTitle title={mainTitle} onSave={setMainTitle} />
        </div>

        {/* Campaigns Section */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Campaigns</h3>
            <CampaignAccordion
              campaigns={categories}
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
              <span className="text-sm font-medium text-blue-600">Blueprint: Productivity Course Demo</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Active</div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">{children}</div>
      </main>
    </div>
  )
}

export default Layout
