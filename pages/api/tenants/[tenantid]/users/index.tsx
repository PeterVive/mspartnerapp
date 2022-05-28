/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from "next";
import { MyAuthenticationProvider } from "../../../../../utils/customAuthProvider";
import {
  Client,
  ClientOptions,
  PageCollection,
  PageIterator,
  PageIteratorCallback,
} from "@microsoft/microsoft-graph-client";
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
      if (!req.query.filter) {
        req.query.filter = "";
      }

      if (!req.query.select) {
        req.query.select = "";
      }
      try {
        const users: User[] = [];
        const response: PageCollection = await client
          .api("/users")
          .filter(req.query.filter ? req.query.filter[0] : "")
          .select(req.query.select)
          .get();
        let callback: PageIteratorCallback = (data) => {
          users.push(data);
          return true;
        };
        let pageIterator = new PageIterator(client, response, callback);
        await pageIterator.iterate();
        res.status(200).json(users);
      } catch (error: any) {
        res.status(500).send({
          errorMessage: error.message,
        });
      }
      break;
    case "POST":
      try {
        const response = await client.api("/users").post(req.body);
        res.status(200).send(response);
      } catch (error: any) {
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
