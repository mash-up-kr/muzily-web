import type { ReactNode, ComponentType } from "react";
import show from "./show";

interface Adapter {
  component: ComponentType<any>;
  props: { [prop: string]: unknown };
}

const create = (adapters: Adapter[] = []) => {
  const adapter = ({ children }: { children: ReactNode }) =>
    adapters.reverse().reduce((acc, { component, props = {} }) => {
      const Component = component;

      return <Component {...props}>{acc}</Component>;
    }, children);

  return {
    show: (modal: Parameters<typeof show>[0]) => {
      show(modal, { adapter });
    },
  };
};

export default create;
