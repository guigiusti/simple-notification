import {
  SimpleNotificationBaseClient,
  SimpleNotificationResponse,
} from "./client";

export class ResendClient extends SimpleNotificationBaseClient {
  private static readonly api_url = "https://api.resend.com/emails";
  constructor(api_key = process.env.RESEND_API_KEY) {
    super(api_key);
  }
  protected async request(body: any): Promise<SimpleNotificationResponse> {
    const response = await fetch(`${ResendClient.api_url}`, {
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
      response.ok,
      data.message || response.statusText,
      response.status
    );
  }
  public async sendEmail(email: {
    from: string;
    to: string;
    subject: string;
    cc?: string | string[];
    bcc?: string | string[];
    scheduled_at?: string;
    reply_to?: string | string[];
    html?: string;
    text?: string;
    headers?: Record<string, string>;
    attachments?: {
      filename: string;
      content?: Buffer | string;
      path?: string;
      content_type?: string;
    }[];
    tags?: string | string[];
  }): Promise<SimpleNotificationResponse> {
    return this.request(email);
  }
}
