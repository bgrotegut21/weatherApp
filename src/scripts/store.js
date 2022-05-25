const store = () => {
  const saveData = (items) => {
    const storedItem = JSON.stringify(items);
    localStorage.setItem('currentCities', storedItem);
  };

  const getData = () => {
    const data = localStorage.getItem('currentCities');
    const realData = JSON.parse(data);
    return realData;
  };

  return { getData, saveData };
};
