import './style.css'


  // Variables globales
let days = 30;
let rainyDays = [];

const SUNNY = './assets/SUN.png';
const PARTLYCLOUDY = './assets/PARTLYCLOUDY.png'
const CLOUDY = './assets/CLOUD.png';
const RAINY = './assets/RAIN.png';
const SNOWY = './assets/SNOW.png';

let dayToPrint = {
  day: 0,
  month: '',
  image: '',
  dayTemperature: 0,
  dayProbability: 0
};
let daysToPrint = [];

const hightProbabilityOfRain = (probability, i, temperatures) => {
  if (probability >= 100 && i + 1 < temperatures.length) {
    temperatures[i + 1] -= 1; // Disminuye la temperatura del día siguiente
  }
};


const lessOf5Degrres = (temperature, probability) => {
  if (temperature < 8) {
    probability = probability * 0.70; // Un 20% menos
    probability = Math.floor(probability);
  }
  return Math.max(0, Math.min(probability, 100)); // Asegura que la probabilidad esté entre 0 y 100
};

const moreThan25degrees = (temperature, probability) => {
  if (temperature > 27) {
    probability = probability * 1.20; // Un 30% más
    probability = Math.floor(probability);
  }
  return Math.max(0, Math.min(probability, 100)); // Asegura que la probabilidad esté entre 0 y 100
};

const changeTemperaturePerDay = (temperature) => {
  let aleatory = Math.random();
  if (aleatory <= 0.10) temperature += 2;
  else if (aleatory >= 0.90) temperature -= 2;
  return temperature;
};

const hightLowTemperature = (temperatures) => {
  let max = temperatures[0];
  let min = temperatures[0];
  for (let i = 0; i < temperatures.length; i++) {
    let temperature = temperatures[i];
    if (temperature > max) max = temperature;
    if (temperature < min) min = temperature;
  }
  return { max: max, min: min };
};

const setWeatherToPrint = (probability, temperature, day, month) => {

  let lowerMonth = month.toLowerCase();

  if (lowerMonth === 'marzo' || lowerMonth === 'abril' || lowerMonth === 'mayo' || lowerMonth === 'junio' || lowerMonth === 'julio' || lowerMonth === 'agosto' || lowerMonth === 'septiembre' || lowerMonth === 'octubre ') { // Marzo a Octubre, considerado como meses más cálidos en España
    if (probability >= 0 && probability <= 10 ) {
      day.image = SUNNY;
    } else if (probability > 11 && probability <= 21) {
      day.image = PARTLYCLOUDY;
    } else if (probability > 22 && probability <= 35 ) {
      day.image = CLOUDY;
    } else if (probability > 4 && probability <= 100) {
      day.image = RAINY;
    } else if (temperature <= 0) {
      day.image = SNOWY;
    } else {
      day.image = SUNNY;
    }
  } else { // Noviembre a Febrero, considerado como meses más fríos en España
    if (temperature < 1) {
      day.image = SNOWY;
    } else if (probability > 6 && probability <= 16 ) {
      day.image = PARTLYCLOUDY;
    } else if (probability > 17 && probability <= 33) {
      day.image = CLOUDY;
    } else if (probability > 34 && probability <= 100 && temperature >= 9) {
      day.image = RAINY;
    } else if (temperature > 6 && probability >= 0 && probability <= 5) {
      day.image = SUNNY;
    } else {
      day.image = PARTLYCLOUDY;
    }
  }
  day.dayProbability = probability;
  day.dayTemperature = temperature;
  day.month = month;
  return day;
};


function getMonthValues(month) {
  let days;
  let probability;
  let temperature;

  switch (month) {
    case 'Enero':
      days = 31;
      probability = 20;
      temperature = 1;
      break;
    case 'Febrero':
      days = 28;
      probability = 25;
      temperature = 7;
      break;
    case 'Marzo':
      days = 31;
      probability = 25;
      temperature = 12;
      break;
    case 'Abril':
      days = 35;
      probability = 40;
      temperature = 15;
      break;
    case 'Mayo':
      days = 31;
      probability = 17;
      temperature = 20;
      break;
    case 'Junio':
      days = 30;
      probability = 8;
      temperature = 27;
      break;
    case 'Julio':
      days = 31;
      probability = 3;
      temperature = 35;
      break;
    case 'Agosto':
      days = 31;
      probability = 1;
      temperature = 40;
      break;
    case 'Septiembre':
      days = 30;
      probability = 15;
      temperature = 30;
      break;
    case 'Octubre':
      days = 31;
      probability = 60;
      temperature = 18;
      break;
    case 'Noviembre':
      days = 30;
      probability = 40;
      temperature = 12;
      break;
    case 'Diciembre':
      days = 31;
      probability = 35;
      temperature = 9;
      break;
    default:
      days = 30;
      probability = 30;
      temperature = 20;
  }

  return {
    days,
    probability,
    temperatures: new Array(days).fill(temperature)
  };
}

// ? Función principal
const weatherController = (days, probability, temperatures, month) => {
  daysToPrint = []; // Reinicia el array para el nuevo mes
  for (let i = 0; i < days; i++) {
    temperatures[i] = changeTemperaturePerDay(temperatures[i]);
    probability = moreThan25degrees(temperatures[i], probability);
    probability = lessOf5Degrres(temperatures[i], probability);
    if (i < days - 1) {
      hightProbabilityOfRain(probability, i, temperatures);
    }
    rainyDays.push(probability);
    daysToPrint.push(
      setWeatherToPrint(probability, temperatures[i], { ...dayToPrint, day: i + 1 }, month)
    );
  }
  // !!! frevisar por que no aparece !!
  const hightLowTemp = hightLowTemperature(temperatures);
  createMaxMinElement(hightLowTemp.min, hightLowTemp.max)

  printWheather(daysToPrint);
};


const weatherPerMonth = () => {
  const selectedMonth = document.getElementById('month-select');
  if (selectedMonth) {
    selectedMonth.addEventListener('change', (event) => {
      const selectedMonth = event.target.value;
      const { days, probability, temperatures } = getMonthValues(selectedMonth);
      weatherController(days, probability, temperatures, selectedMonth);
    });
  }
};
weatherPerMonth();


// ? Funciones de UI
const printWheather = (daysToPrint) => {
  const weatherBlockElement= document.getElementById('weather-block');
  let toPrint = '';

  if (weatherBlockElement) {
    for (let day of daysToPrint) {
      toPrint += `
      <div class="day-weather-container">
        <p class="date">${day.day} de ${day.month}</p>
        <img class="image-weather" src="${day.image}" alt="">
        <section>
          <p class="probability">${day.dayProbability}%</p>
          <p class="temperature">${day.dayTemperature}°C</p>
        </section>
      </div>`;
    }
    // weatherBlockElement.insertAdjacentHTML('beforeend', toPrint);
    weatherBlockElement.innerHTML = toPrint
  }
};

const createMaxMinElement = (minTemperature, maxTemperature) => {
  const weatherBlockElement = document.getElementById('weather-block');

  if (weatherBlockElement) {
    weatherBlockElement.insertAdjacentHTML('afterbegin', 
      `<section class="low-hight-container" id="low-hight">
      <div class="low-hight-block">
        <p>min: <span>${minTemperature}</span></p>
        <p>max: <span>${maxTemperature}</span></p>
      </div>
    </section>`
    );
  } else {
    console.error('El contenedor "weather-block" no se encontró en el documento.');
  }
};


// const createMaxMinElement = (minTemperature, maxTemperature) => {
//   const weatherElementContainer = document.getElementById('weather-container');

//   if (weatherElementContainer) {
//     weatherElementContainer.insertAdjacentHTML('beforeend', 
//       `<section class="low-hight-container" id="low-hight">
//       <div class="low-hight-block">
//         <p>min: <span>${minTemperature}</span></p>
//         <p>max: <span>${maxTemperature}</span></p>
//       </div>
//     </section>`
//     );

//   } else {
//     console.error('El contenedor "weather-container" no se encontró en el documento.');
//   }
// };


// // ? Funciones de UI
// const printWheather = (daysToPrint) => {
//   const wheatherElementContainer = document.getElementById('wather-container');
//   let toPrint = '';

//   if (wheatherElementContainer) {
//     for (let day of daysToPrint) {
//       toPrint += `
//       <div class="day-wheather-container">
//         <p class="date">${day.day} de ${day.month}</p>
//         <img class="image-weather" src="${day.image}" alt="">
//         <section>
//           <p class="probability">${day.dayProbability}%</p>
//           <p class="temperature">${day.dayTemperature}°C</p>
//         </section>
//       </div>`;
//     }
//   }
//   wheatherElementContainer.innerHTML = toPrint;
// };

// const createMaxMinElement = (minTemperature, maxTemperature) => {
//   let toPrint = '';
//   const weatherContainer = document.getElementById('weather-container');
//   if (!weatherContainer) {
//     console.error('No se encontró el contenedor del clima.');
//     return;

//   } else {
//     const temperatureSection = document.getElementById('low-high-block');
//     if(temperatureSection){
//        toPrint = `
//           <p>min: <span>${minTemperature}</span></p>
//           <p>max: <span>${maxTemperature}</span></p>`;

//           temperatureSection.innerHTML = toPrint
//     }
  
//     weatherContainer.appendChild(temperatureSection);
//   }


// }
