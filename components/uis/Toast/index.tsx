import { ThemeProvider } from "@emotion/react";
import styled from "@emotion/styled";
import { AnimatePresence, motion } from "framer-motion";
import Toast from "~/libs/Toast";
import { emotionTheme } from "~/theme";

export default new Toast({
  Adapter: ({ children }) => (
    <ThemeProvider theme={emotionTheme}>{children}</ThemeProvider>
  ),
  ToastItem: ({ children, isShow, options }) => (
    <AnimatePresence>
      {isShow && (
        <>
          <ProgressBar
            style={{
              animationDuration: `${options.duration}ms`,
              margin: "0 16px",
            }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
          />
          <Container
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
          >
            {children}
          </Container>
        </>
      )}
    </AnimatePresence>
  ),
});

const Container = styled(motion.div)`
  padding: 16px;
  background-color: rgba(0, 0, 0, 0.5);
  margin: 0 16px 16px 16px;
  backdrop-filter: blur(10px);
  box-shadow: 0 16px 32px -16px rgba(0, 0, 0, 0.4);
`;

const ProgressBar = styled(motion.div)`
  height: 4px;
  background-color: ${({ theme }) => theme.colors.blue0500};
  animation-name: progress;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
  @keyframes progress {
    0% {
      width: 0;
    }
    100% {
      width: calc(100% - 32px);
    }
  }
`;
