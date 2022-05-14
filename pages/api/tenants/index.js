/* eslint-disable import/no-anonymous-default-export */
import { MyAuthenticationProvider } from "../../../utils/customAuthProvider";
import { Client, PageIterator } from "@microsoft/microsoft-graph-client";

export default async (_, res) => {
  let clientOptions = {
    defaultVersion: "beta",
    authProvider: new MyAuthenticationProvider(
      process.env.PARTNER_TENANT_ID,
      ["https://graph.microsoft.com/.default"],
      false
    ),
  };

  const client = Client.initWithMiddleware(clientOptions);
  const contracts = [];
  const response = await client.api(`/contracts`).get();
  let callback = (data) => {
    contracts.push(data);
    return true;
  };
  let pageIterator = new PageIterator(client, response, callback);
  await pageIterator.iterate();
  res.status(200).json(contracts);
};
