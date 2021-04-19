// eslint-disable-next-line import/prefer-default-export
export const appStates = Object.freeze({
  idle: 'idle',
  processing: 'processing',
  success: 'success',
  invalidUrl: 'invalid url',
  generalError: 'invalid rss feed',
});

export const FEED_REFRESH_TIMEOUT_MS = 3000;
