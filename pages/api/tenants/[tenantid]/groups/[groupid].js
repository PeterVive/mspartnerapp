import { NextApiRequest, NextApiResponse } from 'next';
import { MyAuthenticationProvider } from '../../../../../utils/customAuthProvider';
import { Client, ClientOptions } from '@microsoft/microsoft-graph-client';
import { Group } from '@microsoft/microsoft-graph-types-beta';
import { corsOptions } from '../../../../../utils/cors';
import NextCors from 'nextjs-cors';

export default async (_: NextApiRequest, res: NextApiResponse) => {
  await NextCors(_, res, corsOptions);

  let clientOptions: ClientOptions = {
    defaultVersion: 'beta',
    authProvider: new MyAuthenticationProvider(
      _.query.tenantid as string,
      ['https://graph.microsoft.com/.default'],
      false
    )
  };

  const client = Client.initWithMiddleware(clientOptions);
  const group = (await client.api(`/groups/${_.query.groupid}`).get())
    .value as Group;
  res.status(200).json(group);
};
