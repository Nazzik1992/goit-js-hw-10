
import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import fetchCountries  from './fetchCountries.js'


const DEBOUNCE_DELAY = 300;
const inputEl = document.getElementById('search-box');
const listEl = document.querySelector('.country-list')
const infoEl = document.querySelector('.country-info')

inputEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
    let  inputValue = e.target.value.trim();
  if (!inputValue) {
    resetCard(listEl);
    resetCard(infoEl);
    return;
  }

  fetchCountries(inputValue).then(data =>  {
    
    if (data.length > 10) { 
      Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  resetCard(listEl);
  resetCard(infoEl);
    return;
  }
  
  createMarkup(data);
     
  }).catch(err => {
    resetCard(listEl);
    resetCard(infoEl);
  
    Notiflix.Notify.failure("Oops, there is no country with that name");
  });
  }
  
  
  function resetCard(card) {
    card.innerHTML = "";
  }
  
  function markupCountryList(countries)  {
  return countries.map(
  
    ({ name, flags }) => 
    `<li class = list> 
    <img class = img_list src = "${flags.svg}" alt = "${name.official}" >
    ${name.official}
    </li>`
  ).join("");
  
  }
  
  function markupCountryInfo(country)  {
    return country.map(({ name, capital, population, flags, languages }) => {
      return `
          <h1 class="name"><img class=img src="${flags.svg} " alt="${
        name.official
      }" ${name.official}</h1>
          <p class="text">Capital: ${capital[0]}</p>
          <p class="text">Population: ${population}</p>
          <p class="text">Languages: ${Object.values(languages).join(',')}</p>
        `;
    });
  }
  
  function createMarkup(countries) {
    if (countries.length === 1) {
      resetCard(listEl);
      infoEl.innerHTML = markupCountryInfo(countries);
    }
    else {
    resetCard(infoEl);
    listEl.innerHTML = markupCountryList(countries);
    }
  }