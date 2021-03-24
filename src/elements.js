const inputUrlEl = () => {
  return document.querySelector('input[name="url"]');
};

const feedbackEl = () => {
  return document.querySelector('.feedback');
};

export default {
  inputUrlEl,
  feedbackEl,
};
