import emit from './emit';
import settings from './settings';
import { fetchData } from './methods';

const search = () => {
  const options = settings();
  const { appid } = options;

  const createTemplate = (city, country, lat, long, state) => ({
    city,
    state,
    country,
    lat,
    long,
  });

  const findResults = async (text) => {
    const items = [];

    const url = `
    http://api.openweathermap.org/geo/1.0/direct?q=${text}&limit=5${appid}`;

    const results = await fetchData(url);

    console.log(results, 'the results');
    results.forEach((result) => {
      const item = createTemplate(
        result.name,
        result.country,
        String(result.lat),
        String(result.lon),
        result.state
      );

      items.push(item);
    });

    console.log(items, 'the current items');
  };

  findResults('london');
};

search();
