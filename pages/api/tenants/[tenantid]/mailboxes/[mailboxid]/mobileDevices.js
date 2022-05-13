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
  const mailboxBase64 = Buffer.from(_.query.mailboxid).toString("base64");
  const mailboxes = await (
    await client
      .api(
        `${_.query.tenantid}/mailbox('${mailboxBase64}')/MobileDevice/Exchange.GetMobileDeviceStatistics()?IsEncoded=True`
      )
      .get()
  ).value;
  res.status(200).json(mailboxes);
};