import type { ComponentProps, FunctionComponent, ReactNode } from "react";
import { hydrateRoot } from "react-dom/client";
import DefaultItem from "./DefaultItem";
import Manager from "./Manager";
import type { Options } from "./types";

class Toast {
  portal: HTMLElement | null = null;

  createToast: Parameters<ComponentProps<typeof Manager>["bind"]>[0] | null =
    null;

  constructor(
    options: {
      portalId?: string;
      Adapter?: FunctionComponent<{ children: ReactNode }>;
      ToastItem?: ComponentProps<typeof Manager>["ToastItem"];
    } = {}
  ) {
    const {
      portalId = "toast-portal",
      ToastItem,
      Adapter = ({ children }) => <>{children}</>,
    } = options;
    if (typeof document !== "undefined") {
      const portalElement = document.getElementById(portalId);

      if (portalElement) {
        this.portal = portalElement;
      } else {
        const newPortal = document.createElement("div");
        newPortal.id = portalId;
        newPortal.style.left = "0";
        newPortal.style.right = "0";
        newPortal.style.bottom = "0";
        newPortal.style.zIndex = "9999";
        newPortal.style.position = "fixed";
        this.portal = newPortal;
        document.body.appendChild(this.portal);
      }

      hydrateRoot(
        this.portal,
        <Adapter>
          <Manager
            bind={(createToast) => {
              this.createToast = createToast;
            }}
            ToastItem={ToastItem ?? DefaultItem}
          />
        </Adapter>
      );
    }
  }

  show(
    Content: ReactNode | FunctionComponent<{ options: Options }>,
    options: Partial<Options> = { delay: 400, duration: 2000 }
  ) {
    const { delay = 400, duration = 2000 } = options;

    const content =
      typeof Content === "function" ? (
        <Content options={{ delay, duration }} />
      ) : (
        Content
      );

    this.createToast?.(content, { delay, duration });
  }
}

export default Toast;
