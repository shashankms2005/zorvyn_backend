# Finance Data Processing and Access Control Backend

A robust, logically structured RESTful API backend built as a submission for the Backend Developer Intern assignment. This application serves as the core data engine for a conceptual finance dashboard, providing secure authentication, role-based access control, relational financial data management, and real-time dashboard analytics.

## 🚀 Tech Stack & Design Choices

- **Language:** TypeScript & Node.js (Ensures high type-safety and developer strictness)
- **Framework:** Express.js (Modular routing, fast processing)
- **Database:** PostgreSQL hosted on Supabase (Relational integrity, always-on cloud hosting, IPv4 Session Pooler)
- **ORM:** Prisma (Type-safe database querying, excellent migration control)
- **Validation:** Zod (Strict runtime schema validation to catch bad input at the edge)
- **Auth:** JSON Web Tokens (JWT) & bcrypt (Stateless, secure session management)

## 📋 Core Features Implemented

1. **User and Role Management (RBAC)**
   - Strict hierarchical role system: **VIEWER** (Dashboard only), **ANALYST** (Dashboard + View Records), **ADMIN** (Full CRUD + User Management).
   - Middleware-enforced route guards.
   - Account toggling (Active/Inactive), locking out disabled users at the middleware layer.
2. **Financial Records Management**
   - High-complexity schema mapping Users to Records (One-to-many relationship).
   - Detailed transaction fields including `paymentMethod`, `status`, `currency`, and `category`.
   - Advanced query filtering (fetch by date ranges, categories, and types).
3. **Dashboard Summary Analytics**
   - Aggregation APIs natively built to calculate Net Balance, Total Incomes, and Expenses.
   - Uses optimized database summation and grouping functions rather than retrieving raw data arrays.
4. **Validation and Error Handling**
   - Implemented Zod schemas for every single incoming POST/PUT/PATCH request.
   - Global Error Handler middleware normalizes all application crashes or rejected promises into a clean, predictable JSON format.

## 🛠️ Setup & Local Development

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation Steps

1. **Clone and Install**
   ```bash
   git clone https://github.com/shashankms2005/zorvyn_backend.git
   cd zorvyn_backend
   npm install
   ```

2. **Configure Environment Variables**
   Create a `.env` file in the root directory (if not present) and add the following:
   ```env
   # PostgreSQL connection string
   DATABASE_URL="postgresql://postgres.latkjcwwvfzedqiuokrm:Shashank%4020077@aws-1-ap-south-1.pooler.supabase.com:5432/postgres?pgbouncer=true"
   
   # JWT Encryption Key
   JWT_SECRET="super_secret_jwt_key_for_assignment_only"
   ```

3. **Database Initialization & Massive Seeding**
   The project includes a highly detailed seeding script that injects **1,000 randomized financial records** distributed across 3 mock users. Run:
   ```bash
   npx prisma db push --accept-data-loss
   npm run seed
   ```

4. **Start the Server**
   ```bash
   npm run dev
   ```
   The backend will execute in watch mode at `http://localhost:3000`. 
   Navigate to `http://localhost:3000/api/health` to confirm uptime.

## 📖 Mock Users for Testing

The seed script creates three foundational users for immediate postman testing. All share the password: `password123`.

- **Admin Account**: `rahul.admin@Finance.zorvyn.com`
- **Analyst Account**: `priya.analyst@Finance.zorvyn.com`
- **Viewer Account**: `amit.viewer@Finance.zorvyn.com`

## 🧠 Assumptions & Trade-offs Considered

1. **Dashboard Calculations:** 
   - *Assumption:* For a financial app at scale, dashboard stats shouldn't invoke fetching tens of thousands of rows. 
   - *Implementation:* The dashboard endpoint leverages native Prisma aggregation functions (`aggregate`, `groupBy`) pushing the computation to the PostgreSQL database engine to optimize memory and speed.
2. **Stateless Authentication:** 
   - *Trade-off:* I opted for JWT stateless authentication over server-side session caching (like Redis). While JWTs make instantaneous invalidation harder, they infinitely scale vertically without requiring additional deployment infrastructure memory. I mitigate this by checking the database for user `isActive` status during token verification.
3. **Database Selection:** 
   - *Decision:* Initially developed using SQLite for simplicity, then evaluated Neon (which suspends after 5 minutes of inactivity), and ultimately migrated to **PostgreSQL on Supabase**. Supabase provides an always-on free tier with an IPv4 Session Pooler that guarantees zero cold-start timeouts on real requests. This aligns with production-grade scalability expectations and avoids ephemeral filesystem wipes on cloud deployment platforms.
4. **Data Seed Volume:**
   - *Decision:* A dashboard API is untestable with 3 rows of data. I engineered a randomizing seed generator to inject 1000 dynamically scaled records spread across 365 days.

## 📚 API Documentation

For the complete schema request/response definitions and endpoint paths, please refer to [API_DOCS.html](./API_DOCS.html).
