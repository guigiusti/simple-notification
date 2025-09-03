import {
  SimpleNotificationBaseClient,
  SimpleNotificationResponse,
} from "./client";

export class MailgunClient extends SimpleNotificationBaseClient {
  private readonly api_url: string;
  constructor(
    region: "us" | "eu" = "us",
    domain = process.env.MAILGUN_DOMAIN,
    api_key = process.env.MAILGUN_API_KEY
  ) {
    if (!api_key) {
      throw new Error("MAILGUN_API_KEY missing");
    }
    if (!domain) {
      throw new Error("MAILGUN_DOMAIN missing");
    }
    super(api_key);
    this.api_url =
      region === "us"
        ? `https://api.mailgun.net/v3/${domain}/messages`
        : `https://api.eu.mailgun.net/v3/${domain}/messages`;
  }
  protected async request(body: FormData): Promise<SimpleNotificationResponse> {
    const response = await fetch(this.api_url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(`api:${this.api_key}`)}`,
      },
      body: body,
    });
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
      response.statusText || data.message,
      response.status
    );
  }
  public async sendEmail(email: {
    from: string;
    to: string;
    subject: string;
    cc?: string[];
    bcc?: string[];
    text?: string;
    html?: string;
    attachments?: {
      filename: string;
      content: Buffer | string;
    }[];
  }): Promise<SimpleNotificationResponse> {
    const formData = new FormData();
    formData.append("from", email.from);
    formData.append("to", email.to);
    formData.append("subject", email.subject);
    if (email.html) formData.append("html", email.html);
    if (email.cc) formData.append("cc", email.cc.join(","));
    if (email.bcc) formData.append("bcc", email.bcc.join(","));
    if (email.text) formData.append("text", email.text);
    if (email.attachments) {
      email.attachments.forEach((attachment) => {
        const attachmentPart =
          typeof attachment.content === "string"
            ? attachment.content
            : new Uint8Array(attachment.content);
        formData.append(
          "attachment",
          new Blob([attachmentPart]),
          attachment.filename
        );
      });
    }
    return this.request(formData);
  }
}
