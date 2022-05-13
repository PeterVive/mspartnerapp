/* eslint-disable import/no-anonymous-default-export */
import { MyAuthenticationProvider } from "../../../../../../utils/customAuthProvider";
import { Client } from "@microsoft/microsoft-graph-client";

export default async (_, res) => {
  let clientOptions = {
    customHosts: new Set(["outlook.office365.com"]),
    defaultVersion: "beta",
    baseUrl: "https://outlook.office365.com/adminapi/",
    authProvider: new MyAuthenticationProvider(
      _.query.tenantid,
      ["https://outlook.office365.com/.default"],
      false,
      "a0c73c16-a7e3-4564-9a95-2bdf47383716"
    ),
  };

  const client = Client.initWithMiddleware(clientOptions);
  const mailboxes = await client
    .api(`${_.query.tenantid}/Mailbox/${_.query.mailboxid}/MailboxPermission`)
    .get();
  res.status(200).json(mailboxes);
};
