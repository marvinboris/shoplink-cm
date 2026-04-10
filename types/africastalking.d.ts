declare module 'africastalking' {
  interface AfricasTalkingOptions {
    apiKey: string;
    username: string;
  }

  interface SMSOptions {
    to: string | string[];
    message: string;
    from?: string;
  }

  interface SMSResult {
    SMSMessageData: {
      Message: string;
      Recipients: Array<{
        number: string;
        status: string;
        cost: string;
        messageId: string;
      }>;
    };
  }

  interface AfricasTalkingInstance {
    SMS: {
      send(options: SMSOptions): Promise<SMSResult>;
    };
  }

  function AfricasTalking(options: AfricasTalkingOptions): AfricasTalkingInstance;

  export default AfricasTalking;
}
