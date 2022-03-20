const convertHoursToAMPMString = (hour) => {
  let newHour;
  if (hour > 24) return new Error('Number cannot be greater than 24');

  if (hour > 12) {
    const currentHour = hour - 12;

    if (hour === 24) {
      newHour = `${currentHour}AM`;
    } else {
      newHour = `${currentHour}PM`;
    }
  } else if (hour === 12) {
    newHour = `${hour}PM`;
  } else if (hour === 0) {
    newHour = '12AM';
  } else {
    newHour = `${hour}AM`;
  }

  return newHour;
};

const converTimeToAMPM = (hour, currentMinutes) => {
  let minutes = String(currentMinutes);
  if (minutes.length < 2) minutes = `0${minutes}`;

  let newHour;
  if (hour > 24) return new Error('Number cannot be greater than 24');

  if (hour > 12) {
    const currentHour = hour - 12;

    if (hour === 24) {
      newHour = `${currentHour}:${minutes}AM`;
    } else {
      newHour = `${currentHour}:${minutes}PM`;
    }
  } else if (hour === 12) {
    newHour = `${hour}:${minutes}PM`;
  } else if (hour === 0) {
    newHour = `12:${minutes}AM`;
  } else {
    newHour = `${hour}:${minutes}AM`;
  }

  return newHour;
};

const convertMetersToKilometers = (num) => {
  let kilometer = num / 1000;

  console.log(kilometer, 'current kilometer');

  if (num % 1 !== 0) kilometer = kilometer.toFixed(1);
  return `${kilometer} km`;
};

const convertMetersToMiles = (num) => {
  let mile = num / 1609.34;

  if (num % 1 !== 0) mile = mile.toFixed(1);
  return `${mile} miles`;
};

const convertDtToObject = (date, timezoneOffset) => {
  const daysOfTheWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const utcDate = new Date(date * 1000);
  const currentTime = date + timezoneOffset;
  const currentDate = new Date(currentTime * 1000);
  const weekNunmber = currentDate.getUTCDay();

  const weekDay = daysOfTheWeek[weekNunmber];

  const hours = currentDate.getUTCHours();
  const minutes = currentDate.getUTCMinutes();
  const day = currentDate.getUTCDate();
  const month = currentDate.getUTCMonth();
  const year = currentDate.getUTCFullYear();
  const seconds = currentDate.getUTCSeconds();
  const dateString = currentDate.toUTCString();
  const amPmHour = convertHoursToAMPMString(hours);
  const amPm = converTimeToAMPM(hours, minutes);

  const utcHours = utcDate.getUTCHours();
  const utcMinutes = utcDate.getUTCMinutes();
  const utcDay = utcDate.getUTCDate();
  const utcWeekNumber = utcDate.getUTCDay();
  const utcWeekDay = daysOfTheWeek[utcWeekNumber];

  const utcMonth = utcDate.getUTCMonth();
  const utcYear = utcDate.getUTCFullYear();
  const utcSeconds = utcDate.getUTCSeconds();
  const utcDateString = utcDate.toUTCString();
  const utcAmPmHour = convertHoursToAMPMString(utcHours);
  const utcAmPm = converTimeToAMPM(utcHours, utcMinutes);

  const currentDateObject = {
    year,
    month,
    day,
    hours,
    minutes,
    seconds,
    weekDay,
    weekNunmber,
    dateString,
    amPmHour,
    amPm,
  };

  const utcDateObject = {
    utcYear,
    utcMonth,
    utcDay,
    utcHours,
    utcMinutes,
    utcSeconds,
    utcWeekNumber,
    utcWeekDay,
    utcDateString,
    utcAmPmHour,
    utcAmPm,
  };

  return { currentDateObject, utcDateObject };
};

export { convertDtToObject, convertMetersToKilometers, convertMetersToMiles };
