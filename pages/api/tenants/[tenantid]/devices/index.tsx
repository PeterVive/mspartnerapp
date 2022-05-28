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
import { Device } from "@microsoft/microsoft-graph-types-beta";
import { getSession } from "next-auth/react";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (!session) {
    res.status(401).send({ Error: "Not authorized." });
    return;
  }

  let clientOptions: ClientOptions = {
    defaultVersion: "beta",
    authProvider: new MyAuthenticationProvider(req.query.tenantid as string),
  };

  if (!req.query.filter) {
    req.query.filter = "";
  }

  if (!req.query.select) {
    req.query.select = "";
  }

  const client = Client.initWithMiddleware(clientOptions);
  const devices: Device[] = [];
  const response: PageCollection = await client
    .api(`/devices`)
    .select(req.query.select)
    .filter(req.query.filter ? req.query.filter[0] : "")
    .get();
  let callback: PageIteratorCallback = (data) => {
    devices.push(data);
    return true;
  };
  let pageIterator = new PageIterator(client, response, callback);
  await pageIterator.iterate();
  res.status(200).json(devices);
};
