import { ContextItem, PingResult, TaskItem } from "./TaskClasses";

/**
 * This interface defines the general interfaces for adapters, so any
 * task-list-endpoint could be added in the future.
 */
export interface ITaskAdapter {

  /**
   * @return A human-readable name for the adapter.
   */
  getDisplayInfo(): string;

  /**
   * Sends a ping request to verify connectivity or the responsiveness of a service.
   *
   * @return {Promise<PingResult>} A promise that resolves with the result of the ping operation, containing details
   * about the response such as the status and latency, or rejects if the operation fails.
   */
  ping(): Promise<PingResult>;

  /**
   * Retrieves a list of active contexts asynchronously.
   *
   * @return {Promise<Context[]>} A promise that resolves to an array of context objects.
   */
  getActiveContexts(): Promise<ContextItem[]>;

  /**
   * Retrieves a list of tasks for a given context.
   *
   * @return {Promise<TaskItem[]>} A promise that resolves to an array of task objects.
   */
  getActiveTasks(contextId: number): Promise<TaskItem[]>

  /**
   * Toggles the state of a specific task between active and completed.
   *
   * @param {number} taskId - The unique identifier of the task to toggle..
   * @return {Promise<boolean>} A promise that resolves to a boolean indicating whether the operation was successful.
   */
  toggleTaskState(taskId: number): Promise<boolean>

  /**
   * Creates a new task using the specified context.
   *
   * @param {number} contextId - The ID of the context to add the task to.
   * @param {string} title - The title of the new task.
   * @param {string} description - Additional notes/text of the new task..
   * @return {Promise<TaskItem>} A promise that resolves to the newly created TaskItem.
   */
  createTask(contextId: number, title: string, description: string): Promise<TaskItem>

  /**
   * Deletes a specific task.
   *
   * @param {number} taskId - The unique identifier of the task to delete.
   * @return {Promise<boolean>} A promise that resolves to a boolean indicating whether the operation was successful.
   */
  deleteTask(taskId: number): Promise<boolean>

  /**
   * Updates a specific task.
   *
   * @param {number} taskId - The unique identifier of the task to update.
   @param {number} contextId - New ID of the context to add the task to.
   * @param {string} title - The new title of the task.
   * @param {string} description - New notes/text of the task.
   * @return {Promise<TaskItem>} A promise that resolves to the updated TaskItem.
   */
  updateTask(taskId: number, contextId: number, title: string, description: string): Promise<TaskItem>;
}
