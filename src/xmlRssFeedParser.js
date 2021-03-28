const parser = new DOMParser();

// const tryParseXML = (xmlString) => {
//   const parsererrorNS = parser.parseFromString('INVALID', 'application/xml')
//     .getElementsByTagName('parsererror')[0].namespaceURI;
//   const dom = parser.parseFromString(xmlString, 'application/xml');
//   if (dom.getElementsByTagNameNS(parsererrorNS, 'parsererror').length > 0) {
//     throw new Error('Error parsing XML');
//   }
//   return dom;
// };

const unsafeParseXML = (xmlString) => parser.parseFromString(xmlString, 'application/xml');

const validateRssFormat = (dom) => {
  const rss = dom.querySelector('rss');
  if (rss === null) {
    throw new Error('Invalid rss format');
  }
  const version = rss.getAttribute('version');
  if (version === null) {
    throw new Error('Invalid rss format');
  }
};

const parseRss = (xmlString) => {
  const rssFeedDom = unsafeParseXML(xmlString);
  // const rssFeedDom = tryParseXML(xmlString);
  validateRssFormat(rssFeedDom);

  const title = rssFeedDom.querySelector('title').innerHTML;
  const description = rssFeedDom.querySelector('description').innerHTML;
  const items = rssFeedDom.querySelectorAll('item');
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
