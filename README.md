# StudioSpace — Peer-to-Peer Creative Workspace & Production Studio Sharing Platform

> **Live Website:** [https://studiospace.vercel.app](https://studiospace.vercel.app) (Local: `http://localhost:3000`)  
> **API Server:** [https://studiospace-api.onrender.com](https://studiospace-api.onrender.com) (Local: `http://localhost:5000`)

StudioSpace is a high-performance peer-to-peer marketplace designed for creators, filmmakers, photographers, podcasters, and musicians. Studio owners and hosts can list their creative spaces—ranging from photography cyc walls and cinema sound stages to podcast lounges, music recording suites, and art workshops. Fellow creators can discover, filter, inspect dynamic availability, and reserve studio slots with transparent pricing and real-time booking management.

---

## 🌟 Key Features

- **Dynamic Discovery & Category Exploration:** Browse, search, and filter creative workspaces across 5 distinct categories (Photo Studios, Sound Stages, Podcast Rooms, Music Suites, Art Workshops) with responsive grids, real-time query parameters, and instant price bands.
- **Interactive Hero Showcase & Dynamic Featured Spaces:** Multi-slide responsive carousel (using Swiper.js) featuring punchy headlines, direct CTA navigation, and 6 dynamically fetched top-rated studios powered by MongoDB Atlas.
- **Intelligent Double-Booking Collision Prevention:** Server-enforced overlap detection algorithm verifying existing reservations before confirmation, rejecting conflicting slot reservations with clear feedback.
- **Comprehensive Studio Management (CRUD):** Host-authenticated portal for listing spaces with photo uploads (ImgBB proxy integration), hourly rates, security deposits, interactive amenity tags/checkboxes, and table/card management with delete confirmation modals.
- **Real-Time Booking Management & PDF Invoice Generator:** Instant reservation workflow allowing creators to track requests with status badges (Pending, Confirmed, Completed, Cancelled), cancel pending slots, and download official PDF receipts for confirmed bookings.
- **Heart Wishlist System:** Optimistic saved studios wishlist allowing authenticated users to bookmark their favorite production spaces.
- **Dual Theme Support (Light & Dark):** Custom-engineered DaisyUI themes (`studiolight` and `studiodark`) with zero-flicker client-side persistence.
- **Modern Non-Intrusive Feedback:** Zero default browser alerts — 100% powered by Sonner toast notifications and custom modal dialogs.

---

## 🛠 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, DaisyUI 5, Lucide React, TanStack Query |
| **Authentication & Authorization** | BetterAuth / Custom JWT stored in HTTPOnly `ss_token` cookie, Google OAuth Identity Services |
| **Backend** | Express 4, Node.js, TypeScript, Zod Schema Validation, Multer |
| **Database** | MongoDB Atlas, Native Node.js MongoDB Driver |
| **Asset & File Storage** | ImgBB Image Hosting API proxy |
| **Feedback & Notifications** | Sonner toasts, custom accessible modals |

---

## 🔑 Examiner Test Credentials

| Account Role | Email Address | Password | Permissions & Purpose |
|---|---|---|---|
| **Host Account** | `host@studiospace.com` | `Studio123` | Can list spaces, edit owned studios, review reservations |
| **Creator / Guest** | `creator@studiospace.com` | `Studio123` | Can explore, save wishlists, request slots, cancel pending bookings |

---

## 🚀 Local Setup Steps

### 1. Prerequisites
- **Node.js** v20.x or higher
- **npm** or **pnpm**
- **MongoDB Atlas** cluster or local MongoDB instance

### 2. Clone Repository
```bash
git clone https://github.com/your-username/studiospace.git
cd studiospace
```

### 3. Server Setup & Seeding
```bash
cd server
npm install

# Configure server/.env (see server/.env.example)
# PORT=5000
# MONGODB_URI=<your-mongodb-atlas-uri>
# JWT_SECRET=<your-jwt-secret>
# CLIENT_URL=http://localhost:3000

# Seed demo users, studios, and bookings
npm run seed

# Run Express server
npm run dev
# Server runs on http://localhost:5000
```

### 4. Client Setup
```bash
cd ../client
npm install

# Configure client/.env.local (see client/.env.example)
# API_PROXY_TARGET=http://localhost:5000
# NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Run Next.js App
npm run dev
# Client runs on http://localhost:3000
```

---

## 🏆 Challenges & Optional Requirements Implemented

1. **Challenge 1 (JWT Security with HTTPOnly Cookies):** All mutations (`POST /api/studios`, `DELETE /api/studios/:id`, `POST /api/bookings`) are safeguarded by HTTPOnly JWT cookies (`ss_token`), securely blocking unauthorized access with strict `401 Unauthorized` responses.
2. **Challenge 2 (Double-Booking Prevention):** Robust time-range overlap algorithm on MongoDB prevents conflicting reservations on the same date and studio slot.
3. **Challenge 3 (Theme Customization):** System-wide light/dark theme toggle persisted in `localStorage` with inline pre-paint script to prevent theme flash.
4. **Optional Requirement (Saved Studios Wishlist):** Heart icon on studio cards allowing logged-in creators to save and manage shortlisted spaces in MongoDB.
5. **Optional Requirement (PDF Booking Invoice Generator):** Downloadable official PDF receipts for confirmed studio reservations directly from the My Bookings dashboard.
