import type {
  ComponentProps,
  ElementType,
  ReactElement,
  ReactNode,
} from "react";
import { createRoot } from "react-dom/client";
import { DEFAULT_PORTAL_ID_PREFIX } from "../../constants";

export const DEFAULT_ADAPTER = (props: { children: ReactNode }) =>
  props.children;

const createStatus = {
  INITIAL: () => ({
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: null,
  }),
  PENDING: () => ({
    isLoading: true,
    isSuccess: false,
    isError: false,
    error: null,
  }),
  SUCCESS: () => ({
    isLoading: false,
    isSuccess: true,
    isError: false,
    error: null,
  }),
  FAILURE: (error: any) => ({
    isLoading: false,
    isSuccess: false,
    isError: true,
    error,
  }),
};

const EVENT = {
  // 추가 가능
  onClick: "onClick",
  onTouchStart: "onTouchStart",
  onMouseDown: "onMouseDown",
  onMouseEnter: "onMouseEnter",
} as const;

type ValueOfEVENT = typeof EVENT[keyof typeof EVENT];

type Callback = () => void | Promise<void>;

interface ModalProps {
  createClose: <T extends ElementType = "button">(
    callback?: () => any | Promise<any>,
    options?: {
      onStart?: () => void | Promise<void>;
      onSuccess?: () => void | Promise<void>;
      onFailure?: (e: unknown) => void | Promise<void>;
      onClosed?: () => void | Promise<void>;
    }
  ) => (
    eventName?: ValueOfEVENT,
    injectAsyncStatus?: (
      status:
        | ReturnType<typeof createStatus.INITIAL>
        | ReturnType<typeof createStatus.PENDING>
        | ReturnType<typeof createStatus.SUCCESS>
        | ReturnType<typeof createStatus.FAILURE>
    ) => Partial<ComponentProps<T>>
  ) => Partial<{
    [key in keyof typeof EVENT]: Callback;
  }>;
}

interface ShowOptions {
  portalId?: string;
  adapter: (props: { children: ReactNode }) => ReactNode;
}

const show = (
  modal: (props: ModalProps) => ReactElement,
  options: ShowOptions = {
    portalId: DEFAULT_PORTAL_ID_PREFIX,
    adapter: DEFAULT_ADAPTER,
  }
) => {
  const { portalId = DEFAULT_PORTAL_ID_PREFIX, adapter = DEFAULT_ADAPTER } =
    options;

  const id =
    typeof portalId === "string" && portalId !== DEFAULT_PORTAL_ID_PREFIX
      ? portalId
      : `${DEFAULT_PORTAL_ID_PREFIX}-${new Date().getTime()}`;

  let portalEl = document.getElementById(id);

  if (!portalEl) {
    portalEl = document.createElement("div");
    portalEl.id = id;
    portalEl.style.left = "0";
    portalEl.style.right = "0";
    portalEl.style.top = "0";
    portalEl.style.bottom = "0";
    portalEl.style.zIndex = "9999";
    portalEl.style.position = "fixed";
    portalEl.style.display = "flex";
    portalEl.style.flexDirection = "column";
    portalEl.style.justifyContent = "center";
    portalEl.style.alignItems = "center";
  }

  document.body.appendChild(portalEl);

  const root = createRoot(portalEl);

  let status = createStatus.INITIAL();

  const render = () => {
    root.render(
      adapter({
        children: modal({
          createClose: (callback = async () => {}, options = undefined) => {
            return (eventName = "onClick", injectAsyncStatus?) => {
              const handleClose = async () => {
                status = createStatus.PENDING();
                options?.onStart?.();
                render();
                try {
                  if (injectAsyncStatus) {
                    await callback?.();
                  } else {
                    callback?.();
                  }
                  status = createStatus.SUCCESS();
                  options?.onSuccess?.();
                } catch (e: any) {
                  status = createStatus.FAILURE(e);
                  options?.onFailure?.(e);
                } finally {
                  render();
                  portalEl?.remove();
                  options?.onClosed?.();
                }
              };

              return {
                ...(injectAsyncStatus?.(status) ?? {}),
                ...{ [eventName]: handleClose },
              };
            };
          },
        }),
      })
    );
  };

  render();

  return id;
};

export default show;
