// This file contains the data-classes to interact with any service.
export class TaskItem {
  public readonly id: number;
  public readonly title: string;
  public readonly contextId: number;

  constructor(id: number, title: string, contextId: number) {
    this.id = id;
    this.title = title;
    this.contextId = contextId;
  }
}

export class ContextItem {
  public readonly id: number;
  public readonly name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}

export class PingResult {
  isReachable: boolean;
  isAuthenticated: boolean;
  message: string;

  constructor(isReachable: boolean, isAuthenticated: boolean, message: string = "") {
    this.isReachable = isReachable;
    this.isAuthenticated = isAuthenticated;
    this.message = message;
  }

  public isOk(): boolean {
    return this.isReachable && this.isAuthenticated;
  }
}
