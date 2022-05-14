/* eslint-disable import/no-anonymous-default-export */
import { MyAuthenticationProvider } from "../../../../../utils/customAuthProvider";
import { Client } from "@microsoft/microsoft-graph-client";
import { getSession } from "next-auth/react";

export default async (_, res) => {
  const session = await getSession({ req: _ });
  if (!session) {
    res.status(401).send({ Error: "Not authorized." });
    return;
  }

  let clientOptions = {
    defaultVersion: "beta",
    authProvider: new MyAuthenticationProvider(
      _.query.tenantid,
      ["https://graph.microsoft.com/.default"],
      false
    ),
  };

  const client = Client.initWithMiddleware(clientOptions);
  const group = (await client.api(`/groups/${_.query.groupid}`).get()).value;
  res.status(200).json(group);
};
