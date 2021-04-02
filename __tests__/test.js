// @ts-check

import { promises as fs } from 'fs';
import path from 'path';
import isValidRssUrl from '../src/validator';

beforeEach(async () => {
  const pathToHtml = path.resolve(__dirname, '../src/index.html');
  const html = await fs.readFile(pathToHtml, 'utf8');
  document.body.innerHTML = html;
});

describe('test validator', () => {
  test('url validator negative', () => {
    expect(isValidRssUrl('htt4ps://ru.hexlet.io/lessons.rss'))
      .toBeFalsy();
    expect(isValidRssUrl('https:///ru.hexlet.io/lessons.rss/blah'))
      .toBeFalsy();
  });

  test('url validator positive', () => {
    expect(isValidRssUrl('http://lorem-rss.herokuapp.com/feed'))
      .toBeTruthy();
    expect(isValidRssUrl('https://ru.hexlet.io/lessons.rss'))
      .toBeTruthy();
  });
});
