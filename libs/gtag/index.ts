export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";

export const gtagPageView = (url: string) => {
  window.gtag("config", GA_TRACKING_ID, {
    page_path: url,
  });
};
