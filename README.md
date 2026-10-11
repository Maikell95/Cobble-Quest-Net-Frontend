# Cobble Quest — Frontend

Web y tienda del servidor de Minecraft Cobble Quest (Cobblemon).

En producción: [store.wrquest.xyz](https://store.wrquest.xyz) · Backend: [Cobble-Quest-Net-Backend](https://github.com/Maikell95/Cobble-Quest-Net-Backend)

## Qué tiene

- **Tienda.** Catálogo, carrito, pago con PayPal o tarjeta. El producto llega solo al jugador en el servidor.
- **Rangos.** Comparativa de rangos y ventajas.
- **Wiki.** Pokédex de las especies de Cobblemon, generada desde el repositorio oficial del mod.
- **Estado del servidor.** Jugadores en línea en tiempo real.
- **Admin.** Gestión de productos y eventos.
- **Tema claro/oscuro.** Rutas con carga diferida.

## Stack

React 19 · TypeScript · Vite 6 · Tailwind CSS 4 · React Router 7 · Framer Motion · PayPal JS SDK

## Estructura

```
src/
├── pages/        Home, Store, Ranks, Wiki, Support, Cart, Admin
├── components/   layout y modales (pago, jugador)
├── context/      auth, carrito, jugador, tema
├── hooks/        estado del servidor
└── data/         caché de la wiki
scripts/          generan los datos de la wiki desde Cobblemon
```

## Local

```bash
npm install
npm run dev
```

Variables (`.env`):

```
VITE_API_URL=http://localhost:4000
VITE_PAYPAL_CLIENT_ID=tu-client-id
```

Deploy: GitHub Actions en cada push a `main`.
