import {
  convertDtToObject,
  convertCelsiusToFarenheight,
  fetchData,
} from './methods';

import settings from './settings';
import Storage from './store';

const weatherData = () => {
  let isCelsius = true;

  const options = settings();
  const { appid } = options;
  const units = '&units=metric';

  const forecastUrl = 'https://api.openweathermap.org/data/2.5/weather?';
  const oneTimeUrl = 'https://api.openweathermap.org/data/2.5/onecall?';

  let currentCities = [];

  let currentForecastData;
  let currentOneTimeData;
  let currentTries = -1;

  let defaultCelsius = true;

  let currentIndex = 0;

  let timezoneOffset;
  let currentTime;

  const compareObjects = (object1, object2) => {
    const objectKeys = Object.keys(object1);
    let isEqual = true;

    objectKeys.forEach((key) => {
      if (object1[key] !== object2[key]) {
        isEqual = false;
      }
    });
    return isEqual;
  };

  const appendResult = (result) => {
    const checkResult = currentCities.filter((city) =>
      compareObjects(city, result)
    );
    if (checkResult.length === 0) {
      currentCities.push(result);
      Storage.saveData(currentCities);
    } else {
      return false;
    }
  };

  const getResults = () => currentCities;

  const getCityByIndex = (cityIndex) => currentCities[cityIndex];

  const deleteCityByIndex = (index) => {
    if (currentCities[index]) {
      let latestCities = currentCities;
      const currentCity = currentCities[index];
      latestCities = latestCities.filter((city) => {
        if (city.lat === currentCity.lat && city.long === currentCity.long) {
          return false;
        }
        return true;
      });

      currentCities = latestCities;
      Storage.saveData(currentCities);

      return latestCities;
    }
    return new Error('City is not in the array');
  };

  const getCoordinatesUrl = (city) => `lat=${city.lat}&lon=${city.long}`;

  // when putting data together pattern must be forecastUrl + coordinateUrl + units +  appid
  const getData = async (index) => {
    let forecastData;
    let oneTimeData;

    const currentCity = currentCities[currentIndex];
    const coordinateUrl = getCoordinatesUrl(currentCity);

    const currentForecastUrl = forecastUrl + coordinateUrl + units + appid;
    const currentOneTimeUrl = oneTimeUrl + coordinateUrl + units + appid;
    try {
      forecastData = await fetchData(currentForecastUrl);
      oneTimeData = await fetchData(currentOneTimeUrl);

      return { forecastData, oneTimeData };
    } catch (err) {
      return err;
    }
  };

  const removeNegativeZeroes = (num) => {
    const temp = Math.round(num);

    if (Object.is(temp, -0)) return 0;
    return temp;
  };

  const createTempObject = (num) => {
    const celsius = removeNegativeZeroes(num);
    const fahrenheit = convertCelsiusToFarenheight(num);
    return { celsius, fahrenheit };
  };

  const getTopData = () => {
    const currentNowObject = {};

    currentNowObject.cityName = currentForecastData.name;
    currentNowObject.country = currentForecastData.sys.country;
    currentNowObject.description = currentForecastData.weather[0].description;
    currentNowObject.condition = currentForecastData.weather[0].main;

    currentNowObject.temp = createTempObject(currentForecastData.main.temp);

    currentNowObject.max = createTempObject(
      currentOneTimeData.daily[0].temp.max
    );

    currentNowObject.min = createTempObject(
      currentOneTimeData.daily[0].temp.min
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
        time: sunsetTime,
        condition: 'Sunset',
      };
      const sunriseObject = {
        time: sunriseTime,
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

    if (currentHour > possibleSunsets[0].time.currentDateObject.hours) {
      currentSunset = possibleSunsets[1];
    } else {
      currentSunset = possibleSunsets[0];
    }
    if (currentHour > possibleSunrises[0].time.currentDateObject.hours) {
      currentSunrise = possibleSunrises[1];
    } else {
      currentSunrise = possibleSunrises[0];
    }

    return { currentSunrise, currentSunset };
  };

  const createDistanceObject = (num, wind) => {
    if (wind) {
      const meters = `${Number(num).toFixed(1)} m/s`;
      const miles = `${Number(num * 2.23694).toFixed(1)} mph`;
      return { meters, miles };
    }

    const kilometers = `${Number(num).toFixed(1)} km`;
    const miles = `${Number(num * 0.621371).toFixed(1)} m`;

    return { kilometers, miles };
  };

  const getBottomData = () => {
    const currentSunData = getCurrentSunsetData();

    const sunset = currentSunData.currentSunset;
    const sunrise = currentSunData.currentSunrise;

    const windspeed = createDistanceObject(
      currentForecastData.wind.speed,
      true
    );

    const chanceOfRain = currentOneTimeData.hourly[0].pop;

    const feelsLike = createTempObject(currentForecastData.main.feels_like);

    const { pressure } = currentForecastData.main;
    const { humidity } = currentForecastData.main;
    const { visibility } = currentForecastData;

    const currentVisiblity = createDistanceObject(visibility / 1000);

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
        description: data.weather[0].description,
        chanceOfRain: data.pop,
        max: createTempObject(data.temp.max),
        min: createTempObject(data.temp.min),
      };

      weeklyObjects.push(weeklyObject);
    });

    return weeklyObjects;
  };

  const getSunArrays = (array, sunData) => {
    const currentSunData = [];
    let index = 0;
    const newArray = array;

    array.forEach((hourlyObject) => {
      sunData.forEach((sunsetData) => {
        if (
          sunsetData.time.currentDateObject.year ===
            hourlyObject.time.currentDateObject.year &&
          sunsetData.time.currentDateObject.month ===
            hourlyObject.time.currentDateObject.month &&
          sunsetData.time.currentDateObject.day ===
            hourlyObject.time.currentDateObject.day &&
          sunsetData.time.currentDateObject.hours ===
            hourlyObject.time.currentDateObject.hours
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

    return newArray;
  };

  const giveScene = (hourlyArray) => {
    let currentObjects = hourlyArray;
    let currentCondition;

    for (let i = 0; i < currentObjects.length; i += 1) {
      if (currentObjects[i].condition === 'Sunset') {
        currentCondition = 'day';
        break;
      } else if (currentObjects[i].condition === 'Sunrise') {
        currentCondition = 'night';
        break;
      }
    }

    currentObjects = currentObjects.map((hourlyObject) => {
      if (hourlyObject.condition === 'Sunset') {
        currentCondition = 'night';
      } else if (hourlyObject.condition === 'Sunrise') {
        currentCondition = 'day';
      } else {
        const currentObject = hourlyObject;
        currentObject.scene = currentCondition;
        return currentObject;
      }
      return hourlyObject;
    });

    return currentObjects;
  };

  const getCurrentTime = () => currentTime;

  const getHourlyData = () => {
    let hourlyObjects = [];

    currentOneTimeData.hourly.forEach((hourlyData) => {
      const hourlyDates = convertDtToObject(hourlyData.dt, timezoneOffset);

      const hourlyObject = {
        time: hourlyDates,
        condition: hourlyData.weather[0].main,
        temp: createTempObject(hourlyData.temp),
        description: hourlyData.weather[0].description,
        chanceOfRain: hourlyData.pop,
      };
      hourlyObjects.push(hourlyObject);
    });

    hourlyObjects = giveSunData(hourlyObjects);
    hourlyObjects = giveScene(hourlyObjects);

    return hourlyObjects;
  };

  const getWarningData = () => {
    const currentWarning = [];

    if (currentOneTimeData.alerts) {
      currentOneTimeData.alerts.forEach((alert) => {
        const alertObject = {
          title: alert.event,
          description: alert.description,
        };

        currentWarning.push(alertObject);
      });
      return currentWarning;
    }
    return {
      message: 'There are currently no warnings',
    };
  };

  const changeTemp = () => {
    isCelsius = !isCelsius;
    defaultCelsius = false;

    return { isCelsius, defaultCelsius };
  };

  const changeLocationByIndex = (num) => {
    currentIndex = num;
  };

  const getCurrentCities = () => currentCities;

  const getSavedCities = () => {
    const savedCities = Storage.getData();

    if (savedCities !== null) {
      currentCities = savedCities;
      return currentCities;
    }
    return false;
  };

  const activateData = async () => {
    try {
      getSavedCities();
      const index = currentIndex;
      if (!currentCities[index]) return false;

      const currentData = await getData(index);

      currentForecastData = currentData.forecastData;
      currentOneTimeData = currentData.oneTimeData;
      timezoneOffset = currentOneTimeData.timezone_offset;
      currentTime = convertDtToObject(currentForecastData.dt, timezoneOffset);

      const topData = getTopData();
      const hourlyData = getHourlyData();
      const weeklyData = getWeeklyData();
      const bottomData = getBottomData();
      const warningData = getWarningData();

      return { topData, hourlyData, weeklyData, bottomData, warningData };
    } catch (err) {
      currentTries += 1;
      if (currentTries < 3) {
        return activateData();
      }
      return { message: err, isError: true };
    }
  };

  return {
    activateData,
    appendResult,
    deleteCityByIndex,
    getCurrentTime,
    getResults,
    changeTemp,
    getCurrentCities,
    getCityByIndex,
    changeLocationByIndex,
  };
};

const data = weatherData();

export default data;
