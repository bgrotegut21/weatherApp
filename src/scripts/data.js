import {
  convertDtToObject,
  convertMetersToKilometers,
  convertMetersToMiles,
  fetchData,
} from './methods';

import settings from './settings';

import emit from './emit';

const weatherData = () => {
  let isCelsius = true;

  const options = settings();
  const { appid } = options;
  let units = '&units=metric';

  const forecastUrl = 'https://api.openweathermap.org/data/2.5/weather?';
  const oneTimeUrl = 'https://api.openweathermap.org/data/2.5/onecall?';

  const currentCities = [];

  let currentForecastData;
  let currentOneTimeData;
  let currentTries = -1;

  const currentIndex = 0;

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

  const getResults = () => currentCities;

  const deleteCityByIndex = (index) => {
    if (currentCities[index]) {
      let latestCities = currentCities;
      const currentCity = currentCities[index];
      latestCities = latestCities.filter((city) => {
        if (city.lat === currentCity.lat && city.long === currentCity.long) {
          return true;
        }
        return false;
      });
      return latestCities;
    }
    return new Error('City is not in the array');
  };

  const getCoordinatesUrl = (city) => `lat=${city.lat}&lon=${city.long}`;

  // when putting data together pattern must be forecastUrl + coordinateUrl + units +  appid
  const getData = async (index) => {
    let forecastData;
    let oneTimeData;

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

    // if (currentCities.length === 0) {
    //   appendResult({
    //     city: 'Seattle',
    //     state: 'Washington',
    //     country: 'US',
    //     lat: '47.6038321',
    //     long: '-122.3300624',
    //     // lat: '40.7127281',
    //     // long: '-74.0060152',
    //   });
    //   // console.log(currentCities, 'the current cities');
    //   return getData();
    // }

    const currentCity = currentCities[currentIndex];
    const coordinateUrl = getCoordinatesUrl(currentCity);

    const currentForecastUrl = forecastUrl + coordinateUrl + units + appid;
    const currentOneTimeUrl = oneTimeUrl + coordinateUrl + units + appid;
    try {
      // console.log('trying');

      // console.log(currentForecastUrl, 'the current forecastUrl');

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
    currentNowObject.country = currentForecastData.sys.country;
    currentNowObject.description = currentForecastData.weather[0].description;
    currentNowObject.condition = currentForecastData.weather[0].main;

    currentNowObject.temp = removeNegativeZeroes(
      Math.round(currentForecastData.main.temp)
    );

    currentNowObject.max = removeNegativeZeroes(
      Math.round(currentOneTimeData.daily[0].temp.max)
    );

    currentNowObject.min = removeNegativeZeroes(
      Math.round(currentOneTimeData.daily[0].temp.min)
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

    // console.log(possibleSunrises[0], 'the current time');

    if (currentHour > possibleSunrises[0].time.currentDateObject.hours) {
      currentSunrise = possibleSunrises[1];
    } else {
      currentSunrise = possibleSunrises[0];
    }

    return { currentSunrise, currentSunset };
  };

  const changeWindspeedData = (num) => {
    let currentWindspeed = '';

    if (isCelsius) currentWindspeed = `${num} km/h`;
    else currentWindspeed = `${num} mph`;
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

    console.log(visibility.toFixed(1), 'visiblity fixed to one decimal place');

    if (isCelsius) currentVisiblity = convertMetersToKilometers(visibility);
    else currentVisiblity = convertMetersToMiles(visibility);

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
        max: removeNegativeZeroes(data.temp.max),
        min: removeNegativeZeroes(data.temp.min),
      };
      weeklyObjects.push(weeklyObject);
    });

    return weeklyObjects;

    // console.log(weeklyObjects);
  };

  const getSunArrays = (array, sunData) => {
    const currentSunData = [];
    let index = 0;
    const newArray = array;

    // console.log(array, 'the current array');
    // console.log(sunData, 'the sun data');

    // console.log(array, 'the hourly obejects');

    console.log(sunData, 'the current sun data');

    array.forEach((hourlyObject) => {
      sunData.forEach((sunsetData) => {
        // console.log(sunsetData, 'the current sunset data');
        // console.log(hourlyObject, 'the current hourlyObject');

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

    console.log(newArray, 'the current new array');
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
        temp: removeNegativeZeroes(Math.round(hourlyData.temp)),
        description: hourlyData.weather[0].description,
        chanceOfRain: hourlyData.pop,
      };
      hourlyObjects.push(hourlyObject);
      // //console.log(hourlyDates, 'the hourly dates');
      // //console.log(hourlyObject, 'the hourly object');
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
    isCelsius ? (units = '&units=metric') : (units = '&units=imperial');
    return { isCelsius, units };
  };

  const activateData = async () => {
    try {
      const index = currentIndex;
      let currentData;

      currentData = await getData(index);

      currentForecastData = currentData.forecastData;
      currentOneTimeData = currentData.oneTimeData;
      timezoneOffset = currentOneTimeData.timezone_offset;
      currentTime = convertDtToObject(currentForecastData.dt, timezoneOffset);

      // console.log(currentTime, 'the current time');

      // console.log(currentOneTimeData, 'current one time data');
      // console.log(currentForecastData, 'the current forecastdata');

      const topData = getTopData();
      const hourlyData = getHourlyData();
      const weeklyData = getWeeklyData();
      const bottomData = getBottomData();
      const warningData = getWarningData();

      // console.log(warningData, 'the warning data');

      // console.log(hourlyData, 'the current hourlyData');

      // console.log({ topData, hourlyData, weeklyData, bottomData });

      return { topData, hourlyData, weeklyData, bottomData, warningData };
    } catch (err) {
      currentTries += 1;
      if (currentTries < 3) {
        return activateData();
      }
      throw new Error(err);
      return { message: 'cannot get data' };
    }
  };

  // appendResult({
  //   city: 'New York',
  //   state: 'New York',
  //   country: 'US',
  //   lat: '40.7127281',
  //   long: '-74.0060152',
  // });

  // appendResult({
  //   city: 'Rugby',
  //   state: 'North Dakota',
  //   country: 'US',
  //   lat: '48.368888',
  //   long: '-99.996246',
  // });

  // appendResult({
  //   city: 'Midland',
  //   state: 'Texas',
  //   country: 'US',
  //   lat: '31.9973662',
  //   long: '-102.0779482',
  // });

  appendResult({
    city: 'Seattle',
    state: 'Washington',
    country: 'US',
    lat: '47.6038321',
    long: '-122.3300624',
    // lat: '40.7127281',
    // long: '-74.0060152',
  });

  appendResult({
    city: 'Provo',
    state: 'Utah',
    country: 'US',
    lat: '40.2338438',
    long: '-111.6585337',
  });

  // appendResult({
  //   city: 'London',
  //   state: 'England',
  //   country: 'GB',
  //   lat: '51.5073219',
  //   long: '-0.1276474',
  // });

  // appendResult({
  //   city: 'El Paso',
  //   state: 'Texas',
  //   country: 'US',
  //   lat: '31.7754152',
  //   long: '-106.464634',
  // });

  // appendResult({
  //   city: 'Mobile',
  //   state: 'Alabama',
  //   country: 'US',
  //   lat: '30.6943566',
  //   long: '-88.0430541',
  // });

  // appendResult({
  //   city: 'Mobile',
  //   state: 'Alabama',
  //   country: 'US',
  //   lat: '312312330.6943566',
  //   long: '312312388.0430541',
  // });

  // appendResult({
  //   city: 'Ushuaia',
  //   state: 'Tierra del Fuego Province',
  //   country: 'AR',
  //   lat: '-54.806115899999995',
  //   long: '-68.3184972880496',
  // });

  return {
    activateData,
    appendResult,
    deleteCityByIndex,
    getCurrentTime,
    getResults,
    changeTemp,
  };
};

const data = weatherData();

export default data;
