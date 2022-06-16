import "../styles/globals.css";
import type { AppProps } from "next/app";
import Something from "~/components/Something";
import { ThemeProvider } from "@emotion/react";
import { emotionTheme } from "~/theme";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={emotionTheme}>
      <Something />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
