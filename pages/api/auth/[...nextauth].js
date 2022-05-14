import NextAuth from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";

export default NextAuth({
  providers: [
    AzureADProvider({
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      tenantId: process.env.PARTNER_TENANT_ID,
    }),
  ],
});
