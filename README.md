# AFEX-VUE APP
========================

Esta aplicacion ha sido desarrollada como una prueba tecnica de integracion de las tecnologias CSS Flex, Node.js, AWS Lambda, AWS DynamoDB, AWS S3, y Vue 3 Composition API


## Deploy

### Vue

La carpeta "afex-vue" contiene el proyecto principal en Vue.  

Para realizar una instalacion local del proyecto, debe utilizar los siguientes comandos:

```
    npm install
    npm run dev
```

Para realizar un deploy fresco debe utilizar el siguiente comando:

```
    npm run build
```

Este comando generara los archivos necesarios para realizar un deploy estatico desde cualquier servidor web, almacenados en la carpeta "dist". Este proyecto en particular fue subido a un bucket publico de Amazon S3.

### AWS Dynamo DB

Se debe generar una tabla en DynamoDB llamada "afex", referida en el lambda, que debe poseer una clave primaria de nombre "uid" de tipo string.


### AWS Lambda

En la carpeta "afex-module" se encuentra el archivo index.mjs, que representa el contenido de una funcion lambda. Contiene todas las funciones del CRUD. Tambien se adjunta un archivo llamado functions.js el cual contiene un ejemplo de request a la API.
Se debe configurar en las variables de ambiente del lambda la variable API_KEY, obtenida desde la cuenta de desarrollador de google.

La configuracion fue realizada acorde a la siguiente guia de Amazon: <https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-dynamo-db.html>

El deploy actual se encuentra configurado para limitar la cantidad maxima de trafico a 10 operaciones por segundo.

Los endpoints son los siguientes:

![alt text](https://raw.githubusercontent.com/bryan-menendez/afex-vue/master/ss_api.png)

#### GET /videos/{uid}
 Endpoint que sirve como proxy de la API de Youtube. Recibe un parametro {uid}, que representa el id del video del cual queremos solicitar informacion.
 
Response:  
```
{
  "items": [
    {
        ...,
    "id": "IkKMJPgALmI",
      "snippet": {
          ...
        "title": "Title",
        "description": "desc",
        "thumbnails": {
          "medium": {
            "url": "https://i.ytimg.com/vi/IkKMJPgALmI/mqdefault.jpg",
            "width": 320,
            "height": 180
          },...
        },...
      },
      "contentDetails": {
        "duration": "PT2H21M40S",
        ...
      }
    }
  ],...
}
```
 
#### PUT /videos/

Endpoint que recibe nuevos videos. Recibe los parametros uid, title, desc, y length. El parametro length se almacena en formato ISO 8601 y es transformado en el frontend.

Request:  
```
{
   "uid": 'MOq0s9G-Uyg', 
   "title": "title", 
   "desc": "desc", 
   "length": "PT34M4S"
}
```

Response:  
```
    `Put item {uid}`
```

#### DELETE /videos/{uid}

Endpoint que recibe solicitudes de eliminacion de videos. Recibe el parametro uid.


Response:  
```
    `Deleted item {uid}`
```

#### GET /videos

Endpoint que retorna la lista completa de videos almacenados. Retorna un arreglo con los objetos.

Response:  
```
[...,
{
   "uid": 'MOq0s9G-Uyg', 
   "title": "title", 
   "desc": "desc", 
   "length": "PT34M4S"
   },...
]
```

#### OPTIONS /videos

Este endpoint permite el envio de cabeceras CORS al navegador cuando se realizan llamadas a APIs externas. Se debe vincular con la misma integracion que los endpoints anteriores.
