import { ThemeProvider } from "@emotion/react";
import styled from "@emotion/styled";
import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion";
import Toast from "~/libs/Toast";
import { emotionTheme } from "~/theme";

export default new Toast({
  Adapter: ({ children }) => (
    <ThemeProvider theme={emotionTheme}>
      <AnimateSharedLayout>{children}</AnimateSharedLayout>
    </ThemeProvider>
  ),
  Template: ({ content, isShow, options: { delay, duration, status } }) => {
    let badge = null;

    switch (status) {
      case "success": {
        badge = "✅";
        break;
      }
      case "error": {
        badge = "⛔️";
        break;
      }
      case "warning": {
        badge = "🚧";
        break;
      }
      case "info": {
        badge = "🍋";
        break;
      }
      default: {
        badge = "";
      }
    }

    return (
      <AnimatePresence>
        {isShow && (
          <Container
            layout
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
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
                gap: 12,
                paddingLeft: 16,
              }}
            >
              {badge}
              <Wrapper>{content}</Wrapper>
            </div>
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
