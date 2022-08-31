import { css, ThemeProvider } from "@emotion/react";
import styled from "@emotion/styled";
import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion";
import Toast from "~/libs/Toast";
import { emotionTheme } from "~/theme";

const badge = {
  success: "✅",
  error: "⛔️",
  warning: "🚧",
  info: "ⓘ",
} as const;

interface ExtraOptions {
  isShowClose?: boolean;
}

export default new Toast<ExtraOptions>({
  defaultOptions: { duration: 4000, delay: 100, status: "info" },
  Adapter: ({ children }) => (
    <ThemeProvider theme={emotionTheme}>
      <AnimateSharedLayout>{children}</AnimateSharedLayout>
    </ThemeProvider>
  ),
  Template: ({
    content,
    isShow,
    options: { delay, duration, status, isShowClose = true },
    close,
  }) => {
    return (
      <AnimatePresence>
        {isShow && (
          <Container
            layout
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { delay: delay / 1000 } }}
            exit={{
              y: -20,
              opacity: 0,
              transition: { duration: delay / 1000 },
            }}
          >
            <ProgressBar style={{ animationDuration: `${duration}ms` }} />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                paddingLeft: 16,
              }}
            >
              {status && badge[status]}
              <Wrapper>{content}</Wrapper>
            </div>
            {isShowClose && (
              <span
                css={css`
                  position: absolute;
                  top: 4px;
                  right: 4px;
                `}
                onClick={close}
              >
                ×
              </span>
            )}
          </Container>
        )}
      </AnimatePresence>
    );
  },
});

const Container = styled(motion.div)`
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  margin: 0 16px 16px 16px;
  backdrop-filter: blur(10px);
  box-shadow: 0 16px 32px -16px rgba(0, 0, 0, 0.4);
  border-radius: 16px;
  overflow: hidden;
`;

const Wrapper = styled.div`
  flex: 1;
  padding: 16px;
`;

const ProgressBar = styled(motion.div)`
  position: fixed;
  top: 0;
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
      width: 100%;
    }
  }
`;
