import type { FunctionComponent, ReactNode, ReactElement } from "react";
import { useEffect, useState } from "react";
import { useTimeout } from "~/hooks/commons";
import type { Options, Toast } from "./types";

const Manager = ({
  bind,
  ToastItem,
}: {
  bind: (
    createToast: (content: Toast["content"], options: Toast["options"]) => void
  ) => void;
  ToastItem: FunctionComponent<{
    isShow: boolean;
    options: { duration: number; delay: number };
    children: ReactNode;
  }>;
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    bind((content, options) =>
      setToasts((old) => [
        ...old,
        { id: `${new Date().getTime()}`, content, options },
      ])
    );
  }, [bind]);

  return (
    <>
      {toasts.map(({ content, id, options }) => {
        const Content = content;

        return (
          <DoAfterDuration
            key={id}
            options={options}
            onDelayedAfterDone={() =>
              setToasts((oldToasts) =>
                oldToasts.filter((toast) => toast.id !== id)
              )
            }
          >
            {({ done }) => (
              <ToastItem options={options} isShow={!done}>
                {typeof Content === "function" ? <Content /> : Content}
              </ToastItem>
            )}
          </DoAfterDuration>
        );
      })}
    </>
  );
};

export default Manager;

const DoAfterDuration = ({
  options,
  children,
  onDelayedAfterDone,
  onDone,
}: {
  options: Options;
  children: (options: { done: boolean }) => ReactElement;
  onDelayedAfterDone?: () => void;
  onDone?: () => void;
}) => {
  const [done, setDone] = useState(false);

  useTimeout(() => {
    setDone(true);
    onDone?.();
    setTimeout(() => {
      onDelayedAfterDone?.();
    }, options.delay);
  }, options.duration);

  return <>{children({ done })}</>;
};
