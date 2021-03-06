/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from "next";
import { MyAuthenticationProvider } from "../../../utils/customAuthProvider";
import { Client } from "@microsoft/microsoft-graph-client";
import { getSession } from "next-auth/react";
import { Contract } from "@microsoft/microsoft-graph-types-beta";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (!session) {
    res.status(401).send({ Error: "Not authorized." });
    return;
  }

  let clientOptions = {
    defaultVersion: "beta",
    authProvider: new MyAuthenticationProvider(
      process.env.PARTNER_TENANT_ID as string
    ),
  };

  const client = Client.initWithMiddleware(clientOptions);
  try {
    const contract: Contract = (
      await client
        .api(`/contracts`)
        .filter(`customerId eq ${req.query.tenantid}`)
        .get()
    ).value[0];
    res.status(200).json(contract);
  } catch (error: any) {
    res.status(500).send({
      errorMessage: error.message,
    });
  }
};
