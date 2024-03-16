# pathfinding-phaser

Este proyecto es para mostrar como funcionan los algoritmos de busqueda en un juego 2D en Phaser.

## Tecnologias

- Phaser
- JavaScript
- HTML
- CSS
- Git

## Estructura

Se armo una clase por cada algoritmo de busqueda que extiende de una clase base:

- Busquedas sin informacion
  - Busqueda por amplitud (Breadth First)
  - Busqueda por profundidad (Depth First)
  - Dijkstra
- Busquedas informadas
  - A \* (A estrella)

## Contribuir

Si quieres agregar un algoritmo o modificar por una implementacion distinta de alguno de los algoritmos puedes crear un PR o agregar una issue al proyecto.

## Algoritmos

### Breadth First

BreadthFirst implementa el algoritmo de búsqueda en anchura (Breadth-First Search, BFS) para encontrar el camino más corto en un mapa de cuadrícula.

**Detalles**
setGrid(map): Este método toma un mapa bidimensional como entrada y lo copia en la propiedad grid de la instancia.

findPath(fromX, fromY, toX, toY, callback): Este método es el punto de entrada para iniciar la búsqueda del camino. Toma las coordenadas de inicio y fin y una función de devolución de llamada (callback) que se llama cuando se encuentra el camino. Crea una nueva instancia de la clase Instance y configura sus propiedades. Luego, llama al método \_checkNeighbors para iniciar la búsqueda.

getNeighbors(node, map): Este método toma un nodo y un mapa como entrada y devuelve todos los nodos vecinos que son accesibles (es decir, están en la lista de acceptableTiles).

\_backtrace(node): Este método toma un nodo como entrada y sigue su camino hacia atrás (usando la propiedad parent de cada nodo) hasta que llega al nodo de inicio. Devuelve el camino como una lista de nodos.

\_checkNeighbors(instance, x, y): Este método es la parte principal del algoritmo BFS. Toma una instancia y las coordenadas de un nodo, obtiene todos los vecinos del nodo, los agrega a la lista de nodos abiertos y los marca como visitados. Si encuentra el nodo de destino, llama a la función de devolución de llamada con el camino encontrado. Si no, toma el siguiente nodo de la lista de nodos abiertos y repite el proceso.

### Depth First

DepthFirst implementa el algoritmo de búsqueda en profundidad (Depth-First Search, DFS) para encontrar un camino en un mapa de cuadrícula.

**Detalles**

setGrid(map): Este método toma un mapa bidimensional como entrada y lo copia en la propiedad grid de la instancia.

findPath(fromX, fromY, toX, toY, callback): Este método es el punto de entrada para iniciar la búsqueda del camino. Toma las coordenadas de inicio y fin y una función de devolución de llamada (callback) que se llama cuando se encuentra el camino. Crea una nueva instancia de la clase Instance y configura sus propiedades. Luego, llama al método \_checkNeighbors para iniciar la búsqueda.

getNeighbors(node, map): Este método toma un nodo y un mapa como entrada y devuelve todos los nodos vecinos que son accesibles (es decir, están en la lista de acceptableTiles).

\_backtrace(node): Este método toma un nodo como entrada y sigue su camino hacia atrás (usando la propiedad parent de cada nodo) hasta que llega al nodo de inicio. Devuelve el camino como una lista de nodos.

\_checkNeighbors(instance, x, y): Este método es la parte principal del algoritmo DFS. Toma una instancia y las coordenadas de un nodo, obtiene todos los vecinos del nodo, los agrega a la lista de nodos abiertos y los marca como visitados. Si encuentra el nodo de destino, llama a la función de devolución de llamada con el camino encontrado. Si no, toma el siguiente nodo de la lista de nodos abiertos y repite el proceso. A diferencia del BFS, DFS va tan profundo como puede en cada rama antes de retroceder.

### Dijkstra

Dijkstra implementa el algoritmo de Dijkstra para encontrar el camino más corto en un mapa de cuadrícula.

**Detalles**
setGrid(map): Este método toma un mapa bidimensional como entrada y lo copia en la propiedad grid de la instancia.

findPath(fromX, fromY, toX, toY, callback): Este método es el punto de entrada para iniciar la búsqueda del camino. Toma las coordenadas de inicio y fin y una función de devolución de llamada (callback) que se llama cuando se encuentra el camino. Crea una nueva instancia de la clase Instance y configura sus propiedades. Luego, llama al método \_checkNeighbors para iniciar la búsqueda.

getNeighbors(node, map): Este método toma un nodo y un mapa como entrada y devuelve todos los nodos vecinos que son accesibles (es decir, están en la lista de acceptableTiles).

\_backtrace(node): Este método toma un nodo como entrada y sigue su camino hacia atrás (usando la propiedad parent de cada nodo) hasta que llega al nodo de inicio. Devuelve el camino como una lista de nodos.

\_checkNeighbors(instance, x, y): Este método es la parte principal del algoritmo de Dijkstra. Toma una instancia y las coordenadas de un nodo, obtiene todos los vecinos del nodo, los agrega a la lista de nodos abiertos y los marca como visitados. Si encuentra el nodo de destino, llama a la función de devolución de llamada con el camino encontrado. Si no, toma el siguiente nodo de la lista de nodos abiertos y repite el proceso. A diferencia del BFS y DFS, Dijkstra utiliza una cola de prioridad para seleccionar el siguiente nodo a visitar basándose en el costo acumulado hasta el momento.

### A \*

AStar implementa el algoritmo de búsqueda de ruta A\* para encontrar el camino más corto en un mapa de cuadrícula.

**Detalles**
setIterationsPerCalculation(iterations): Este método establece el número de iteraciones que el algoritmo debe realizar por cada cálculo.

avoidAdditionalPoint(x, y): Este método toma las coordenadas de un punto y lo agrega a la lista de puntos a evitar. Esto significa que el algoritmo no considerará este punto como parte de un camino válido.

stopAvoidingAdditionalPoint(x, y): Este método toma las coordenadas de un punto y lo elimina de la lista de puntos a evitar.

stopAvoidingAllAdditionalPoints(): Este método elimina todos los puntos de la lista de puntos a evitar.

findPath(startX, startY, endX, endY, callback): Este método es el punto de entrada para iniciar la búsqueda del camino. Toma las coordenadas de inicio y fin y una función de devolución de llamada (callback) que se llama cuando se encuentra el camino. Dentro de este método, se verifica si el algoritmo puede usarse con los parámetros dados y luego se inicia la búsqueda del camino.

callbackWrapper: Esta es una función interna que se utiliza para llamar a la función de devolución de llamada con el resultado de la búsqueda del camino. Si syncEnabled es verdadero, la función de devolución de llamada se llama inmediatamente. Si es falso, se llama en el próximo ciclo del bucle de eventos de JavaScript.
