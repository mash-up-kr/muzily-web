import type { FunctionComponent, ReactNode } from "react";
import show from "./show";

const create = (
  adapters: FunctionComponent<{ children: ReactNode }> = ({ children }) => (
    <>{children}</>
  )
) => ({
  show: (modal: Parameters<typeof show>[0]) => {
    show(modal, { adapters });
  },
});

export default create;
