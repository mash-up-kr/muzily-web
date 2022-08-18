import type { ComponentProps, FunctionComponent, ReactNode } from "react";
import { createContext } from "react";
import type DefaultTemplate from "./DefaultTemplate";

export const Context = createContext(
  {} as {
    Template?: FunctionComponent<
      { content: ReactNode } & Pick<
        ComponentProps<typeof DefaultTemplate>,
        "close" | "isShow" | "options"
      >
    >;
  }
);
