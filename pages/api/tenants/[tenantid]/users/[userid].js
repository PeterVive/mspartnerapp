/* eslint-disable import/no-anonymous-default-export */
import { MyAuthenticationProvider } from "../../../../../utils/customAuthProvider";
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
      _.query.tenantid,
      ["https://graph.microsoft.com/.default"],
      false
    ),
  };
  const client = Client.initWithMiddleware(clientOptions);
  console.log(_.method);
  switch (_.method) {
    case "GET":
      if (!_.query.select) {
        _.query.select = "";
      }
      try {
        const user = await client
          .api(`/users/${_.query.userid}`)
          .select(_.query.select)
          .get();

        res.status(200).json(user);
        break;
      } catch (error) {
        res.status(500).send({
          errorMessage: error.message,
        });
      }
      break;
    case "PATCH":
      console.log("PATCHING");
      console.log(_.body);
      try {
        const response = await client
          .api(`/users/${_.query.userid}`)
          .patch(_.body);
        res.status(200).json(response);
        break;
      } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
      }
      break;
    default:
      res.status(400).send({
        errorMessage: "Invalid request type",
      });
      break;
  }
};
