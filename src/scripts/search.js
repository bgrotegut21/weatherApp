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
    let results = [];

    const url = `
    http://api.openweathermap.org/geo/1.0/direct?q=${text}&limit=5${appid}`;

    try {
      if (text.length > 0) results = await fetchData(url);

      // console.log(results, 'THE current retults');

      if (!Array.isArray(results)) results = [];

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
    } catch (err) {
      console.error(err);
    }

    return items;
  };

  return { findResults };
};

export default search;
