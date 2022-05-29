import { useState } from "react";
import { store } from "../store/store";
import { Provider } from "react-redux";
import Head from "next/head";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider } from "@emotion/react";
import type { EmotionCache } from "@emotion/cache";
import theme from "../components/Layout/theme";
import createEmotionCache from "../utils/createEmotionCache";
import Layout from "../components/Layout/Layout";
import { SessionProvider } from "next-auth/react";
import { SWRConfig } from "swr";
import { fetcher } from "../utils/fetcher";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface CustomAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
  emotionCache = clientSideEmotionCache,
}: CustomAppProps) {
  const router = useRouter();

  return (
    <Provider store={store}>
      <SessionProvider session={session}>
        <SWRConfig
          value={{
            fetcher: fetcher,
          }}
        >
          <CacheProvider value={emotionCache}>
            <Head>
              <meta
                name="viewport"
                content="initial-scale=1, width=device-width"
              />
            </Head>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Layout>
                <Component {...pageProps} key={router.asPath} />
              </Layout>
            </ThemeProvider>
          </CacheProvider>
        </SWRConfig>
      </SessionProvider>
    </Provider>
  );
}
