# Trabajo Práctico Integrador -- Backend

# Integrantes
Barboza Morales, Jair   88643
Sosa, Ivo               91078
Bottiglieri, Amadeo     95703
Chaui, Camilo             95148

## Descripción del Proyecto

Este proyecto consiste en el desarrollo de un conjunto de Web APIs o REST APIs utilizando **Node.js**, **Express**, 
**Sequelize**, **SQLite** y **Jest**. El objetivo es aplicar los conceptos y técnicas vistas en clase para crear un 
backend completo que permita la manipulación de datos almacenados en una base de datos SQLite, manejando tablas 
relacionadas según los recursos de interés elegidos por cada grupo.

## Enunciado

Realizar un ejercicio grupal en el repositorio de Gitlab. El objetivo es implementar un conjunto de Web APIs o REST APIs, 
tantas como integrantes tenga el grupo, sobre recursos a elección. Para ello, pueden basarse en el modelo de la Web API o 
REST API Artículos que se implementó en el paso a paso que está compartido en el repositorio, la cual consume datos de la 
base de datos mediante el ORM Sequelize e implementa un conjunto de endpoints de acceso a estas tablas en de acuerdo con lo 
estudiado.

Para completar el ejercicio, cada grupo debe crear **dos tablas relacionadas por alumno**, con al menos **10 registros**, 
incluyendo al menos:
- Un campo numérico,
- Un campo de fecha,
- Un campo string.

Además, deben crear el modelo de Sequelize que represente la tabla y el controlador Web API o REST API con los métodos:
- `GET`
- `GET by ID`
- `POST`
- `PUT`
- `DELETE`

Cada endpoint debe contar con **tests unitarios** implementados con Jest.

Este ejercicio permite aplicar los conocimientos adquiridos en clase y poner en práctica la implementación de Web APIs o 
REST APIs utilizando Sequelize. Además, brinda la oportunidad de trabajar en equipo y mejorar la habilidad para colaborar 
en proyectos de programación.

### Condiciones de Entrega

Para entregar el ejercicio, cada grupo deberá:
1. Realizar el merge de los commits de todos los integrantes en la rama `main` del repositorio asociado al proyecto.
2. Comprimir una copia del repositorio, sin incluir la carpeta `node_modules`, en un archivo que tenga por nombre 
   `Grupo-3KXX-##.zip`, de acuerdo con la denominación del grupo de aula virtual.
3. Responder a esta tarea en el aula virtual subiendo el archivo zip en la sección de entrega y agregando un link al repositorio.

## Instrucciones para Configuración y Ejecución del Proyecto

### Prerrequisitos
- **Node.js**: versión 14 o superior
- **npm**: versión 6 o superior
- **Git**

### Instalación

1. Clona el repositorio:
   ```bash
   git clone <URL-DEL-REPOSITORIO>

2. Navega al directorio del proyecto:
cd <nombre-del-directorio>

3. Instala las dependencias:
npm install


## Configuracion de la Base de Datos
El proyecto utiliza SQLite como base de datos. La configuración de Sequelize y SQLite está definida en sequelize-init.js y sqlite-init.js. La base de datos se inicializará automáticamente con las tablas requeridas y sus relaciones al ejecutarse el proyecto.

# Ejecución del Servidor
Para iniciar el servidor en modo desarrollo:
npm run dev


El servidor estará disponible en http://localhost:3000.

## Endpoints Principales
Los endpoints están estructurados para manejar los recursos del proyecto. A continuación se presentan ejemplos de algunos endpoints disponibles:

GET /api/<nombre-recurso>: Obtiene todos los registros del recurso.
GET /api/<nombre-recurso>/:id: Obtiene un registro específico por ID.
POST /api/<nombre-recurso>: Crea un nuevo registro.
PUT /api/<nombre-recurso>/:id: Actualiza un registro por ID.
DELETE /api/<nombre-recurso>/:id: Elimina un registro por ID.


## Testing
Los tests de cada endpoint han sido desarrollados utilizando Jest. Para ejecutar los tests:
npm test
