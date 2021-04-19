import stringConstants from './locales/stringConstants';

const validateRssFormat = (dom, i18Instance) => {
  const parserError = dom.querySelector('parsererror');
  if (parserError) {
    const errorText = dom.textContent;
    throw new Error(`${i18Instance.t(stringConstants.error.xmlParsing)} ${errorText}`);
  }
  const rss = dom.querySelector('rss');
  if (rss === null) {
    throw new Error(i18Instance.t(stringConstants.error.invalidRssRssNotFound));
  }
  const version = rss.getAttribute('version');
  if (version === null) {
    throw new Error(i18Instance.t(stringConstants.error.invalidRssVersionNotFound));
  }
};

const parseRss = (xmlString, i18Instance) => {
  const parser = new DOMParser();
  const rssXMLDom = parser.parseFromString(xmlString, 'application/xml');
  validateRssFormat(rssXMLDom, i18Instance);

  const titleEl = rssXMLDom.querySelector('channel > title');
  const title = titleEl.textContent;
  const descriptionEl = rssXMLDom.querySelector('channel > description');
  const description = descriptionEl.textContent;
  const items = rssXMLDom.querySelectorAll('channel > item');
  const posts = [...items.values()].map((item) => {
    const postTitleEl = item.querySelector('title');
    const postTitle = postTitleEl.textContent;
    const postLinkEl = item.querySelector('link');
    const postLink = postLinkEl.textContent;
    const postDescriptionEl = item.querySelector('description');
    const postDescription = postDescriptionEl.textContent;
    const pubDate = new Date(item.querySelector('pubDate').textContent);
    return {
      title: postTitle,
      link: postLink,
      description: postDescription,
      publishDate: pubDate,
    };
  });

  return {
    feed: {
      title,
      description,
    },
    posts,
  };
};

export default parseRss;
