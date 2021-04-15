const parser = new DOMParser();

const validateRssFormat = (dom) => {
  const parserError = dom.querySelector('parsererror');
  if (parserError) {
    const errorText = dom.textContent;
    throw new Error(`XML parsing error: ${errorText}`);
  }
  const rss = dom.querySelector('rss');
  if (rss === null) {
    throw new Error('Invalid rss format: rss element not found');
  }
  const version = rss.getAttribute('version');
  if (version === null) {
    throw new Error('Invalid rss format: rss version not found');
  }
};

const parseRss = (xmlString) => {
  const rssXMLDom = parser.parseFromString(xmlString, 'application/xml');
  validateRssFormat(rssXMLDom);

  const title = rssXMLDom.querySelector('channel > title').textContent;
  const description = rssXMLDom.querySelector('channel > description').textContent;
  const items = rssXMLDom.querySelectorAll('channel > item');
  const posts = [...items.values()].map((item) => {
    const postTitle = item.querySelector('title').textContent;
    const postLink = item.querySelector('link').textContent;
    const postDescription = item.querySelector('description').textContent;
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
