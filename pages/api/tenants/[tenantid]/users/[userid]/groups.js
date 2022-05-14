import { MyAuthenticationProvider } from "../../../../../../utils/customAuthProvider";
import { Client } from "@microsoft/microsoft-graph-client";
import { getSession } from "next-auth/react";

const groups = () => async (_, res) => {
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

  const client = Client.initWithMiddleware(clientOptions);
  try {
    const groups = await (
      await client.api(`/users/${_.query.userid}/getMemberGroups`).post({
        securityEnabledOnly: false,
      })
    ).value;

    res.status(200).json(groups);
  } catch (error) {
    res.status(500).send({
      errorMessage: error.message,
    });
  }
};
export default groups;
