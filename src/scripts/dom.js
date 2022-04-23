import clouds from '../images/clouds.jpg';
import nightsky from '../images/nightsky.jpg';
import rain from '../images/rain.jpg';
import secondsky from '../images/secondsky.jpg';
import snow from '../images/snow.jpg';
import thunderstrom from '../images/thunderstorm.jpg';

import clear from '../assets/clear.svg';
import cloudy from '../assets/cloudy.svg';
import drizzledClouds from '../assets/drizzledClouds.svg';
import heavyRain from '../assets/heavyRain.svg';
import lightclouds from '../assets/lightclouds.svg';
import lightcloudy from '../assets/lightcloudy.svg';
import misc from '../assets/misc.svg';
import moon from '../assets/moon.svg';
import moonclouds from '../assets/moonclouds.svg';
import moonrain from '../assets/moonrain.svg';
import rainIcon from '../assets/rain.svg';
import rainingSun from '../assets/rainingSun.svg';
import searchBlack from '../assets/searchBlack.svg';
import searchWhite from '../assets/searchWhite.svg';
import snowIcon from '../assets/snow.svg';
import snowflake from '../assets/snowflake.svg';
import sunset from '../assets/sunset.svg';
import thundercloud from '../assets/thundercloud.svg';
import atmosphere from '../images/astmosphere.jpg';

const getDom = () => {
  const currentElements = {
    changeTemp: document.querySelector('.changeTemp'),
    exitMenu: document.querySelector('.exitMenu'),
    searchBar: document.querySelector('.searchBar'),
    searchButton: document.querySelector('.searchButton'),
    placeTitle: document.querySelector('.placeTitle'),
    currentCities: document.querySelector('.currentCities'),
    deleteCity: document.querySelectorAll('.deleteCity'),
    addCity: document.querySelectorAll('.addCity'),
    exitResults: document.querySelector('.exitResults'),
    overlay: document.querySelector('.overlay'),
    currentError: document.querySelector('.currentError'),
    errorMessage: document.querySelector('.errorMessage'),
    tryAgainButton: document.querySelector('.tryAgainButton'),
    triggerButton: document.querySelector('.triggerButton'),
    cityTitle: document.querySelector('.cityTitle'),

    condition: document.querySelector('.condition'),
    temp: document.querySelector('.temp'),
    warningHolder: document.querySelector('.warningHolder'),
    highTemp: document.querySelector('.highTemp'),
    lowTemp: document.querySelector('.lowTemp'),
    hourlyForecast: document.querySelector('.hourlyForcast'),
    weeklyForecast: document.querySelector('.weeklyForcast'),
    perciptationText: document.querySelector('.perciptationText'),
    humidityText: document.querySelector('.humidityText'),
    windText: document.querySelector('.windText'),
    feelsText: document.querySelector('.feelsText'),
    sunsetTime: document.querySelector('.sunsetTime'),
    sunriseTime: document.querySelector('.sunriseTime'),
    pressureText: document.querySelector('.pressureText'),
    visbiltyText: document.querySelector('.visbiltyText'),
    hamburgerButton: document.querySelector('.hamburgerButton'),
    menuSection: document.querySelector('.menuSection'),

    body: document.body,
  };

  return currentElements;
};

const getImages = () => {
  const images = {
    atmosphere,
    clouds,
    nightsky,
    rain,
    secondsky,
    snow,
    thunderstrom,
  };
  return images;
};

const getIcons = () => {
  const icons = {
    clear,
    cloudy,
    drizzledClouds,
    heavyRain,
    lightclouds,
    lightcloudy,
    misc,
    moon,
    moonclouds,
    moonrain,
    rainIcon,
    rainingSun,
    searchBlack,
    searchWhite,
    snowIcon,
    snowflake,
    sunset,
    thundercloud,
  };
  return icons;
};

export { getDom, getImages, getIcons };
