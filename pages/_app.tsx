import "../styles/globals.css";
import type { AppProps } from "next/app";
import Something from "~/components/Something";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Something />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
