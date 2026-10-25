# Subscribely

A full-stack web application for user authentication, subscription plan management, and online payments using Stripe.

## Overview

Subscribely brings the frontend and backend together in a single repository, making development and maintenance easier.

The frontend provides the user interface, while the backend handles authentication, user management, subscription plans, database connectivity, and billing operations.

## Features

- User authentication and session management with Passport.js
- User account management
- Subscription plan management
- Stripe payment and billing integration
- Stripe webhook handling
- MongoDB database integration
- Frontend-backend API integration
- Environment-based configuration

## Tech Stack

### Frontend

- React
- Vite
- JavaScript
- HTML and CSS

### Backend

- Node.js
- Express.js
- Passport.js
- express-session
- dotenv
- CORS

### Database and Payments

- MongoDB
- Stripe

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB database
- Stripe account for payment testing

### 1. Clone the repository

```bash
git clone
cd subscribely
```

### 2. Set Up the Frontend

Open a terminal and run:

```bash
cd frontend
npm install
npm run dev
```

The Vite development server typically runs at `http://localhost:5173`.

### 3. Set Up the Backend

Open another terminal from the repository root and run:

```bash
cd backend
npm install
```

### 4. Start the Backend

Run the start command configured in `backend/package.json`. For example:

```bash
npm start
```

## API Routes

| Route             | Purpose                      |
| ----------------- | ---------------------------- |
| `/auth`           | Authentication               |
| `/plans`          | Subscription plan management |
| `/user`           | User management              |
| `/billing`        | Billing operations           |
| `/webhook/stripe` | Stripe webhook events        |
| `/`               | Server health check          |

The available endpoints and HTTP methods depend on the individual route files.

## Security

- Keep API keys, database credentials, and session secrets in environment variables.
- Ensure `.env` and `node_modules/` are included in `.gitignore`.
- Use a strong session secret.
- Verify Stripe webhook signatures before processing events.
- Configure CORS and secure cookies appropriately for production.

## Development Status

Work in progress.

## License

No license has been specified yet.
