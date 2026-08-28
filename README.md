# 1. 🏢 Smart Co-Working Space Management Using Real-Time Monitoring

A centralized, role-based web platform that helps individuals, startups, and enterprises discover, evaluate, and book co-working spaces — with smart filtering, real-time availability tracking, secure payments, and dedicated dashboards for Users, Owners, and Admins.

![MERN](https://img.shields.io/badge/Stack-MERN-informational)
![License](https://img.shields.io/badge/License-MIT-green)
![Status](https://img.shields.io/badge/Status-Active-brightgreen)

---

## 2. 📖 Project Overview

The Co-Working Space Web Platform is built for **SmartWorkspace** to solve a real problem: users struggle to find co-working spaces that match their exact team size, budget, and amenity needs, while owners struggle to manage listings, bookings, and inquiries manually.

This platform brings discovery, comparison, and booking into one workflow — with transparent details on capacity, area, pricing, and amenities, real-time availability, and a smart matching layer that filters spaces to a user's specific requirements.

**Target Users**

- Freelancers & remote workers
- Startups and small teams
- Enterprises seeking flexible workspaces
- Co-working space owners and managers

---

## 3. ✨ Key Features

- 🔐 Secure role-based authentication (User / Owner / Admin) with JWT
- 🔎 Smart search & filtering by persons, area, budget, location, and amenities
- 📍 Detailed space listings — capacity, area, pricing, amenities, images
- 📅 Real-time availability checks before booking
- 🧾 Booking & inquiry system with approve/reject workflow
- 💳 Integrated Razorpay payments with order creation & verification
- 🔔 In-app notification system (read / delete / mark-as-read)
- 🖼️ Cloudinary-powered image uploads for spaces & profiles
- 📊 Full admin dashboard with platform-wide analytics
- 📱 Fully responsive UI across desktop, tablet, and mobile

---

## 4. 👥 User Roles

| Role      | Capabilities                                                                                                                         |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **User**  | Browse & search spaces, view details, send bookings/inquiries, make payments, track booking status, manage profile & notifications   |
| **Owner** | List & manage own spaces, set availability, review/approve/reject bookings, reply to inquiries, view owner dashboard & notifications |
| **Admin** | Full platform oversight — manage users/owners, moderate spaces, monitor bookings/inquiries/payments, view platform-wide analytics    |

Role separation is enforced end-to-end via `authMiddleware`, `roleMiddleware`, and route-level `authorizeRoles()` guards on the backend, and `ProtectedRoute.jsx` on the frontend.

---

## 5. 🧰 Tech Stack

**Frontend**

- React.js (Vite)
- Tailwind CSS + shadcn/ui components
- React Router

**Backend**

- Node.js + Express.js 5

**Database**

- MongoDB with Mongoose ODM

**Authentication**

- JWT (JSON Web Tokens) + bcryptjs password hashing

**Payments**

- Razorpay (order creation + signature verification)

**Media Storage**

- Cloudinary (image uploads via Multer)

**Deployment**

- Vercel (frontend & backend)

---

## 6. 🏗️ System Architecture

```
┌────────────────┐        HTTPS/REST        ┌─────────────────────┐
│   React (Vite)  │ ───────────────────────▶ │   Express.js API     │
│   Frontend SPA   │ ◀─────────────────────── │   (Node.js)          │
└────────────────┘         JSON              └─────────┬───────────┘
                                                          │
               ┌──────────────────────────────────────────┼───────────────────────────┐
               │                                          │                            │
               ▼                                          ▼                            ▼
      ┌─────────────────┐                     ┌───────────────────┐        ┌────────────────────┐
      │    MongoDB        │                     │     Cloudinary      │        │      Razorpay         │
      │ (Users, Spaces,    │                     │ (Space/Profile      │        │ (Order creation &     │
      │ Bookings, Inquiries,│                     │  Image Storage)     │        │  Payment verification)│
      │ Payments,          │                     └───────────────────┘        └────────────────────┘
      │ Notifications)     │
      └─────────────────┘
```

**Request flow:** Client → Express routes → `authMiddleware` / `roleMiddleware` → Controller → Mongoose Model → MongoDB → JSON response back to client.

---

## 7. 📁 Project Structure

```
Smart-Co-Working-Space-Management-Using-Real-Time-Monitoring/
│
├── backend/
│   ├── config/
│   │   ├── cloudinary.js
│   │   ├── db.js
│   │   └── razorpay.js
│   │
│   ├── controllers/
│   │   ├── adminControllers.js
│   │   ├── authController.js
│   │   ├── bookingController.js
│   │   ├── inquiryController.js
│   │   ├── notificationController.js
│   │   ├── paymentController.js
│   │   └── spaceController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   └── uploadMiddleware.js
│   │
│   ├── models/
│   │   ├── Booking.js
│   │   ├── Inquirey.js
│   │   ├── Notification.js
│   │   ├── Payments.js
│   │   ├── Space.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── inquireyRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── paymentRoutes.js
│   │   └── spaceRoutes.js
│   │
│   ├── seed/
│   │   └── seedAdmin.js
│   │
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── uploadToCloudinary.js
│   │
│   ├── .env / .env.example
│   ├── .gitignore
│   ├── package.json
│   ├── server.js
│   └── vercel.json
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   │   ├── admin/        (AdminHeader, AdminSidebar, StatsCard, StatusBadge, ConfirmDialog, AdminLoader)
    │   │   ├── auth/         (ProtectedRoute)
    │   │   ├── booking/      (BookingCard, BookingForm, BookingSummary)
    │   │   ├── common/       (EmptyState, ErrorMessage, Loading)
    │   │   ├── dashboard/    (DashboardShell, DashboardSidebar, OwnerSidebar)
    │   │   ├── home/         (HeroSection, FeaturedSpaces, HowItWorks, Testimonials, FAQSection, ...)
    │   │   ├── inquirey/     (InquiryCard, InquireyForm)
    │   │   ├── layout/       (Navbar, Footer, MainLayout, AdminLayout, Sidebar)
    │   │   └── space/        (SpaceCard, SpaceForm, SpaceGrid)
    │   │
    │   ├── context/
    │   │   └── authContext.jsx
    │   ├── lib/
    │   │   └── utils.js
    │   ├── pages/
    │   │   ├── admin/        (AdminDashboard, AdminUser(s), AdminSpace(s), AdminBooking(s), AdminInquiries, AdminPayments)
    │   │   ├── booking/       (Booking, BookingDetails)
    │   │   ├── inquirey/      (Inquirey)
    │   │   ├── owner/         (OwnerDashBoard, MySpace, OwnerBooking, OwnerInquiries, OwnerProfile, Notification)
    │   │   ├── payments/      (Payment)
    │   │   ├── services/      (api.js, authService, bookingService, spaceService, paymentService, ...)
    │   │   ├── space/         (Spaces, SpaceDetails)
    │   │   ├── user/          (UserDashboard, MyBooking, MyInquires, Profile, Notification)
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   └── Register.jsx
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    │
    ├── .env / .gitignore
    ├── components.json
    ├── index.html
    ├── jsconfig.json
    ├── package.json
    ├── vercel.json
    └── vite.config.js
```

---

## 8. 🎨 Frontend Features

- Component-driven React architecture (Vite) organized by domain: `admin`, `auth`, `booking`, `dashboard`, `home`, `inquirey`, `layout`, `space`
- `ProtectedRoute.jsx` guards private routes based on auth state and role
- `authContext.jsx` provides global auth state across the app
- Dedicated `services/` layer (`api.js`, `authService`, `bookingService`, `spaceService`, `paymentService`, `inquireyService`, `notificationService`, `adminApi`) cleanly separating API calls from UI
- Reusable UI primitives: `EmptyState`, `ErrorMessage`, `Loading`, `ConfirmDialog`, `StatsCard`, `StatusBadge`
- Rich home page sections: Hero, Featured Spaces, How It Works, Popular Cities, Testimonials, FAQ, Trusted Companies, Marketplace Stats
- Styled with Tailwind CSS + shadcn/ui (`components.json`) for a consistent design system

---

## 9. ⚙️ Backend Features

- RESTful API built with **Express.js 5** and **ES Modules**
- Clean **MVC-style** separation: `routes/` → `controllers/` → `models/`
- Centralized CORS configuration with an allow-list driven by `CLIENT_URL`
- Global error-handling middleware covering CORS errors, Multer/file-upload errors, and generic server errors
- Health-check endpoints: `GET /` and `GET /api/health`
- `uploadMiddleware.js` (Multer) + `uploadToCloudinary.js` for image handling
- `generateToken.js` utility for signed JWTs (7-day expiry)
- `seedAdmin.js` script to bootstrap the first Admin account

---

## 10. 📡 Real-Time Monitoring

- **Live availability checks** — `GET /api/bookings/availability` validates a space's open/booked status before a booking is confirmed, preventing double-booking
- **Live space status** — spaces are flagged `available` / `unavailable`, updatable instantly by Owners (`PUT /api/admin/spaces/:id/availability` on the admin side) and reflected immediately in search results
- **Booking status pipeline** — `pending → confirmed/cancelled`, updated by Owners and visible to Users in real time via `getBookingById` / `getMyBookings`
- **In-app notifications** — booking, inquiry, and status-change events generate notifications (`Notification` model) surfaced through `GET /api/notifications`
- **Live admin metrics** — the Admin Dashboard endpoint aggregates users, spaces, bookings, inquiries, and revenue on every request via MongoDB aggregation pipelines (no stale cached stats)

---

## 11. 🛡️ Admin Panel

The Admin Panel (`/api/admin/*`, `pages/admin/*`) gives platform-wide control:

- **Dashboard analytics** — total/active users, owners & admins; total/available/unavailable spaces; booking counts by status; inquiry counts by status; payment totals and **total revenue** (via aggregation)
- **User management** — search & filter by name/email/phone/location, paginated listing, view a user's full activity (spaces, bookings, inquiries, payments), change role, delete user (self-role-change and self-deletion are blocked; admin accounts are protected from deletion)
- **Owner management** — dedicated owners listing (`GET /api/admin/owners`)
- **Space moderation** — list/search all spaces, view space detail, force-update availability, delete a listing
- **Booking oversight** — view all bookings, view a booking's detail, override booking status
- **Inquiry oversight** — view all inquiries and inquiry detail
- **Payment oversight** — view all payments and payment detail

---

## 12. 🗄️ Database

MongoDB (via Mongoose) with the following core collections:

| Model            | Purpose                                                                                                  |
| ---------------- | -------------------------------------------------------------------------------------------------------- |
| **User**         | Auth credentials, role (`user` / `owner` / `admin`), profile info                                        |
| **Space**        | Co-working space listing — owner ref, location, capacity, area, pricing, amenities, availability, images |
| **Booking**      | Links a User + Space, dates, status (`pending` / `confirmed` / `cancelled`)                              |
| **Inquiry**      | Links a User + Space, message thread, status (`pending` / `replied`), close/reply actions                |
| **Payment**      | Linked to a Booking + User, Razorpay order/payment IDs, amount, status (`paid` / `failed`)               |
| **Notification** | User-targeted alerts for bookings/inquiries/status changes, read/unread state                            |

Relationships are modeled with Mongoose `ref`s (e.g. `Booking.space → Space`, `Booking.user → User`, `Payment.booking → Booking`) and populated on read for detail views.

---

## 13. 📚 API Documentation

Base URL: `/api`

### Auth — `/api/auth`

| Method | Endpoint           | Access  | Description                                           |
| ------ | ------------------ | ------- | ----------------------------------------------------- |
| POST   | `/register`        | Public  | Register a new user (supports profile picture upload) |
| POST   | `/login`           | Public  | Login and receive JWT                                 |
| GET    | `/me`              | Private | Get current logged-in user                            |
| PUT    | `/update-profile`  | Private | Update profile details                                |
| PUT    | `/change-password` | Private | Change account password                               |
| POST   | `/logout`          | Private | Logout current session                                |

### Spaces — `/api/spaces`

| Method | Endpoint          | Access | Description                       |
| ------ | ----------------- | ------ | --------------------------------- |
| GET    | `/`               | Public | List all spaces                   |
| GET    | `/search`         | Public | Search spaces by filters          |
| GET    | `/search-options` | Public | Get available filter options      |
| GET    | `/owner`          | Owner  | Get spaces owned by current owner |
| POST   | `/`               | Owner  | Create a new space listing        |
| PUT    | `/:id`            | Owner  | Update a space listing            |
| DELETE | `/:id`            | Owner  | Delete a space listing            |
| GET    | `/:id`            | Public | Get space details by ID           |

### Bookings — `/api/bookings`

| Method | Endpoint        | Access  | Description                        |
| ------ | --------------- | ------- | ---------------------------------- |
| GET    | `/availability` | Public  | Check real-time space availability |
| POST   | `/`             | User    | Create a booking                   |
| GET    | `/my-bookings`  | User    | Get current user's bookings        |
| GET    | `/owner`        | Owner   | Get bookings for owner's spaces    |
| PUT    | `/:id/status`   | Owner   | Approve/reject a booking           |
| GET    | `/:id`          | Private | Get booking details                |
| PUT    | `/:id/cancel`   | Private | Cancel a booking                   |

### Inquiries — `/api/inquiries`

| Method | Endpoint        | Access  | Description                      |
| ------ | --------------- | ------- | -------------------------------- |
| POST   | `/`             | User    | Send an inquiry to a space owner |
| GET    | `/my-inquiries` | User    | Get current user's inquiries     |
| PUT    | `/:id/close`    | Private | Close an inquiry                 |
| GET    | `/owner`        | Owner   | Get inquiries for owner's spaces |
| PUT    | `/:id/reply`    | Owner   | Reply to an inquiry              |

### Notifications — `/api/notifications`

| Method | Endpoint    | Access  | Description                 |
| ------ | ----------- | ------- | --------------------------- |
| GET    | `/`         | Private | Get notifications           |
| DELETE | `/all`      | Private | Clear all notifications     |
| PUT    | `/:id/read` | Private | Mark a notification as read |
| DELETE | `/:id`      | Private | Delete a notification       |

### Payments — `/api/payments`

| Method | Endpoint              | Access  | Description                       |
| ------ | --------------------- | ------- | --------------------------------- |
| POST   | `/create-order`       | Private | Create a Razorpay payment order   |
| POST   | `/verify`             | Private | Verify a completed payment        |
| GET    | `/booking/:bookingId` | Private | Get payment details for a booking |

### Admin — `/api/admin`

| Method | Endpoint                   | Access | Description                     |
| ------ | -------------------------- | ------ | ------------------------------- |
| GET    | `/dashboard`               | Admin  | Platform-wide analytics         |
| GET    | `/users`                   | Admin  | List/search all users           |
| GET    | `/users/:id`               | Admin  | User detail + activity          |
| PUT    | `/users/:id/role`          | Admin  | Change a user's role            |
| DELETE | `/users/:id`               | Admin  | Delete a user                   |
| GET    | `/owners`                  | Admin  | List all owners                 |
| GET    | `/spaces`                  | Admin  | List/search all spaces          |
| GET    | `/spaces/:id`              | Admin  | Space detail                    |
| PUT    | `/spaces/:id/availability` | Admin  | Force-update space availability |
| DELETE | `/spaces/:id`              | Admin  | Delete a space                  |
| GET    | `/bookings`                | Admin  | List all bookings               |
| GET    | `/bookings/:id`            | Admin  | Booking detail                  |
| PUT    | `/bookings/:id/status`     | Admin  | Override booking status         |
| GET    | `/inquiries`               | Admin  | List all inquiries              |
| GET    | `/inquiries/:id`           | Admin  | Inquiry detail                  |
| GET    | `/payments`                | Admin  | List all payments               |
| GET    | `/payments/:id`            | Admin  | Payment detail                  |

Every response follows a consistent JSON shape: `{ success: boolean, message?, data/entity, error? }`.

---

## 14. 🛠️ Installation

**Prerequisites:** Node.js ≥ 18, npm, a MongoDB URI, a Cloudinary account, a Razorpay account.

```bash
# Clone the repository
git clone https://github.com/<your-username>/Smart-Co-Working-Space-Management-Using-Real-Time-Monitoring.git
cd Smart-Co-Working-Space-Management-Using-Real-Time-Monitoring

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

## 15. 🔑 Environment Variables

Create a `.env` file inside `backend/` (see `.env.example`):

```env
PORT=
NODE_ENV=

MONGODB_URI=
JWT_SECRET=

ADMIN_NAME=
ADMIN_EMAIL=
ADMIN_PASSWORD=
ADMIN_ROLE=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

CLIENT_URL=
```

Create a `.env` file inside `frontend/` with your API base URL, e.g.:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

---

## 16. ▶️ How to Run

**Backend**

```bash
cd backend
npm run dev          # starts with nodemon
# or
npm start            # production start
```

**Seed the first Admin account**

```bash
npm run seed:admin
```

**Frontend**

```bash
cd frontend
npm run dev
```

By default the backend runs on `http://localhost:8000` and the frontend Vite dev server on `http://localhost:5173` (adjust `CLIENT_URL` / `VITE_API_BASE_URL` accordingly).

---

## 17. 🌐 Live Demo

> Add your deployed links here once available:

- **Frontend:** `https://<your-frontend>.vercel.app`
- **Backend API:** `https://<your-backend>.vercel.app`

---

## 18. 📸 Screenshots

### 👤 User

|                                          Landing Page                                           |                                          Register / Authentication                                           |
| :---------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------: |
| ![Landing UI](https://res.cloudinary.com/drwflyyk/image/upload/v1787911020/Landing-page-UI.png) | ![Register UI](https://res.cloudinary.com/drwflyyk/image/upload/v1787910909/Registrations-Authenticatin.png) |

|                                          Space Management                                           |                                            View Details Page                                             |
| :-------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------: |
| ![Space UI](https://res.cloudinary.com/drwflyyk/image/upload/v1787910920/Space-Mangaments-Page.png) | ![View Page UI](https://res.cloudinary.com/drwflyyk/image/upload/v1787910917/View-details-page-user.png) |

**User Booking & Inquiry**

![User Booking & Inquiry](https://res.cloudinary.com/drwflyyk/image/upload/v1787910914/user-make-an-Enquirey.png)

### 🏢 Owner

|                                           Owner Dashboard / Bookings                                            |                                          Owner - My Spaces                                          |
| :-------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------: |
| ![Owner Dashboard Booking UI](https://res.cloudinary.com/drwflyyk/image/upload/v1787910967/Owner-Dashboard.png) | ![Owner Space UI](https://res.cloudinary.com/drwflyyk/image/upload/v1787910975/Owner-My-spaces.png) |

**Owner Bookings**

![Owner Booking UI](https://res.cloudinary.com/drwflyyk/image/upload/v1787910966/Owner-Bookings.png)

### 🛡️ Admin

**Admin Dashboard**

![Admin Dashboard UI](https://res.cloudinary.com/drwflyyk/image/upload/v1787910975/Owner-My-spaces.png)

---

## 19. 🔐 Demo Credentials

> Replace with your actual seeded/demo accounts before publishing.

| Role  | Email               | Password    |
| ----- | ------------------- | ----------- |
| Admin | `admin@example.com` | `Admin-xxx` |
| Owner | `owner@example.com` | `Owner-xxx` |
| User  | `user@example.com`  | `User-xxx`  |

---

## 20. 🌟 Project Highlights

- Clean **MVC architecture** on the backend with a fully decoupled service layer on the frontend
- **Three-tier RBAC** (User / Owner / Admin) enforced consistently across routes, middleware, and UI
- **End-to-end booking lifecycle** — search → availability check → booking → owner approval → payment → confirmation
- **Real revenue analytics** computed live via MongoDB aggregation, not hardcoded
- Production-ready details: CORS allow-listing, centralized error handling, health-check routes, and Vercel deployment configs for both apps

---

## 21. 🧩 Challenges Solved

- **Preventing double-booking** — solved with a dedicated real-time availability-check endpoint before booking creation
- **Consistent role enforcement** — solved with a combination of `authMiddleware` (identity) + `roleMiddleware` / `authorizeRoles()` (permission) applied per-route
- **Safe admin operations** — self-role-change and self-account-deletion are explicitly blocked; other admin accounts can't be deleted from the panel
- **Reliable payments** — Razorpay order creation is decoupled from verification, with signature verification before a booking/payment is marked paid
- **Image handling at scale** — Multer buffers uploads in-memory and streams directly to Cloudinary, avoiding local disk storage
- **CORS in a multi-environment setup** — origin allow-list driven by `CLIENT_URL` with clear rejection logging

---

## 22. 🚧 Future Improvements

- AI-based space recommendations
- Dynamic/demand-based pricing models
- Native mobile application
- Additional payment gateway integrations
- Advanced analytics dashboard with real-time charts
- Automated email/SMS delivery (currently in-app notifications)

---

## 23. 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

Please open an issue first for major changes to discuss what you'd like to add.

---

## 24. 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2026 Md Bari

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 25. 🧑‍💻 Author

**Md Abdul Bari**
MERN Stack Developer

---

## 26. 🙏 Acknowledgements

- **Unified Mentor** — for the project requirements and problem statement
- [React](https://react.dev/), [Vite](https://vitejs.dev/), [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)
- [Express.js](https://expressjs.com/) & [MongoDB](https://www.mongodb.com/) / [Mongoose](https://mongoosejs.com/)
- [Cloudinary](https://cloudinary.com/) for media storage
- [Razorpay](https://razorpay.com/) for payment processing
