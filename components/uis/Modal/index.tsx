import type { ReactElement, ReactNode } from "react";
import { useMemo, useState } from "react";
import { useDisclosure } from "~/hooks/commons";
import Close from "./Close";
import Context from "./context";
import Open from "./Open";
import Portal from "./Portal";

const DEFAULT_PORTAL_ID_PREFIX = "modal-portal";

type UseDisclosure = typeof useDisclosure;

type Props = {
  portalId?: string;
  trigger:
    | ReactNode
    | ((args: { open: ReturnType<UseDisclosure>["open"] }) => ReactElement);
  modal:
    | ReactNode
    | ((args: {
        close: ReturnType<UseDisclosure>["close"];
        isWaiting: boolean;
      }) => ReactElement);
  initialIsOpen?: Parameters<UseDisclosure>[0]["initialState"];
  onOpen?: Parameters<UseDisclosure>[0]["onOpen"];
  onClose?: Parameters<UseDisclosure>[0]["onClose"];
};

const Modal = ({
  portalId,
  initialIsOpen = false,
  trigger,
  onOpen,
  onClose,
  modal,
}: Props) => {
  const memoizedPortalId = useMemo(() => {
    return typeof portalId === "string" && portalId !== DEFAULT_PORTAL_ID_PREFIX
      ? portalId
      : `${DEFAULT_PORTAL_ID_PREFIX}-${new Date().getTime()}`;
  }, []);

  const [isWaiting, setIsWaiting] = useState(false);
  const { isOpen, close, open } = useDisclosure({
    initialState: initialIsOpen,
    onOpen,
    onClose: async () => {
      await onClose?.();
      document.getElementById(memoizedPortalId)?.remove();
    },
  });

  return (
    <Context.Provider value={{ open, close, isWaiting, setIsWaiting }}>
      {typeof trigger === "function" ? trigger({ open }) : trigger}
      {isOpen ? (
        <Portal id={memoizedPortalId}>
          {typeof modal === "function" ? modal({ close, isWaiting }) : modal}
        </Portal>
      ) : null}
    </Context.Provider>
  );
};

export default Modal;

Modal.Open = Open;
Modal.Close = Close;

export { useModal } from "./context";
