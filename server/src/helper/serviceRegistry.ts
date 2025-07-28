import { BlueprintValue, ProjectCategoryValue } from "../types/project";

// Service method signature type
export type ServiceMethod = (
  blueprintValue: BlueprintValue[],
  projectCategoryValue: ProjectCategoryValue[],
  ...additionalParams: any[]
) => Promise<string>;

// Service registry interface
export interface ServiceRegistry {
  [key: string]: {
    service: any;
    method: string;
    additionalParams?: any[];
    description?: string;
    category?: string;
    mainCategory?: string;
    categoryId?: string; // Add category ID support
    mainCategoryId?: string; // Add main category ID support
  };
}

// Service registry manager class
export class ServiceRegistryManager {
  private registry: ServiceRegistry = {};

  // Register a new service
  register(
    title: string,
    service: any,
    method: string,
    additionalParams: any[] = [],
    description?: string,
    category?: string
  ) {
    const key = category ? `${category}:${title}` : title;
    this.registry[key] = {
      service,
      method,
      additionalParams,
      description,
      category,
    };
  }

  // Register multiple services at once
  registerBatch(
    services: Array<{
      title: string;
      service: any;
      method: string;
      additionalParams?: any[];
      description?: string;
      category?: string;
    }>
  ) {
    services.forEach(
      ({
        title,
        service,
        method,
        additionalParams = [],
        description,
        category,
      }) => {
        this.register(
          title,
          service,
          method,
          additionalParams,
          description,
          category
        );
      }
    );
  }

  // Get a service configuration
  get(title: string, category?: string) {
    const key = category ? `${category}:${title}` : title;
    return this.registry[key];
  }

  // Get a service by title and category
  getByTitleAndCategory(title: string, category?: string) {
    const key = category ? `${category}:${title}` : title;
    return this.registry[key] || null;
  }

  // Get a service by category ID and main category ID
  getByCategoryId(title: string, categoryId?: string, mainCategoryId?: string) {
    const service = this.registry[title];

    if (!service) {
      return null;
    }

    // If no category ID specified, return the service
    if (!categoryId) {
      return service;
    }

    // If category ID matches, check main category ID
    if (service.categoryId === categoryId) {
      // If no main category ID specified, return the service
      if (!mainCategoryId) {
        return service;
      }

      // If main category ID matches, return the service
      if (service.mainCategoryId === mainCategoryId) {
        return service;
      }

      // If no main category ID specified in service, return it (fallback)
      if (!service.mainCategoryId) {
        return service;
      }

      // If main category ID doesn't match, return null
      return null;
    }

    // If no category ID specified in service, return it (fallback)
    if (!service.categoryId) {
      return service;
    }

    // If category ID doesn't match, return null
    return null;
  }

  // Get a service by category ID and main category title
  getByCategoryIdAndMainCategory(title: string, mainCategory: string) {
    const key = `${mainCategory}:${title}`;
    console.log("key", key);
    const service = this.registry[key];
    console.log("service", service);
    if (!service) {
      return null;
    }

    // Return the service if found
    return service;
  }

  // Get all registered services
  getAll(): ServiceRegistry {
    return { ...this.registry };
  }

  // Get services by category
  getByCategory(category: string) {
    return Object.entries(this.registry)
      .filter(([_, config]) => config.category === category)
      .reduce((acc, [title, config]) => {
        acc[title] = config;
        return acc;
      }, {} as ServiceRegistry);
  }


  

  // Get all categories
  getCategories(): string[] {
    const categories = new Set<string>();
    Object.values(this.registry).forEach((config) => {
      if (config.category) {
        categories.add(config.category);
      }
    });
    return Array.from(categories);
  }

  // Get all main categories
  getMainCategories(): string[] {
    const mainCategories = new Set<string>();
    Object.values(this.registry).forEach((config) => {
      if (config.mainCategory) {
        mainCategories.add(config.mainCategory);
      }
    });
    return Array.from(mainCategories);
  }

  // Get all category IDs
  getCategoryIds(): string[] {
    const categoryIds = new Set<string>();
    Object.values(this.registry).forEach((config) => {
      if (config.categoryId) {
        categoryIds.add(config.categoryId);
      }
    });
    return Array.from(categoryIds);
  }

  // Get all main category IDs
  getMainCategoryIds(): string[] {
    const mainCategoryIds = new Set<string>();
    Object.values(this.registry).forEach((config) => {
      if (config.mainCategoryId) {
        mainCategoryIds.add(config.mainCategoryId);
      }
    });
    return Array.from(mainCategoryIds);
  }

  // Check if a service exists
  has(title: string, category?: string): boolean {
    const key = category ? `${category}:${title}` : title;
    return key in this.registry;
  }

  // Remove a service
  remove(title: string, category?: string): boolean {
    const key = category ? `${category}:${title}` : title;
    if (this.has(title, category)) {
      delete this.registry[key];
      return true;
    }
    return false;
  }

  // Clear all services
  clear() {
    this.registry = {};
  }

  // Get service count
  getCount(): number {
    return Object.keys(this.registry).length;
  }

  // Validate service configuration
  validateService(
    title: string,
    category: string
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const key = category ? `${category}:${title}` : title;
    const config = this.registry[key];

    if (!config) {
      const serviceKey = category ? `${category}:${title}` : title;
      return { isValid: false, errors: [`Service "${serviceKey}" not found`] };
    }

    if (!config.service) {
      errors.push("Service object is missing");
    }

    if (!config.method) {
      errors.push("Method name is missing");
    }

    if (config.service && config.method) {
      const methodFunction = config.service[config.method];
      if (typeof methodFunction !== "function") {
        errors.push(`Method "${config.method}" not found on service`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Get all valid services
  getValidServices(): ServiceRegistry {
    const validServices: ServiceRegistry = {};

    Object.entries(this.registry).forEach(([key, config]) => {
      // Extract title from key (remove category prefix if present)
      const title = key.includes(":") ? key.split(":")[1] : key;
      const category = key.includes(":") ? key.split(":")[0] : undefined;

      const validation = this.validateService(title!, category!);
      if (validation.isValid) {
        validServices[key] = config;
      } else {
        console.warn(`Invalid service "${key}":`, validation.errors);
      }
    });

    return validServices;
  }
}

// Create a global instance
export const serviceRegistryManager = new ServiceRegistryManager();

// Helper function to execute a service
export const executeService = async (
  title: string,
  blueprintValues: BlueprintValue[],
  fieldValue: ProjectCategoryValue[],
  mainCategory: string,
  progressCallback?: (chunk: string) => void,
  homepageReference?: string
): Promise<string | null> => {
  // Try category ID and main category title lookup first, then fall back to title-based lookup
  let config = serviceRegistryManager.getByCategoryIdAndMainCategory(
    title,
    mainCategory
  );

  if (!config) {
    console.warn(
      `No service found for title: "${title}"${
        mainCategory ? ` and main category: "${mainCategory}"` : ""
      }`
    );
    return null;
  }

  const validation = serviceRegistryManager.validateService(
    title,
    mainCategory!
  );
  if (!validation.isValid) {
    console.error(`Invalid service "${title}":`, validation.errors);
    return null;
  }

  try {
    const { service, method, additionalParams = [] } = config;
    const methodFunction = service[method] as ServiceMethod;

    // Call the method with appropriate parameters
    const result = await methodFunction.call(
      service,
      blueprintValues,
      fieldValue,
      ...additionalParams,
      progressCallback,
      homepageReference
    );

    return result;
  } catch (error) {
    console.error(`Error executing service "${title}":`, error);
    return null;
  }
};

// Helper function to create progress callback
export const createProgressCallback = (sendSSE: (data: any) => void) => {
  return (chunk: string) => {
    sendSSE({
      type: "ai_chunk",
      content: chunk,
      progress: 85,
    });
  };
};
