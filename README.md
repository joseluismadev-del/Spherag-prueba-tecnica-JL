# Spherag - Prueba Tecnica

Aplicacion movil desarrollada con React Native para la gestion de fincas y dispositivos Atlas de Spherag.

## Requisitos previos

- Node.js >= 22.11.0
- Android Studio con un emulador configurado (o un dispositivo fisico con depuracion USB activada)
- JDK 17

## Instalacion

1. Clonar el repositorio:

```bash
git clone https://github.com/joseluismadev-del/Spherag-prueba-tecnica-JL.git
cd Spherag-prueba-tecnica-JL/PruebaTecnica
```

2. Instalar las dependencias:

```bash
npm install
```

## Ejecutar la aplicacion

1. Iniciar Metro (el bundler de React Native):

```bash
npm start
```

2. En otra terminal, compilar e instalar en Android:

```bash
npm run android
```

Si usas un dispositivo fisico por USB, ejecuta antes:

```bash
adb reverse tcp:8081 tcp:8081
```

## Estructura del proyecto

```
src/
  assets/          # Imagenes y recursos estaticos
  context/         # Contexto de autenticacion (AuthContext)
  navigation/      # Navegacion con React Navigation
  screens/         # Pantallas de la app
    LoginScreen.js
    HomeScreen.js
    AtlasListScreen.js
    AtlasDetailScreen.js
  services/        # Llamadas a la API de Spherag
    authService.js
    fincasService.js
    atlasService.js
```

## Scripts disponibles

| Comando           | Descripcion                        |
| ----------------- | ---------------------------------- |
| `npm start`       | Inicia el servidor Metro           |
| `npm run android` | Compila y ejecuta en Android       |
| `npm run ios`     | Compila y ejecuta en iOS           |
| `npm run lint`    | Ejecuta el linter (ESLint)         |
| `npm test`        | Ejecuta los tests con Jest         |
