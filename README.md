# Backend-en-nube
->Desplegar un backend que simule la apertura y manejo de una cuenta bancaria con las siguientes operaciones:

1.- Creación de usuario en cognito y alguna base de datos. POST /cliente/signup

2.-Verificación de usuario POST /cliente/verificar

3-Autenticación de cliente POST /cliente/signin

4.-Depósitos a la cuenta Ruta POST /cuenta/deposito

5.-Retiros de la cuenta Ruta POST /cuenta/retiro

6.-Consulta de saldo Ruta GET /cuenta/saldo

->Características del backend:

1.-Deben existir dos controladores, uno para cliente y otro para cuenta

2.-Las rutas de cuenta deben estar protegidas únicamente por token

3.-En caso de retiro, si no hay saldo mostrar un mensaje de error, en cualquier otro caso marcar un mensaje de éxito.

4.-Debe generarse un workspace dentro de postman o herramienta equivalente con los casos de prueba

5.-La base de datos puede ser en mysql o dynamo db.

->Características del despliegue:

->La tabla en dynamo como la base de datos en mysql deben ser nuevas.

->El pool de cognito debe ser nuevo

->Pueden reutilizar una instancia ya aprovisionada para desplegar el proyecto