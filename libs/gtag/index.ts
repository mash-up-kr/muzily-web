export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";

export const gtagPageView = (url: string) => {
  const debugMode =
    process.env.NODE_ENV !== "production" ? { debug_mode: true } : {};
  window.gtag("config", GA_TRACKING_ID, {
    page_path: url,
    ...debugMode,
  });
};
