/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from "next";
import { MyAuthenticationProvider } from "../../../../../utils/customAuthProvider";
import { Client, ClientOptions } from "@microsoft/microsoft-graph-client";
import { getSession } from "next-auth/react";
import { Domain } from "@microsoft/microsoft-graph-types-beta";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (!session) {
    res.status(401).send({ Error: "Not authorized." });
    return;
  }

  if (!req.query.select) {
    req.query.select = "";
  }

  let clientOptions: ClientOptions = {
    defaultVersion: "beta",
    authProvider: new MyAuthenticationProvider(
      req.query.tenantid,
      ["https://graph.microsoft.com/.default"],
      false
    ),
  };

  const client = Client.initWithMiddleware(clientOptions);

  const domains: Domain[] = await (
    await client.api("/domains").select(req.query.select).get()
  ).value;

  res.status(200).json(domains);
};
