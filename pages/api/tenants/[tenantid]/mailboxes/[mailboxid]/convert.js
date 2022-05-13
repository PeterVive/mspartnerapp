/* eslint-disable import/no-anonymous-default-export */
export default async (_, res) => {
  //let operationResult = await exoRequest(_.query.tenantid as string, "Set-Mailbox", {
  //    Identity: _.query.mailboxid,
  //    type: _.query.type
  //})
  res.status(200).json(_.query.type);
};
