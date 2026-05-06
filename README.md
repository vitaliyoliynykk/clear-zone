# Clear Zone Frontend

Frontend application for the **Clear Zone** project, an embedded indoor air quality monitoring system based on **ESP32** modules.

This app provides the user interface for:
- user authentication
- device onboarding via Web Bluetooth
- live device status updates over WebSocket
- indoor air quality dashboards and history charts
- AI-generated air quality summaries

## Tech Stack

- React 19
- TypeScript
- Vite
- Redux Toolkit
- React Router
- Chakra UI

## Getting Started

This project uses `pnpm`.

```bash
nvm use
pnpm install
cp .env.template .env
pnpm dev
```

## Environment Variables

Set these values in `.env`:

```env
VITE_API_URL=
VITE_WS_URL=
VITE_APP_VERSION=
VITE_VAPID_PUBLIC_KEY=
```

## Available Scripts

```bash
pnpm dev
pnpm build
pnpm preview
pnpm lint
pnpm test
```
