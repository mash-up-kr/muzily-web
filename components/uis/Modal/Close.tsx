import type { ComponentPropsWithoutRef, ElementType } from "react";
import { useModal } from "./context";

type Props<T extends ElementType> = {
  as?: T;
  waitInjectToAs?: (
    isWaiting: boolean
  ) => Partial<Omit<ComponentPropsWithoutRef<T>, "onClick">>;
};

const Close = <T extends ElementType = "button">({
  as,
  waitInjectToAs,
  ...props
}: Props<T> & Omit<ComponentPropsWithoutRef<T>, keyof Props<T>>) => {
  const { close, isWaiting, setIsWaiting } = useModal();
  const Component = as || "button";

  const handleClick = async () => {
    setIsWaiting(() => true);
    if (waitInjectToAs) {
      await props.onClick?.();
    } else {
      props.onClick?.();
    }
    close();
    setIsWaiting(() => false);
  };

  const injectingProps =
    typeof waitInjectToAs === "function" ? waitInjectToAs(isWaiting) : {};

  return <Component {...props} onClick={handleClick} {...injectingProps} />;
};

export default Close;
