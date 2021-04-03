import onChange from 'on-change';
import { updateView } from './view';
import { appStates } from './constants';

export const isFeedUrlDuplicated = (feeds, url) => {
  const idx = feeds.findIndex((feed) => feed.link === url);
  return idx > -1;
};

export const getLastPublishDate = (posts) => {
  const publishDates = posts.map((post) => post.publishDate);
  const maxPublishDate = Math.max(...publishDates);
  return new Date(maxPublishDate);
};

export const storeFeed = (state, rssFeed, url) => {
  const latestPublishDate = getLastPublishDate([...rssFeed.posts]);
  state.feeds.push({
    link: url,
    lastUpdate: latestPublishDate,
    ...rssFeed.feed,
  });
};

export const storePosts = (state, posts) => {
  const firstIdx = state.posts.length;
  const enrichedPosts = posts.map((post, idx) => ({
    id: firstIdx + idx,
    visited: false,
    ...post,
  })).reverse();
  state.posts.push(...enrichedPosts);
};

const state = {
  state: appStates.idle,
  error: '',
  feeds: [],
  posts: [],
};

export const watchedState = onChange(state, (path, value, previousValue) => {
  console.log('state update');
  console.log(`path: ${path}, value:`);
  console.dir(value);
  updateView(path, value, previousValue, watchedState);
});
