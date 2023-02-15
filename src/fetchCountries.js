// Создаю ф-ю для запроса на СЕРВЕР
export function fetchCountries(name) {
  const BASE_URL = 'https://restcountries.com/v3.1/name/';
  const filter = '?fields=name,capital,population,flags,languages';
  //  // 1- В случае успешного промиса (т.е. если на мой запрос придет ответ с СЕРВЕРА) => будет выполняться метод then()
  // 	// 2- Внутри метода then(........) => будет вызываться ф-я - в нашем случае стрелочная () => {}
  // 	// 3- Параметр ф-ии response => принимает на себя аргумент(ДАННЫЕ), который хранится в fetch(запрос) => fetch(ответ, т.е. ДАННЫЕ)
  // 	// 4- Распарсиваю данные с СЕРВЕРА-(метод json) и передаю дальше по цепочке(return) - return response.json()
  return fetch(`${BASE_URL}${name}${filter}`).then(response => {
		// Если ОТВЕТ НЕ ОК => вызов new Error заключается в том, что переданная ему ошибка заключается в следующем формате −
		// { name: 'Error', сообщение: 'String you passed in the constructor' }
    if (!response.ok) {
      throw new Error(response.status);
    }

		// ПЕРЕДАЕТ ПО ЦЕПОЧКЕ УСПЕШНЫЙ ПРОМИС, т.е. если на запрос пришел ответ без ошибки, то распарсиваю массив данных из БЕКЕНДА
    return response.json();
  });
}

// или

// const OPTIONS = 'name,capital,population,flags,languages';
// const OPTIONS = {
//   headers: {
//     option: 'name,flags,capital,population,languages',
//   },
// };

