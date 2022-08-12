import type { ComponentPropsWithoutRef, ElementType } from "react";
import { useModal } from "../../context";

type Props<T extends ElementType> = {
  as?: T;
  closeAfterOnClick?: boolean;
};

const Open = <T extends ElementType = "button">({
  as,
  ...props
}: Props<T> & Omit<ComponentPropsWithoutRef<T>, keyof Props<T>>) => {
  const { open } = useModal();
  const Component = as || "button";

  const handleClick = async () => {
    props.onClick?.();
    open();
  };

  return <Component {...props} onClick={handleClick} />;
};

export default Open;
