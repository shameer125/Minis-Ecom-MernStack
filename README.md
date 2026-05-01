# MINIS E-Commerce — MERN Stack

## Project Structure
```
minis-ecom/
├── backend/      ← Node.js + Express + MongoDB
└── frontend/     ← React + Tailwind CSS
```

---

## STEP 1 — Setup Backend

```bash
cd minis-ecom/backend
npm install
```

Create a `.env` file inside `backend/` folder:
```
PORT=5000
MONGO_URI=mongodb+srv://YOUR_USER:YOUR_PASS@cluster0.xxxxx.mongodb.net/minis-ecom?retryWrites=true&w=majority
JWT_SECRET=minis_secret_key_123
NODE_ENV=development
```

Seed the database (run ONCE):
```bash
node config/seed.js
```

Start the backend:
```bash
npm run dev
```
✅ You should see: 🚀 Server running on port 5000

---

## STEP 2 — Setup Frontend

Open a NEW terminal:
```bash
cd minis-ecom/frontend
npm install
npm run dev
```
✅ Open: http://localhost:5173

---

## STEP 3 — Access Admin Dashboard

URL: http://localhost:5173/admin

Login credentials:
- Email:    admin@minis.com
- Password: admin123

---

## Admin Dashboard Pages
- /admin              → Dashboard (revenue chart, stats, orders)
- /admin/products     → Add / Edit / Delete products
- /admin/orders       → View & update order status
- /admin/users        → Manage customers

---

## Store Pages
- /                   → Home
- /shop               → All products
- /shop/women         → Women's category
- /shop/men           → Men's category
- /product/:slug      → Product detail
- /cart               → Shopping cart
- /checkout           → Place order (login required)
- /wishlist           → Saved items
- /orders             → My orders (login required)
- /contact            → Contact form
- /login              → Sign in
- /register           → Create account
