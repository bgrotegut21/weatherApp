import data from './data';
import template from './template';
import userInterface from './ui';

import { getDom } from './dom';

const menu = () => {
  let dom;
  const findData = data;
  const arrangement = template();
  const menuOn = false;
  let isTemp = false;

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
    addBindings(dom.hamburgerButton, activareHamburgerAnimation, 'click');
  };

  const removeExternalBidings = () => {
    removeBindings(dom.hamburgerButton, activareHamburgerAnimation, 'click');
  };

  const removeInternalBindings = () => {
    removeBindings(dom.exitMenu, activateExitMenuAnimation, 'click');
  };

  const addInternalBindings = () => {
    removeExternalBidings();
    addBindings(dom.exitMenu, activateExitMenuAnimation, 'click');
    addBindings(dom.changeTemp, activateTriggerMenu, 'click');
  };

  const addExternalBindings = () => {
    removeInternalBindings();
    addBindings(dom.hamburgerButton, activareHamburgerAnimation, 'click');
  };

  const changeTempatrue = () => {
    findData.changeTemp();
    userInterface.activatePageData();
  };

  const activateTriggerMenu = () => {
    const { changeTemp } = dom;

    isTemp = !isTemp;

    if (isTemp) {
      setTimeout(() => {
        changeTemp.classList.add('changeTempAnimation');
        changeTempatrue();
      }, 300);
    } else {
      setTimeout(() => {
        changeTemp.classList.remove('changeTempAnimation');
        changeTempatrue();
      }, 300);
    }
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
      addExternalBindings();
    }, 500);
  };

  const activareHamburgerAnimation = () => {
    const { overlay } = dom;
    const { menuSection } = dom;
    const { exitMenu } = dom;

    overlay.style.display = 'block';

    setTimeout(() => {
      menuSection.classList.add('menuSectionAnimation');
      overlay.classList.add('overlayAnimation');
    });
    setTimeout(() => {
      addInternalBindings();
    }, 500);
  };

  activateMenu();
};

const menuSection = menu();

export default menuSection;
