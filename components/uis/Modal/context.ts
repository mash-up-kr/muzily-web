import { useContext, createContext } from "react";

const Context = createContext({
  open: (() => {}) as () => Promise<void>,
  close: (() => {}) as () => Promise<void>,
  isWaiting: false,
  setIsWaiting: (() => {}) as React.Dispatch<React.SetStateAction<boolean>>,
});
export default Context;

export const useModal = () => useContext(Context);
