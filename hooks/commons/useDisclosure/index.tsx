import { useEffect, useState } from "react";

interface Options {
  initialState: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

const useDisclosure = ({
  initialState,
  onOpen = undefined,
  onClose = undefined,
}: Options) => {
  const [isOpen, setIsOpen] = useState(initialState);

  useEffect(() => {
    if (isOpen !== initialState) {
      setIsOpen(initialState);
    }
  }, [initialState]);

  const open = async () => {
    setIsOpen(true);
    await onOpen?.();
  };

  const close = async () => {
    setIsOpen(false);
    await onClose?.();
  };

  const toggle = () => (isOpen ? close() : open());

  return { isOpen, open, close, toggle };
};

export default useDisclosure;
