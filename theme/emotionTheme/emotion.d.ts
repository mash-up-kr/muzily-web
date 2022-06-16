import type { EmotionTheme } from "./index";
import "@emotion/react";

declare module "@emotion/react" {
  export interface Theme extends EmotionTheme {
    [x: string]: any;
  }
}
