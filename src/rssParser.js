const parser = new DOMParser();

const validateRssFormat = (dom) => {
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

  const title = rssXMLDom.querySelector('title').innerHTML;
  const description = rssXMLDom.querySelector('description').innerHTML;
  const items = rssXMLDom.querySelectorAll('item');
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
