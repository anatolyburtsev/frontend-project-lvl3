import {
  getByText,
  screen,
  waitFor,
} from '@testing-library/dom';
import '@testing-library/jest-dom';
import fs from 'fs';
import path from 'path';
import i18next from 'i18next';
import nock from 'nock';
import userEvent from '@testing-library/user-event';
import App from '../src/app';
import en from '../__fixture__/test_locale_en';
import { ALL_ORIGINS_PROXY } from '../src/constants';

beforeAll(() => {
  nock.disableNetConnect();
  // axios.defaults.adapter = require('axios/lib/adapters/http');
});

const loadFixture = (filename) => {
  const pathToFixtures = path.resolve(__dirname, '../__fixture__/', filename);
  return fs.readFileSync(pathToFixtures, 'utf8');
};

const mockRssResponsePlainText = (string) => {
  nock(ALL_ORIGINS_PROXY)
    .get(/.*rss/)
    .reply(200, { contents: string }, { 'Access-Control-Allow-Origin': '*' });
};

const mockRssResponse = (filename) => {
  const rssResponse = loadFixture(filename);
  mockRssResponsePlainText(rssResponse);
};

const addFeedAndWaitFor = async (textToWait) => {
  userEvent.type(screen.getByTestId('urlInput'), 'http://example.com/rss');
  userEvent.click(screen.getByText('Add'));

  await waitFor(() => expect(screen.queryByText(textToWait))
    .toBeVisible());
};

beforeEach(async () => {
  const i18nInst = i18next.createInstance();
  await i18nInst.init({
    lng: 'en',
    debug: false,
    resources: {
      en,
    },
  });
  const pathToHtml = path.resolve(__dirname, '../index.html');
  const html = fs.readFileSync(pathToHtml, 'utf8');
  document.body.innerHTML = html;
  App(i18nInst);
});

describe('rss aggregator tests', () => {
  test('simple html only validation', () => {
    screen.getByText('Add');
    screen.getByTestId('urlInput');
    screen.getByText('RSS aggregator');
  });

  test('add feed with 2 posts, success', async () => {
    mockRssResponse('rssFeed2Posts.xml');
    await addFeedAndWaitFor('RSS feed added successfully');

    screen.getByText('Feeds');
    const feedsEl = screen.getByTestId('feeds');
    getByText(feedsEl, 'Feeds');
    getByText(feedsEl, 'RSS Title');
    getByText(feedsEl, 'RSS description');

    screen.getByText('Posts');
    const postsEl = screen.getByTestId('posts');
    getByText(postsEl, 'Posts');

    const post1 = getByText(postsEl, 'Post title 1');
    expect(post1.closest('a'))
      .toHaveAttribute('href', 'http://www.example.com/postlink1');
    getByText(post1.closest('li'), 'View');

    const post2 = getByText(postsEl, 'Post title 2');
    expect(post2.closest('a'))
      .toHaveAttribute('href', 'http://www.example.com/postlink2');
    getByText(post2.closest('li'), 'View');
  });

  test('add the same feed 2 times, error', async () => {
    mockRssResponse('rssFeed2Posts.xml');
    await addFeedAndWaitFor('RSS feed added successfully');

    await addFeedAndWaitFor('RSS already added');

    expect(screen.getAllByText('RSS Title').length)
      .toEqual(1);
  });

  test('invalid rss feed', async () => {
    mockRssResponsePlainText('invalid response');
    await addFeedAndWaitFor('Resource doesn\'t have a valid RSS');
  });

  test('network failure', async () => {
    nock(ALL_ORIGINS_PROXY)
      .get(/.*rss/)
      .reply(500, {}, { 'Access-Control-Allow-Origin': '*' });
    await addFeedAndWaitFor('Problems with the Internet');
  });

  test('invalid url', () => {
    userEvent.type(screen.getByTestId('urlInput'), 'invalid url');
    expect(screen.getByTestId('urlInput'))
      .not
      .toHaveClass('is-invalid');
    userEvent.click(screen.getByText('Add'));

    screen.getByText('Link must be a valid URL');
    expect(screen.getByTestId('urlInput'))
      .toHaveClass('is-invalid');
  });

  test('readonly mode when feed is adding', async () => {
    const rssResponse = loadFixture('rssFeed2Posts.xml');
    nock(ALL_ORIGINS_PROXY)
      .get(/.*rss/)
      .delay(100)
      .reply(200, { contents: rssResponse }, { 'Access-Control-Allow-Origin': '*' });

    userEvent.type(screen.getByTestId('urlInput'), 'http://example.com/rss');
    userEvent.click(screen.getByText('Add'));

    const addBtn = screen.getByText('Add')
      .closest('button');
    expect(addBtn)
      .toBeDisabled();

    const inputEl = screen.getByTestId('urlInput');
    expect(inputEl)
      .toHaveAttribute('readonly');

    await waitFor(() => expect(screen.queryByText('RSS feed added successfully'))
      .toBeVisible());

    expect(addBtn)
      .toBeEnabled();
    expect(inputEl)
      .not
      .toHaveAttribute('readonly');
  });

  // TODO: add test on modal

  // TODO: add test on auto update
});
