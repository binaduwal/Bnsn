import { Response } from "express";
import { BlueprintValue, ProjectCategoryValue } from "../types/project";
import { executeService, createProgressCallback, serviceRegistryManager } from "./serviceRegistry";
import { registerAllServices } from "./serviceRegistration";

interface ProjectGenerationTask {
    title: string;
    blueprintValues: BlueprintValue[];
    fieldValue: ProjectCategoryValue[];
    priority?: number;
    dependencies?: string[];
    mainCategory:string;
}

interface ContinuousGenerationConfig {
    tasks: ProjectGenerationTask[];
    parallel?: boolean;
    maxConcurrent?: number;
    onTaskStart?: (task: ProjectGenerationTask) => void;
    onTaskComplete?: (task: ProjectGenerationTask, result: string) => void;
    onTaskError?: (task: ProjectGenerationTask, error: any) => void;
    onProgress?: (completed: number, total: number, currentTask?: string) => void;
}

interface GenerationResult {
    title: string;
    content: string | null;
    success: boolean;
    error?: string;
    duration: number;
}

// Initialize services
registerAllServices();

// Continuous project generation class
export class ContinuousProjectGenerator {
    private isRunning = false;
    private currentTasks: Set<string> = new Set();

    /**
     * Generate content for a single task
     */
    async generateSingleTask(
        task: ProjectGenerationTask,
        sendSSE: (data: any) => void
    ): Promise<GenerationResult> {
        const startTime = Date.now();
        
        try {
            const progressCallback = createProgressCallback(sendSSE);
            
            sendSSE({
                type: "task_start",
                title: task.title,
                message: `Starting generation for ${task.title}`
            });

            const result = await executeService(
                task.title,
                task.blueprintValues,
                task.fieldValue,
                task.mainCategory,
                progressCallback,
     
            );

            const duration = Date.now() - startTime;
            
            sendSSE({
                type: "task_complete",
                title: task.title,
                message: `Completed generation for ${task.title}`,
                duration
            });

            return {
                title: task.title,
                content: result,
                success: true,
                duration
            };
        } catch (error) {
            const duration = Date.now() - startTime;
            
            sendSSE({
                type: "task_error",
                title: task.title,
                message: `Error generating ${task.title}: ${error}`,
                duration
            });

            return {
                title: task.title,
                content: null,
                success: false,
                error: error instanceof Error ? error.message : String(error),
                duration
            };
        }
    }

    /**
     * Generate content for multiple tasks sequentially
     */
    async generateSequentially(
        config: ContinuousGenerationConfig,
        sendSSE: (data: any) => void
    ): Promise<GenerationResult[]> {
        const results: GenerationResult[] = [];
        const { tasks, onTaskStart, onTaskComplete, onTaskError, onProgress } = config;

        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i];
            
            if (task && onTaskStart) onTaskStart(task);
            if (task && onProgress) onProgress(i, tasks.length, task.title);

            if (task) {
                const result = await this.generateSingleTask(task, sendSSE);
                results.push(result);

                if (result.success && onTaskComplete) {
                    onTaskComplete(task, result.content!);
                } else if (!result.success && onTaskError) {
                    onTaskError(task, result.error);
                }
            }
        }

        if (onProgress) onProgress(tasks.length, tasks.length);

        return results;
    }

    /**
     * Generate content for multiple tasks in parallel
     */
    async generateInParallel(
        config: ContinuousGenerationConfig,
        sendSSE: (data: any) => void
    ): Promise<GenerationResult[]> {
        const { tasks, maxConcurrent = 3, onTaskStart, onTaskComplete, onTaskError, onProgress } = config;
        const results: GenerationResult[] = [];
        let completed = 0;

        // Process tasks in batches
        for (let i = 0; i < tasks.length; i += maxConcurrent) {
            const batch = tasks.slice(i, i + maxConcurrent);
            const batchPromises = batch.map(async (task) => {
                if (onTaskStart) onTaskStart(task);
                
                const result = await this.generateSingleTask(task, sendSSE);
                completed++;
                
                if (onProgress) onProgress(completed, tasks.length, task.title);
                
                if (result.success && onTaskComplete) {
                    onTaskComplete(task, result.content!);
                } else if (!result.success && onTaskError) {
                    onTaskError(task, result.error);
                }
                
                return result;
            });

            const batchResults = await Promise.all(batchPromises);
            results.push(...batchResults);
        }

        return results;
    }

    /**
     * Generate content with dependency resolution
     */
    async generateWithDependencies(
        config: ContinuousGenerationConfig,
        sendSSE: (data: any) => void
    ): Promise<GenerationResult[]> {
        const { tasks } = config;
        const results: GenerationResult[] = [];
        const completed = new Set<string>();
        const taskMap = new Map(tasks.map(task => [task.title, task]));

        // Helper function to check if dependencies are met
        const dependenciesMet = (task: ProjectGenerationTask): boolean => {
            if (!task.dependencies) return true;
            return task.dependencies.every(dep => completed.has(dep));
        };

        // Helper function to get available tasks
        const getAvailableTasks = (): ProjectGenerationTask[] => {
            return tasks.filter(task => 
                !completed.has(task.title) && 
                dependenciesMet(task)
            );
        };

        while (completed.size < tasks.length) {
            const availableTasks = getAvailableTasks();
            
            if (availableTasks.length === 0) {
                // Circular dependency or missing dependency
                const remainingTasks = tasks.filter(task => !completed.has(task.title));
                throw new Error(`Cannot resolve dependencies for remaining tasks: ${remainingTasks.map(t => t.title).join(', ')}`);
            }

            // Process available tasks in parallel
            const batchPromises = availableTasks.map(async (task) => {
                const result = await this.generateSingleTask(task, sendSSE);
                completed.add(task.title);
                return result;
            });

            const batchResults = await Promise.all(batchPromises);
            results.push(...batchResults);
        }

        return results;
    }

    /**
     * Main generation method
     */
    async generate(
        config: ContinuousGenerationConfig,
        sendSSE: (data: any) => void
    ): Promise<GenerationResult[]> {
        if (this.isRunning) {
            throw new Error("Generation already in progress");
        }

        this.isRunning = true;

        try {
            sendSSE({
                type: "generation_start",
                message: `Starting continuous generation of ${config.tasks.length} tasks`,
                total: config.tasks.length
            });

            let results: GenerationResult[];

            if (config.parallel) {
                results = await this.generateInParallel(config, sendSSE);
            } else {
                results = await this.generateSequentially(config, sendSSE);
            }

            const successful = results.filter(r => r.success).length;
            const failed = results.filter(r => !r.success).length;

            sendSSE({
                type: "generation_complete",
                message: `Completed generation: ${successful} successful, ${failed} failed`,
                results: {
                    total: results.length,
                    successful,
                    failed
                }
            });

            return results;
        } finally {
            this.isRunning = false;
        }
    }

    /**
     * Get available services for generation
     */
    getAvailableServices(): string[] {
        return Object.keys(serviceRegistryManager.getAll());
    }

    /**
     * Get services by category
     */
    getServicesByCategory(category: string): string[] {
        const services = serviceRegistryManager.getByCategory(category);
        return Object.keys(services);
    }

    /**
     * Get all categories
     */
    getCategories(): string[] {
        return serviceRegistryManager.getCategories();
    }

    /**
     * Validate a task before generation
     */
    validateTask(task: ProjectGenerationTask): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (!task.title) {
            errors.push("Task title is required");
        }

        if (!serviceRegistryManager.has(task.title)) {
            errors.push(`Service "${task.title}" not found`);
        }

        if (!task.blueprintValues || task.blueprintValues.length === 0) {
            errors.push("Blueprint values are required");
        }

        if (!task.fieldValue || task.fieldValue.length === 0) {
            errors.push("Field values are required");
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Check if generation is currently running
     */
    isCurrentlyRunning(): boolean {
        return this.isRunning;
    }

    /**
     * Stop current generation
     */
    stop(): void {
        this.isRunning = false;
    }
}

// Export a singleton instance
export const continuousProjectGenerator = new ContinuousProjectGenerator(); 