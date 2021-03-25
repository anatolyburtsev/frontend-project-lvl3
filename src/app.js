import onChange from 'on-change';
import axios from 'axios';
import i18next from 'i18next';
import en from './locales/en';
import isValidRssUrl from './validator';
import elements from './elements';
import updateView from './view';
import xmlRssFeedParser from './xmlRssFeedParser';
import errors from './locales/errors';

const isFeedUrlDuplicated = (feeds, url) => {
  const idx = feeds.findIndex((feed) => feed.link === url);
  return idx > -1;
};

const storeFeed = (watchedState, rssFeed, url) => {
  watchedState.feeds.push({ link: url, ...rssFeed.feed });
};

const storePosts = (watchedState, posts) => {
  const firstIdx = watchedState.posts.length;
  const postsWithId = posts.map((post, idx) => ({ id: firstIdx + idx, ...post }));
  watchedState.posts.push(...postsWithId);
};

export default () => {
  i18next.init({
    lng: 'en',
    debug: true,
    resources: {
      en,
    },
  });

  const state = {
    feed: {
      urlValid: true,
      error: false,
    },
    feeds: [],
    posts: [],
  };

  const inputUrlEl = elements.inputUrlEl();

  const watchedState = onChange(state, (path, value) => {
    console.log('state update');
    console.log(`path: ${path} value: ${value}`);
    console.dir(watchedState);
    updateView(path, value);
  });

  const form = document.querySelector('.rss-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.feed.error = '';
    const formData = new FormData(form);
    const feedUrl = formData.get('url');
    const isUrlValid = isValidRssUrl(feedUrl);
    watchedState.feed.urlValid = isUrlValid;
    if (!isUrlValid) {
      watchedState.feed.error = errors.invalidUrl;
      return;
    }

    if (isFeedUrlDuplicated(watchedState.feeds, feedUrl)) {
      watchedState.feed.error = errors.urlDuplicate;
      return;
    }

    const axiosClient = axios.create({ timeout: 3000 });

    axiosClient.get(feedUrl)
      .then((response) => xmlRssFeedParser(response.data))
      .then((rssFeed) => {
        storeFeed(watchedState, rssFeed, feedUrl);
        storePosts(watchedState, rssFeed.posts);
      })
      .then(() => {
        inputUrlEl.value = '';
        watchedState.feed.error = '';
      })
      .catch((err) => {
        console.log('CAUGHT Error!');
        console.log(err);
        watchedState.feed.error = errors.rssFeedNotFound;
      });
  });
};
