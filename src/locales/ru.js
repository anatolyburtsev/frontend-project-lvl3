import strings from './stringConstants';

export default {
  translation: {
    [strings.alerts.invalidUrl]: 'Ссылка должна быть валидным URL',
    [strings.alerts.urlDuplicate]: 'RSS уже существует',
    [strings.alerts.invalidRssFeed]: 'Ресурс не содержит валидный RSS',
    [strings.alerts.rssAddedSuccessfully]: 'RSS успешно загружен',
    [strings.alerts.networkIssue]: 'Ошибка сети',
    [strings.feeds]: 'Фиды',
    [strings.posts]: 'Посты',
    [strings.view]: 'Просмотр',
    [strings.readFull]: 'Читать полностью',
    [strings.close]: 'Закрыть',
    [strings.error.xmlParsing]: 'XML parsing error',
    [strings.error.invalidRssRssNotFound]: 'Invalid rss format: rss element not found',
    [strings.error.invalidRssVersionNotFound]: 'Invalid rss format: rss version not found',
  },
};
