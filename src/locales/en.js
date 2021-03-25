import errors from './errors';

export default {
  translation: {
    [errors.invalidUrl]: 'Link must be a valid URL',
    [errors.urlDuplicate]: 'RSS already added',
    [errors.rssFeedNotFound]: 'Resource doesn\'t have a valid RSS',
    feeds: 'Feeds',
    posts: 'Posts',
    view: 'View',
  },
};
