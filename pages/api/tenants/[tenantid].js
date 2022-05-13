import { MyAuthenticationProvider } from "../../../utils/customAuthProvider";
import { Client } from "@microsoft/microsoft-graph-client";
import NextCors from "nextjs-cors";

const tenant = () => async (_, res) => {
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
    ).value;
    res.status(200).json(contract);
  } catch (error) {
    res.status(500).send({
      errorMessage: error.message,
    });
  }
};
export default tenant;
