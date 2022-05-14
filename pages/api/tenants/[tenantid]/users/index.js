/* eslint-disable import/no-anonymous-default-export */
import { MyAuthenticationProvider } from "../../../../../utils/customAuthProvider";
import { Client, PageIterator } from "@microsoft/microsoft-graph-client";
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

  switch (_.method) {
    case "GET":
      if (!_.query.filter) {
        _.query.filter = "";
      }

      if (!_.query.select) {
        _.query.select = "";
      }
      try {
        const users = [];
        const response = await client
          .api("/users")
          .select(_.query.select)
          .filter(_.query.filter)
          .get();
        let callback = (data) => {
          users.push(data);
          return true;
        };
        let pageIterator = new PageIterator(client, response, callback);
        await pageIterator.iterate();
        res.status(200).json(users);
      } catch (error) {
        res.status(500).send({
          errorMessage: error.message,
        });
      }
      break;
    case "POST":
      try {
        const response = await client.api("/users").post(_.body);
        res.status(200).send(response);
      } catch (error) {
        console.log(error);
        res.status(500).send({
          errorMessage: error.message,
        });
      }
      break;
    default:
      res.status(400).send({
        errorMessage: "Unsupported request type.",
      });
      break;
  }
};
