import type { ComponentProps, FunctionComponent, ReactNode } from "react";
import { hydrateRoot } from "react-dom/client";
import { Context } from "./context";
import type DefaultTemplate from "./DefaultTemplate";
import Manager from "./Manager";

class Toast {
  portal: HTMLElement | null = null;

  createToast: Parameters<ComponentProps<typeof Manager>["bind"]>[0] | null =
    null;

  constructor(
    options: {
      zIndex?: number;
      portalId?: string;
      Adapter?: FunctionComponent<{ children: ReactNode }>;
      Template?: FunctionComponent<
        { content: ReactNode } & Pick<
          ComponentProps<typeof DefaultTemplate>,
          "close" | "isShow" | "options"
        >
      >;
    } = {}
  ) {
    const {
      zIndex = 9999,
      portalId = "toast-portal",
      Template,
      Adapter = ({ children }) => <>{children}</>,
    } = options;
    if (typeof document !== "undefined") {
      const portalElement = document.getElementById(portalId);

      if (portalElement) {
        this.portal = portalElement;
      } else {
        const newPortal = document.createElement("div");
        newPortal.id = portalId;
        newPortal.style.cssText = `
          left: 0;
          right: 0;
          bottom: 0;
          z-index: ${zIndex};
          position: fixed;
        `;
        this.portal = newPortal;
        document.body.appendChild(this.portal);
      }

      hydrateRoot(
        this.portal,
        <Adapter>
          <Context.Provider value={{ Template }}>
            <Manager
              bind={(createToast) => {
                this.createToast = createToast;
              }}
            />
          </Context.Provider>
        </Adapter>
      );
    }
  }

  show(
    content: ComponentProps<typeof DefaultTemplate>["content"],
    options: Partial<ComponentProps<typeof DefaultTemplate>["options"]> = {
      duration: 2000,
      delay: 400,
      status: null,
    }
  ) {
    const { duration = 2000, delay = 400, status = null } = options;

    this.createToast?.(content, { duration, delay, status });
  }
}

export default Toast;