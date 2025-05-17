
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const form = document.querySelector('.form');
const delayInput = form.querySelector('input[name="delay"]');
const stateInputs = form.querySelectorAll('input[name="state"]');

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

function showNotification(state, delay) {
  const message = `${state === 'fulfilled' ? '✅ Fulfilled' : '❌ Rejected'} promise in ${delay}ms`;

  if (state === 'fulfilled') {
    iziToast.success({
      title: 'Success',
      message,
      position: 'topRight',
      backgroundColor: '#4caf50',
      color: '#fff',
    });
  } else {
    iziToast.error({
      title: 'Error',
      message,
      position: 'topRight',
      backgroundColor: '#ff4d4d',
      color: '#fff',
    });
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const delay = Number(delayInput.value);
  const state = Array.from(stateInputs).find(input => input.checked)?.value;

  if (!state) {
    iziToast.warning({
      title: 'Warning',
      message: 'Please select a state (fulfilled/rejected)',
      position: 'topRight',
      backgroundColor: '#ffa500',
      color: '#fff',
    });
    return;
  }

  createPromise(delay, state)
    .then((delay) => showNotification('fulfilled', delay))
    .catch((delay) => showNotification('rejected', delay));

  form.reset();
});