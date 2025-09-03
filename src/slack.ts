import {
  SimpleNotificationBaseClient,
  SimpleNotificationResponse,
} from "./client";

export class SlackClient extends SimpleNotificationBaseClient {
  private readonly channelId: string;
  private static readonly api_url = "https://slack.com/api";
  constructor(
    token = process.env.SLACK_BOT_TOKEN,
    channelId = process.env.SLACK_CHANNEL
  ) {
    if (!token) {
      throw new Error("SLACK_BOT_TOKEN missing");
    }
    if (!channelId) {
      throw new Error("SLACK_CHANNEL missing");
    }
    super(token);
    this.channelId = channelId;
  }
  protected async request(
    endpoint: string,
    body: any
  ): Promise<SimpleNotificationResponse> {
    const response = await fetch(`${SlackClient.api_url}/${endpoint}`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.api_key}`,
      },
    });
    const text = await response.text();
    const data = text ? JSON.parse(text) : undefined;
    return this.result(
      response.ok && data.ok,
      data.error || response.statusText,
      response.status
    );
  }
  public async sendMessage(
    message: string
  ): Promise<SimpleNotificationResponse> {
    return this.request("chat.postMessage", {
      channel: this.channelId,
      text: message,
    });
  }
}
