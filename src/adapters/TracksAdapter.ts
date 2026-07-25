import { ContextItem, PingResult, TaskItem } from "./TaskClasses";
import { XMLParser } from "fast-xml-parser";
import type { ITaskAdapter } from "./ITaskAdapter";
import { t } from "../localizer/Localizer";
import type { RequestUrlParam, RequestUrlResponsePromise } from "obsidian";

/**
 * This adapter implements the ITaskAdapter interface for Tracks.
 */
export class TracksAdapter implements ITaskAdapter {

  private readonly xmlParser = new XMLParser({
    ignoreDeclaration: true
  });

  /**
   * Creates a new instance.
   * @param baseUrl The base url to reach Tracks.
   * @param basicToken The basic token (base64) to access Tracks.
   * @param doRequest The method to execute the request. Passed as a parameter to be unit-testable.
   */
  constructor(private baseUrl: string,
              private basicToken: string,
              private doRequest: (request: RequestUrlParam | string) => RequestUrlResponsePromise) {
  }

  public getDisplayInfo(): string {
    return `Tracks (${this.baseUrl})`;
  }

  public async ping(): Promise<PingResult> {
    try {
      await this.doRequest({
        url: `${this.baseUrl}/contexts.xml`,
        method: "GET",
        headers: {
          "Authorization": `Basic ${this.basicToken}`
        }
      });

      return new PingResult(true, true);
    } catch (ex) {
      if (!ex || typeof ex !== "object" || !("status" in ex) || typeof ex.status !== "number") {
        return new PingResult(false, false, "An exception occurred during ping. Returned type is unknown.");
      }

      // 401 = auth failed
      if (ex.status === 401) {
        return new PingResult(true, false);
      }

      // 404 = (task) not found
      if (ex.status === 404) {
        return new PingResult(true, true);
      }

      // 5xx = server error
      if (ex.status >= 500 && ex.status <= 599) {
        const message = t("messages.server-http-error", {code: ex.status.toString()});
        return new PingResult(true, false, message);
      }

      return new PingResult(false, false);
    }
  }

  public async getActiveContexts(): Promise<ContextItem[]> {
    let contextAsJson;
    try {
      const response = await this.doRequest({
        url: `${this.baseUrl}/contexts.xml`,
        method: "GET",
        headers: {
          "Authorization": `Basic ${this.basicToken}`
        }
      });

      contextAsJson = this.xmlParser.parse(response.text);
    } catch (e) {
      // todo: handle error
      console.error("error getting contexts - " + e);
      return [];
    }

    // Array of a single object is returned as a single object
    // instead of using an array. So we need 2 checks: Empty and array.
    let contexts = contextAsJson?.contexts?.context;
    if (!contexts) {
      return [];
    }
    if (!Array.isArray(contexts)) {
      contexts = [contexts];
    }

    return contexts
      .filter((x) => x.state === "active")
      .map((x) => new ContextItem(x["id"], String(x["name"])))
      .sort((a, b) => a.name.localeCompare(b.name));
  }


  public async getActiveTasks(contextId: number): Promise<TaskItem[]> {
    let responseAsXml;
    try {
      const response = await this.doRequest({
        url: `${this.baseUrl}/contexts/${contextId}/todos.xml?limit_to_active_todos=1`,
        method: "GET",
        headers: {
          "Authorization": `Basic ${this.basicToken}`
        }
      });

      responseAsXml = this.xmlParser.parse(response.text);
    } catch (e) {
      // todo: handle error
      console.error("error getting tasks" + e);
      return [];
    }

    // Array of a single object is returned as a single object
    // instead of using an array. So we need 2 checks: Empty and array.
    let tasks = responseAsXml?.todos?.todo;
    if (!tasks) {
      return [];
    }
    if (!Array.isArray(tasks)) {
      tasks = [tasks];
    }

    return tasks.map((x) => new TaskItem(x["id"], String(x["description"]), x["context-id"]));
  }

  public async toggleTaskState(taskId: number): Promise<boolean> {
    try {
      await this.doRequest({
        // We can use this shortcut to toggle the state between active and completed.
        url: `${this.baseUrl}/todos/${taskId}/toggle_check.xml`,
        method: "PUT",
        headers: {
          "Authorization": `Basic ${this.basicToken}`,
          "Content-Type": "text/xml"
        }
      });

    } catch (e) {
      console.error("error toggle todo" + e);
      return false;
    }
    return true;
  }

  public async createTask(contextId: number, title: string, description: string): Promise<TaskItem> {
    try {
      const xmlBody = `<todo>
    <description>${title}</description>
    <context-id>${contextId}</context-id>
    <notes>${description}</notes>
  </todo>`;

      const response = await this.doRequest({
        url: `${this.baseUrl}/todos.xml`,
        method: "POST",
        body: xmlBody,
        headers: {
          "Authorization": `Basic ${this.basicToken}`,
          "Content-Type": "text/xml"
        }
      });

      const location = response.headers.location;
      const parts = location.split("/");
      const newId = parseInt(parts[parts.length - 1], 10);

      return new TaskItem(newId, title, contextId);
    } catch (e) {
      // todo: handle error
      console.error("error creating task: " + e);
      throw e;
    }
  }

  public async deleteTask(taskId: number): Promise<boolean> {
    try {
      await this.doRequest({
        url: `${this.baseUrl}/todos/${taskId}.xml`,
        method: "DELETE",
        headers: {
          "Authorization": `Basic ${this.basicToken}`,
        }
      });
      return true;
    } catch (e) {
      console.error("error deleting task: " + e);
      return false;
    }
  }

  public async updateTask(taskId: number, title: string, description: string, contextId: number): Promise<TaskItem>{
    try {
      const xmlBody = `<todo>
    <description>${title}</description>
    <context-id>${contextId}</context-id>
    <notes>${description}</notes>
  </todo>`;

      await this.doRequest({
        url: `${this.baseUrl}/todos/${taskId}.xml`,
        method: "PUT",
        body: xmlBody,
        headers: {
          "Authorization": `Basic ${this.basicToken}`,
          "Content-Type": "text/xml"
        }
      });

      return new TaskItem(taskId, title, contextId);
    } catch (e) {
      // todo: handle error
      console.error("error updating task: " + e);
      throw e;
    }
  }
}
