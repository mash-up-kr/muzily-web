import type { ComponentProps, FunctionComponent, ReactNode } from "react";
import { hydrateRoot } from "react-dom/client";
import { Context } from "./context";
import type DefaultTemplate from "./DefaultTemplate";
import Manager from "./Manager";

type ConstructorParameter = {
  zIndex?: number;
  portalId?: string;
  Adapter?: FunctionComponent<{ children: ReactNode }>;
  Template?: FunctionComponent<
    { content: ReactNode } & Pick<
      ComponentProps<typeof DefaultTemplate>,
      "close" | "isShow" | "options"
    >
  >;
  defaultOptions?: Partial<ComponentProps<typeof DefaultTemplate>["options"]>;
};

class Toast {
  portal: HTMLElement | null = null;

  createToast: Parameters<ComponentProps<typeof Manager>["bind"]>[0] | null =
    null;

  defaultOptions: ComponentProps<typeof DefaultTemplate>["options"] = {
    duration: 2000,
    delay: 200,
    status: null,
  };

  constructor({
    zIndex = 9999,
    portalId = "toast-portal",
    Template,
    Adapter = ({ children }) => <>{children}</>,
    defaultOptions,
  }: ConstructorParameter = {}) {
    this.defaultOptions = {
      ...this.defaultOptions,
      ...defaultOptions,
    };

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
    options: Partial<ComponentProps<typeof DefaultTemplate>["options"]> = {}
  ) {
    this.createToast?.(content, { ...this.defaultOptions, ...options });
  }
}

export default Toast;
