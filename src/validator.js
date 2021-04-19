import * as yup from 'yup';

const urlSchema = yup.string()
  .url()
  .required();

const isValidRssUrl = (string) => urlSchema.isValidSync(string);

export default isValidRssUrl;
