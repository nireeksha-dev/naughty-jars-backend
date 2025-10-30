# Naughty Jars --SERVER

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (use [nvm](https://github.com/nvm-sh/nvm))
- npm or yarn

### Installation

```bash
git clone <YOUR_GIT_URL>
cd NJ-server
npm install
npm start
```

Open [http://localhost:5001]

## 🏗️ Tech Stack

    Express Js + TypeScript
    Multer + Sharp -- file uploads and optimization
    JWT -- simple auth
    Stripe -- PG

## 📁 Project Structure

```
/src
  /controllers
    - authController.ts
    - productController.ts
  /middleware
    - auth.ts
    - multer.ts
  /models
    - User.ts
    - Product.ts
  /routes
    - authRoutes.ts
    - productRoutes.ts
  - app.ts
  - server.ts

```

### Available Scripts

```bash
npm run dev          # Start dev server (http://localhost:8080)
npm run build        # Production build
npm run build:dev    # Development build
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Environment Variables

Create a `.env` file in the root directory (see `.env.example`):

```env
VITE_GA_ID=G-XXXXXXXXX
VITE_META_PIXEL_ID=XXXXXXXXXXXXX
VITE_API_URL=https://api.nextdoclabs.com
```

## 🚀 Deployment
