/* eslint-disable import/no-anonymous-default-export */
import { MyAuthenticationProvider } from "../../../../../utils/customAuthProvider";
import { Client } from "@microsoft/microsoft-graph-client";

export default async (_, res) => {
  if (!_.query.filter) {
    _.query.filter = "";
  }

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

  try {
    const client = Client.initWithMiddleware(clientOptions);
    const mailboxes = await (
      await client
        .api(`${_.query.tenantid}/Mailbox`)
        .filter(_.query.filter)
        .get()
    ).value;
    res.status(200).json(mailboxes);
  } catch (error) {
    res.status(500).send({
      errorMessage: error,
    });
  }
};