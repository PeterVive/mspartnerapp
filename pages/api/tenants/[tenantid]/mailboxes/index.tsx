/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from "next";
import { MyAuthenticationProvider } from "../../../../../utils/customAuthProvider";
import {
  Client,
  ClientOptions,
  PageCollection,
  PageIterator,
  PageIteratorCallback,
} from "@microsoft/microsoft-graph-client";
import { getSession } from "next-auth/react";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (!session) {
    res.status(401).send({ Error: "Not authorized." });
    return;
  }

  if (!req.query.filter) {
    req.query.filter = "";
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

  try {
    const client = Client.initWithMiddleware(clientOptions);
    const mailboxes: Object[] = [];
    const response: PageCollection = await client
      .api(`${req.query.tenantid}/Mailbox`)
      .filter(req.query.filter ? req.query.filter[0] : "")
      .get();

    let callback: PageIteratorCallback = (data) => {
      mailboxes.push(data);
      return true;
    };
    let pageIterator = new PageIterator(client, response, callback);
    await pageIterator.iterate();
    res.status(200).json(mailboxes);
  } catch (error) {
    res.status(500).send({
      errorMessage: error,
    });
  }
};
