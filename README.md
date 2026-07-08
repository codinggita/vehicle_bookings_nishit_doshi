# 🚗 Vehicle Bookings App

A modern, high-performance vehicle bookings management dashboard system featuring a premium, custom Indigo-themed UI frontend and an MVC-structured Node.js Express backend.

[![Deploy to Render](https://render.com/images/deploy-to-render.button.svg)](https://render.com/deploy?repo=https://github.com/nishit546/vehicle_bookings_nishit_doshi)

---

## 📂 Project Structure

This project is set up as a monorepo:
* **[/backend](./backend)**: The MVC Express API Node.js server.
* **[/frontend](./frontend)**: The Vite React dashboard client interface.

---

## ☁️ Deployment on Render

You can easily deploy the backend API service directly to Render.

### Option 1: One-Click Deploy Button (Recommended)
Click the button below to deploy the backend API using the project's pre-configured `render.yaml` blueprint:

[![Deploy to Render](https://render.com/images/deploy-to-render.button.svg)](https://render.com/deploy?repo=https://github.com/nishit546/vehicle_bookings_nishit_doshi)

### Option 2: Manual Setup on Render
If you prefer to configure it manually on the Render Dashboard:

1. Create a new **Web Service** on [Render](https://dashboard.render.com).
2. Connect your GitHub repository.
3. Configure the following settings:
   - **Name**: `vehicle-bookings-backend`
   - **Environment**: `Node`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. In the **Environment** tab, add the following Environment Variables:
   - `NODE_ENV`: `production`
   - `MONGO_URI`: *Your MongoDB Connection String* (e.g. from MongoDB Atlas)
   - `JWT_SECRET`: *A secure random secret key* (e.g. generated or a long string)
   - `JWT_EXPIRE`: `24h`
5. Click **Deploy Web Service**.

---

## 🛠️ Local Development

For details on local installation, running, seeding databases, and testing endpoints, refer to:
* [Backend README](./backend/README.md)
* [Frontend README](./frontend/README.md)
* [Postman API Documentation](./backend/POSTMAN.md)
