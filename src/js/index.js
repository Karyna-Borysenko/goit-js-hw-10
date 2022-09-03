import '../css/styles.css';

import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import fetchCountries from './fetchCountries';

const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const searchInput = document.getElementById('search-box');

const DEBOUNCE_DELAY = 300;

searchInput.addEventListener('input', debounce(onInputSearch, DEBOUNCE_DELAY));

function onInputSearch(event) {
  event.preventDefault();
  inputReset();

  const inputText = event.target.value.trim();
  if (inputText) {
    fetchCountries(inputText)
      .then(handleResponse)
      .catch(err =>
        Notiflix.Notify.failure('Oops, there is no country with that name')
      );
  }
}

function handleResponse(countriesArr) {
  if (countriesArr.length > 10) {
    return Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  }
  if (countriesArr.length === 1) {
    return createCountryCard(countriesArr[0]);
  }
  createCountryList(countriesArr);
}

function createCountryCard(country) {
  const {
    flags: { svg },
    name: { common },
    capital,
    population,
    languages,
  } = country;
  const markupCard = `<div class="country-container"><img class="country-img" src="${svg}" alt="${common} flag"><h1 class="country-name">${common}</h1></div>
    <p><span class="country-text">Capital: </span>${capital}</p>
    <p><span class="country-text">Population: </span>${population}</pclass=>
    <p><span class="country-text">Languages: </span>${Object.values(
      languages
    ).join(', ')}</p>`;

  countryInfo.innerHTML = markupCard;
}

function createCountryList(country) {
  const markupList = country
    .map(({ flags, name }) => {
      return `<li class=country-item>
      <img class="country-img" src="${flags.svg}" alt="${name.common} flag"><p class="country-text">${name.common}</p>
    </li>`;
    })
    .join('');

  countryList.innerHTML = markupList;
}

function inputReset() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}
