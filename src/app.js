import axios from 'axios';
import i18next from 'i18next';
import isValidRssUrl from './validator';
import parseRSSXML from './xmlRssFeedParser';
import strings from './locales/stringConstants';
import 'bootstrap/dist/js/bootstrap.bundle';
import { initView } from './view';
import {
  getLastPublishDate,
  isFeedUrlDuplicated,
  storeFeed,
  storePosts,
  watchedState,
} from './model';
import { appStates, FEED_REFRESH_TIMEOUT_MS } from './constants';
import { elements } from './render';
import ru from './locales/ru';

const routes = {
  proxy: (targetUrl) => {
    const proxyUrl = new URL('/get', 'https://hexlet-allorigins.herokuapp.com');
    proxyUrl.searchParams.set('disableCache', 'true');
    proxyUrl.searchParams.set('url', targetUrl);
    return targetUrl;
    // return proxyUrl.toString();
  },
};

const refreshFeed = (state, feed) => axios.get(routes.proxy(feed.link))
  .then((response) => parseRSSXML(response.data))
  .then((rssFeed) => {
    const newPosts = rssFeed.posts
      .filter((post) => post.publishDate > feed.lastUpdate);
    if (newPosts.length === 0) return;
    storePosts(state, newPosts);
    // eslint-disable-next-line no-param-reassign
    feed.lastUpdate = getLastPublishDate(newPosts);
  })
  .catch((err) => {
    console.error(`Failed to refresh feed: ${feed.link}`, err);
  });

const refreshAllFeeds = (state) => {
  window.setTimeout(() => Promise.all(state.feeds.map(
    (feed) => refreshFeed(state, feed),
  ))
    .then(() => {
      refreshAllFeeds(state);
    }), FEED_REFRESH_TIMEOUT_MS);
};

const addNewFeed = (state, link, onSuccess, onError) => axios.get(routes.proxy(link))
  .then((response) => parseRSSXML(response.data))
  .then((rssFeed) => {
    storeFeed(state, rssFeed, link);
    storePosts(state, rssFeed.posts);
  })
  .then(onSuccess)
  .catch((err) => onError(err));

export default async () => {
  await i18next.init({
    lng: 'ru',
    debug: false,
    resources: {
      ru,
    },
  });

  initView(watchedState);

  refreshAllFeeds(watchedState);
  // window.HTMLFormElement.prototype.submit = () => {
  // };
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
