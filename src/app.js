import onChange from 'on-change';
import i18next from 'i18next';
import $ from 'jquery';
import axiosClient from './tools';
import en from './locales/en';
import isValidRssUrl from './validator';
import elements from './elements';
import updateView from './view';
import xmlRssFeedParser from './xmlRssFeedParser';
import strings from './locales/stringConstants';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';

const isFeedUrlDuplicated = (feeds, url) => {
  const idx = feeds.findIndex((feed) => feed.link === url);
  return idx > -1;
};

const getLastPublishDate = (posts) => {
  const publishDates = posts.map((post) => post.publishDate);
  const maxPublishDate = Math.max(...publishDates);
  return new Date(maxPublishDate);
};

const storeFeed = (state, rssFeed, url) => {
  const latestPublishDate = getLastPublishDate([...rssFeed.posts]);
  state.feeds.push({
    link: url,
    lastUpdate: latestPublishDate,
    ...rssFeed.feed,
  });
};

const storePosts = (state, posts) => {
  const firstIdx = state.posts.length;
  const enrichedPosts = posts.map((post, idx) => ({
    id: firstIdx + idx,
    visited: false,
    ...post,
  }));
  state.posts.push(...enrichedPosts);
};

const refreshFeed = (state, feed) => axiosClient.get(feed.link)
  .then((response) => xmlRssFeedParser(response.data))
  .then((rssFeed) => {
    const newPosts = rssFeed.posts
      .filter((post) => post.publishDate > feed.lastUpdate);
    if (newPosts.length === 0) return;
    console.log('new posts are found');
    storePosts(state, newPosts);
    const newLastUpdate = getLastPublishDate(newPosts);
    // eslint-disable-next-line no-param-reassign
    feed.lastUpdate = newLastUpdate;
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

const addNewFeed = (state, link, onSuccess, onError, onFinally) => axiosClient.get(link)
  .then((response) => xmlRssFeedParser(response.data))
  .then((rssFeed) => {
    storeFeed(state, rssFeed, link);
    storePosts(state, rssFeed.posts);
  })
  .then(onSuccess)
  .catch((err) => onError(err))
  .finally(onFinally);

const getPostById = (state, id) => state.posts[id];

const setupModal = (state) => {
  $('#modal')
    .on('show.bs.modal', (event) => {
      const btn = event.relatedTarget;
      const { id } = btn.dataset;
      const post = getPostById(state, id);
      post.visited = true;
      const modalTitleEl = elements.modalTitleEl();
      const modalBodyEl = elements.modalBodyEl();
      const modalMoreInfoEl = elements.modalMoreInfoBtnEl();
      modalTitleEl.textContent = post.title;
      modalBodyEl.textContent = post.description;
      modalMoreInfoEl.setAttribute('href', post.link);
    });
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
      processing: false,
    },
    feeds: [],
    posts: [],
  };

  const inputUrlEl = elements.inputUrlEl();
  const formEl = elements.formEl();

  const watchedState = onChange(state, (path, value) => {
    console.log('state update');
    console.log(`path: ${path} value: ${value}`);
    console.dir(watchedState);
    updateView(path, value, watchedState);
  });

  watchedState.feeds.push({
    link: 'ya.ru',
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

  setupModal(watchedState);

  refreshAllFeeds(watchedState);

  formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(formEl);
    const feedUrl = formData.get('url');
    const isUrlValid = isValidRssUrl(feedUrl);
    watchedState.feed.urlValid = isUrlValid;
    if (!isUrlValid) {
      watchedState.feed.error = strings.invalidUrl;
      return;
    }

    if (isFeedUrlDuplicated(watchedState.feeds, feedUrl)) {
      watchedState.feed.error = strings.urlDuplicate;
      return;
    }

    watchedState.feed.processing = true;
    addNewFeed(watchedState, feedUrl, () => {
      inputUrlEl.value = '';
      watchedState.feed.error = '';
    }, (err) => {
      console.log('CAUGHT Error!');
      console.log(err);
      watchedState.feed.error = strings.rssFeedNotFound;
    }, () => {
      watchedState.feed.processing = false;
    });
  });
};
