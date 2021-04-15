import 'bootstrap/dist/js/bootstrap.min';
import axios from 'axios';
import onChange from 'on-change';
import _ from 'lodash';
import isValidRssUrl from './validator';
import parseRSSXML from './rssParser';
import strings from './locales/stringConstants';
import { updateView } from './view/view';
import {
  getLastPublishDate, initialState,
  isFeedUrlDuplicated,
  storeFeed,
  storePosts,
} from './model';
import { getElements } from './view/render';
import { appStates } from './constants';

const routes = {
  proxy: (targetUrl) => {
    const ALL_ORIGINS_PROXY = 'https://hexlet-allorigins.herokuapp.com';
    const proxyUrl = new URL('/get', ALL_ORIGINS_PROXY);
    proxyUrl.searchParams.set('disableCache', 'true');
    proxyUrl.searchParams.set('url', targetUrl);
    return proxyUrl.toString();
  },
};

const refreshFeed = (state, feed) => axios.get(routes.proxy(feed.link))
  .then((response) => parseRSSXML(response.data.contents))
  .then((rssFeed) => {
    const newPosts = rssFeed.posts
      .filter((post) => post.publishDate > feed.lastUpdate);
    if (newPosts.length === 0) return;
    storePosts(state, newPosts);
    feed.lastUpdate = getLastPublishDate(newPosts);
  })
  .catch((err) => {
    console.error(`Failed to refresh feed: ${feed.link}`, err);
  });

const refreshAllFeeds = (state) => {
  const FEED_REFRESH_TIMEOUT_MS = 3000;
  window.setTimeout(() => Promise.all(state.feeds.map(
    (feed) => refreshFeed(state, feed),
  ))
    .then(() => {
      refreshAllFeeds(state);
    }), FEED_REFRESH_TIMEOUT_MS);
};

const addNewFeed = (state, link) => axios
  .get(routes.proxy(link))
  .then((response) => parseRSSXML(response.data.contents))
  .then((rssFeed) => {
    storeFeed(state, rssFeed, link);
    storePosts(state, rssFeed.posts);
  })
  .then(() => {
    state.error = '';
    state.state = appStates.success;
  })
  .catch((err) => {
    console.error(err);
    if (err.request) {
      state.error = strings.alerts.networkIssue;
      state.state = appStates.generalError;
    } else {
      state.error = strings.alerts.invalidRssFeed;
      state.state = appStates.generalError;
    }
  });

export default (i18Instance) => {
  const elements = getElements(document);
  const watchedState = onChange(_.cloneDeep(initialState), (path, value, previousValue) => {
    updateView(path, value, previousValue, watchedState, elements, i18Instance);
  });

  refreshAllFeeds(watchedState);

  elements.formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.state = appStates.processing;
    const formData = new FormData(elements.formEl);
    const feedUrl = formData.get('url')
      .trim();
    if (!isValidRssUrl(feedUrl)) {
      watchedState.state = appStates.invalidUrl;
      return;
    }

    if (isFeedUrlDuplicated(watchedState.feeds, feedUrl)) {
      watchedState.error = strings.alerts.urlDuplicate;
      watchedState.state = appStates.generalError;
      return;
    }

    addNewFeed(watchedState, feedUrl);
  });

  elements.postsEl.addEventListener('click', (event) => {
    const postId = event.target.dataset.id;
    if (!postId) {
      return;
    }

    watchedState.ui.visitedPosts.add(postId);
    watchedState.ui.modal.postId = postId;
  });
};
