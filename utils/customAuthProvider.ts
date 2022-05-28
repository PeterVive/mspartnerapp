const url = require("url");
import "isomorphic-fetch";

import { AuthenticationProvider } from "@microsoft/microsoft-graph-client";

export class MyAuthenticationProvider implements AuthenticationProvider {
  tenantId: string;
  asApp: boolean;
  scopes: string[];
  appId?: string;
  resource?: string;

  constructor(
    tenantId: string,
    asApp: boolean = false,
    scopes: string[] = ["https://graph.microsoft.com/.default"],
    appId?: string,
    resource?: string
  ) {
    this.tenantId = tenantId;
    this.asApp = asApp;
    this.scopes = scopes;
    this.appId = appId;
    this.resource = resource;
  }

  async getAccessToken() {
    let authBody;

    if (this.resource) {
      authBody = {
        resource: this.resource,
        grant_type: "refresh_token",
        refresh_token: process.env.EXCHANGE_REFRESH_TOKEN,
      };
    } else if (this.asApp) {
      authBody = {
        scope: this.scopes[0],
        grant_type: "client_credentials",
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
      };
    } else if (this.appId) {
      authBody = {
        scope: this.scopes[0],
        grant_type: "refresh_token",
        client_id: this.appId,
        refresh_token: process.env.EXCHANGE_REFRESH_TOKEN,
      };
    } else {
      authBody = {
        scope: this.scopes[0],
        grant_type: "refresh_token",
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        refresh_token: process.env.REFRESH_TOKEN,
      };
    }

    const params = new url.URLSearchParams(authBody);

    let requestUrl = `https://login.microsoftonline.com/${this.tenantId}/oauth2/v2.0/token`;

    if (this.resource) {
      requestUrl = `https://login.microsoftonline.com/${this.tenantId}/oauth2/token`;
    }

    try {
      const response = await fetch(requestUrl, {
        method: "POST",
        body: params,
      });
      const accessToken = await (await response.json()).access_token;
      return accessToken;
    } catch (err) {
      Promise.reject(err);
    }
    return Promise.reject();
  }
}
