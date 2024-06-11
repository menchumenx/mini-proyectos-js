import './style.css'


/*
 * La última semana de 2021 comenzamos la actividad de retos de programación,
 * con la intención de resolver un ejercicio cada semana para mejorar
 * nuestra lógica... ¡Hemos llegado al EJERCICIO 100! Gracias 🙌
 *
 * Crea un programa que calcule los puntos de una palabra.
 * - Cada letra tiene un valor asignado. Por ejemplo, en el abecedario
 *   español de 27 letras, la A vale 1 y la Z 27.
 * - El programa muestra el valor de los puntos de cada palabra introducida.
 * - El programa finaliza si logras introducir una palabra de 100 puntos.
 * - Puedes usar la terminal para interactuar con el usuario y solicitarle
 *   cada palabra.
 */


//? VARIABLES GLOBALES
let wordrecibed = "";
const abecedario = 'abcdefghijklmnñopqrstuvwxyz';
let result = 0;


// ? FUNCIONES
// getWord() ->  Recibe el valor del input lo pasa a minusculas y despues limpia el valor del input.
const getWord = () => {
  const inputElement = document.getElementById('word');
  wordrecibed = inputElement.value;
  
  let wordtoLowerCase;

  if (wordrecibed) {
    wordtoLowerCase = wordrecibed.toLowerCase();
  }

  inputElement.value = "";

  return wordtoLowerCase;
}


// abcValueAsigment() -> Crea un array de objetos {letra:valor}
const abcValueAsigment = (abecedario) => {
  let valoresLetras = {};
  for (let i = 0; i < abecedario.length; i++) {
    valoresLetras[abecedario[i]] = i + 1;
  }
  return valoresLetras;
}


// stringToArray() -> Crea un array de la palabra recogida 
const stringToArray = (wordtoLowerCase) => {
  return wordtoLowerCase.split("")
}


// wordValue() -> Esta función calcula y muestra el valor total de una palabra basándose en un conjunto de valores asignados a cada letra.
// @param {Object} valoresLetras - Un objeto donde las claves son letras y los valores son los valores numéricos correspondientes a cada letra.
// @param {Array} arryWord - Un array que representa una palabra, donde cada elemento es una letra de la palabra.
const wordValue = (valoresLetras, arryWord) => {

  Object.keys(valoresLetras).forEach((letra) => {

    arryWord.forEach(wordLetter => {
      if (wordLetter === letra) {
        result += valoresLetras[letra]
      }
    })
  });
  console.log('Suma total: ', result);
}

// wordTotalPoints() -> Funcion principal que acoge todos los pasos necesarios para hacer el cálculo. Recibe como único parámetro el abecedario.
const wordTotalPoints = (abecedario) => {
  const abc = abcValueAsigment(abecedario); // crea el array de obetos con la asignación letra/valor
  const word = getWord() // recoge la palabra de la vista y la pasa a minusculas
  const arryWord = stringToArray(word) // convierte el string en array para poder recorrerlo
  wordValue(abc, arryWord) // hace la suma de los valores comparando los dos arrays
}

// createResultText() -> Función que crea un lemento h3, para mostrar el resultado en la vista.
const createResultText = () => {
  const resultElement = document.getElementById('resultElement');

  if (resultElement) {
    const h3Element = document.createElement('h3');
    if (h3Element) {
      h3Element.classList.add('h3-result');
      h3Element.textContent = `La suma total es: ${result}`
    }

    resultElement.appendChild(h3Element)
  }
}


// Llamada a la función principal a traves de la asignación de un evento al botón.
const buttonElement = document.getElementById('buttonElement');
if (buttonElement) {
  buttonElement.addEventListener('click', () => {
    wordTotalPoints(abecedario);
    createResultText()
  })
}