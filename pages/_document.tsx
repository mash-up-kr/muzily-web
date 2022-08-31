import Document, { Html, Head, Main, NextScript } from "next/document";

const viewsible = `
(function(w, d, a){
  w.beusablerumclient = {
      load : function(src){
          var b = d.createElement("script");
          b.src = src; b.async=true; b.type = "text/javascript";
          d.getElementsByTagName("head")[0].appendChild(b);
      }
  };w.beusablerumclient.load(a + "?url=" + encodeURIComponent(d.URL));
})(window, document, "//rum.beusable.net/load/b220812e223531u053");
`;

class MyDocument extends Document {
  render() {
    return (
      <Html lang="ko">
        <Head>
          <script type="text/javascript">{viewsible}</script>

          {/* Memo(@young-mason) 일단 모든 페이지에 같은 타이틀이 노출되는 정책이라 lint 무시하였음 */}
          <title>Muzily | 함께 만드는 모두의 플레이리스트</title>
          <link rel="icon" href="/favicon.ico" />
          <meta
            property="og:title"
            content="Muzily | 함께 만드는 모두의 플레이리스트"
          />
          <meta property="og:image" content="/images/og-image.png" />
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
