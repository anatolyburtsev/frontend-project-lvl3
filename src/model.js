import _ from 'lodash';
import { appStates } from './constants';

export const isFeedUrlDuplicated = (feeds, url) => {
  const idx = feeds.findIndex((feed) => feed.link === url);
  return idx > -1;
};

export const storeFeed = (state, rssFeed, url) => {
  state.feeds.push({
    link: url,
    ...rssFeed.feed,
  });
};

export const filterNewPosts = (state, posts) => {
  const currentPostLinks = state.posts.map((p) => p.link);
  return posts.filter((p) => !currentPostLinks.includes(p.link));
};

export const storePosts = (state, posts) => {
  const firstIdx = state.posts.length;
  const enrichedPosts = posts.map((post, idx) => ({
    id: firstIdx + idx,
    ...post,
  }));
  state.posts.unshift(...enrichedPosts);
};

const initialState = {
  state: appStates.idle,
  ui: {
    modal: {
      postId: null,
    },
    visitedPosts: new Set(),
  },
  error: null,
  feeds: [],
  posts: [],
};

export const getInitialState = () => _.cloneDeep(initialState);
