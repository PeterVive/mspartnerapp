import { MyAuthenticationProvider } from "../../../../../../utils/customAuthProvider";
import { Client } from "@microsoft/microsoft-graph-client";

const groups = () => async (_, res) => {
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
