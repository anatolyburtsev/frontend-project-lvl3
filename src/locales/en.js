import strings from './stringConstants';

export default {
  translation: {
    [strings.alerts.invalidUrl]: 'Link must be a valid URL',
    [strings.alerts.urlDuplicate]: 'RSS already added',
    [strings.alerts.invalidRssFeed]: 'Resource doesn\'t have a valid RSS',
    [strings.alerts.rssAddedSuccessfully]: 'RSS feed added successfully',
    [strings.alerts.networkIssue]: 'Network issue',
    [strings.feeds]: 'Feeds',
    [strings.posts]: 'Posts',
    [strings.view]: 'View',
    [strings.readFull]: 'Read more',
    [strings.close]: 'Close',
    [strings.error.xmlParsing]: 'XML parsing error',
    [strings.error.invalidRssRssNotFound]: 'Invalid rss format: rss element not found',
    [strings.error.invalidRssVersionNotFound]: 'Invalid rss format: rss version not found',
  },
};
