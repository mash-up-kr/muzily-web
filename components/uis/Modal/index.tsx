import type { ReactNode } from "react";
import { ThemeProvider } from "@emotion/react";
import Modal, { createModal, useModal } from "~/libs/Modal";
import { emotionTheme } from "~/theme";

const themedModal = createModal(({ children }: { children: ReactNode }) => (
  <ThemeProvider theme={emotionTheme}>{children}</ThemeProvider>
));
const showModal = themedModal.show;

export default Modal;
export { showModal, useModal };
