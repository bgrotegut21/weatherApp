import {
  convertDtToObject,
  convertMetersToKilometers,
  convertMetersToMiles,
} from './methods';

import emit from './emit';

const data = () => {
  const isCelsius = true;

  const appid = '&appid=9b92ef3c1ea97e8e01e250dfcd12508d';

  const units = '&units=metric';

  const forecastUrl = 'https://api.openweathermap.org/data/2.5/weather?';
  const oneTimeUrl = 'https://api.openweathermap.org/data/2.5/onecall?';

  const currentCities = [];

  let currentForecastData;
  let currentOneTimeData;
  let currentTries = -1;

  let timezoneOffset;
  let currentTime;

  const appendResult = (result) => {
    let isSame = true;

    if (currentCities.length > 0) {
      currentCities.forEach((currentResult) => {
        const currentResultKeys = Object.keys(currentResult);
        currentResultKeys.forEach((key) => {
          if (currentResult[key] !== result[key]) {
            isSame = false;
          }
        });
      });
    } else {
      isSame = false;
    }

    if (!isSame) {
      currentCities.push(result);
      return result;
    }
    return false;
  };

  const getCoordinatesUrl = (city) => `lat=${city.lat}&lon=${city.long}`;

  const fetchData = async (url) => {
    const response = await fetch(url, { mode: 'cors' });

    const currentData = await response.json();

    return currentData;
  };

  // when putting data together pattern must be forecastUrl + coordinateUrl + units +  appid
  const getData = async (index) => {
    let forecastData;
    let oneTimeData;
    let currentIndex = 0;

    // if (index) {
    //   if (currentCities[index]) {
    //     currentIndex = index;

    //     const city = currentCities[currentIndex];
    //     const cityCoordinatesUrl = getCoordinatesUrl(city);

    //     const cityForeCastUrl =
    //       forecastUrl + cityCoordinatesUrl + units + appid;
    //     const cityOneTimeUrl = oneTimeUrl + cityCoordinatesUrl + units + appid;
    //   }
    // }

    if (currentCities.length === 0) {
      appendResult({
        city: 'Seattle',
        state: 'Washington',
        country: 'US',
        lat: '47.6038321',
        long: '-122.3300624',
        // lat: '40.7127281',
        // long: '-74.0060152',
      });
      console.log(currentCities, 'the current cities');
      return getData();
    }

    if (index && currentCities[index]) currentIndex = index;

    const currentCity = currentCities[currentIndex];
    const coordinateUrl = getCoordinatesUrl(currentCity);

    const currentForecastUrl = forecastUrl + coordinateUrl + units + appid;
    const currentOneTimeUrl = oneTimeUrl + coordinateUrl + units + appid;
    try {
      console.log('trying');

      console.log(currentForecastUrl, 'the current forecastUrl');

      forecastData = await fetchData(currentForecastUrl);
      oneTimeData = await fetchData(currentOneTimeUrl);

      return { forecastData, oneTimeData };
    } catch (err) {
      console.error(err);
      return err;
    }
  };

  const removeNegativeZeroes = (num) => {
    const temp = Math.round(num);

    if (Object.is(temp, -0)) return 0;
    return temp;
  };

  const getTopData = () => {
    const currentNowObject = {};

    currentNowObject.cityName = currentForecastData.name;
    currentNowObject.description = currentForecastData.weather[0].description;

    currentNowObject.temp = removeNegativeZeroes(
      Math.round(currentForecastData.main.temp)
    );

    currentNowObject.max = removeNegativeZeroes(
      Math.round(currentForecastData.main.temp_max)
    );

    currentNowObject.min = removeNegativeZeroes(
      Math.round(currentForecastData.main.temp_min)
    );

    return currentNowObject;
  };

  const getSunsetData = () => {
    const sunsetArray = [];
    const sunriseArray = [];

    currentOneTimeData.daily.forEach((dailyData) => {
      const { sunset } = dailyData;
      const { sunrise } = dailyData;

      const sunsetTime = convertDtToObject(sunset, timezoneOffset);
      const sunriseTime = convertDtToObject(sunrise, timezoneOffset);

      const sunsetObject = {
        time: sunsetTime.currentDateObject,
        condition: 'Sunset',
      };
      const sunriseObject = {
        time: sunriseTime.currentDateObject,
        condition: 'Sunrise',
      };

      sunsetArray.push(sunsetObject);
      sunriseArray.push(sunriseObject);
    });

    return { sunsetArray, sunriseArray };
  };

  const getCurrentSunsetData = () => {
    const currentSunData = getSunsetData();
    const currentSunsetArray = currentSunData.sunsetArray;
    const currentSunriseArray = currentSunData.sunriseArray;

    const possibleSunsets = [currentSunsetArray[0], currentSunsetArray[1]];
    const possibleSunrises = [currentSunriseArray[0], currentSunriseArray[1]];

    const currentHour = currentTime.currentDateObject.hours;

    let currentSunset;
    let currentSunrise;

    if (currentHour > possibleSunsets[0].time.hours) {
      currentSunset = possibleSunsets[1];
    } else {
      currentSunset = possibleSunsets[0];
    }

    console.log(possibleSunrises[0], 'the current time');

    if (currentHour > possibleSunrises[0].time.hours) {
      currentSunrise = possibleSunrises[1];
    } else {
      currentSunrise = possibleSunrises[0];
    }

    return { currentSunrise, currentSunset };
  };

  const changeWindspeedData = (num) => {
    let currentWindspeed = '';

    if (isCelsius) currentWindspeed = `w ${num} km/h`;
    else currentWindspeed = `w ${num} mph`;
    return currentWindspeed;
  };

  const getBottomData = () => {
    const currentSunData = getCurrentSunsetData();

    const sunset = currentSunData.currentSunset;
    let currentVisiblity;
    const sunrise = currentSunData.currentSunrise;

    const windspeed = changeWindspeedData(
      removeNegativeZeroes(currentForecastData.wind.speed)
    );

    const chanceOfRain = currentOneTimeData.hourly[0].pop;

    const feelsLike = removeNegativeZeroes(currentForecastData.main.feels_like);

    const { pressure } = currentForecastData.main;
    const { humidity } = currentForecastData.main;
    const { visibility } = currentForecastData;

    if (isCelsius) currentVisiblity = convertMetersToKilometers(visibility);
    else currentVisiblity = convertMetersToMiles(visi);

    const time = convertDtToObject(currentForecastData.dt, timezoneOffset);

    return {
      sunset,
      sunrise,
      windspeed,
      chanceOfRain,
      feelsLike,
      pressure,
      humidity,
      currentVisiblity,
      time,
    };
  };

  const getWeeklyData = () => {
    const weeklyObjects = [];

    currentOneTimeData.daily.forEach((data) => {
      const currentTime = convertDtToObject(data.dt, timezoneOffset);
      const weeklyObject = {
        day: currentTime.currentDateObject.weekDay,
        condition: data.weather[0].main,
        chanceOfRain: data.pop,
        max: removeNegativeZeroes(data.temp.max),
        min: removeNegativeZeroes(data.temp.min),
      };
      weeklyObjects.push(weeklyObject);
    });

    return weeklyObjects;

    console.log(weeklyObjects);
  };

  const getSunArrays = (array, sunData) => {
    const currentSunData = [];
    let index = 0;
    const newArray = array;

    array.forEach((hourlyObject) => {
      sunData.forEach((sunsetData) => {
        if (
          sunsetData.time.year === hourlyObject.time.year &&
          sunsetData.time.month === hourlyObject.time.month &&
          sunsetData.time.day === hourlyObject.time.day &&
          sunsetData.time.hours === hourlyObject.time.hours
        ) {
          index += 1;
          currentSunData.push({
            sunset: sunsetData,
            currentIndex: index,
          });
        }
      });
      index += 1;
    });

    currentSunData.forEach((currentData) => {
      newArray.splice(currentData.currentIndex, 0, currentData.sunset);
    });
    return newArray;
  };

  const giveSunData = (array) => {
    const sunsetData = getSunsetData();
    let newArray = array;
    newArray = getSunArrays(newArray, sunsetData.sunsetArray);
    newArray = getSunArrays(newArray, sunsetData.sunriseArray);

    console.log(newArray, 'the current new array');
    return newArray;
  };

  const getHourlyData = () => {
    let hourlyObjects = [];

    currentOneTimeData.hourly.forEach((hourlyData) => {
      const hourlyDates = convertDtToObject(hourlyData.dt, timezoneOffset);

      const hourlyObject = {
        time: hourlyDates.currentDateObject,
        condition: hourlyData.weather[0].main,
        temp: removeNegativeZeroes(Math.round(hourlyData.temp)),
        chanceOfRain: hourlyData.pop,
      };
      hourlyObjects.push(hourlyObject);
      // console.log(hourlyDates, 'the hourly dates');
      // console.log(hourlyObject, 'the hourly object');
    });

    hourlyObjects = giveSunData(hourlyObjects);
    console.log(hourlyObjects, 'current hourly objects');

    return hourlyObjects;
  };

  const activateData = async () => {
    try {
      const currentData = await getData();
      currentForecastData = currentData.forecastData;
      currentOneTimeData = currentData.oneTimeData;
      timezoneOffset = currentOneTimeData.timezone_offset;
      currentTime = convertDtToObject(currentForecastData.dt, timezoneOffset);

      console.log(currentTime, 'the current time');

      console.log(currentOneTimeData, 'current one time data');
      console.log(currentForecastData, 'the current forecastdata');

      const topData = getTopData();
      const hourlyData = getHourlyData();
      const weeklyData = getWeeklyData();
      const bottomData = getBottomData();

      emit.subscribe('appendResult', [appendResult]);

      console.log({ topData, hourlyData, weeklyData, bottomData });
    } catch (err) {
      currentTries += 1;
      if (currentTries < 3) {
        return activateData();
      }
      return { currentOneTimeData };
    }
  };

  // appendResult({
  //   city: 'New York',
  //   state: 'New York',
  //   country: 'US',
  //   lat: '40.7127281',
  //   long: '-74.0060152',
  // });

  activateData();
};
data();
