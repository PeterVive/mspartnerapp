/* eslint-disable import/no-anonymous-default-export */
import { MyAuthenticationProvider } from "../../../utils/customAuthProvider";
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
      process.env.PARTNER_TENANT_ID,
      ["https://graph.microsoft.com/.default"],
      false
    ),
  };

  const client = Client.initWithMiddleware(clientOptions);
  try {
    const contract = (
      await client
        .api(`/contracts`)
        .filter(`customerId eq ${_.query.tenantid}`)
        .get()
    ).value[0];
    res.status(200).json(contract);
  } catch (error) {
    res.status(500).send({
      errorMessage: error.message,
    });
  }
};
