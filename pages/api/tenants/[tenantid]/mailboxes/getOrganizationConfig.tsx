/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from "next";
import { MyAuthenticationProvider } from "../../../../../utils/customAuthProvider";
import { Client, ClientOptions } from "@microsoft/microsoft-graph-client";
import { getSession } from "next-auth/react";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (!session) {
    res.status(401).send({ Error: "Not authorized." });
    return;
  }

  let requestBody = {
    CmdletInput: {
      CmdletName: "Get-OrganizationConfig",
      Parameters: {},
    },
  };

  let clientOptions: ClientOptions = {
    customHosts: new Set(["outlook.office365.com"]),
    defaultVersion: "beta",
    baseUrl: "https://outlook.office365.com/adminapi/",
    authProvider: new MyAuthenticationProvider(
      req.query.tenantid as string,
      false,
      ["https://outlook.office365.com/.default"],
      "a0c73c16-a7e3-4564-9a95-2bdf47383716"
    ),
  };

  const client = Client.initWithMiddleware(clientOptions);

  try {
    const data = (
      await client
        .api(`${req.query.tenantid}/InvokeCommand`)
        .post(JSON.stringify(requestBody))
    ).value;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
};
