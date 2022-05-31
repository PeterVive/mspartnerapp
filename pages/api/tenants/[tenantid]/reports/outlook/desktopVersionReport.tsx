/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from "next";
import { MyAuthenticationProvider } from "../../../../../../utils/customAuthProvider";
import {
  Client,
  ClientOptions,
  GraphRequest,
  PageCollection,
  PageIterator,
  PageIteratorCallback,
  ResponseType,
} from "@microsoft/microsoft-graph-client";
import type { ManagedDevice } from "@microsoft/microsoft-graph-types-beta";
import { getSession } from "next-auth/react";
import csvParser from "csv-parser";

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

  if (!req.query.period) {
    req.query.period = "D30";
  }

  const getParsedReport = async (url: string) => {
    const data: any[] = [];
    return new Promise(function (resolve, reject) {
      client
        .api(url)
        .responseType(ResponseType.STREAM)
        .getStream()
        .then((response) => {
          response
            .pipe(csvParser())
            .on("error", (error: any) => reject(error))
            .on("data", (row: any) => data.push(row))
            .on("end", () => {
              resolve(data);
            });
        });
    });
  };

  const client = Client.initWithMiddleware(clientOptions);
  try {
    const parsedReport = await getParsedReport(
      `/reports/getEmailAppUsageVersionsUserCounts(period='${req.query.period}')`
    );
    res.status(200).json(parsedReport);
  } catch (error: any) {
    res.status(500).send({
      errorMessage: error.message,
    });
  }
};
