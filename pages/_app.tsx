import "../styles/globals.css";
import React from "react";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@emotion/react";
import styled from "@emotion/styled";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { RecoilRoot } from "recoil";
import { Layout } from "~/components/uis";
import { MemberInfo } from "~/contexts";
import SocketProvider from "~/contexts/Socket";
import { emotionTheme } from "~/theme";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <React.StrictMode>
      <RecoilRoot>
        <S.Background />
        <Layout>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={emotionTheme}>
              <MemberInfo.Provider>
                <SocketProvider>
                  <Component {...pageProps} />
                </SocketProvider>
              </MemberInfo.Provider>
            </ThemeProvider>
            <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
          </QueryClientProvider>
        </Layout>
      </RecoilRoot>
    </React.StrictMode>
  );
}

export default MyApp;

const S = {
  Background: styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #111111;
  `,
};
