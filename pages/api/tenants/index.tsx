/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from "next";
import { MyAuthenticationProvider } from "../../../utils/customAuthProvider";
import {
  Client,
  PageCollection,
  PageIterator,
  PageIteratorCallback,
} from "@microsoft/microsoft-graph-client";
import { getSession } from "next-auth/react";
import { Contract } from "@microsoft/microsoft-graph-types-beta";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (!session) {
    res.status(401).send({ Error: "Not authorized." });
    return;
  }

  let clientOptions = {
    defaultVersion: "beta",
    authProvider: new MyAuthenticationProvider(
      process.env.PARTNER_TENANT_ID as string
    ),
  };

  const client = Client.initWithMiddleware(clientOptions);
  const contracts: Contract[] = [];
  const response: PageCollection = await client.api(`/contracts`).get();
  let callback: PageIteratorCallback = (data: Contract) => {
    contracts.push(data);
    return true;
  };
  let pageIterator = new PageIterator(client, response, callback);
  await pageIterator.iterate();
  res.status(200).json(contracts);
};
