import '../styles/daily.css';
import '../styles/global.css';
import '../styles/info.css';
import '../styles/sections.css';
import '../styles/weekly.css';

import data from './data';
import template from './template';

import { getDom, getImages, getIcons } from './dom';

const ui = () => {
  let dom = getDom();
  const currentTemplate = template();
  const findData = data();
  const image = getImages();
  const arrangement = template();

  let organizedData;
  let currentTime;

  const organizeBackgrounds = (currentCondition, hourlyData) => {
    dom.body.removeAttribute('class');
    let currentClassName;

    console.log(hourlyData, 'the current hourlydata');

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
      console.log(currentCondition, 'the current conditoin object');
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

    console.log(topData, 'the current top data');
    dom.cityTitle.textContent = `${topData.cityName}, US`;
    dom.condition.textContent = topData.description;
    dom.temp.textContent = `${topData.temp}°`;
    dom.highTemp.textContent = `High ${topData.max}°`;
    dom.lowTemp.textContent = `Low ${topData.min}°`;
    organizeBackgrounds(topData.condition, hourlyData);

    console.log(dom, 'the current dom');
    console.log(dom.cityTitle, 'dom city title');
  };

  const compareSun = (currentHour) => {
    console.log(currentTime, 'the current time');

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

  // remember to test this code
  const organizeHourlyForecastHolder = () => {
    dom.hourlyForecast.innerHTML = '';

    console.log(organizedData.hourlyData, 'organized hourly data');
    let currentHourlyData = organizedData.hourlyData.splice(1);
    const currentHour = currentHourlyData[0];
    if (compareSun(currentHour))
      currentHourlyData = currentHourlyData.splice(1);

    currentHourlyData.forEach((hourData) => {
      const hourlyTemplate = arrangement.createHouryTemplate(hourData);
      dom.hourlyForecast.innerHTML += hourlyTemplate;
    });
  };

  const organizeWarningData = () => {
    dom.warningHolder.innerHTML = '';
    const { warningData } = organizedData;

    console.log(dom.warningHolder, 'dom warning holder');

    if (Array.isArray(warningData) && warningData.length !== 0) {
      warningData.forEach((warnData) => {
        const warningTemplate = arrangement.createWarning(warnData);
        dom.warningHolder.innerHTML += warningTemplate;
      });
    }
  };

  const activatePageData = async () => {
    organizedData = await findData.activateData();
    currentTime = findData.getCurrentTime();
    console.log(organizedData, 'the organized data');
    organizeTopData();
    organizeHourlyForecastHolder();
    organizeWarningData();
  };

  const activatePage = () => {
    const mainTemplate = currentTemplate.createMainTemplate();
    console.log(mainTemplate, 'the main template');
    dom.body.innerHTML = mainTemplate;
    dom = getDom();
  };

  activatePage();
  const currentPageData = activatePageData();
};

ui();