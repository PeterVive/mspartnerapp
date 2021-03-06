/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from "next";
import { MyAuthenticationProvider } from "../../../../../utils/customAuthProvider";
import { Client, ClientOptions } from "@microsoft/microsoft-graph-client";
import { Group } from "@microsoft/microsoft-graph-types-beta";
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

  const client = Client.initWithMiddleware(clientOptions);
  const group: Group = await client.api(`/groups/${req.query.groupid}`).get();
  res.status(200).json(group);
};
