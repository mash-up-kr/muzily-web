import type {
  ComponentProps,
  ComponentType,
  ElementType,
  FunctionComponent,
  ReactNode,
} from "react";
import { createRoot } from "react-dom/client";
import { DEFAULT_PORTAL_ID_PREFIX } from "../../constants";

export const DEFAULT_ADAPTERS: FunctionComponent<{ children: ReactNode }> = (
  props
) => <>{props.children}</>;

type Status = ReturnType<typeof createStatus[keyof typeof createStatus]>;

const createStatus = {
  INITIAL: () => ({
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: null,
    data: null,
  }),
  PENDING: () => ({
    isLoading: true,
    isSuccess: false,
    isError: false,
    error: null,
    data: null,
  }),
  SUCCESS: (data: unknown) => ({
    isLoading: false,
    isSuccess: true,
    isError: false,
    error: null,
    data,
  }),
  FAILURE: (error: unknown) => ({
    isLoading: false,
    isSuccess: false,
    isError: true,
    error,
    data: null,
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

interface ShowOptions {
  portalId?: string;
  adapters: ComponentType<{ children: ReactNode }>;
}

const show = (
  createModal: FunctionComponent<{
    createClose: <T extends ElementType = "button", D = any>(
      callback?: () => D | Promise<D>,
      options?: {
        onStart?: () => void | Promise<void>;
        onSuccess?: (data: D) => void | Promise<void>;
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
  }>,
  options: ShowOptions = {
    portalId: DEFAULT_PORTAL_ID_PREFIX,
    adapters: DEFAULT_ADAPTERS,
  }
) => {
  const {
    portalId = DEFAULT_PORTAL_ID_PREFIX,
    adapters: Adapters = DEFAULT_ADAPTERS,
  } = options;

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
    portalEl.style.position = "fixed";
    portalEl.style.display = "flex";
    portalEl.style.flexDirection = "column";
    portalEl.style.justifyContent = "center";
    portalEl.style.alignItems = "center";
  }

  document.body.appendChild(portalEl);

  let status: Status = createStatus.INITIAL();

  const root = createRoot(portalEl);

  const CreateModal = createModal;

  const render = () =>
    root.render(
      <Adapters>
        <CreateModal
          createClose={(callback?, options?) =>
            (eventName = "onClick", injectAsyncStatus?) => ({
              ...(injectAsyncStatus?.(status) ?? {}),
              ...{
                [eventName]: async () => {
                  if (callback) {
                    status = createStatus.PENDING();
                    options?.onStart?.();
                    render();

                    try {
                      const result = await callback();
                      status = createStatus.SUCCESS(result);
                      options?.onSuccess?.(result);
                      render();
                    } catch (e: unknown) {
                      status = createStatus.FAILURE(e);
                      options?.onFailure?.(e);
                      render();
                    }
                  }

                  portalEl?.remove();
                  options?.onClosed?.();
                  render();
                  root.unmount();
                },
              },
            })}
        />
      </Adapters>
    );

  render();

  return root;
};

export default show;
