// This file contains utilities for testing purposes only

import type { EventMap, IMessenger } from "../messenger/IMessenger";
import type { ILogger } from "./Logger";

export class DoNothingMessenger implements IMessenger {

  public static instance: DoNothingMessenger = new DoNothingMessenger();

  dispose(): void {
  }

  on<K extends keyof EventMap>(event: K, handler: (payload: EventMap[K]) => void): void {
  }

  send<K extends keyof EventMap>(event: K, payload: EventMap[K]): void {
  }

  unregister<K extends keyof EventMap>(event: K, handler: (payload: EventMap[K]) => void): void {
  }
}

export class NullLogger implements ILogger {

  public static instance: NullLogger = new NullLogger();

  error(message: string, optionalParams: unknown): void {
  }

  info(message: string, optionalParams: unknown): void {
  }

  warn(message: string, optionalParams: unknown): void {
  }

}
