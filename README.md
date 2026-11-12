# Delicias Cafe

Aplicacion academica compuesta por un frontend Angular, una API Spring Boot y una base de datos MySQL.

La configuracion para empaquetar el frontend y el backend en un servicio Docker, junto con los pasos de despliegue y las limitaciones de la demo, esta en [DESPLIEGUE.md](./DESPLIEGUE.md).

## Desarrollo local

1. Inicia MySQL e importa los scripts SQL en el orden indicado en la guia de despliegue.
2. Configura `SPRING_DATASOURCE_PASSWORD` y `JWT_SECRET` en el entorno antes de iniciar el backend.
3. Inicia Spring Boot en el puerto 3000.
4. En `delicias-cafe`, ejecuta `npm start`; el proxy de desarrollo redirige `/api` al backend local.