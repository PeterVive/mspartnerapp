/* eslint-disable import/no-anonymous-default-export */
import { MyAuthenticationProvider } from "../../../../../../utils/customAuthProvider";
import { Client } from "@microsoft/microsoft-graph-client";
import { getSession } from "next-auth/react";

export default async (_, res) => {
  const session = await getSession({ req: _ });
  if (!session) {
    res.status(401).send({ Error: "Not authorized." });
    return;
  }

  let requestBody = {
    CmdletInput: {
      CmdletName: "Get-TransportRule",
      Parameters: {},
    },
  };

  let clientOptions = {
    customHosts: new Set(["outlook.office365.com"]),
    defaultVersion: "beta",
    baseUrl: "https://outlook.office365.com/adminapi/",
    authProvider: new MyAuthenticationProvider(
      _.query.tenantid,
      ["https://outlook.office365.com/.default"],
      false,
      "a0c73c16-a7e3-4564-9a95-2bdf47383716"
    ),
  };

  const client = Client.initWithMiddleware(clientOptions);

  try {
    const data = await (
      await client
        .api(`${_.query.tenantid}/InvokeCommand`)
        .post(JSON.stringify(requestBody))
    ).value;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
};
