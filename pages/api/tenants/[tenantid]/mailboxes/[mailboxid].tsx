/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from "next";
import { MyAuthenticationProvider } from "../../../../../utils/customAuthProvider";
import { Client, ClientOptions } from "@microsoft/microsoft-graph-client";
import { getSession } from "next-auth/react";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (!session) {
    res.status(401).send({ Error: "Not authorized." });
    return;
  }

  let clientOptions: ClientOptions = {
    customHosts: new Set(["outlook.office365.com"]),
    defaultVersion: "beta",
    baseUrl: "https://outlook.office365.com/adminapi/",
    authProvider: new MyAuthenticationProvider(
      req.query.tenantid,
      ["https://outlook.office365.com/.default"],
      false,
      "a0c73c16-a7e3-4564-9a95-2bdf47383716"
    ),
  };

  const client = Client.initWithMiddleware(clientOptions);
  try {
    const mailboxes = await client
      .api(`${req.query.tenantid}/Mailbox/${req.query.mailboxid}`)
      .get();
    res.status(200).json(mailboxes);
  } catch (error) {
    res.status(500).json(error);
  }
};
