export interface User {
  id: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  type: 'project' | 'blueprint';
  lastModified: string;
  created: string;
  status: 'Active' | 'Draft' | 'Archived';
  isStarred?: boolean;
  userId: string;
  blueprintId?: string;
  settings?: ProjectSettings;
}

export interface ProjectSettings {
  focus: string;
  tone: string;
  quantity: string;
}

export interface Blueprint {
  id: string;
  name: string;
  feedBnsn: string;
  offerType: string;
  formData: BlueprintFormData;
  created: string;
  updated: string;
  userId: string;
}

export interface BlueprintFormData {
  projectTitle: string;
  firstName: string;
  lastName: string;
  position: string;
  bioPosition: string;
  backstory: string;
  timeActive: string;
  credentials: string[];
  beforeStates: string[];
  afterStates: string[];
  offers: string[];
  pages: string[];
  miscellaneous: string[];
  training: string[];
  bookBuilder: string[];
  custom: string[];
  buyers: string[];
  company: string[];
}

export interface Campaign {
  id: string;
  name: string;
  projectId: string;
  content: string;
  status: 'Draft' | 'Sent' | 'Scheduled';
  created: string;
  updated: string;
  userId: string;
  statistics?: {
    wordsUsed: number;
    emailsSent?: number;
    openRate?: number;
  };
}

export interface DeepSeekRequest {
  model: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  stream?: boolean;
}

export interface DeepSeekResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface FileUploadResult {
  filename: string;
  originalName: string;
  size: number;
  mimetype: string;
  path: string;
  url: string;
}