const data = () => {
  const isCelsius = true;

  let currentForecastData;
  let currentOneTimeData;

  const appid = '&appid=9b92ef3c1ea97e8e01e250dfcd12508d';

  const units = '&unit=metric';

  const forecastUrl = 'api.openweathermap.org/data/2.5/weather?';
  const oneTimeUrl = 'https://api.openweathermap.org/data/2.5/onecall?';

  const currentCities = [];

  const appendResult = (result) => {
    let isSame = true;

    currentCities.forEach((currentResult) => {
      const currentResultKeys = Object.keys(currentResult);
      currentResultKeys.forEach((key) => {
        if (currentResult[key] !== result[key]) {
          isSame = false;
        }
      });
    });

    if (!isSame) {

    } lsereturn false;
  };

  const getCoordinatesUrl = (city) => `lat=${city.lat}&lon=${city.long}`;

  const fetchData = async (url) => {
    const response = await fetch(url);
    const currentData = await response.json();
    return currentData;
  };

  // when putting data together pattern must be forecastUrl + coordinateUrl + units +  appid
  const getData = async () => {
    if (currentCities.length === 0) {
      appendResult({
        city: 'New York',
        state: 'New York',
        country: 'US',
        lat: '40.7127281',
        long: '-74.0060152',
      });
      getData();
    } else {
      const defaultCity = currentCities[0];
      const coordinateUrl = getCoordinatesUrl(defaultCity);

      const currentForecastUrl = forecastUrl + coordinateUrl + units + appid;
      const currentOneTimeUrl = oneTimeUrl + coordinateUrl + units + appid;
      try {
        console.log('trying');

        currentForecastData = await fetchData(currentForecastUrl);
        currentOneTimeData = await fetchData(currentOneTimeUrl);

        return { currentForecastData, currentOneTimeData };
      } catch (err) {
        console.error(err);
      }
    }
  };

  const getTopData = () => {
    // console.log(currentForecastData);
  };

  const activateData = async () => {
    try {
      await getData();
      getTopData();
    } catch (err) {
      console.error(err);
    }
  };
  activateData();
};
data();
