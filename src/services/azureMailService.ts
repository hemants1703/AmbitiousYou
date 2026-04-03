import { EmailClient } from "@azure/communication-email";

export default class AzureMailService {
  emailClient: EmailClient;

  constructor() {
    const CONNECTION_STRING = process.env.AZURE_CONNECTION_STRING;

    if (!CONNECTION_STRING) {
      throw new Error("AZURE_CONNECTION_STRING is not set");
    }

    this.emailClient = new EmailClient(CONNECTION_STRING);
  }

  async sendEmail(address: string, subject: string, plainText: string): Promise<boolean | Error> {
    const POLLER_WAIT_TIME = 10;

    try {
      const message = {
        senderAddress: "donotreply@ambitiousyou.pro",
        content: { subject, plainText },
        recipients: {
          to: [{ address }],
        },
      };

      const poller = await this.emailClient.beginSend(message);

      if (poller.getOperationState().status === "notStarted") {
        throw new Error("Poller was not started");
      }

      let timeElapsed = 0;
      while (!poller.isDone()) {
        poller.poll();
        console.log("Email send polling in progess...");

        await new Promise((resolve) => setTimeout(resolve, POLLER_WAIT_TIME * 1000));
        timeElapsed += 10;

        if (timeElapsed > 18 * POLLER_WAIT_TIME) {
          throw new Error("Email send polling timed out");
        } else if (poller.getResult()?.error) {
          throw poller.getResult()?.error;
        }
      }

      return true;
    } catch (error) {
      console.error("Error sending email: ", error);
      return new Error("Error sending email");
    }
  }

  async sendHtmlEmail(address: string, subject: string, html: string): Promise<boolean | Error> {
    const POLLER_WAIT_TIME = 10;

    try {
      const message = {
        senderAddress: "donotreply@ambitiousyou.pro",
        content: { subject, html },
        recipients: {
          to: [{ address }],
        },
      };

      const poller = await this.emailClient.beginSend(message);

      if (poller.getOperationState().status === "notStarted") {
        throw new Error("Poller was not started");
      }

      let timeElapsed = 0;
      while (!poller.isDone()) {
        poller.poll();
        console.log("Email send polling in progess...");

        await new Promise((resolve) => setTimeout(resolve, POLLER_WAIT_TIME * 1000));
        timeElapsed += 10;

        if (timeElapsed > 18 * POLLER_WAIT_TIME) {
          throw new Error("Email send polling timed out");
        } else if (poller.getResult()?.error) {
          throw poller.getResult()?.error;
        }
      }

      return true;
    } catch (error) {
      console.error("[Azure Mail Service Error]: ", error);
      return new Error("Error sending email");
    }
  }
}
