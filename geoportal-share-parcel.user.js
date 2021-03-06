// ==UserScript==
// @name         GeoportalShareParcel
// @namespace    http://geoportal.gov.pl/
// @source       https://github.com/piotrgredowski/geoportal-share-parcel
// @version      0.3.0
// @description  Script which shows copyable link to selected parcel in header of table with parcel info
// @description:pl Skrypt dodający kopiowalny link do wybranej działki w nagłówku tabeli z informacjami na temat działki
// @author       Piotr Grędowski
// @include      *geoportal.gov.pl/*
// @icon         https://mapy.geoportal.gov.pl/imap/resources/images/favicon.ico
// @grant        none
// @updateURL    https://raw.githubusercontent.com/piotrgredowski/geoportal-share-parcel/main/geoportal-share-parcel.meta.js
// @downloadURL  https://raw.githubusercontent.com/piotrgredowski/geoportal-share-parcel/main/geoportal-share-parcel.user.js
// ==/UserScript==

const getParcelId = (parcelElement) => {
  const item = document.querySelector('.htmlListItem');
  try {
    const parcelElement = item.getElementsByTagName('b')[0];
    return parcelElement.textContent;
  } catch {
    return;
  }
};

const getParcelUrl = (parcelId) => {
  return `https://mapy.geoportal.gov.pl/imap/Imgp_2.html?identifyParcel=${parcelId}`;
};

const wholeNewElementId = 'geoportal-share-link'
const anchorId = 'anchor-from-geoportal-share';

const createParcelLinkElement = (url) => {
  const container = document.createElement('span');
  container.id = wholeNewElementId;
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.id = anchorId;
  anchor.innerText = 'Link do działki';
  const divider = document.createTextNode(': ');
  const input = document.createElement('input');
  input.id = url;
  input.value = url;
  input.setAttribute('onclick', 'this.select()');

  container.append(anchor);
  container.append(divider);
  container.append(input);
  return container;
};

const addParcelLinkToTable = (anchor) => {
  const tr = document.querySelector('.infoPopupTitle table tr');
  const td = document.createElement('td');
  td.append(anchor);
  tr.prepend(td);
};

const removeElement = (element) => {
  element.parentElement.removeChild(element);
}

(function () {
  'use strict';

  let lastParcelId;


  const func = () => {
    const parcelId = getParcelId();

    if (!parcelId) return;
    if (parcelId === lastParcelId) return;

    const oldParcelLinkElement = document.getElementById(wholeNewElementId);
    if (oldParcelLinkElement) {
      removeElement(oldParcelLinkElement);
    }

    lastParcelId = parcelId;
    const url = getParcelUrl(parcelId);
    const newParcelLinkElement = createParcelLinkElement(url);
    addParcelLinkToTable(newParcelLinkElement);
  };

  setInterval(func, 100);
})();
