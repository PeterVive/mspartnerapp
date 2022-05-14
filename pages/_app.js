import * as React from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider } from "@emotion/react";
import theme from "../components/Layout/theme";
import createEmotionCache from "../utils/createEmotionCache";
import Layout from "../components/Layout/Layout";
import { TenantContext } from "../utils/TenantContext";
import { SessionProvider } from "next-auth/react";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
  emotionCache = clientSideEmotionCache,
}) {
  const [tenant, setTenant] = React.useState();
  console.log(session);

  return (
    <SessionProvider session={session}>
      <TenantContext.Provider value={[tenant, setTenant]}>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ThemeProvider>
      </TenantContext.Provider>
    </SessionProvider>
  );
}
