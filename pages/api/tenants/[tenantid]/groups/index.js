/* eslint-disable import/no-anonymous-default-export */
import { MyAuthenticationProvider } from "../../../../../utils/customAuthProvider";
import { Client, PageIterator } from "@microsoft/microsoft-graph-client";
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

  if (!_.query.filter) {
    _.query.filter = "";
  }

  if (!_.query.select) {
    _.query.select = "";
  }

  const client = Client.initWithMiddleware(clientOptions);
  const groups = [];
  const response = await client
    .api(`/groups`)
    .select(_.query.select)
    .filter(_.query.filter)
    .get();
  let callback = (data) => {
    groups.push(data);
    return true;
  };
  let pageIterator = new PageIterator(client, response, callback);
  await pageIterator.iterate();
  res.status(200).json(groups);
};
