'use strict';
// ESTE PARTE ESTA OCULTA *********
const fs = require('fs');

process.stdin.resume();
process.stdin.setEncoding('utf-8');

let inputString = '';
let currentLine = 0;

process.stdin.on('data', function (inputStdin) {
    inputString += inputStdin;
});

process.stdin.on('end', function () {
    inputString = inputString.split('\n');

    main();
});

function readLine() {
    return inputString[currentLine++];
}

const promiseReturn = (a) => {
    const negatives = [93, 69, 72];
    if (negatives.includes(a)) {
        return Promise.reject();
    }
    return Promise.resolve(a);
}
// ESTE PARTE ESTA OCULTA *********

// DESARROLLO DE PRUEBA
/*
 * Complete the 'promiseAccumulation' function below.
 *
 * The function is expected to yield a number.
 */

// FUNCION GENERADORA > función especial que puede pausar su ejecución y luego reanudarla. Esto es útil para crear iteradores y manejar secuencias de valores de una manera más controlada.
function* promiseAccumulation(promiseArr) {
    for (let promise of promiseArr) {
        try {
            // yield se usa en una función generadora para pausar la función y devolver un valor. De modo que la próxima vez que la función generadora se reanuda, continuará ejecutándose desde donde se pausó.
            // En el contexto de promiseAccumulation, yield se usa para permitir el control paso a paso sobre la resolución de promesas, manejando tanto los valores resueltos como los errores de manera ordenada.
            const result = yield promise;
            yield result;

        } catch (error) {
            yield -1;
            return;
        }
    }
}

async function main() {
    const outputPath = 'output.txt'; // Ruta local para el archivo de salida
    const ws = fs.createWriteStream(outputPath);
    let n = parseInt(readLine().trim()); // número de entradas
    // console.log('N: ', n);
    let promiseArr = [];
    
    for (let i = 0; i < n; i++) {
        let x = parseInt(readLine().trim());
        promiseArr.push(promiseReturn(x));
    }
    // gen es un iterador del generador promiseAccumulation.
    const gen = promiseAccumulation(promiseArr);
    let nextValue = undefined; // captura los valores resueltos de las promesas

    while (true) {
        // valores que devuelve la función genradora {value:?, done:false/true}
        // En una función generadora que usa yield para devolver valores uno a uno. Cada llamada a gen.next() reanuda la función desde donde se pausó. En cada iteracion reanuda la busqueda del resultado de la promesa 
        let { value, done } = gen.next(nextValue);
        if (done) {
            break; // la promesa devuleve reject -1
        }
        try {
            nextValue = await value;
            let result = gen.next(nextValue).value; // se pasa nextvalue, para que la funcion generativa, pepa por donde continuar
            ws.write(result + '\n');
        } catch (error) {
            ws.write('-1\n');
            break;
        }
    }

    ws.end();
}
