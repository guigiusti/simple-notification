import {
  SimpleNotificationBaseClient,
  SimpleNotificationResponse,
} from "./client";

export class ClickupClient extends SimpleNotificationBaseClient {
  private static readonly api_url =
    "https://api.clickup.com/api/v3/workspaces/";
  private readonly workspaceId: string;
  private readonly channelId: string | undefined;
  constructor(
    channelId = process.env.CLICKUP_CHANNEL_ID,
    token = process.env.CLICKUP_API_KEY,
    workspaceId = process.env.CLICKUP_WORKSPACE_ID
  ) {
    if (!token) {
      throw new Error("CLICKUP_API_KEY missing");
    }
    if (!workspaceId) {
      throw new Error("CLICKUP_WORKSPACE_ID missing");
    }
    super(token);
    this.workspaceId = workspaceId;
    this.channelId = channelId;
  }
  protected async request(
    endpoint?: string,
    method?: "GET" | "POST",
    headers?: Record<string, string>,
    body?: any
  ): Promise<SimpleNotificationResponse> {
    const response = await fetch(
      `${ClickupClient.api_url}${this.workspaceId}/${endpoint}`,
      {
        headers: {
          Authorization: `${this.api_key}`,
          ...headers,
        },
        body: method === "POST" ? JSON.stringify(body) : undefined,
        method: method,
      }
    );
    const text = await response.text();
    const data = text ? JSON.parse(text) : undefined;
    if (!response.ok) {
      return this.result(
        response.ok,
        data.message || response.statusText,
        response.status
      );
    }
    return this.result(
      response.ok,
      data.message || response.statusText,
      response.status,
      method === "GET"
        ? data.data.map((channel: any) => ({
            id: channel.id,
            name: channel.name,
            type: channel.type,
            visibility: channel.visibility,
          }))
        : undefined
    );
  }
  public async getChannels(): Promise<SimpleNotificationResponse> {
    return this.request("chat/channels", "GET");
  }
  public async sendMessage(
    message: string
  ): Promise<SimpleNotificationResponse> {
    const body = {
      type: "message",
      content: message,
      comment_parts: [
        {
          type: "text",
          text: message,
        },
      ],
    };
    const headers = {
      "Content-Type": "application/json",
    };
    return this.request(
      `chat/channels/${this.channelId}/messages`,
      "POST",
      headers,
      body
    );
  }
}
