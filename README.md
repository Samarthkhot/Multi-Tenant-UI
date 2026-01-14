# Tekno Tantra – Multi-Tenant Admin Dashboard

This project is a frontend dashboard application built using React (Vite) and Tailwind CSS.  
It demonstrates authentication flow, protected routing, reusable components and responsive UI design.

The project simulates a real-world admin and tenant portal.

---

## ⚙️ Setup Steps

Follow the steps below to run the project locally:

### Step 1 – Install Dependencies

Open terminal inside the project folder and run:

npm install

---

### Step 2 – Start Development Server

npm run dev

---

### Step 3 – Open in Browser

Open your browser and visit:

http://localhost:5173

---

---

## 📂 Folder Structure Explanation

src/
 ├── components/
 │   ├── common/
 │   │   ├── ProtectedRoute.jsx  
 │   │   └── LoginGuard.jsx  
 │   │
 │   └── ui/
 │       ├── StatCard.jsx  
 │       ├── Badge.jsx  
 │
 ├── layouts/
 │   └── DashboardLayout.jsx  
 │
 ├── pages/
 │   ├── admin/
 │   │   ├── AdminLogin.jsx  
 │   │   └── AdminDashboard.jsx  
 │   │
 │   ├── tenant/
 │   │   ├── TenantLogin.jsx  
 │   │   └── TenantDashboard.jsx  
 │   │
 │   ├── Profile.jsx  
 │   └── Settings.jsx  
 │
 ├── App.jsx  
 └── main.jsx  

### Explanation

- **components/common**  
  Contains reusable logic components such as route protection and login guards.

- **components/ui**  
  Contains reusable UI components like cards and badges.

- **layouts**  
  Contains the common dashboard layout including sidebar and header.

- **pages**  
  Contains all application screens such as login, dashboards, profile and settings.

- **App.jsx**  
  Manages routing configuration.

- **main.jsx**  
  Entry point of the React application.

---

---

## 🔐 Key Logic Explanation

### Authentication Logic

This project uses **localStorage** to simulate authentication.

#### Admin Login
- User enters email and password.
- Validation checks required fields and email format.
- On successful login:
  - Role is stored as `"admin"` in localStorage.
  - User is redirected to Admin Dashboard.

#### Tenant Login
- User enters Tenant ID, email and password.
- Validation is performed.
- On successful login:
  - Role is stored as `"tenant"`.
  - Tenant ID is stored.
  - User is redirected to Tenant Dashboard.

#### Logout
- Clears role, tenantId and theme from localStorage.
- Redirects user to Landing Page.

---

### Routing Logic

Routing is handled using **React Router DOM**.

#### ProtectedRoute
- Checks the user role from localStorage.
- If role is missing or incorrect, user is redirected to landing page.
- Prevents unauthorized access to dashboards.

#### LoginGuard
- Prevents logged-in users from accessing login pages again.
- Automatically redirects logged users to their respective dashboards.

#### Dashboard Layout Routing
- Uses nested routing.
- Sidebar and header remain fixed.
- Only page content changes using `<Outlet />`.

---

---

## 👨‍💻 Author

Samarth Khot  
Final Year – Computer Engineering
