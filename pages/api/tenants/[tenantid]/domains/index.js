/* eslint-disable import/no-anonymous-default-export */
import { MyAuthenticationProvider } from "../../../../../utils/customAuthProvider";
import { Client } from "@microsoft/microsoft-graph-client";
export default async (_, res) => {
  if (!_.query.select) {
    _.query.select = "";
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

  const domains = await (
    await client.api("/domains").select(_.query.select).get()
  ).value;

  res.status(200).json(domains);
};
