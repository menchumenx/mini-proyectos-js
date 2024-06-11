
# GENERADOR DE PROMESAS
La finalidad de este código es procesar una serie de entradas, manejarlas mediante promesas, y gestionar sus resultados, escribiendo los resultados en un archivo de salida. Utiliza un generador para controlar de forma secuencial y ordenada la resolución de estas promesas, además de asegurar un manejo adecuado de errores.

## Explicación general
El código se inicia leyendo entradas desde un archivo exterto ```input.txt ```, y procesa cada una de las cuales como una promesa. Estas promesas se acumulan en un array y se gestionan utilizando una función generadora llamada ***promiseAccumulation***. Esta función, al ser una funcion generadora, permite pausar y reanudar la ejecución, proporcionando un control paso a paso sobre la resolución de las promesas.

---

## Para ejecutar
```cmd
node main.js < input.txt
```
---

## Archivos input.txt - output.txt
Archivo de texto que sirve de input de entrada para ejecutar el código. Esta entrada seproduce al redirigir el contenido de input.txt a la entrada estándar del programa. El programa leerá las entradas, procesará las promesas y escribirá los resultados en output.txt.

#### Ejemplo de caso 1:

> innput     > output
1 | 3          1 | 2
2 | 2          2 | -1          
3 | 93
4 | 4

Este caso se resuelve con este output debido a que 93 es uno de los numeros excluyentes en la para una correcta resolucion de la promesa. 
Por tanto  3, sera el valor asignado a ***n***(numero de iteraciones). 2 sera el primer valor recibido por la promesa, y este hará que la promesa se resuleva correctamente. Seguidamente la promesa recibirá 93, y al ser excluyente, la promesa no se resolvera y devovera reject, lo que hace que el output sea -1, parando la ejecución.

#### Ejemplo de caso 2:

> innput     > output
1 | 4          1 | 37
2 | 37         2 | 62          
3 | 65         3 | 8 
4 | 8          4 | 3
5 | 3

En este caso como no encuentra ningun número excluyente no para la ejecucion y muestra el output completo.

---

## Programa

#### Función `readLine`

La función `readLine` se utiliza para leer una línea de entrada del array `inputString`, que contiene todas las líneas de entrada que se han leído desde la entrada estándar.

```javascript
function readLine() {
    return inputString[currentLine++];
}
```

**Funcionamiento**
- `inputString`: Es un array que almacena todas las líneas de entrada, que se llenan cuando el evento `process.stdin.on('end')` se dispara.
- `currentLine`: Es una variable que lleva el seguimiento de la línea actual que se está leyendo del array `inputString`.

**Detalles de la Implementación**
- La función `readLine` devuelve la línea actual del array `inputString` usando `currentLine` como índice.
- Después de devolver la línea actual, incrementa `currentLine` en 1 para que la próxima llamada a `readLine` devuelva la siguiente línea.



#### Promesa
```javascript
const promiseReturn = (a) => {
    const negatives = [93, 69, 72];
    if (negatives.includes(a)) {
        return Promise.reject();
    }
    return Promise.resolve(a);
}
```


#### Funcion Generadora
Una función generadora se define usando el asterisco * después de la palabra clave function, como en function*. Dentro de una función generadora, yield se usa para pausar la función y devolver un valor. La próxima vez que la función generadora se reanuda, continuará ejecutándose desde donde se pausó.

La función ***promiseAccumulation()*** es una función generadora que gestiona un arreglo de promesas, permitiendo manejar resoluciones y errores de manera controlada

```javascript
function* promiseAccumulation(promiseArr) {
    for (let promise of promiseArr) {
        try {
            const result = yield promise;
            yield result;

        } catch (error) {
            yield -1;
            return;
        }
    }
}
```
> **Funcionamiento:**
**- Iteración sobre Promesas:**
Itera sobre cada promesa en el arreglo promiseArr.

**- Pausa y Reanudación:**
Usa yield para pausar la ejecución y esperar a que cada promesa se resuelva.
Tras la resolución, el resultado de la promesa es capturado y devuelto con otro yield.

**- Manejo de Errores:**
Si una promesa es rechazada, el error es capturado y la función genera yield -1, finalizando la ejecución.


#### Funcion Main 
La función main es una función asincrónica que gestiona la lectura de datos, el procesamiento de promesas y la escritura de resultados en un archivo local llamado output.txt. Se encarga de coordinar todo el flujo de trabajo, desde la lectura de entradas hasta la escritura de resultados, utilizando promesas y generadores para manejar operaciones asincrónicas de manera controlada y eficiente.

**Configuración del Archivo de Salida**
- Crea un flujo de escritura (`ws`) para el archivo `output.txt`.
```javascript

  const outputPath = 'output.txt'; // Ruta local para el archivo de salida
  const ws = fs.createWriteStream(outputPath);
```

**Lectura de Entradas**
- Lee el número de entradas (`n`) desde la entrada estándar.
- Lee las siguientes `n` líneas, las convierte a números y almacena las promesas resultantes en el arreglo `promiseArr`.

```javascript
  let n = parseInt(readLine().trim()); // número de entradas -> primer número del archivo input.txt
  let promiseArr = [];
    
    for (let i = 0; i < n; i++) {
        let x = parseInt(readLine().trim());
        promiseArr.push(promiseReturn(x));
    }
```

**Procesamiento de Promesas**
- Utiliza un generador (`promiseAccumulation`) para iterar sobre las promesas en `promiseArr`.
- Cada promesa es esperada (`await value`), y el resultado es gestionado por el generador.

```javascript
    // gen es un iterador del generador promiseAccumulation.
    const gen = promiseAccumulation(promiseArr);
```

**Manejo de Resultados**
- Escribe el resultado de cada promesa resuelta en el archivo `output.txt`.
- En caso de error, escribe `-1` y detiene el proceso.

```javascript
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

```

**Finalización**
- Cierra el flujo de escritura (`ws.end()`) al finalizar el procesamiento.