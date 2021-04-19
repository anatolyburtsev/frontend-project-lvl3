import _ from 'lodash';
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
