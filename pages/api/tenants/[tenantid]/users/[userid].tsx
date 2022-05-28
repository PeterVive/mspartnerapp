/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from "next";
import { MyAuthenticationProvider } from "../../../../../utils/customAuthProvider";
import { Client, ClientOptions } from "@microsoft/microsoft-graph-client";
import { getSession } from "next-auth/react";
import { User } from "@microsoft/microsoft-graph-types-beta";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (!session) {
    res.status(401).send({ Error: "Not authorized." });
    return;
  }

  let clientOptions: ClientOptions = {
    defaultVersion: "beta",
    authProvider: new MyAuthenticationProvider(req.query.tenantid as string),
  };
  const client = Client.initWithMiddleware(clientOptions);

  switch (req.method) {
    case "GET":
      if (!req.query.select) {
        req.query.select = "";
      }
      try {
        const user: User = await client
          .api(`/users/${req.query.userid}`)
          .select(req.query.select)
          .get();

        res.status(200).json(user);
        break;
      } catch (error: any) {
        res.status(500).send({
          errorMessage: error.message,
        });
      }
      break;
    case "PATCH":
      try {
        const response = await client
          .api(`/users/${req.query.userid}`)
          .patch(req.body);
        res.status(200).json(response);
        break;
      } catch (error: any) {
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
