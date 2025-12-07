# MeetMe Calendar

![Static Badge](https://img.shields.io/badge/Frontend-React_19-blue)
![Static Badge](https://img.shields.io/badge/State-Redux_Toolkit-purple)
![Static Badge](https://img.shields.io/badge/UI-shadcn_style-black)
![Static Badge](https://img.shields.io/badge/Backend-Node%2FExpress-green)
![Static Badge](https://img.shields.io/badge/Status-In_Development-orange)

Live site: **https://meetme-1-mu1h.onrender.com**

## Features
- Authenticated calendar with week grid, mini-month selector, and keyboard/arrow navigation.
- Create, edit, and delete appointments with color tags, meeting links, notes, and smart time-slot placement.
- Shadcn-inspired UI primitives (buttons, inputs, dropdown, dialog) with a dark calendar theme and light auth pages.
- Responsive layout with sticky header, quick “New event” CTA, and inline event modal.
- Toast notifications for CRUD actions and inline validation for time ranges.

## Tech Stack
- React 19 (SPA with React Router 7)
- Redux Toolkit Query for API calls and caching
- Custom shadcn-style component primitives
- React Icons, React Toastify
- Node/Express backend (API) proxied in development

## Getting Started
```bash
cd frontend
npm install
npm start
```
The app proxies API calls to the backend defined in `package.json` (`proxy`).

## Build & Deploy
Local production build:
```bash
cd frontend
npm run build
```
Render static deploy is configured via `render.yaml`, publishing `frontend/build` and rewriting routes to `index.html` for SPA navigation.
