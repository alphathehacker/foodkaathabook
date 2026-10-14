# 🍲 Food Kaatha Book — Shop Ledger App

Track daily food transactions in your shop — for both immediate payments and *Katha* (credit).

> Built with Node.js, Express, MongoDB, Tailwind CSS
> Installable mobile app (PWA) — add to your phone's home screen

---

## 📱 Install on your phone (Android)

1. Open the live link in Chrome on your phone
2. Tap **⋮ menu → "Add to Home screen"** (or "Install app")
3. It now opens full-screen like a native app — no Play Store needed

---

## 🧰 Features

- ✅ Real signup & login (passwords hashed with bcrypt, sessions via JWT)
- ✅ Add transactions as **📒 Katha (credit)** or **💵 Paid** — with a toggle
- ✅ Customer name, item list with live ₹ total
- ✅ Search transactions by customer
- ✅ Edit / delete entries
- ✅ Each shopkeeper sees only their own ledger
- ✅ Installable PWA: manifest, icons, offline app-shell caching
- ✅ Stored permanently in MongoDB Atlas, single-server hosting

## How Katha credit tracking works

Small food shops often let regular customers eat now and pay later. Every transaction is recorded as **Paid** (settled immediately) or **Katha** (credit owed by that customer). Because each entry carries the customer name, items and total, the shop can look up any customer and see exactly what they owe — no paper ledger needed.

---

## 🏗️ Tech Stack

- **Frontend:** HTML, Tailwind CSS, Vanilla JS (PWA: manifest + service worker)
- **Backend:** Node.js, Express
- **Auth:** bcryptjs + jsonwebtoken (30-day tokens)
- **Database:** MongoDB Atlas (Mongoose)
- **Hosting:** Render.com (single web service)

## API

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | — | Create account → `{ token, name }` |
| POST | `/api/auth/login` | — | Log in → `{ token, name }` |
| GET | `/api/transactions` | Bearer token | My transactions, newest first |
| POST | `/api/transactions` | Bearer token | Add transaction |
| PUT | `/api/transactions/:id` | Bearer token | Update my transaction |
| DELETE | `/api/transactions/:id` | Bearer token | Delete my transaction |
| GET | `/api/health` | — | Health check |

---

## 🚀 Local Development

### 1. Clone the repo

```bash
git clone https://github.com/alphathehacker/foodkaathabook.git
cd foodkaathabook
```

### 2. Install and run

```bash
npm install
```

Create a `.env` file (never commit real credentials):

```
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>/foodkatha?retryWrites=true&w=majority
JWT_SECRET=<a long random string>
PORT=5000
```

```bash
npm start
```

Open http://localhost:5000 — sign up, then add transactions from your phone or desktop.
