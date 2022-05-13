const url = require("url");
import "isomorphic-fetch";

class MyAuthenticationProviderOptions {
  tenantId;
  scopes;
  asApp;
  appId;
  resource;
}

export class MyAuthenticationProvider {
  authenticationProviderOptions = new MyAuthenticationProviderOptions();

  constructor(tenantId, scopes, asApp, appId, resource) {
    this.authenticationProviderOptions.tenantId = tenantId;
    this.authenticationProviderOptions.scopes = scopes;
    this.authenticationProviderOptions.asApp = asApp;
    this.authenticationProviderOptions.appId = appId;
    this.authenticationProviderOptions.resource = resource;
  }

  async getAccessToken() {
    let authBody;

    if (this.authenticationProviderOptions.resource) {
      authBody = {
        resource: this.authenticationProviderOptions.resource,
        grant_type: "refresh_token",
        refresh_token: process.env.EXCHANGE_REFRESH_TOKEN,
      };
    } else if (this.authenticationProviderOptions.asApp) {
      authBody = {
        scope: this.authenticationProviderOptions.scopes[0],
        grant_type: "client_credentials",
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
      };
    } else if (this.authenticationProviderOptions.appId) {
      authBody = {
        scope: this.authenticationProviderOptions.scopes[0],
        grant_type: "refresh_token",
        client_id: this.authenticationProviderOptions.appId,
        refresh_token: process.env.EXCHANGE_REFRESH_TOKEN,
      };
    } else {
      authBody = {
        scope: this.authenticationProviderOptions.scopes[0],
        grant_type: "refresh_token",
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        refresh_token: process.env.REFRESH_TOKEN,
      };
    }

    const params = new url.URLSearchParams(authBody);

    let requestUrl = `https://login.microsoftonline.com/${this.authenticationProviderOptions.tenantId}/oauth2/v2.0/token`;

    if (this.authenticationProviderOptions.resource) {
      requestUrl = `https://login.microsoftonline.com/${this.authenticationProviderOptions.tenantId}/oauth2/token`;
    }

    try {
      const response = await fetch(requestUrl, {
        method: "POST",
        body: params,
      });
      const accessToken = await (await response.json()).access_token;
      return accessToken;
    } catch (err) {
      console.log(err);
      Promise.reject(err);
    }
    return Promise.reject();
  }
}
