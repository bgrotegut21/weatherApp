import '../styles/daily.css';
import '../styles/global.css';
import '../styles/info.css';
import '../styles/sections.css';
import '../styles/weekly.css';

import data from './data';
import template from './template';

import { getDom, getImages } from './dom';

const ui = () => {
  let dom = getDom();
  const currentTemplate = template();
  const findData = data;
  const arrangement = template();
  let currentUnit = 'celsius';
  let distanceUnit = 'kilometers';
  let windUnit = 'meters';

  let canChangeData = true;

  let organizedData;
  let currentTime;

  const copyArray = (array) => {
    const newArray = [];
    array.forEach((item) => {
      newArray.push(item);
    });
    return newArray;
  };

  const organizeBackgrounds = (currentCondition, hourlyData) => {
    dom.body.removeAttribute('class');
    let currentClassName;

    const conditions = [
      'Clouds',
      'Snow',
      'Rain',
      'Drizzle',
      'Thunderstorm',
      'Clear',
    ];

    const specialConditons = [
      'Mist',
      'Smoke',
      'Haze',
      'Dust',
      'Fog',
      'Sand',
      'Dust',
      'Ash',
      'Squall',
      'Tornado',
    ];

    conditions.forEach((condition) => {
      if (condition === currentCondition) {
        if (condition === 'Drizzle') {
          currentClassName = 'rain';
        } else if (condition === 'Clear') {
          if (hourlyData.scene === 'night') {
            currentClassName = 'night';
          } else {
            currentClassName = 'sky';
          }
        } else {
          currentClassName = condition.toLowerCase();
        }
      }
    });

    specialConditons.forEach((specialCondition) => {
      if (currentCondition === specialCondition) {
        currentClassName = 'atmosphere';
      }
    });

    dom.body.setAttribute('class', currentClassName);
  };

  const organizeTopData = () => {
    const { topData } = organizedData;

    const hourlyData = organizedData.hourlyData[0];

    dom.cityTitle.textContent = `${topData.cityName}, ${topData.country}`;
    dom.condition.textContent = topData.description;
    dom.temp.textContent = `${topData.temp[currentUnit]}°`;
    dom.highTemp.textContent = `High ${topData.max[currentUnit]}°`;
    dom.lowTemp.textContent = `Low ${topData.min[currentUnit]}°`;
    organizeBackgrounds(topData.condition, hourlyData);
  };

  const compareSun = (currentHour) => {
    const currentUtcHour = currentHour.time.utcDateObject;
    const currentUtcTime = currentTime.utcDateObject;

    if (
      currentHour.condition === 'Sunset' ||
      currentHour.condition === 'Sunrise'
    ) {
      if (currentUtcHour.utcHours <= currentUtcTime.utcHours) {
        if (currentUtcHour.utcMinutes < currentUtcTime.utcMinutes) {
          return true;
        }
      }
    }
    return false;
  };

  const organizeHourlyForecastHolder = () => {
    dom.hourlyForecast.innerHTML = '';

    const hourlyData = copyArray(organizedData.hourlyData);

    let currentHourlyData = hourlyData.splice(1);
    const currentHour = currentHourlyData[0];
    if (compareSun(currentHour))
      currentHourlyData = currentHourlyData.splice(1);

    currentHourlyData.forEach((hourData) => {
      const hourlyTemplate = arrangement.createHourlyForecast(
        hourData,
        currentUnit
      );
      dom.hourlyForecast.innerHTML += hourlyTemplate;
    });
  };

  const organizeWarningData = () => {
    dom.warningHolder.innerHTML = '';
    const { warningData } = organizedData;

    if (Array.isArray(warningData) && warningData.length !== 0) {
      warningData.forEach((warnData) => {
        const warningTemplate = arrangement.createWarning(warnData);
        dom.warningHolder.innerHTML += warningTemplate;
      });
    }
  };

  const organizeWeeklyData = () => {
    dom.weeklyForecast.innerHTML = '';
    const weeklyArray = copyArray(organizedData.weeklyData);

    const weeklyData = weeklyArray.splice(1);

    weeklyData.forEach((weekData) => {
      const weeklyTemplate = arrangement.createForecastLine(
        weekData,
        currentUnit
      );
      dom.weeklyForecast.innerHTML += weeklyTemplate;
    });
  };

  const triggerCitiesDoesNotExist = (exists) => {
    if (exists) {
      dom.noCitySection.style.display = 'block';
      dom.body.setAttribute('class', '');
      dom.body.style.backgroundColor = 'rgb(18,101,181)';

      dom.wordHolder.style.display = 'none';
      dom.warningHolder.style.display = 'none';
      dom.hourlyForecastHolder.style.display = 'none';
      dom.weeklyForecastHolder.style.display = 'none';
      dom.weatherInfoHolder.style.display = 'none';
      canChangeData = false;

      dom.citySectionTitle.textContent = ':(';
      dom.citySectionDescription.innerHTML =
        'You currently do not have any cities saved, please add a city to see the weather.';
    } else {
      canChangeData = true;

      dom.noCitySection.style.display = 'none';
      dom.body.style.backgroundColor = 'transparent';

      dom.wordHolder.style.display = 'flex';
      dom.warningHolder.style.display = 'flex';
      dom.hourlyForecastHolder.style.display = 'flex';
      dom.weeklyForecastHolder.style.display = 'flex';
      dom.weatherInfoHolder.style.display = 'flex';
    }
  };

  const triggerCityError = (isError, errorObject) => {
    if (isError) {
      dom.noCitySection.style.display = 'block';
      dom.body.setAttribute('class', '');
      dom.body.style.backgroundColor = 'indianred';

      dom.wordHolder.style.display = 'none';
      dom.warningHolder.style.display = 'none';
      dom.hourlyForecastHolder.style.display = 'none';
      dom.weeklyForecastHolder.style.display = 'none';
      dom.weatherInfoHolder.style.display = 'none';

      dom.citySectionTitle.textContent = 'X';
      dom.citySectionDescription.innerHTML = `Error: ${errorObject.message}</br></br>Please try again!`;

      canChangeData = false;
    }
  };

  const organizeBottomData = () => {
    const { bottomData } = organizedData;

    const perciptationText = `${Math.floor(bottomData.chanceOfRain * 100)}%`;

    dom.sunriseTime.textContent =
      bottomData.sunrise.time.currentDateObject.amPm;
    dom.sunsetTime.textContent = bottomData.sunset.time.currentDateObject.amPm;

    dom.perciptationText.textContent = perciptationText;
    dom.humidityText.textContent = `${bottomData.humidity}%`;
    dom.windText.textContent = bottomData.windspeed[windUnit];
    dom.feelsText.textContent = `${bottomData.feelsLike[currentUnit]}°`;
    dom.pressureText.textContent = `${bottomData.pressure}hPa`;
    dom.visbiltyText.textContent = `${bottomData.currentVisiblity[distanceUnit]}`;
  };

  const activatePageData = async () => {
    organizedData = await findData.activateData();
    if (!organizedData) {
      triggerCitiesDoesNotExist(true);
    } else if (organizedData.isError) {
      triggerCityError(true, organizedData);
    } else {
      triggerCitiesDoesNotExist(false);

      currentTime = findData.getCurrentTime();
      organizeTopData();
      organizeHourlyForecastHolder();
      organizeWarningData();
      organizeWeeklyData();
      organizeBottomData();
    }
  };

  const refreshData = async () => {
    organizeTopData();
    organizeHourlyForecastHolder();
    organizeWarningData();
    organizeWeeklyData();
    organizeBottomData();
  };

  const changeUnits = () => {
    if (currentUnit === 'celsius') {
      currentUnit = 'fahrenheit';
      distanceUnit = 'miles';
      windUnit = 'miles';
    } else {
      currentUnit = 'celsius';
      distanceUnit = 'kilometers';
      windUnit = 'meters';
    }
    if (canChangeData) refreshData();
  };

  const activatePage = () => {
    const mainTemplate = currentTemplate.createMainTemplate();
    dom.body.innerHTML = mainTemplate;
    dom = getDom();
  };

  return {
    activatePage,
    activatePageData,
    changeUnits,
    triggerCitiesDoesNotExist,
  };
};

const userInterface = ui();

export default userInterface;
