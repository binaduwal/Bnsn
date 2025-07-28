# Dynamic Project Generation System

This system provides a flexible and extensible way to generate content using various AI services. The architecture is designed to be maintainable, scalable, and easy to extend.

## Architecture Overview

### 1. Service Registry (`serviceRegistry.ts`)
- **Purpose**: Manages all available services dynamically
- **Features**:
  - Dynamic service registration
  - Service validation
  - Category-based organization
  - Error handling and logging

### 2. Service Registration (`serviceRegistration.ts`)
- **Purpose**: Centralized place to register all services
- **Features**:
  - Organized by categories (Email, Content, Pages, etc.)
  - Metadata for each service (description, category)
  - Easy to add new services

### 3. Continuous Project Generator (`continuousProjectGenerator.ts`)
- **Purpose**: Handles multiple generation tasks
- **Features**:
  - Sequential and parallel execution
  - Dependency resolution
  - Progress tracking
  - Error handling per task

### 4. Dynamic Switch (`projectGeneratorSwitch.ts`)
- **Purpose**: Replaces the large switch statement with dynamic service lookup
- **Features**:
  - Automatic service discovery
  - Fallback handling
  - Consistent error reporting

## Usage Examples

### Single Project Generation
```typescript
import { generatedContent } from './projectGeneratorSwitch';

const result = await generatedContent({
  blueprintValues,
  fieldValue,
  res,
  title: "Content Email Generator",
  sendSSE
});
```

### Continuous Project Generation
```typescript
import { continuousProjectGenerator } from './continuousProjectGenerator';

const config = {
  tasks: [
    {
      title: "Content Email Generator",
      blueprintValues,
      fieldValue,
    },
    {
      title: "Landing Page Generator", 
      blueprintValues,
      fieldValue,
    }
  ],
  parallel: true,
  maxConcurrent: 3
};

const results = await continuousProjectGenerator.generate(config, sendSSE);
```

### Adding a New Service

1. **Create the service file** (e.g., `newService.ts`):
```typescript
import { DeepSeekService } from "../deepseek";
import { BlueprintValue, ProjectCategoryValue } from "../../types/project";

class NewService extends DeepSeekService {
  async generateNewContentStream(
    blueprintValue: BlueprintValue[],
    projectCategoryValue: ProjectCategoryValue[],
    onProgress?: (chunk: string) => void
  ): Promise<string> {
    // Your implementation here
  }
}

export const newService = new NewService();
```

2. **Register the service** in `serviceRegistration.ts`:
```typescript
serviceRegistryManager.registerBatch([
  {
    title: "New Content Generator",
    service: newService,
    method: "generateNewContentStream",
    category: "Content",
    description: "Generate new type of content"
  }
]);
```

## API Endpoints

### Single Generation
- **POST** `/api/projects/generate`
- **Body**: `{ category, project, values, blueprintId, currentCategory }`

### Continuous Generation
- **POST** `/api/projects/generate-continuous`
- **Body**: 
```json
{
  "tasks": [
    {
      "title": "Content Email Generator",
      "category": "Email",
      "values": { "key": "value" }
    }
  ],
  "blueprintId": "blueprint_id",
  "parallel": false,
  "maxConcurrent": 3
}
```

### Get Available Services
- **GET** `/api/projects/services`
- **Response**: List of all available services organized by category

## Benefits

1. **Maintainability**: No more large switch statements
2. **Extensibility**: Easy to add new services
3. **Organization**: Services grouped by categories
4. **Error Handling**: Consistent error reporting
5. **Performance**: Parallel execution support
6. **Monitoring**: Detailed progress tracking
7. **Validation**: Service validation before execution

## Service Categories

- **Email**: Email generators
- **Content**: Articles, blog posts
- **Pages**: Landing pages, web pages
- **LinkedIn**: LinkedIn profile content
- **Sales Funnel**: Sales funnel components
- **Big Ideas**: Big idea generators
- **Books**: Book-related content
- **Bonuses**: Bonus creators
- **Branding**: Brand identity
- **Upsells**: Upsell generators
- **Webinars**: Webinar content
- **Advertorials**: Advertorial content
- **Order Bumps**: Order bump copy
- **PR**: Press releases
- **Advertising**: Ad copy
- **Video Sales Letters**: VSL scripts

## Error Handling

The system provides comprehensive error handling:
- Service validation before execution
- Individual task error reporting
- Graceful degradation when services fail
- Detailed error messages for debugging

## Performance Considerations

- **Parallel Execution**: Up to 3 concurrent tasks by default
- **Streaming**: Real-time progress updates
- **Memory Management**: Efficient resource usage
- **Timeout Handling**: Automatic timeout for long-running tasks 