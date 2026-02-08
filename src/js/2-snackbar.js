import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');

form.addEventListener('submit', handleForm);

function handleForm(event) {
  event.preventDefault();

  const delay = Number(event.currentTarget.elements.delay.value);
  const state = event.currentTarget.elements.state.value;

  createPromise(delay, state)
    .then(value => {
      iziToast.success({
        title: 'OK',
        message: `✅ Fulfilled promise in ${value}ms`,
        position: 'topRight',
      });
    })
    .catch(value => {
      iziToast.error({
        title: 'Error',
        message: `❌ Rejected promise in ${value}ms`,
        position: 'topRight',
      });
    });

  event.currentTarget.reset();
}

function createPromise(delay, state) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });
}
