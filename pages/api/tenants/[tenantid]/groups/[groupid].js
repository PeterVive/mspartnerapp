/* eslint-disable import/no-anonymous-default-export */
import { MyAuthenticationProvider } from "../../../../../utils/customAuthProvider";
import { Client } from "@microsoft/microsoft-graph-client";

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
  const group = (await client.api(`/groups/${_.query.groupid}`).get()).value;
  res.status(200).json(group);
};
