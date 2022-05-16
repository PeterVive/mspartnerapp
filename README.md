# MSPartnerApp

## What is it?

An application using the Secure Application Model (SAM) to manage your customer tenants.

Uses both public and undocumented MS Graph endpoints to connect to your tenants.

## Screenshots

![Main view](/.github/screenshots/mainview.png)
![Users view](/.github/screenshots/usersview.png)

## How to setup

These instructions should get you up and running.  
For creating the Azure AD Application and generating refresh tokens, I recommend [following the instructions from CIPP](https://cipp.app/docs/user/gettingstarted/prerequisites/).

1. Clone the repository
   ```
   git clone https://github.com/petervive/mspartnerapp && cd mspartnerapp
   ```
2. Install dependencies.
   ```
   npm install
   ```
3. Set environment variables. (You can create a `.env.local` file for local development)
   ```
    PARTNER_TENANT_ID=tenantname.onmicrosoft.com
    CLIENT_ID=<SAM Application Client ID>
    CLIENT_SECRET=<SAM Application Client Secret>
    REFRESH_TOKEN=<Generated refresh token>
    EXCHANGE_REFRESH_TOKEN=<Generated exchange refresh token>
    NEXTAUTH_SECRET=<Random base64 string>
        You could generate one using "openssl rand -base64 32".
    NEXTAUTH_URL=<Deployment URL>
        For example http://localhost:3000 for local development.
   ```
4. Start the server

   For local development:

   ```
   npm run dev
   ```

   For deployment:

   ```
   npm run build && npm run start
   ```
