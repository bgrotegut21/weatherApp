import data from './data';
import template from './template';
import userInterface from './ui';
import search from './search';

import { getDom } from './dom';

const menu = () => {
  let dom;
  const findData = data;
  const arrangement = template();

  let isTemp = false;

  let resultItems = [];

  const explore = search();

  const addBindings = (elements, func, binding) => {
    if (!Array.isArray(elements)) elements.addEventListener(binding, func);
    else elements.forEach((element) => element.addEventListener(binding, func));
  };

  const removeBindings = (elements, func, binding) => {
    if (!Array.isArray(elements)) elements.removeEventListener(binding, func);
    else
      elements.forEach((element) => element.removeEventListener(binding, func));
  };

  const activateMenu = () => {
    userInterface.activatePage();
    userInterface.activatePageData();
    dom = getDom();

    changeMenuMode();

    addBindings(dom.hamburgerButton, activateHamurgerMenuAnimation, 'click');
  };

  const removeExternalBidings = () => {
    removeBindings(dom.hamburgerButton, activateHamurgerMenuAnimation, 'click');
  };

  const removeInternalBindings = () => {
    removeBindings(dom.exitMenu, activateExitMenuAnimation, 'click');
    removeBindings(dom.changeTemp, activateTriggerMenu, 'click');
    removeBindings(dom.searchButton, searchResults, 'click');
  };

  const addInternalBindings = () => {
    removeExternalBidings();
    addBindings(dom.exitMenu, activateExitMenuAnimation, 'click');
    addBindings(dom.changeTemp, activateTriggerMenu, 'click');
    addBindings(dom.searchButton, searchResults, 'click');
  };

  const removeMenuBindings = () => {
    const updatedDom = getDom();

    removeBindings(updatedDom.deleteCity, removeCity, 'click');
    removeBindings(updatedDom.addCity, pickResult, 'click');
    removeBindings(updatedDom.placeText, changeCity, 'click');
    removeBindings(updatedDom.exitResults, exitRestultsMenu, 'click');
  };

  const addExternalBindings = () => {
    removeInternalBindings();
    removeMenuBindings();
    addBindings(dom.hamburgerButton, activateHamurgerMenuAnimation, 'click');
  };

  const activateTriggerMenu = () => {
    const { changeTemp } = dom;

    isTemp = !isTemp;

    if (isTemp) {
      setTimeout(() => {
        changeTemp.classList.add('changeTempAnimation');
        userInterface.changeUnits();
      }, 300);
    } else {
      setTimeout(() => {
        changeTemp.classList.remove('changeTempAnimation');
        userInterface.changeUnits();
      }, 300);
    }
  };

  const clearSearchBarInput = () => {
    dom.searchBar.value = '';
  };

  const activateExitMenuAnimation = () => {
    const { menuSection } = dom;
    const { overlay } = dom;

    setTimeout(() => {
      menuSection.classList.remove('menuSectionAnimation');
      overlay.classList.remove('overlayAnimation');
    }, 0);

    setTimeout(() => {
      overlay.style.display = 'none';
      changeMenuMode();
      addExternalBindings();
      clearSearchBarInput();
    }, 500);
  };

  const assignIndex = (itemType) => {
    let index = 0;
    const updatedDom = getDom();

    const addCities = updatedDom[itemType];
    addCities.forEach((city) => {
      const currentCity = city;
      currentCity.assignedIndex = index;
      index += 1;
    });

    if (itemType === 'deleteCity') {
      const placeTexts = updatedDom.placeText;
      index = 0;
      placeTexts.forEach((text) => {
        const currentText = text;
        currentText.assignedIndex = index;
        index += 1;
      });
    }
  };

  const organizeCityResults = () => {
    const currentPlaces = findData.getCurrentCities();

    dom.currentCities.innerHTML = '';
    currentPlaces.forEach((place) => {
      const currentPlace = arrangement.createCityTemplate(place, true);
      dom.currentCities.innerHTML += currentPlace;
    });
    assignIndex('deleteCity');
  };

  const organizeItems = (items) => {
    dom.results.innerHTML = '';

    if (items.length > 0) {
      items.forEach((item) => {
        const itemTemplate = arrangement.createCityTemplate(item);
        dom.results.innerHTML += itemTemplate;
      });
    } else {
      dom.results.textContent = 'No Results';
    }

    assignIndex('addCity');
  };

  const pickResult = (event) => {
    const addTown = event.target;
    const itemIndex = addTown.assignedIndex;
    const pickedItem = resultItems[itemIndex];

    findData.appendResult(pickedItem);
    changeMenuMode();
  };

  const changePlace = (index) => {
    findData.changeLocationByIndex(index);
    userInterface.activatePageData();
  };

  const removeCity = (event) => {
    let cityIndex = event.target.assignedIndex;
    findData.deleteCityByIndex(cityIndex);

    changeMenuMode();

    const cities = findData.getResults();

    if (cities.length === 0) {
      userInterface.triggerCitiesDoesNotExist(true);
    } else {
      if (cityIndex >= cities.length) cityIndex = 0;
      changePlace(cityIndex);
    }
  };

  const changeCity = (event) => {
    const cityIndex = event.target.assignedIndex;
    changePlace(cityIndex);
    activateExitMenuAnimation();
  };

  const exitRestultsMenu = () => {
    changeMenuMode();
  };

  const changeMenuMode = (itemResults) => {
    removeMenuBindings();

    if (itemResults) {
      dom.placeTitle.textContent = 'Results';
      dom.results.style.display = 'block';
      dom.currentCities.style.display = 'none';
      dom.currentCities.innerHTML = '';
      dom.exitResults.style.display = 'block';

      organizeItems(itemResults);
    } else {
      dom.placeTitle.textContent = 'Cities';
      dom.currentCities.style.display = 'block';
      dom.results.style.display = 'none';
      dom.results.innerHTML = '';
      dom.exitResults.style.display = 'none';

      organizeCityResults();
    }

    const updatedDom = getDom();

    if (itemResults) {
      addBindings(updatedDom.addCity, pickResult, 'click');
      addBindings(updatedDom.exitResults, exitRestultsMenu, 'click');
    } else {
      addBindings(updatedDom.deleteCity, removeCity, 'click');
      addBindings(updatedDom.placeText, changeCity, 'click');
    }
  };

  const searchResults = async () => {
    const text = dom.searchBar.value;
    const items = await explore.findResults(text);
    resultItems = items;

    changeMenuMode(resultItems);
  };

  const activateHamurgerMenuAnimation = () => {
    const { overlay } = dom;
    const { menuSection } = dom;

    overlay.style.display = 'block';

    setTimeout(() => {
      menuSection.classList.add('menuSectionAnimation');
      overlay.classList.add('overlayAnimation');
    });
    setTimeout(() => {
      addInternalBindings();
      changeMenuMode();
      clearSearchBarInput();
    }, 500);
  };

  activateMenu();
};

const menuSection = menu();

export default menuSection;
