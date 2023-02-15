import './css/styles.css';
import './css/countries.css'
const DEBOUNCE_DELAY = 300;
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';

// ****************************
const refs = {
  countryInput: document.getElementById('search-box'),
  countryList: document.querySelector('.country-list'),
  countryCard: document.querySelector('.country-info'),
};
// *****************************
refs.countryInput.addEventListener(
  'input',
  debounce(onInputCountrySearch, DEBOUNCE_DELAY)
);

function onInputCountrySearch(e) {
  // САНАЦИЯ - При вводе пользователем пробела перед НАЗВАНИЕМ СТРАНЫ - trim() => очищает от пробелов
  let inputValue = '';
  inputValue = e.target.value.trim();

	// При вводе пользователем пробела - запрос на СЕРВЕР не посылается (ф-я обрывается)
	// +
	// При очищении инпута пользователем => UI очищается от динамической разметки
	if (inputValue.length === 0) {
		clearUI()
		return;
	}

	// Ф-я очищает пользов.интерфейс(UI), а именно:
	// 1) при нашем 1-й ЗАПРОСЕ на СЕРВЕР => к нам пришел ответ в виде массива данных из 10 стран => поэтому будет рендерится разметка CountriesListMarkup
//   2) затем польователь добавляет символы в ИНПУТ - прописывает название страны например, полностью =>
// 			происходит 2-й ЗАПРОС на СЕРВЕР => приходит ответ - массив данных с 1 страной =Ю рендерится наша динамическая разметка CountryCardMarkup
//   3) Для того, чтобы очистить разметку CountriesListMarkup => применяем refs.countryList.innerHTML = '' (clearUI())
	clearUI()

  // 1- Ф-я после ввода пользователем => inputValue, посылает ЗАПРОС на СЕРВЕР, далее если ОТВЕТ-УСПЕШНЫЙ,
  // то метод .then() вызывает ф-ю ()=>{},
	// в параметр которой идут ДАННЫЕ, которые пришли с БЕКЕНДА, обычно ввиде МАССИВА ОБЬЕКТОВ - [{}, {}, {}] => (dataArray)
	// 2- Если ДЛИНА МАССИВА(т.е. кол-во стран) === 1 то динамически рендерится CountryCardMarkup
	// 		Если ДЛИНА МАССИВА(т.е. кол-во стран) === 2-10 то динамически рендерится CountriesListMarkup
	// 		Если ДЛИНА МАССИВА(т.е. кол-во стран) 10< то динамически рендерится CountriesListMarkup
  fetchCountries(inputValue)
    .then(dataArray => {
			// console.log('onInputCountrySearch  dataArray', dataArray)
      if (dataArray.length === 1) {
        renderCountryCardMarkup(dataArray);
      } else if (dataArray.length > 1 && dataArray.length <= 10) {
        renderCountriesListMarkup(dataArray);
      } else {
				// Если в ответе бэкенд вернул больше чем 10 стран
        onFetchInfo();
      }
    })
		//onFetchError - Если пользователь ввёл имя страны которой не существует,
		// бэкенд вернёт не пустой массив, а ошибку со статус кодом 404
    .catch(onFetchError);
}

// Декструктеризация данных(свойств), которые приходят с БЕКЕНДА => {name, flags} =>
// Динамически подставляю в разметку ${name}
function renderCountriesListMarkup(arrayData) {
  const countriesListMarkup = arrayData
    .map(({ name, flags }) => {
      return `
				<li class="item">
					<img class="flags" src="${flags.svg}" alt="${name.official}" width="25" />
					<h2 class="name text">${name.official}</h2>
				</li>`;
    })
    .join('');

  refs.countryList.innerHTML = countriesListMarkup;
}

function renderCountryCardMarkup(arrayData) {
  const countryCardMarkup = arrayData
    .map(({ name, capital, population, languages, flags }) => {
      return `
				<div class="card">
					<div class="wrapper">
						<img class="flags" src="${flags.svg}" alt="${name.official}" width="50" />
						<h2 class="name">${name.official}</h2>
					</div>
					<p class="value"><span class="text">Capital:</span> ${capital}</p>
					<p class="value"><span class="text">Population:</span> ${population}</p>
					<p class="value"><span class="text">Languages:</span> ${Object.values(
            languages
          )}</p>`;
    })
    .join('');

  refs.countryCard.innerHTML = countryCardMarkup;
}

function onFetchInfo() {
  Notify.info('Too many matches found. Please enter a more specific name.');
}

function onFetchError() {
  Notify.failure('Oops, there is no country with that name');
}

function clearUI() {
	refs.countryList.innerHTML = '';
	refs.countryCard.innerHTML = '';
}
