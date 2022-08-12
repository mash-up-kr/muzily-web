import { useContext, createContext } from "react";

type InitialState = {
  open: () => Promise<void>;
  close: () => Promise<void>;
  isWaiting: boolean;
  setIsWaiting: React.Dispatch<React.SetStateAction<boolean>>;
};

const Context = createContext({} as InitialState);
export default Context;

export const useModal = () => useContext(Context);
