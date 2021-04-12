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

beforeAll(() => {
  nock.disableNetConnect();
});

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

afterEach(() => {
  nock.cleanAll();
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

  test('autoupdate works', async () => {
    const rssResponse1Post = loadFixture('rssFeed1Post.xml');
    const rssResponse2Posts = loadFixture('rssFeed2Posts.xml');
    nock(ALL_ORIGINS_PROXY)
      .get(/.*feed/)
      .reply(200, { contents: rssResponse1Post }, { 'Access-Control-Allow-Origin': '*' })
      .get(/.*feed/)
      .reply(200, { contents: rssResponse2Posts }, { 'Access-Control-Allow-Origin': '*' });
    // await addFeedAndWaitFor('RSS feed added successfully');
    userEvent.type(screen.getByTestId('urlInput'), 'http://example.com/feed');
    userEvent.click(screen.getByText('Add'));

    await waitFor(() => expect(screen.queryByText('RSS feed added successfully'))
      .toBeVisible());

    expect(screen.queryByText('Post title 2'))
      .not
      .toBeInTheDocument();

    await waitFor(() => expect(screen.queryByText('Post title 2'))
      .toBeVisible(), { timeout: 5500 });
    expect(screen.queryByText('Post title 1'))
      .toBeInTheDocument();
  }, 6000);

  test('verify modal content', async () => {
    mockRssResponse('rssFeed2Posts.xml');
    await addFeedAndWaitFor('RSS feed added successfully');

    await waitFor(() => expect(screen.queryByText('Post title 1'))
      .toBeVisible());

    const modal = screen.getByTestId('modal');
    expect(modal)
      .not
      .toHaveClass('show');

    const post1 = screen.getByText('Post title 1')
      .closest('li');
    getByText(post1, 'View')
      .click();

    await waitFor(() => expect(modal)
      .toHaveClass('show'));

    expect(getByText(modal, 'Post title 1'))
      .toBeVisible();
    expect(getByText(modal, 'Post description 1'))
      .toBeVisible();
    const linkBtn1 = screen.getByText('More information...')
      .closest('a');
    expect(linkBtn1)
      .toHaveAttribute('href', 'http://www.example.com/postlink1');

    getByText(modal, 'Close')
      .closest('button')
      .click();

    // TODO: doesn't work, fix it
    // await waitFor(() => expect(modal)
    //   .not
    //   .toHaveClass('show'), { timeout: 3000 });

    const post2 = screen.getByText('Post title 2')
      .closest('li');
    getByText(post2, 'View')
      .click();

    expect(getByText(modal, 'Post title 2'))
      .toBeVisible();
    expect(getByText(modal, 'Post description 2'))
      .toBeVisible();
    const linkBtn2 = screen.getByText('More information...')
      .closest('a');
    expect(linkBtn2)
      .toHaveAttribute('href', 'http://www.example.com/postlink2');
  });
});
