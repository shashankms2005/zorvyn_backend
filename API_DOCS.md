# API Documentation

## Base URL
`http://localhost:3000/api`

## Authentication
Most endpoints require a valid JWT. Pass it in the header as:
`Authorization: Bearer <your_token>`

---

## 1. Auth related
### Register a User
- **POST** `/auth/register`
- **Access**: Public
- **Body**: 
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "password123"
  }
  ```

### Login
- **POST** `/auth/login`
- **Access**: Public
- **Body**:
  ```json
  {
    "email": "rahul.admin@Finance.zorvyn.com",
    "password": "password123"
  }
  ```
- **Response**: Returns a token and user details.

---

## 2. Dashboard
### Get Dashboard Summary
- **GET** `/dashboard/summary`
- **Access**: `ADMIN`, `ANALYST`, `VIEWER`
- **Returns**: Aggregated totals (Income, Expense, Net Balance, Category-wise breakdown, recent activity).

---

## 3. Financial Records
### List Records
- **GET** `/records`
- **Access**: `ADMIN`, `ANALYST`
- **Query Params (Optional)**: `type=INCOME|EXPENSE`, `category`, `startDate`, `endDate`

### Get Single Record
- **GET** `/records/:id`
- **Access**: `ADMIN`, `ANALYST`

### Create Record
- **POST** `/records`
- **Access**: `ADMIN`
- **Body**:
  ```json
  {
    "amount": 1000,
    "type": "INCOME",
    "category": "Salary",
    "date": "2024-03-10T00:00:00.000Z",
    "notes": "March salary"
  }
  ```

### Update Record
- **PUT** `/records/:id`
- **Access**: `ADMIN`
- **Body**: Any field from Create Record (Optional)

### Delete Record
- **DELETE** `/records/:id`
- **Access**: `ADMIN`

---

## 4. Users (Admin Only)
### List Users
- **GET** `/users`
- **Access**: `ADMIN`

### Update User Role
- **PATCH** `/users/:id/role`
- **Access**: `ADMIN`
- **Body**:
  ```json
  {
    "role": "ANALYST"
  }
  ```

### Update User Status
- **PATCH** `/users/:id/status`
- **Access**: `ADMIN`
- **Body**:
  ```json
  {
    "isActive": false
  }
  ```
