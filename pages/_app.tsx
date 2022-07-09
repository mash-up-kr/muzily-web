import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@emotion/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemberInfoContext } from "~/contexts";
import { emotionTheme } from "~/theme";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={emotionTheme}>
        <MemberInfoContext.Provider>
          <Component {...pageProps} />
        </MemberInfoContext.Provider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
