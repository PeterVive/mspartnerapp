import * as React from "react";
import { store } from "../store/store";
import { Provider } from "react-redux";
import Head from "next/head";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider } from "@emotion/react";
import theme from "../components/Layout/theme";
import createEmotionCache from "../utils/createEmotionCache";
import Layout from "../components/Layout/Layout";
import { SessionProvider } from "next-auth/react";
import { SWRConfig } from "swr";
import { fetcher } from "../utils/fetcher";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
  emotionCache = clientSideEmotionCache,
}) {
  const [tenant, setTenant] = React.useState();

  return (
    <Provider store={store}>
      <CacheProvider value={emotionCache}>
        <SessionProvider session={session}>
          <SWRConfig
            value={{
              fetcher: fetcher,
              onError: (error, key) => {
                //console.log(error);
              },
              onErrorRetry: (
                error,
                key,
                config,
                revalidate,
                { retryCount }
              ) => {
                if (error.status == 404) return;
              },
            }}
          >
            <Head>
              <meta
                name="viewport"
                content="initial-scale=1, width=device-width"
              />
            </Head>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </ThemeProvider>
          </SWRConfig>
        </SessionProvider>
      </CacheProvider>
    </Provider>
  );
}
