// eslint-disable-next-line import/prefer-default-export
export const appStates = Object.freeze({
  idle: 'idle',
  processing: 'processing',
  success: 'success',
  invalidUrl: 'invalid url',
  generalError: 'invalid rss feed',
});

export const FEED_REFRESH_TIMEOUT_MS = 5000;

export const ALL_ORIGINS_PROXY = 'https://hexlet-allorigins.herokuapp.com';
