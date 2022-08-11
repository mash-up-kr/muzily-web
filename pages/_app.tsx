import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@emotion/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { RecoilRoot } from "recoil";
import { Layout } from "~/components/uis";
import { MemberInfo } from "~/contexts";
import { emotionTheme } from "~/theme";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <Layout>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={emotionTheme}>
            <MemberInfo.Provider>
              <Component {...pageProps} />
            </MemberInfo.Provider>
          </ThemeProvider>
          <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
        </QueryClientProvider>
      </Layout>
    </RecoilRoot>
  );
}

export default MyApp;
