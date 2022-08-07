import type { ReactElement } from "react";
import { useContext, createContext } from "react";
import { useDisclosure } from "~/hooks/commons";

const Context = createContext({
  close: (() => {}) as () => Promise<void>,
});

export const useModal = () => useContext(Context);

type Props = {
  trigger: (args: { open: () => void }) => ReactElement;
  modal:
    | React.ReactNode
    | ((args: { close: () => Promise<void> }) => ReactElement);
  initialState?: Parameters<typeof useDisclosure>[0]["initialState"];
  onOpen?: Parameters<typeof useDisclosure>[0]["onOpen"];
  onClose?: Parameters<typeof useDisclosure>[0]["onClose"];
};

const Modal = ({
  initialState = false,
  trigger,
  onOpen,
  onClose,
  modal,
}: Props) => {
  const { isOpen, close, open } = useDisclosure({
    initialState,
    onOpen,
    onClose,
  });

  const modalOpened = typeof modal === "function" ? modal({ close }) : modal;

  return (
    <Context.Provider value={{ close }}>
      {trigger({ open })}
      {isOpen ? modalOpened : null}
    </Context.Provider>
  );
};

type CloseProps<T extends React.ElementType> = {
  as?: T;
};

const Close = <T extends React.ElementType = "button">({
  as,
  ...props
}: CloseProps<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof CloseProps<T>>) => {
  const { close } = useModal();
  const Component = as || "button";

  return <Component onClick={close} {...props} />;
};

Modal.Close = Close;

export default Modal;
