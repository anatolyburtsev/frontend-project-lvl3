// @ts-check

import 'bootstrap/dist/css/bootstrap.min.css';
import Example from './Example.js';

export default () => {
  const element = document.getElementById('point');
  const obj = new Example(element);
  obj.init();
};
