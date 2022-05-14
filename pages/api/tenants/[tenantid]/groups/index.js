/* eslint-disable import/no-anonymous-default-export */
import { MyAuthenticationProvider } from "../../../../../utils/customAuthProvider";
import { Client, PageIterator } from "@microsoft/microsoft-graph-client";

export default async (_, res) => {
  let clientOptions = {
    defaultVersion: "beta",
    authProvider: new MyAuthenticationProvider(
      _.query.tenantid,
      ["https://graph.microsoft.com/.default"],
      false
    ),
  };

  const client = Client.initWithMiddleware(clientOptions);
  const groups = [];
  const response = await client.api(`/groups`).get();
  let callback = (data) => {
    groups.push(data);
    return true;
  };
  let pageIterator = new PageIterator(client, response, callback);
  await pageIterator.iterate();
  res.status(200).json(groups);
};
