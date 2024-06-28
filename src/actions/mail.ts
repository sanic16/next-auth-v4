import { activationTemplate } from "@/email-templates/activation";
import { forgotPasswordTemplate } from "@/email-templates/resetPass";
import Handlebars from "handlebars";
import nodemailer from "nodemailer";

export async function sendMail({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}) {
  const { SENDGRID_API_KEY, MAIL_DEFAULT_SENDER } = process.env;
  const transport = nodemailer.createTransport({
    service: "SendGrid",
    host: "smtp.sendgrid.net",
    port: 587,
    auth: {
      user: "apikey",
      pass: SENDGRID_API_KEY,
    },
  });

  try {
    const testResult = await transport.verify();
    console.log("Test Result of the transport:", testResult);
  } catch (error) {
    console.error(error);
  }
  try {
    const sendResult = await transport.sendMail({
      from: MAIL_DEFAULT_SENDER,
      to: to,
      subject: subject,
      text: body,
      html: body,
    });
    console.log("Send Result of the transport:", sendResult);
  } catch (error) {
    console.error(error);
  }
}

export function compileActivationTemplate(name: string, url: string) {
  const template = Handlebars.compile(activationTemplate);
  const htmlBody = template({
    name: name,
    url: url,
  });
  return htmlBody;
}

export function compileResetPassTemplate(name: string, url: string) {
  const template = Handlebars.compile(forgotPasswordTemplate);
  const htmlBody = template({
    name: name,
    url: url,
  });
  return htmlBody;
}
