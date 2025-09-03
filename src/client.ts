export type SimpleNotificationResponse = {
  status: "success" | "error";
  message: string;
  statusCode: number;
  data?: any;
};

export abstract class SimpleNotificationBaseClient {
  protected readonly api_key: string | undefined;

  constructor(api_key?: string) {
    this.api_key = api_key;
  }

  protected result(
    ok: boolean,
    message: string,
    statusCode: number,
    data?: any
  ): SimpleNotificationResponse {
    if (data) {
      return {
        status: ok ? "success" : "error",
        message,
        statusCode,
        data,
      };
    }
    return {
      status: ok ? "success" : "error",
      message,
      statusCode,
    };
  }
  protected abstract request(
    ...args: any[]
  ): Promise<SimpleNotificationResponse>;
}
