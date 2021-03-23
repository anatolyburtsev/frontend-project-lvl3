import * as yup from 'yup';

const urlSchema = yup.string()
  .url();
  // .matches(/(\.rss$|\.xml$)/);

const isValidRssUrl = (string) => urlSchema.isValidSync(string);

export default isValidRssUrl;
