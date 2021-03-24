import onChange from 'on-change';
import axios from 'axios';
import isValidRssUrl from './validator';
import elements from './elements';
import updateView from './view';
import xmlRssFeedParser from './xmlRssFeedParser';

const isFeedUrlDuplicated = (feeds, url) => {
  const idx = feeds.findIndex((feed) => feed.link === url);
  return idx > -1;
};

export default () => {
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
      watchedState.feed.error = 'invalid url';
      return;
    }

    if (isFeedUrlDuplicated(watchedState.feeds, feedUrl)) {
      watchedState.feed.error = 'feed duplicate';
      return;
    }

    const axiosClient = axios.create({ timeout: 3000 });

    axiosClient.get(feedUrl)
      .then((response) => {
        const rssFeed = xmlRssFeedParser(feedUrl, response.data);

        watchedState.feeds.push(rssFeed.feed);
        watchedState.posts = [...watchedState.posts, ...rssFeed.posts];
      })
      .then(() => {
        inputUrlEl.value = '';
        watchedState.feed.error = '';
      })
      .catch((err) => {
        console.log('CAUGHT Error!');
        console.log(err);
        watchedState.feed.error = 'Problem with resource';
      });
  });
};
