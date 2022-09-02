import React, { createContext, useContext } from "react";
import { css } from "@emotion/react";
import { useElementSize } from "~/hooks/commons";

const Context = createContext({ width: 450 });
export const useLayoutWidth = () => useContext(Context);

interface Props {
  children: React.ReactNode;
  screenColor?: string;
}

const Layout = ({ children, screenColor = "#000000" }: Props) => {
  const [ref, size] = useElementSize();

  return (
    <Context.Provider
      value={{
        width: size.width,
      }}
    >
      <div
        css={css`
          height: 100%;
          width: 100%;
          max-height: 100%;
          z-index: 100;
          display: flex;
          justify-content: center;
        `}
      >
        <div
          ref={ref}
          css={css`
            max-width: 450px;
            width: 100%;
            height: 100%;
            overflow-y: auto;
            overflow-x: hidden;
            background: ${screenColor};
            color: #fff;
            position: relative;
            backdrop-filter: blur(10px);

            ::-webkit-scrollbar {
              width: 0;
              height: 0;
            }
          `}
        >
          {children}
        </div>
      </div>
    </Context.Provider>
  );
};

export default Layout;
