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
      // html 태그에 언어 설정
      <Html lang="ko">
        <Head>
          <script type="text/javascript">{viewsible}</script>
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
