# Simple Notification - Javascript

You know that moment you just want to know when something happened in your services? Like user subscription events, downtime, a specific error, you name it. Imagine getting notifications like this directly in your pocket via something like Discord or Telegram. Or in your team Clickup or Slack chat.

What if you want to send this message in multiple chats on different platforms, or even send an email with attachments through a service like Mailgun or Resend at the same time.

Simple Notification\* tries to make this easier, instead of downloading multiple SDKs or implementing the API call yourself, now you can download one simple package and have an easy way to send a message or an e-mail through different services.

\*Lacking features, still in development. Basic usage already available

## Table of Contents

- [On the roadmap](#on-the-roadmap)
- [Installing](#installing)
- [Example Usage](#example-usage)
- [Configuration](#configuration)
- [TypeScript Support](#typescript-support)

## On the roadmap

- Attachment support on more services
- Support to Custom Clients
- Multi-Platform Client (Call multiple Clients at once)
- Templates
- Retry on error

## Installing

Note: The package is not yet published, treat this as an early version.

You can download it via NPM

```
npm install https://github.com/guigiusti/simple-notification

```

Or via Bun:

```
bun add https://github.com/guigiusti/simple-notification-js

# For now this is not coming from a package registry, so you will probably also need to run:

bun pm trust simple-notification

# This will allow it to run the "prepare" script

```

## Example Usage

```
import { TelegramClient } from "simple-notification";

const client = new TelegramClient();

client.sendMessage("Hello, world!");
```

## Configuration

| Service           | Client name             | Environment variables                                     |
| ----------------- | ----------------------- | --------------------------------------------------------- |
| Telegram          | TelegramClient          | TELEGRAM_BOT_TOKEN, TELEGRAM_CHANNEL                      |
| Slack             | SlackClient             | SLACK_BOT_TOKEN, SLACK_CHANNEL                            |
| Discord (bot)     | DiscordBotClient        | DISCORD_BOT_TOKEN, DISCORD_CHANNEL_ID                     |
| Discord (webhook) | DiscordWebhookClient    | DISCORD_WEBHOOK_URL                                       |
| ClickUp           | ClickUpClient (future?) | CLICKUP_API_KEY, CLICKUP_WORKSPACE_ID, CLICKUP_CHANNEL_ID |
| Mailgun           | MailgunClient           | MAILGUN_API_KEY, MAILGUN_DOMAIN                           |
| Resend            | ResendClient            | RESEND_API_KEY                                            |

## Typescript Support

Usage on typescript is natively supported. You can also create a custom client by importing the base class and response type.

```
import { SimpleNotificationBaseClient } from "simple-notification";
import type { SimpleNotificationResponse } from "simple-notification";

export class ExampleClient extends SimpleNotificationBaseClient {
  private readonly api_url = "https://api.example.com";
  constructor(api_key: string) {
    super(api_key);
  }
  protected async request(
    message: string
  ): Promise<SimpleNotificationResponse> {
    const response = await fetch(this.api_url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.api_key}`,
      },
      body: JSON.stringify({ message }),
    });
    return this.result(response.ok, response.statusText, response.status);
  }
  async sendMessage(message: string) {
    return this.request(message);
  }
}

```
