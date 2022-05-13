/* eslint-disable import/no-anonymous-default-export */
import { MyAuthenticationProvider } from "../../../utils/customAuthProvider";
import { Client } from "@microsoft/microsoft-graph-client";
import NextCors from "nextjs-cors";

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

  const contracts = (await client.api(`/contracts`).top(999).get()).value;
  res.status(200).json(contracts);
};
