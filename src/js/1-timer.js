import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const startBtn = document.querySelector('[data-start]');
const datetimePicker = document.querySelector('#datetime-picker');
const daysSpan = document.querySelector('[data-days]');
const hoursSpan = document.querySelector('[data-hours]');
const minutesSpan = document.querySelector('[data-minutes]');
const secondesSpan = document.querySelector('[data-seconds]');

let userSelectedDate = null;
let timerId = null;

startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,

  altInput: true,
  altFormat: 'Y-m-d H:i',
  dateFormat: 'Y-m-d',

  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];

    if (userSelectedDate <= new Date()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      startBtn.disabled = true;
    } else {
      startBtn.disabled = false;
    }
  },
};

const fp = flatpickr('#datetime-picker', options);

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addZero(value) {
  return String(value).padStart(2, '0');
}

function updateTimer({ days, hours, minutes, seconds }) {
  daysSpan.textContent = addZero(days);
  hoursSpan.textContent = addZero(hours);
  minutesSpan.textContent = addZero(minutes);
  secondesSpan.textContent = addZero(seconds);
}

startBtn.addEventListener('click', handleClick);

function handleClick() {
  startBtn.disabled = true;
  fp.altInput.disabled = true;

  timerId = setInterval(() => {
    const currentTime = new Date();
    const msDiff = userSelectedDate - currentTime;

    if (msDiff <= 0) {
      clearInterval(timerId);
      updateTimer({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      fp.altInput.disabled = false;
      return;
    }

    const timeComp = convertMs(msDiff);
    updateTimer(timeComp);
  }, 1000);
}
