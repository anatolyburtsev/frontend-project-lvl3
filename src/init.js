// @ts-check

import Example from './Example.js';
import 'bootstrap/dist/css/bootstrap.min.css';

export default () => {
  const element = document.getElementById('point');
  const obj = new Example(element);
  obj.init();
};
