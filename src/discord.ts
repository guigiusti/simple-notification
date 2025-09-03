import {
  SimpleNotificationBaseClient,
  SimpleNotificationResponse,
} from "./client";

export class DiscordBotClient extends SimpleNotificationBaseClient {
  private static readonly api_url = "https://discord.com/api/v10/";
  private readonly channelId: string;
  constructor(
    token = process.env.DISCORD_BOT_TOKEN,
    channelId = process.env.DISCORD_CHANNEL_ID
  ) {
    if (!token) {
      throw new Error("DISCORD_BOT_TOKEN missing");
    }
    if (!channelId) {
      throw new Error("DISCORD_CHANNEL_ID missing");
    }
    super(token);
    this.channelId = channelId;
  }
  protected async request(body: any): Promise<SimpleNotificationResponse> {
    const response = await fetch(
      `${DiscordBotClient.api_url}/channels/${this.channelId}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bot ${this.api_key}`,
        },
        body: JSON.stringify(body),
      }
    );
    const text = await response.text();
    const data = text ? JSON.parse(text) : undefined;
    return this.result(
      response.ok,
      response.statusText || data.message,
      response.status
    );
  }
  public async sendMessage(data: {
    content: string;
  }): Promise<SimpleNotificationResponse> {
    return this.request(data);
  }
}

export class DiscordWebhookClient extends SimpleNotificationBaseClient {
  private readonly webhookUrl: string;
  constructor(webhookUrl = process.env.DISCORD_WEBHOOK_URL) {
    if (!webhookUrl) {
      throw new Error("DISCORD_WEBHOOK_URL missing");
    }
    super();
    this.webhookUrl = webhookUrl;
  }
  protected async request(body: any): Promise<SimpleNotificationResponse> {
    const response = await fetch(this.webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const text = await response.text();
    const data = text ? JSON.parse(text) : undefined;
    return this.result(
      response.ok,
      response.statusText || data.message,
      response.status
    );
  }
  public async sendMessage(data: {
    content: string;
  }): Promise<SimpleNotificationResponse> {
    return this.request(data);
  }
}
