import { getSession } from "next-auth/react";

/* eslint-disable import/no-anonymous-default-export */
export default async (_, res) => {
  const session = await getSession({ req: _ });
  if (!session) {
    res.status(401).send({ Error: "Not authorized." });
    return;
  }

  //let operationResult = await exoRequest(_.query.tenantid as string, "Set-Mailbox", {
  //    Identity: _.query.mailboxid,
  //    type: _.query.type
  //})
  res.status(200).json(_.query.type);
};
