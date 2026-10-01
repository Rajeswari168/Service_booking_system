# Home Service Booking Platform

A full-stack web application for booking professional home services (Plumbing, Electrical, Home Chef, etc.) with role-based access for Customers, Providers, and Admins.

---

## 🛠 Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Lucide Icons, Axios, React Router
- **Backend**: Java 17+, Spring Boot 3, Spring Security 6, Spring Data JPA, JWT Authentication
- **Database**: PostgreSQL
- **Build Tools**: Maven 3+, Node.js & npm

---

## 🚀 Default Credentials

All demo accounts share the password: `password123`

| Role | Email | Password |
|---|---|---|
| **Customer** | `customer@test.com` | `password123` |
| **Provider** | `provider@test.com` | `password123` |
| **Admin** | `admin@test.com` | `password123` |

---

## 🏃 Local Setup & Running

### 1. Database
Ensure PostgreSQL is running locally on port 5432 and database `service_booking_db` exists:
```bash
# Schema and seed scripts are located in the database/ directory
psql -U postgres -d service_booking_db -f database/schema.sql
psql -U postgres -d service_booking_db -f database/seed.sql
```

### 2. Backend (Spring Boot)
```bash
cd backend
mvn spring-boot:run
```
Backend runs on `http://localhost:8081`.

### 3. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`.

---

## 🌐 Live Cloud Deployment Guide

### Option A: Render.com (Recommended Free/Easy Full-Stack)

1. **Deploy Database (PostgreSQL)**:
   - On [Render](https://render.com), click **New +** -> **PostgreSQL**.
   - Create a database called `service_booking_db`.
   - Copy the **Internal Database URL** and credentials.
   - Run the scripts in `database/schema.sql` and `database/seed.sql` using Render's web shell or any DB client (like DBeaver/pgAdmin).

2. **Deploy Backend (Web Service)**:
   - Click **New +** -> **Web Service** -> Connect this GitHub repo.
   - Root Directory: `backend`
   - Runtime: `Docker` (uses the included `backend/Dockerfile`)
   - Add Environment Variables:
     - `SPRING_DATASOURCE_URL`: `jdbc:postgresql://<render-db-host>:5432/service_booking_db`
     - `SPRING_DATASOURCE_USERNAME`: `<render-db-user>`
     - `SPRING_DATASOURCE_PASSWORD`: `<render-db-password>`
     - `JWT_SECRET`: `404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970`
   - Click **Deploy Web Service**. You will get a backend URL (e.g. `https://service-booking-backend.onrender.com`).

3. **Deploy Frontend (Static Site on Render / Vercel)**:
   - **On Vercel**: Import repo, set Root Directory to `frontend`, Framework: `Vite`.
   - Add Environment Variable:
     - `VITE_API_URL`: `https://service-booking-backend.onrender.com/api`
   - Click **Deploy**. Your frontend is live!

---

### Option B: Railway.app (All-in-One Deployment)

1. Go to [Railway.app](https://railway.app), create a new project.
2. Add a **PostgreSQL** service.
3. Add a service from GitHub repo pointing to `/backend`.
4. Add another service pointing to `/frontend`.
