# 🛍️ MINIS E-Commerce — Full Stack MERN Application

A modern, full-featured e-commerce web application built using the MERN stack (MongoDB, Express.js, React, Node.js). This project demonstrates real-world functionality including authentication, admin dashboard, product management, and order processing.

---

## 🚀 Features

### 👤 User Features

* User registration & login (JWT authentication)
* Browse products by category
* Add to cart & wishlist
* Secure checkout process
* Order history tracking

### 🛠️ Admin Features

* Admin dashboard with stats & revenue overview
* Manage products (Create, Read, Update, Delete)
* Manage users
* View and update order status

---

## 🧱 Tech Stack

**Frontend:**

* React (Vite)
* Tailwind CSS
* React Router
* Context API

**Backend:**

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication

---

## 📁 Project Structure

```
minis-ecom/
├── backend/      # Node.js + Express + MongoDB API
└── frontend/     # React + Tailwind CSS client
```

---

## ⚙️ Backend Setup

```bash
cd minis-ecom/backend
npm install
```

Create a `.env` file in the `backend/` folder:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

### 🌱 Seed Database (Run Once)

```bash
node config/seed.js
```

### ▶️ Run Backend

```bash
npm run dev
```

Server will run at:
👉 [http://localhost:5000](http://localhost:5000)

---

## 💻 Frontend Setup

Open a new terminal:

```bash
cd minis-ecom/frontend
npm install
npm run dev
```

Frontend will run at:
👉 [http://localhost:5173](http://localhost:5173)

---

## 🔐 Admin Access

URL:
👉 [http://localhost:5173/admin](http://localhost:5173/admin)

**Credentials:**

* Email: [admin@minis.com](mailto:admin@minis.com)
* Password: admin123

---

## 📊 Admin Dashboard Routes

| Route           | Description                        |
| --------------- | ---------------------------------- |
| /admin          | Dashboard (stats, revenue, charts) |
| /admin/products | Manage products                    |
| /admin/orders   | Manage orders                      |
| /admin/users    | Manage users                       |

---

## 🛒 Store Routes

| Route          | Description               |
| -------------- | ------------------------- |
| /              | Home page                 |
| /shop          | All products              |
| /shop/women    | Women's category          |
| /shop/men      | Men's category            |
| /product/:slug | Product details           |
| /cart          | Shopping cart             |
| /checkout      | Checkout (login required) |
| /wishlist      | Saved items               |
| /orders        | User orders               |
| /contact       | Contact page              |
| /login         | Login                     |
| /register      | Register                  |

---

## 🌟 Highlights for Recruiters

* Full-stack MERN architecture
* Clean folder structure & scalable design
* Authentication & protected routes
* Real-world e-commerce logic
* Admin dashboard with CRUD operations

---

## 📦 Future Improvements

* Payment gateway integration (Stripe)
* Product reviews & ratings
* Advanced filtering & search
* Performance optimization

---

## 🧑‍💻 Author

**Shameer Ali**

---

## 📄 License

This project is open-source and available for learning purposes.
