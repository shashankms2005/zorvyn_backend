# Finance Backend Setup Instructions

## Tech Stack
- Node.js & TypeScript
- Express.js
- Prisma ORM
- PostgreSQL Database (Neon)
- Zod (Validation)
- JSON Web Tokens (Auth)

## Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

## Setup Steps

1. **Install Dependencies**
   Run the following command to install all required packages:
   ```bash
   npm install
   ```

2. **Database Initialization & Seeding**
   This project uses a PostgreSQL database hosted on Neon. Run this command to push the schema and populate the database with mock users and dummy financial records:
   ```bash
   npx prisma db push
   npm run seed
   ```

3. **Run the Server**
   Start the development server:
   ```bash
   npm run dev
   ```
   > The server will run on `http://localhost:3000`

## Initial Mock Users
The seed script generates three users with different roles. The password for all of them is `password123`.

- **Admin** (Rahul): `rahul.admin@Finance.zorvyn.com` (Role: ADMIN)
- **Analyst** (Priya): `priya.analyst@Finance.zorvyn.com` (Role: ANALYST)
- **Viewer** (Amit): `amit.viewer@Finance.zorvyn.com` (Role: VIEWER)

## API Documentation
Please refer to [API_DOCS.md](./API_DOCS.md) for detailed descriptions of available endpoints, authentication, and access control.
