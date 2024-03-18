<h1 align="center" id="title">RaflleApp</h1>

<p id="description">Aplicación para el CodeQuest de DevTalles.</p>

<h2>🚀 Demo</h2>

[raffle-api.up.railway.app](raffle-api.up.railway.app)

<h2>Screenshots:</h2>

<img src="https://firebasestorage.googleapis.com/v0/b/nameless-afa75.appspot.com/o/screenshot%2F1710748122157-Screenshot%202024-03-18%20014634.png?alt=media&amp;token=11a2be52-bd19-43f4-9709-b4050d98c024" alt="project-screenshot" width="480" height="270/">
  
  
<h2>🧐 Cataracterísticas</h2>

Acá algunas de las características más importantes del proyecto:

- Selección de ganadores
- Seleccion de ganadores por algoritmo Fisher-Yates
- Seleccion de ganadores por algoritmo ParallelShuffle
- Clasificación de premios en diferentes niveles
- Creación de premios
- Creación de toneos
- Acceso a torneos por URL personalizada

<h2>🛠️ Pasos de instalación:</h2>

<p>1. Clonar el repositorio</p>

```bash
git clone https://github.com/nameless-official/raffle-api.git
```

<p>2. Instalar las dependencias</p>

```bash
cd raffle-api
npm install
```

<p>3. Configurar Variables de Entorno</p>

- Crea un archivo .env en la raíz del proyecto.
- Agrega las siguientes variables con tus propios valores:

```
DB_SERVER='localhost'
DB_NAME='nombre_de_la_base_de_datos'
DB_USER='nombre_de_usuario'
DB_PASS='contraseña_de_la_base_de_datos'
DB_PORT='puerto_de_la_base_de_datos'
JWT_SECRET='tu_secreto_jwt'
DISCORD_BOT_TOKEN='tu_token_del_bot'
DEVTALLES_SERVER_ID='id_del_servidor_de_discord'
PORT=3000
```

<p>4. Ejecutar la Aplicación</p>

```bash
npm run start:dev
```

<p>5. Iniciar ngrok para el Túnel HTTPS</p>

- Descarga e instala ngrok desde https://ngrok.com/download.
- Ejecuta el comando ngrok http 3000 para iniciar el túnel HTTPS y obtener una URL segura para conectar tu aplicación de Discord.

```bash
ngrok http 3000
```

<p>6. Configurar la API de Discord</p>

- Crea una aplicación y un bot en la página de desarrolladores de Discord (https://discord.com/developers/applications).
- Copia el token del bot y configúralo en el archivo .env como DISCORD_BOT_TOKEN.
- Es importante tener en cuenta que para configurar el bot, se requiere disponer de un servidor en Discord. Además, el bot solo tiene acceso a la información de los usuarios que pertenecen a los mismos servidores en los que está presente el bot.

<p>7. Uso de la API</p>

- Se puede utilizar la documentación de Swagger para probar los endpoints de la API.
- La documentación de Swagger se encuentra en la ruta `/docs`

<h2>💻 Built with</h2>

Technologies used in the project:

- Nest Js
- PostgreSQL
- DiscordAPI
- JWT
- Firestore
