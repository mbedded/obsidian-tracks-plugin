import type { IMessenger, EventMap } from "./IMessenger";
import { type ILogger } from "../utils/Logger";

/**
 * SimpleMessenger is a utility class designed to manage event-based communication.
 * It allows for registration of listeners for specific events and the dispatching of payloads to those listeners.
 * Please note that we're using type-safe events by using the EventMap to define events and the argument types.
 */
export class SimpleMessenger implements IMessenger {

  public constructor(private readonly logger: ILogger) {
  }

  private listeners: {
    [K in keyof EventMap]?: Array<(payload: EventMap[K]) => void>;
  } = {};


  public on<K extends keyof EventMap>(event: K, handler: (payload: EventMap[K]) => void): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(handler);
  };

  public send<K extends keyof EventMap>(event: K, payload: EventMap[K]): void {
    this.logger.info(`Invoke ${event}`)
    const handlers = this.listeners[event];
    if (!handlers) {
      return;
    }

    for (const handler of handlers) {
      handler(payload);
    }
  }

  public unregister<K extends keyof EventMap>(event: K, handler: (payload: EventMap[K]) => void): void {
    const handlers = this.listeners[event];
    if (!handlers) {
      return;
    }
    const filteredHandlers = handlers.filter((registeredHandler) => registeredHandler !== handler);
    this.listeners[event] = filteredHandlers as typeof this.listeners[K];
  }

  public dispose() {
    this.listeners = {};
  }
}
