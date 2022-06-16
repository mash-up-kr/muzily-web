import colors from "./colors";
import gaps from "./gaps";
import sizes from "./sizes";

const emotionTheme = {
  colors,
  gaps,
  sizes,
} as const;

export default emotionTheme;

export type EmotionTheme = typeof emotionTheme;
