# Vybe – MERN E-commerce

Live demo: https://your-live-site-url.example.com

## Overview
Vybe is a full-stack e-commerce app built on the MERN stack. It supports product browsing with search and pagination, cart/checkout, order placement with PayPal-style payments, user auth with role-based admin features, and admin dashboards for products/orders/users. The backend serves a REST API with JWT-secured routes, file uploads, and MongoDB persistence; the frontend is a React SPA using Redux Toolkit Query for data fetching and caching.

## Tech Stack
- MongoDB + Mongoose – document database and schema modeling for products, users, and orders.
- Express + Node.js – REST API, middleware, uploads, and auth.
- React + React Router – SPA UI, routing, and protected admin/user pages.
- Redux Toolkit Query – data fetching/caching, optimistic updates, and tag-based invalidation.
- Bootstrap/React-Bootstrap – responsive UI components.
- Multer – product image uploads.
- JSON Web Tokens + cookies – auth and session.
- PayPal client integration endpoint – payment processing (swap in your provider).

## Key Features
- Product catalog with search, keyword filters, pagination, and top-rated carousel.
- Product detail pages with reviews/ratings.
- Cart and checkout flow with shipping/payment steps.
- Order creation, payment, delivery tracking; user order history.
- Admin: manage products (CRUD + image upload), users, and all orders.
- Secure routes: protected user endpoints and admin-only operations.
- API error handling and not-found middleware.

## Real-World Uses
- Standalone store or starter template for bespoke e-commerce builds.
- Internal company stores for swag/procurement.
- Learning reference for MERN patterns: RTK Query caching, JWT cookie auth, file uploads, pagination/search.

## Project Structure
- backend/ – Express server, routes, controllers, models, middleware, seeder.
- frontend/ – React app, screens, components, Redux slices (API + UI state), styles.
- uploads/ – served static files for product images.

## Getting Started
1) Install deps:
   - Root: npm install
   - Frontend: npm install --prefix frontend
2) Environment:
   - .env in root with:
     NODE_ENV=development
     PORT=5000
     MONGO_URI=your_mongo_connection_string
     JWT_SECRET=your_jwt_secret
     PAYPAL_CLIENT_ID=your_paypal_client_id
3) Seed data (optional): npm run data:import (or npm run data:destroy to wipe).

## Run
- Dev (concurrent client + server): npm run dev
- Backend only: npm run server
- Frontend only: npm run client (relies on CRA proxy to backend at :5000)

## Build
- Production frontend build: npm run build --prefix frontend
- Serve: ensure NODE_ENV=production and run npm start (serves API and static assets).

## API Highlights
- Products: GET /api/products, GET /api/products/:id, POST/PUT/DELETE (admin), POST /api/products/:id/reviews.
- Users: auth/register/profile; admin user management.
- Orders: POST /api/orders, GET /api/orders/mine, GET /api/orders/:id, PUT /api/orders/:id/pay, PUT /api/orders/:id/deliver (admin), GET /api/orders (admin).
- Uploads: POST /api/upload.
- Config: GET /api/config/paypal.

## Scripts (root)
- npm run dev – concurrent backend + frontend (nodemon + CRA).
- npm run server – backend with nodemon.
- npm run client – frontend dev server.
- npm run data:import / npm run data:destroy – seed utilities.

## Deployment Notes
- Set BASE_URL/proxy as needed if serving frontend separately.
- Provide production .env with MongoDB, JWT secret, and payment provider keys.
- Serve uploads/ statically (already configured in backend/server.js).

Replace the live URL with your deployed site link when you have it.
