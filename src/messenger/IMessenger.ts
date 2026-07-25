import type { TaskItem } from "../adapters/TaskClasses";

/**
 * Represents a mapping of event names to their associated data types.
 *
 * The EventMap type is used to define the contract for event-based systems,
 * specifying the names of the events and the corresponding data or payload
 * associated with each event.
 */
export type EventMap = {
  reload: void;
  show_notice: string;
  show_notice_error: string;
  task_created: TaskCreatedEventArgs;
  update_task: TaskItem;
  task_updated: TaskUpdatedEventArgs;
};

export type TaskCreatedEventArgs = {
  taskId: number;
  contextId: number;
  title: string;
  // todo: add description
};

export type TaskUpdatedEventArgs = {
  taskId: number;
  contextId: number;
  title: string;
  // todo: add description
};

/**
 * Interface for a messenger that facilitates event-based communication.
 * Allows registering event listeners and sending events with associated payloads.
 */
export interface IMessenger {

  /**
   * Registers an event handler for a specific event type.
   *
   * @param {K} event - The name of the event to listen for.
   * @param {(payload: EventMap[K]) => void} handler - The callback function that will be triggered when the event occurs. The function receives the event payload as its argument.
   * @return {void} This method does not return a value.
   */
  on<K extends keyof EventMap>(event: K, handler: (payload: EventMap[K]) => void): void;

  /**
   * Sends an event with the specified name and payload to the appropriate handler.
   *
   * @param {K} event - The name of the event to send. Must be a key of the EventMap.
   * @param {EventMap[K]} payload - The data associated with the event, adhering to the type defined in EventMap for the specified event key.
   * @return {void} Does not return a value.
   */
  send<K extends keyof EventMap>(event: K, payload: EventMap[K]): void;

  /**
   * Unregisters an event handler for a specific event type.
   *
   * @param {K} event - The name of the event to unregister the handler from.
   * @param {(payload: EventMap[K]) => void} handler - The event handler function to be removed.
   * @return {void} Indicates that the handler has been successfully unregistered.
   */
  unregister<K extends keyof EventMap>(event: K, handler: (payload: EventMap[K]) => void): void;
}
