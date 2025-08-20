# System Flowchart: Blueprint Creation, Project Creation, and Categories Generation

## 1. Blueprint Creation Flow

```mermaid
flowchart TD
    A[User Access Blueprint Page] --> B[Click Create New Blueprint]
    B --> C[Fill Blueprint Form]
    C --> D[Enter Blueprint Name]
    C --> E[Enter Feed BNSN Description]
    C --> F[Select Offer Type]
    
    D --> G[Validate Form Fields]
    E --> G
    F --> G
    
    G --> H{Form Valid?}
    H -->|No| I[Show Validation Errors]
    I --> C
    
    H -->|Yes| J[Start Blueprint Creation API]
    J --> K[Create Blueprint Document]
    K --> L[Fetch All Blueprint Categories]
    L --> M[Setup Server-Sent Events]
    
    M --> N[Call DeepSeek AI Service]
    N --> O[Generate AI Content with Categories]
    O --> P[Process AI Response]
    
    P --> Q[Map Categories to Database]
    Q --> R[Create CategoryValue Documents]
    R --> S[Save Blueprint with Categories]
    S --> T[Stream Progress to Client]
    T --> U[Complete Blueprint Creation]
    U --> V[Redirect to Blueprint Detail Page]
```

## 2. Project Creation Flow

```mermaid
flowchart TD
    A[User Access Projects Page] --> B[Click Create New Project]
    B --> C[Project Setup Step 1]
    C --> D[Enter Project Title]
    C --> E[Select Creation Mode]
    
    E --> F{Mode Selection}
    F -->|Create New| G[Enter Project Details]
    F -->|Select Blueprint| H[Choose from Blueprints]
    
    G --> I[Enter Project Description]
    G --> J[Select Offer Type]
    G --> K[Validate Word Count]
    
    H --> L[Select Blueprint]
    L --> M[Validate Selection]
    
    K --> N{Step 1 Valid?}
    M --> N
    
    N -->|No| O[Show Validation Errors]
    O --> C
    
    N -->|Yes| P[Persuasion Vault Step 2]
    P --> Q[Fetch Available Categories]
    Q --> R[Select Categories for Project]
    R --> S{Step 2 Valid?}
    
    S -->|No| T[Show Category Selection Error]
    T --> P
    
    S -->|Yes| U[Review & Launch Step 3]
    U --> V[Review Project Details]
    V --> W[Create Project API Call]
    
    W --> X[Create Project Document]
    X --> Y[Link Project to Blueprint]
    Y --> Z[Link Project to Categories]
    Z --> AA[Save Project]
    AA --> BB[Redirect to Project Detail Page]
```

## 3. Categories Generation Flow

```mermaid
flowchart TD
    A[Admin Access Category Management] --> B[View Category Tree Structure]
    B --> C[Create New Category]
    
    C --> D[Enter Category Details]
    D --> E[Category Title]
    D --> F[Category Alias]
    D --> G[Category Description]
    D --> H[Category Type]
    
    H --> I{Type Selection}
    I -->|Blueprint| J[Blueprint Categories]
    I -->|Project| K[Project Categories]
    
    J --> L[Define Fields for Blueprint]
    K --> M[Define Fields for Project]
    
    L --> N[Add Field Definitions]
    M --> N
    
    N --> O[Field Name]
    N --> P[Field Type]
    P --> Q{Field Type}
    Q -->|text| R[Text Input]
    Q -->|number| S[Number Input]
    Q -->|date| T[Date Input]
    Q -->|boolean| U[Boolean Input]
    
    R --> V[Set Parent Category]
    S --> V
    T --> V
    U --> V
    
    V --> W{Has Parent?}
    W -->|Yes| X[Set Level = Parent Level + 1]
    W -->|No| Y[Set Level = 0]
    
    X --> Z[Validate Category]
    Y --> Z
    
    Z --> AA{Validation Pass?}
    AA -->|No| BB[Show Validation Errors]
    BB --> D
    
    AA -->|Yes| CC[Save Category]
    CC --> DD[Update Category Tree]
    DD --> EE[Category Created Successfully]
```

## 4. Project Content Generation Flow

```mermaid
flowchart TD
    A[User Selects Category in Project] --> B[Enter Field Values]
    B --> C[Validate Field Inputs]
    C --> D[Save Category Values]
    
    D --> E[Generate Content API Call]
    E --> F[Setup Server-Sent Events]
    F --> G[Fetch Blueprint Values]
    G --> H[Fetch Project Category Values]
    
    H --> I[Determine Main Category]
    I --> J[Check for Homepage Reference]
    J --> K{Is Website Page?}
    
    K -->|Yes| L[Fetch Homepage Reference]
    K -->|No| M[Skip Homepage Reference]
    
    L --> N[Call Project Generator Switch]
    M --> N
    
    N --> O[Execute Service Based on Category]
    O --> P{Category Type}
    
    P -->|Article| Q[Article Service]
    P -->|Brand| R[Brand Service]
    P -->|WebPage| S[WebPage Service]
    P -->|LandingPage| T[LandingPage Service]
    P -->|Email| U[Email Service]
    P -->|Advertorial| V[Advertorial Service]
    P -->|Book| W[Book Service]
    
    Q --> X[Generate Article Content]
    R --> X
    S --> X
    T --> X
    U --> X
    V --> X
    W --> X
    
    X --> Y[Stream AI Content]
    Y --> Z[Save Generated Content]
    Z --> AA[Update Category Values]
    AA --> BB[Content Generation Complete]
```

## 5. DeepSeek AI Integration Flow

```mermaid
flowchart TD
    A[DeepSeek Service Call] --> B[Prepare System Prompt]
    B --> C[Format Category Data]
    C --> D[Create User Prompt]
    
    D --> E[Make API Request]
    E --> F{Streaming Enabled?}
    
    F -->|Yes| G[Setup Streaming Response]
    F -->|No| H[Make Regular Request]
    
    G --> I[Process Streaming Chunks]
    I --> J[Parse JSON Response]
    J --> K[Validate AI Content]
    
    H --> L[Process Complete Response]
    L --> K
    
    K --> M{Content Valid?}
    M -->|No| N[Return Error]
    M -->|Yes| O[Return Generated Content]
    
    O --> P[Map to Category Structure]
    P --> Q[Create CategoryValue Objects]
    Q --> R[Save to Database]
```

## Key Components and Relationships

### Database Models
- **Blueprint**: Contains title, description, offerType, userId, categories[]
- **Project**: Contains name, description, userId, blueprintId, categoryId[]
- **Category**: Contains title, alias, description, fields[], type, level, parentId
- **CategoryValue**: Contains category, project/blueprint, userId, value[]

### API Endpoints
- `/api/blueprints` - Blueprint CRUD operations
- `/api/projects` - Project CRUD operations  
- `/api/category` - Category management
- `/api/projects/generate` - Content generation

### Services
- **DeepSeekService**: AI content generation
- **ProjectGeneratorSwitch**: Routes to specific content generators
- **CategoryService**: Category management and validation

### Frontend Components
- Blueprint creation form with streaming progress
- Project creation wizard (3-step process)
- Category selection interface
- Content generation with real-time updates

This flowchart represents the complete system architecture for creating blueprints, projects, and generating categories with AI-powered content creation.
