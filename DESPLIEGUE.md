# Despliegue de Delicias Cafe

La imagen Docker contiene la web Angular, la API Spring Boot y los cuatro archivos SQL del proyecto. La base de datos se mantiene como un servicio MySQL externo y persistente; no se guarda en el disco temporal del servicio web.

## Preparacion

1. Crea una base MySQL vacia para la demo y guarda su URL JDBC, usuario y contraseña.
2. Antes de abrir el registro, importa los SQL en este orden: `Tablas de la pagina.sql`, `Roles de los empleados.sql` e `Imagenes de todos los productos.sql`. `Verificar historial de compras.sql` solo contiene consultas de lectura.
3. Usa únicamente una base de datos de prueba. `Roles de los empleados.sql` elimina y vuelve a crear `logs_empleados`, y asigna una contraseña común a las cuentas que ya existan.
4. Crea un repositorio privado en GitHub y sube el contenido de la carpeta del proyecto.

## Servicio web en Render

1. Crea un Blueprint desde el repositorio y selecciona `render.yaml`.
2. En la configuración del servicio, define `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME` y `SPRING_DATASOURCE_PASSWORD` como variables privadas. La URL debe ser JDBC y usar las opciones TLS que indique el proveedor MySQL.
3. `JWT_SECRET` se genera automáticamente al crear el servicio.
4. Espera a que el chequeo `/api/productos` responda correctamente. El frontend y la API comparten el mismo dominio; la aplicación usa rutas relativas `/api`.

El plan gratuito de Render puede suspender el servicio cuando está inactivo y tardar alrededor de un minuto en reactivarlo. Render no ofrece MySQL administrado en su plan gratuito, así que la base debe contratarse o alojarse con otro proveedor. La disponibilidad del servicio web no implica que la base externa sea gratuita.

## Inicio de sesión con Google

El proyecto usa el Firebase configurado en `delicias-cafe`. En Firebase Console, agrega el dominio `onrender.com` que Render asigne a los dominios autorizados de Authentication y confirma que Google esté habilitado como proveedor. Se necesita acceso al proyecto Firebase existente; si no está disponible, se debe crear otro proyecto y reemplazar su configuración web en Angular.

## Límites de la demo

Los cuatro roles se pueden elegir en el registro público, por lo que cualquier visitante puede obtener permisos de administrador y modificar los datos de demostración. Además, la API no exige actualmente autenticación para sus operaciones y el backend acepta el correo de Google enviado por el cliente sin verificar el token de Firebase. No cargues cuentas, pedidos ni información real, ni uses esta demo como sistema de una cafetería real.

Las imágenes de productos son URLs externas guardadas en MySQL, no archivos de imagen incluidos en la base. Su disponibilidad depende de los sitios que las alojan.
