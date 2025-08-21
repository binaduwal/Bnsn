"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  Settings,
  Folder,
  FolderOpen,
  Sparkles,
  Target,
  Zap,
  Star,
  PlayCircle,
  Layers,
  FileText,
  Activity
} from "lucide-react";
import { Category, SubCategory } from "@/services/projectApi";
import CategoryAliasEditor from "./CategoryAliasEditor";

interface CampaignAccordionProps {
  projectId?: string; // Add projectId prop for alias functionality
  campaigns: Category[];
  selectedCampaign: string | null;
  selectedCategory: string | null;
  onCategoryChange: (id: string) => void;
  onCampaignSelect: (id: string) => void;
  onCampaignUpdate?: (oldAlias: string, newAlias: string) => void; // Made optional since CategoryAliasEditor handles user custom aliases
}

const CampaignAccordion: React.FC<CampaignAccordionProps> = ({
  projectId,
  campaigns,
  selectedCampaign,
  selectedCategory,
  onCategoryChange,
  onCampaignSelect,
  onCampaignUpdate,
}) => {


  const router = useRouter();

  //  useEffect(()=>{
  //   onCategoryChange(campaigns?.[0]?.subCategories[0].thirdCategories[0]?._id)
  //  },[campaigns])

  const handleSettingsClick = (id: string) => {
    router.push(`/dashboard/projects/${id}/settings`);
  };

  const handleCampaignClick = (id: string) => {
    onCategoryChange?.(id);
  };

  const handleHeaderClick = (campaignTitle: string) => {
    onCampaignSelect(campaignTitle);
  };

  const isOpen = (campaignTitle: string): boolean => {
    return selectedCampaign === campaignTitle;
  };

  return (
    <div className="space-y-4">
      {campaigns?.map(camp => {
        return camp.subCategories.map((campaign, index) => (
          <div
            key={campaign._id}
            className="group bg-white/70 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg hover:shadow-xl hover:border-blue-200 transition-all duration-300 overflow-hidden"
          >
            {/* Compact Accordion Header */}
            <div
              onClick={() => handleHeaderClick(campaign.alias || campaign.title)}
              className="relative p-4 bg-gradient-to-r from-blue-50/50 to-purple-50/50 hover:from-blue-100/50 hover:to-purple-100/50 transition-all duration-300 cursor-pointer border-b border-white/30"
            >
              {/* Gradient accent line */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="flex items-center justify-between">
                <div className="flex-1 flex items-center gap-2">
                  {/* Compact Campaign Icon */}
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    {isOpen(campaign.alias || campaign.title) ? (
                      <FolderOpen className="w-3.5 h-3.5 text-blue-600" />
                    ) : (
                      <Folder className="w-3.5 h-3.5 text-purple-600" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    {projectId ? (
                      <div>
                        <CategoryAliasEditor
                          projectId={projectId}
                          categoryId={campaign._id}
                          defaultAlias={campaign.alias || campaign.title}
                          effectiveAlias={campaign.effectiveAlias}
                          onAliasChange={(newAlias) => {
                            // This is now handled internally by CategoryAliasEditor
                            // No need to call onCampaignUpdate as it updates the main category alias
                            console.log('User custom alias changed:', newAlias);
                          }}
                          className="text-sm font-semibold text-gray-800 hover:text-blue-600 transition-colors truncate"
                        />
                        <div className="flex items-center space-x-2 mt-0.5">
                          <span className="text-xs text-gray-500">
                            {campaign.thirdCategories?.length || 0} items
                          </span>
                          <div className="flex items-center space-x-1">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-green-600 font-medium">Active</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h2 className="text-sm font-semibold text-gray-800 hover:text-blue-600 transition-colors truncate">
                          {campaign.alias || campaign.title}
                        </h2>
                        <div className="flex items-center space-x-2 mt-0.5">
                          <span className="text-xs text-gray-500">
                            {campaign.thirdCategories?.length || 0} items
                          </span>
                          <div className="flex items-center space-x-1">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-green-600 font-medium">Active</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Edit functionality is now handled by CategoryAliasEditor */}
                </div>

                <div className="flex items-center space-x-1">
                  {/* <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSettingsClick(campaign._id);
                    }}
                    className="p-1.5 rounded-lg hover:bg-gray-100 transition-all duration-200"
                    title="Campaign settings"
                  >
                    <Settings className="w-3 h-3 text-gray-500 hover:text-gray-700" />
                  </button> */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCampaignSelect(campaign.alias || campaign.title);
                    }}
                    className="p-1.5 rounded-lg hover:bg-blue-50 transition-all duration-200"
                    title={
                      selectedCampaign === (campaign.alias || campaign.title) ? "Collapse" : "Expand"
                    }
                  >
                    <ChevronDown
                      className={`w-4 h-4 text-blue-500 transition-transform duration-300 ${selectedCampaign === (campaign.alias || campaign.title) ? "rotate-180" : ""
                        }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Compact Accordion Content */}
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen(campaign.alias || campaign.title)
                ? "max-h-max opacity-100"
                : "max-h-0 opacity-0"
                }`}
            >
              <div className="px-4 pb-4 space-y-2 bg-gradient-to-b from-blue-50/20 to-purple-50/20">
                {campaign.thirdCategories.map((third, i) => (
                  <div
                    key={i}
                    onClick={() => handleCampaignClick(third._id)}
                    className={`group w-full relative overflow-hidden transition-all duration-300 rounded-lg cursor-pointer ${selectedCategory === third._id
                      ? "bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-300 shadow-md"
                      : "bg-white/80 backdrop-blur-sm border border-gray-200 hover:border-blue-200 hover:shadow-sm hover:bg-white"
                      }`}
                  >
                    {/* Selected item gradient accent */}
                    {selectedCategory === third._id && (
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                    )}

                    <div className="flex items-center justify-between p-3">
                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                        <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-all duration-200 ${selectedCategory === third._id
                          ? "bg-gradient-to-br from-blue-200 to-purple-200"
                          : "bg-gray-100 group-hover:bg-blue-100"
                          }`}>
                          {selectedCategory === third._id ? (
                            <PlayCircle className="w-3.5 h-3.5 text-blue-600" />
                          ) : (
                            <FileText className="w-3.5 h-3.5 text-gray-500 group-hover:text-blue-500" />
                          )}
                        </div>

                        <div className="text-left flex-1  min-w-0">
                          {projectId ? (
                            <CategoryAliasEditor
                              projectId={projectId}
                              categoryId={third._id}
                              defaultAlias={third.alias || third.title}
                              effectiveAlias={third.effectiveAlias}
                              onAliasChange={(newAlias) => {
                                // This is now handled internally by CategoryAliasEditor
                                // No need to call any update function as it updates user-specific custom alias
                                console.log('Third category custom alias changed:', newAlias);
                              }}
                              className={`text-sm font-medium transition-colors truncate block ${selectedCategory === third._id
                                ? "text-blue-900"
                                : "text-gray-800 group-hover:text-blue-700"
                                }`}
                            />
                          ) : (
                            <span className={`text-sm font-medium transition-colors truncate block ${selectedCategory === third._id
                              ? "text-blue-900"
                              : "text-gray-800 group-hover:text-blue-700"
                              }`}>
                              {third.alias || third.title}
                            </span>
                          )}
                          <div className="text-xs text-gray-500 mt-0.5">
                            Template
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center  space-x-2">
                      

                        <div className={`w-3 h-3 rounded-full flex items-center justify-center transition-all duration-200 ${selectedCategory === third._id
                          ? "bg-blue-600"
                          : "bg-gray-300 group-hover:bg-blue-400"
                          }`}>
                          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))
      })}
    </div>
  );
};

export default CampaignAccordion;
