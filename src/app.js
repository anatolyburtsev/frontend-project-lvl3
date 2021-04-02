import i18next from 'i18next';
import axios from 'axios';
import en from './locales/en';
import isValidRssUrl from './validator';
import parseRSSXML from './xmlRssFeedParser';
import strings from './locales/stringConstants';
import 'bootstrap/dist/js/bootstrap.bundle';
import { formEl, initView } from './view';
import {
  getLastPublishDate,
  isFeedUrlDuplicated,
  storeFeed,
  storePosts,
  watchedState,
} from './model';
import { appStates } from './constants';

const refreshFeed = (state, feed) => axios.get(feed.link)
  .then((response) => parseRSSXML(response.data))
  .then((rssFeed) => {
    const newPosts = rssFeed.posts
      .filter((post) => post.publishDate > feed.lastUpdate);
    if (newPosts.length === 0) return;
    console.log('new posts are found');
    storePosts(state, newPosts);
    // eslint-disable-next-line no-param-reassign
    feed.lastUpdate = getLastPublishDate(newPosts);
  })
  .catch((err) => {
    console.error(`Failed to refresh feed: ${feed.link}`, err);
  });

const refreshAllFeeds = (state) => {
  console.log('refresh all feeds');
  window.setTimeout(() => Promise.all(state.feeds.map(
    (feed) => refreshFeed(state, feed),
  ))
    .then(() => {
      refreshAllFeeds(state);
    }), 5000);
};

const addNewFeed = (state, link, onSuccess, onError) => axios.get(link)
  .then((response) => parseRSSXML(response.data))
  .then((rssFeed) => {
    storeFeed(state, rssFeed, link);
    storePosts(state, rssFeed.posts);
  })
  .then(onSuccess)
  .catch((err) => onError(err));

export default () => {
  i18next.init({
    lng: 'en',
    debug: true,
    resources: {
      en,
    },
  });

  watchedState.feeds.push({
    link: 'http://www.ya.ru',
    lastUpdate: new Date(),
    title: 'title',
    description: 'description',
  });

  watchedState.posts.push({
    id: 0,
    visited: false,
    title: 'post title',
    description: 'post description',
    link: 'https://www.google.com',
    publishDate: new Date(),
  });

  watchedState.posts.push({
    id: 1,
    visited: true,
    title: 'post title 2',
    description: 'post description 2',
    link: 'https://www.google.com',
    publishDate: new Date(),
  });

  initView(watchedState);

  // temporary disabled
  refreshAllFeeds(watchedState);

  formEl.addEventListener('submit', async (e) => {
    e.preventDefault();
    watchedState.state = appStates.processing;
    const formData = new FormData(formEl);
    const feedUrl = formData.get('url');
    if (!isValidRssUrl(feedUrl)) {
      watchedState.state = appStates.invalidUrl;
      return;
    }

    if (isFeedUrlDuplicated(watchedState.feeds, feedUrl)) {
      watchedState.error = strings.alerts.urlDuplicate;
      watchedState.state = appStates.generalError;
      return;
    }

    addNewFeed(watchedState, feedUrl, () => {
      watchedState.error = '';
      watchedState.state = appStates.success;
    }, (err) => {
      console.error(err);
      watchedState.error = strings.alerts.invalidRssFeed;
      watchedState.state = appStates.generalError;
    });
  });
};
