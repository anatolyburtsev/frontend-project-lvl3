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
  }))
    .reverse();
  state.posts.push(...enrichedPosts);
};

export const initialState = {
  state: appStates.idle,
  error: '',
  feeds: [],
  posts: [],
};
