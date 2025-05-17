
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const startButton = document.querySelector('[data-start]');
const dateTimePicker = document.getElementById('datetime-picker');
const daysSpan = document.querySelector('[data-days]');
const hoursSpan = document.querySelector('[data-hours]');
const minutesSpan = document.querySelector('[data-minutes]');
const secondsSpan = document.querySelector('[data-seconds]');

let userSelectedDate = null;
let countdownInterval = null;

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function updateTimer({ days, hours, minutes, seconds }) {
  daysSpan.textContent = addLeadingZero(days);
  hoursSpan.textContent = addLeadingZero(hours);
  minutesSpan.textContent = addLeadingZero(minutes);
  secondsSpan.textContent = addLeadingZero(seconds);
}

function startCountdown() {
  const currentDate = new Date().getTime();
  const timeLeft = userSelectedDate - currentDate;

  if (timeLeft <= 0) {
    clearInterval(countdownInterval);
    updateTimer({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    iziToast.info({
      title: 'Done',
      message: 'Time is up!',
      position: 'topRight',
      backgroundColor: '#4caf50',
      color: '#fff',
    });
    startButton.disabled = true;
    dateTimePicker.disabled = false;
    return;
  }

  const timeComponents = convertMs(timeLeft);
  updateTimer(timeComponents);
}

flatpickr(dateTimePicker, {
  enableTime: true,
  time_24hr: true,
  dateFormat: "Y-m-d H:i",
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const currentDate = new Date();
    userSelectedDate = selectedDates[0];

    if (userSelectedDate <= currentDate) {
      startButton.disabled = true;
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
        backgroundColor: '#ff4d4d',
        color: '#fff',
      });
    } else {
      startButton.disabled = false;
    }
  },
});

startButton.addEventListener('click', () => {
  if (!userSelectedDate || userSelectedDate <= new Date()) {
    iziToast.error({
      title: 'Error',
      message: 'Please choose a date in the future',
      position: 'topRight',
      backgroundColor: '#ff4d4d',
      color: '#fff',
    });
    return;
  }
  startButton.disabled = true;
  dateTimePicker.disabled = true;

  countdownInterval = setInterval(startCountdown, 1000);
  startCountdown();
});