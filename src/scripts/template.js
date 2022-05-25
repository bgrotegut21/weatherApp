import { getImages, getIcons } from './dom';

const template = () => {
  const iamge = getImages();
  const icon = getIcons();

  const createMainTemplate = () => {
    const mainTemplate = `
    <div class="content">
    <div class="menuSection">
      <div class="toolsContainer">
        <div class="toggleTempHolder">
          <h3 class="celsius">°C</h3>
          <div class="toggleTemp">
            <button class="changeTemp">changeTempature</button>
          </div>
          <h3 class="fahrenheit">°F</h3>
        </div>

        <h1 class="exitMenu">X</h1>
      </div>

      <h1 class="menuText">Menu</h1>
      <div class="menu">
        <div class="searchHolder">
          <div class="search">
            <input class="searchBar" type="text" />
            <img class="searchButton" src="${icon.searchWhite}" alt="" />
          </div>
        </div>
      </div>
      <h1 class="placeTitle">Cities</h1>

      <div class="currentCities"></div>

      <div class="results"></div>

      <h3 class="exitResults">Exit Results</h3>
    </div>

    <section class="mainSection">

      <section class = "noCitySection">
      <div class = 'cityDoesNotExit'>
        <h1 class = 'citySectionTitle'>:(</h1>
        <h2 class = 'citySectionDescription'>You currently do not have any cities saved, please add a city to see the weather.</h2>
      </div>
    </section>


      <div class="overlay">
        <div class="currentError">
          <h2 class="errorMessage">
            Something went, city could not be fetched, city will return to
            default
          </h2>
          <button class="tryAgainButton">Try Again</button>
        </div>
      </div>
      <nav>
        <div class="hamburgerButton">
          <div class="triggerButton">click me</div>
          <div class="line line1">line1</div>
          <div class="line line2">line2</div>
          <div class="line line3">line3</div>
        </div>
      </nav>

      <div class="wordHolder">
        <div class="words">
          <h1 class="cityTitle">New York, US</h1>
          <p class="condition">clear</p>
          <h1 class="temp">-102°</h1>
          <h2 class="highTemp">High 1°</h2>
          <h2 class="lowTemp">Low -8°</h2>
        </div>
      </div>

      <div class="warningHolder"></div>

      <div class="hourlyForcastHolder">
        <div class="hourlyForcast"></div>
      </div>

      <div class="weeklyForcastHolder">
        <div class="weeklyForcast"></div>
      </div>

      <div class="weatherInfoHolder">
        <div class="weatherInfo">
          <div class="weatherRow">
            <div class="infoBox sunrise">
              <p>SUNRISE</p>
              <h2 class = 'sunriseTime'>6:48AM</h2>
            </div>
            <div class="infoBox sunset">
              <p>SUNSET</p>
              <h2 class = 'sunsetTime'>5:32PM</h2>
            </div>
          </div>

          <div class="weatherRow">
            <div class="infoBox chanceOfRain">
              <p>CHANCE OF RAIN</p>
              <h2 class = 'perciptationText'>20%</h2>
            </div>

            <div class="infoBox humidity">
              <p>HUMIDITY</p>
              <h2 class = 'humidityText'>20%</h2>
            </div>
          </div>

          <div class="weatherRow">
            <div class="infoBox wind">
              <p>WIND</p>
              <h2 class = 'windText'>w 4km/hr</h2>
            </div>

            <div class="infoBox feelsLike">
              <p>FEELS LIKE</p>
              <h2 class = 'feelsText'>-6°</h2>
            </div>
          </div>

          <div class="weatherRow">
            <div class="infoBox pressure">
              <p>PRESSURE</p>
              <h2 class = 'pressureText'>1012 hPa</h2>
            </div>

            <div class="infoBox visibility">
              <p>VISIBILITY</p>
              <h2 class = 'visbiltyText'>100 km</h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
    `;

    return mainTemplate;
  };

  const createCityTemplate = (item, isAdded) => {
    let cityTemplate;

    if (isAdded) {
      cityTemplate = `
      <div class="city">
        <h3 class="placeText">${item.city}, ${item.country}</h3>
        <button class="deleteCity">X</button>
       </div>

`;
    } else {
      cityTemplate = `
              <div class="city">
              <h3 class="resultText">${item.city}, ${item.country}</h3>
              <button class="addCity">+</button>
              </div>
               </div>
      `;
    }
    return cityTemplate;
  };

  const getIcon = (data) => {
    let currentIcon = icon.clear;
    let isLightRain = false;

    if (data.condition === 'Clouds') {
      if (data.description === 'few clouds') {
        if (data.scene === 'night') {
          currentIcon = icon.moonclouds;
        } else {
          currentIcon = icon.lightclouds;
        }
      } else {
        currentIcon = icon.cloudy;
      }
    } else if (data.condition === 'Atmosphere') {
      currentIcon = icon.misc;
    } else if (data.condition === 'Snow') {
      currentIcon = icon.snowIcon;
    } else if (data.condition === 'Rain') {
      const lightConditions = [
        'light rain',
        'moderate rain',
        'heavy intensity rain',
        'very heavy rain',
        'extreme rain',
      ];
      const snowCondition = 'freezing rain';

      lightConditions.forEach((condition) => {
        if (data.description === condition) {
          isLightRain = true;
          if (data.scene === 'night') {
            currentIcon = icon.moonrain;
          } else {
            currentIcon = icon.rainingSun;
          }
        }
      });

      if (!isLightRain) {
        if (data.description === snowCondition) {
          currentIcon = icon.snowIcon;
        } else {
          currentIcon = icon.rainIcon;
        }
      }
    } else if (data.condition === 'Drizzle') {
      currentIcon = icon.drizzledClouds;
    } else if (data.condition === 'Thunderstorm') {
      currentIcon = icon.thundercloud;
    } else if (data.scene === 'night') {
      currentIcon = icon.moon;
    } else {
      currentIcon = icon.clear;
    }
    return currentIcon;
  };

  const createWarning = (warningData) => {
    const warningText = `
    <div class = "warning">
    <h2 class = "advisory">${warningData.title}</h2>
    <p>${warningData.description}</p>
  </div>`;

    return warningText;
  };

  const createHourlyForecast = (data, unit) => {
    let infoText = '&nbsp';
    let typeOfText = 'infoText';
    let weatherIcon;
    let currentTime;
    let currentTemp = '&nbsp';

    if (data.condition === 'Sunset' || data.condition === 'Sunrise') {
      weatherIcon = icon.sunset;
      infoText = data.condition;
      currentTime = data.time.currentDateObject.amPm;
      typeOfText = 'sunsetText';
    } else {
      weatherIcon = getIcon(data);

      if (data.chanceOfRain !== 0) {
        const currentRainPecentage = Math.round(data.chanceOfRain * 100);
        infoText = `${currentRainPecentage}%`;
      }
      currentTime = data.time.currentDateObject.amPmHour;
      currentTemp = `${data.temp[unit]}°`;
    }

    const hourlyText = `
    
    <div class="foreCastHolder">
    <p class="timeText">${currentTime}</p>
    <p class="${typeOfText}">${infoText}</p>
    <img
      class="weatherIcon"
      src="${weatherIcon}"
      alt="weather icon"
    />
    <p>${currentTemp}</p>
  </div>`;

    return hourlyText;
  };

  const createForecastLine = (data, unit) => {
    console.log(unit, 'the currrne unit');
    console.log(data, 'the current data');
    const currentChance = Math.floor(data.chanceOfRain * 100);
    let chanceText = '';
    const forecastIcon = getIcon(data);
    const { day } = data;

    console.log(unit, 'the current unit');
    const max = data.max[unit];
    const min = data.min[unit];

    console.log(data.max, 'data max');
    console.log(currentChance, 'the current chance');
    if (currentChance > 0) chanceText = `${currentChance}%`;

    const foreCastText = `<div class="forecastLine">
                            <h2 class="weekLabel">${day}</h2>
                            <img
                              class="weeklyIcon"
                              src="${forecastIcon}"
                              alt="a weather icon for the week"
                            />
                            <h2 class="precipitation">${chanceText}</h2>
                            <h2 class="weeklyHigh">${max}</h2>
                            <h2 class="weeklyLow">${min}</h2>
                          </div>`;

    return foreCastText;
  };

  return {
    createMainTemplate,
    createCityTemplate,
    createWarning,
    createHourlyForecast,
    createForecastLine,
  };
};

export default template;
