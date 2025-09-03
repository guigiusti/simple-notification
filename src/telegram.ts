import {
  SimpleNotificationBaseClient,
  SimpleNotificationResponse,
} from "./client";

export class TelegramClient extends SimpleNotificationBaseClient {
  private readonly url: string;
  private readonly channelId: string;
  private static readonly api_url = "https://api.telegram.org/bot";
  constructor(
    api_key = process.env.TELEGRAM_BOT_TOKEN,
    channelId = process.env.TELEGRAM_CHANNEL
  ) {
    if (!api_key) {
      throw new Error("TELEGRAM_BOT_TOKEN missing");
    }
    if (!channelId) {
      throw new Error("TELEGRAM_CHANNEL missing");
    }
    super(api_key);
    this.url = `${TelegramClient.api_url}${api_key}`;
    this.channelId = channelId;
  }
  protected async request(endpoint: string, body: any, isFile = false) {
    const headers: Record<string, string> = {};
    if (!isFile) {
      headers["Content-Type"] = "application/json";
    }
    const response = await fetch(`${this.url}/${endpoint}`, {
      method: "POST",
      headers,
      body: isFile ? (body as any) : JSON.stringify(body),
    });
    const text = await response.text();
    const data = text ? JSON.parse(text) : undefined;
    return this.result(
      response.ok && data.ok,
      data.description || response.statusText,
      response.status
    );
  }
  public async sendMessage(
    message: string,
    parseMode?: "HTML" | "Markdown" | "MarkdownV2"
  ): Promise<SimpleNotificationResponse> {
    return this.request("sendMessage", {
      chat_id: this.channelId,
      text: message,
      parse_mode: parseMode,
    });
  }
  public async sendPhotoUrl(
    photo: string,
    caption?: string
  ): Promise<SimpleNotificationResponse> {
    return this.request("sendPhoto", {
      chat_id: this.channelId,
      photo: photo,
      caption: caption,
    });
  }
  public async sendPhotoFile(
    photo: Blob | Buffer,
    caption?: string
  ): Promise<SimpleNotificationResponse> {
    const formData = new FormData();
    formData.append("chat_id", this.channelId);
    formData.append("photo", new Blob([photo]), "image");
    if (caption) formData.append("caption", caption);

    return this.request("sendPhoto", formData, true);
  }
  public async sendDocumentUrl(
    document: string,
    caption?: string
  ): Promise<SimpleNotificationResponse> {
    return this.request("sendDocument", {
      chat_id: this.channelId,
      document: document,
      caption: caption,
    });
  }
  public async sendDocumentFile(
    document: Blob | Buffer,
    filename: string,
    caption?: string
  ): Promise<SimpleNotificationResponse> {
    const formData = new FormData();
    formData.append("chat_id", this.channelId);
    formData.append("document", new Blob([document]), filename);
    if (caption) formData.append("caption", caption);
    return this.request("sendDocument", formData, true);
  }
}
