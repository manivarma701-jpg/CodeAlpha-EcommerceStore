# CodeAlpha_Ecommerce

A simple full-stack e-commerce store built for **CodeAlpha Task 1**.

- **Frontend:** vanilla HTML, CSS, JavaScript (no framework, no build step)
- **Backend:** Node.js + Express
- **Database:** MongoDB (via Mongoose)
- **Auth:** JWT (JSON Web Tokens)

Features: product listing with category filters and search, product detail page,
shopping cart, user registration/login, checkout with shipping address, order
placement, and order history.

> **A note on product images:** the demo catalog uses free-to-use placeholder
> photos (picsum.photos), not images copied from Flipkart, Amazon, or any other
> retailer. Real product photography from other companies' catalogs is
> copyrighted, so it isn't reused here — swap in your own photos any time by
> editing the `image` field in `server/seed.js` or the product records in your
> database.

---

## 1. Project structure

```
CodeAlpha_Ecommerce/
├── client/                  # Frontend — open this with Live Server
│   ├── index.html           # Product listing / homepage
│   ├── product.html         # Product detail page
│   ├── cart.html            # Shopping cart
│   ├── checkout.html        # Checkout (shipping address + place order)
│   ├── order-confirmation.html
│   ├── orders.html          # Order history
│   ├── login.html
│   ├── register.html
│   ├── css/style.css
│   └── js/                  # config.js, api.js, nav.js, home.js, product.js, cart.js, checkout.js, auth.js
├── server/                  # Backend API
│   ├── server.js
│   ├── config/db.js
│   ├── middleware/auth.js
│   ├── models/ (User, Product, Cart, Order)
│   ├── routes/ (auth, products, cart, orders)
│   ├── seed.js              # Populates demo products + admin account
│   ├── package.json
│   └── .env.example
├── .github/workflows/deploy-pages.yml   # Auto-deploys client/ to GitHub Pages
└── README.md
```

---

## 2. Create the GitHub repository

1. Go to [github.com/new](https://github.com/new).
2. Repository name: `CodeAlpha_Ecommerce`. Keep it **Public** (CodeAlpha needs to see it). Don't add a README/gitignore here since you already have them.
3. Click **Create repository** — GitHub will show you a page with commands. Keep that page open.

On your computer, open **PowerShell** in the folder that contains this project (the folder with `client/`, `server/`, `README.md` in it) and run:

```powershell
git init
git add .
git commit -m "Initial commit: CodeAlpha e-commerce store"
git branch -M main
git remote add origin https://github.com/<your-username>/CodeAlpha_Ecommerce.git
git push -u origin main
```

Replace `<your-username>` with your actual GitHub username. If prompted, sign in through the browser window that pops up.

---

## 3. Open the project in VS Code

1. Install [VS Code](https://code.visualstudio.com/) if you don't have it.
2. Install the **Live Server** extension (by Ritwick Dey) from the Extensions panel (`Ctrl+Shift+X`, search "Live Server").
3. In VS Code: `File → Open Folder…` → select the `CodeAlpha_Ecommerce` folder you just pushed to GitHub.
4. If you cloned instead of pushing directly: open a terminal (`` Ctrl+` ``) and run:
   ```powershell
   git clone https://github.com/<your-username>/CodeAlpha_Ecommerce.git
   cd CodeAlpha_Ecommerce
   code .
   ```

---

## 4. Install Node.js (one-time, if not already installed)

1. Download the **LTS** version from [nodejs.org](https://nodejs.org).
2. Run the installer, accepting the defaults.
3. Verify it worked — open a **new** PowerShell window and run:
   ```powershell
   node -v
   npm -v
   ```
   Both should print version numbers.

---

## 5. Set up MongoDB

You have two options — pick whichever is easier for you:

**Option A — MongoDB Atlas (free cloud database, recommended, no local install):**
1. Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free (M0) cluster.
3. Under **Database Access**, create a database user with a username/password.
4. Under **Network Access**, add `0.0.0.0/0` (allow access from anywhere) for development.
5. Click **Connect → Drivers**, copy the connection string. It looks like:
   `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/codealpha_ecommerce?retryWrites=true&w=majority`

**Option B — Local MongoDB:**
1. Install [MongoDB Community Server](https://www.mongodb.com/try/download/community).
2. It runs at `mongodb://127.0.0.1:27017` by default — no extra setup needed.

---

## 6. Run the backend locally

Open a terminal **in VS Code** and run:

```powershell
cd server
npm install
copy .env.example .env
```

Now open the new `server/.env` file and fill in:
- `MONGO_URI` — your Atlas connection string (Option A) or leave the local default (Option B)
- `JWT_SECRET` — any long random string, e.g. `mySuperSecretKey_2026_codealpha`
- `CLIENT_ORIGIN` — leave as `http://127.0.0.1:5500` for now (Live Server's default — check the exact URL/port Live Server opens in step 7 and make sure this matches exactly)

Then seed the database with demo products and an admin account:

```powershell
npm run seed
```

You should see `Seed complete!` with a demo login printed (`admin@codealpha.com` / `admin123`).

Start the API server:

```powershell
npm run dev
```

You should see:
```
MongoDB Connected: ...
Server started on port 5000
```

Leave this terminal running. Visit `http://localhost:5000` in a browser — you should see `{"status":"ok", ...}`.

---

## 7. Run the frontend locally

1. In VS Code's file explorer, right-click `client/index.html`.
2. Select **"Open with Live Server."**
3. Your browser opens to something like `http://127.0.0.1:5500/client/index.html` — note the exact origin (protocol + host + port).
4. **Double-check `server/.env`'s `CLIENT_ORIGIN` matches that origin exactly** (no trailing slash). If you change `.env`, restart `npm run dev`.
5. Confirm `client/js/config.js` has:
   ```js
   const API_BASE_URL = 'http://localhost:5000/api';
   ```

You should now see the product grid load, and be able to add items to cart, register/login, check out, and view order history — all running fully locally.

**Two terminals running at once, that's normal:**
- Terminal 1: `cd server && npm run dev` (the API)
- Terminal 2: Live Server (started by VS Code, no terminal command needed)

---

## 8. Deploying online

### 8a. Deploy the backend (Render)

1. Push your latest code to GitHub (see Git commands below).
2. Go to [render.com](https://render.com) → sign up/log in with GitHub.
3. **New → Web Service** → connect your `CodeAlpha_Ecommerce` repo.
4. Settings:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Under **Environment**, add the same variables from your `.env` file: `MONGO_URI`, `JWT_SECRET`, `CLIENT_ORIGIN` (set this to your GitHub Pages URL from step 8b, e.g. `https://<username>.github.io`).
6. Deploy. Once live, Render gives you a URL like `https://codealpha-ecommerce.onrender.com`.
7. Run the seed script once against production — easiest way is to temporarily set your local `.env`'s `MONGO_URI` to the Atlas string used in production and run `npm run seed` locally (it seeds whatever database `MONGO_URI` points to).

### 8b. Deploy the frontend (GitHub Pages)

This repo already includes `.github/workflows/deploy-pages.yml`, which automatically publishes the `client/` folder — solving the common issue where GitHub Pages tries to render `README.md` instead of your site because `index.html` isn't at the repo root.

1. On GitHub: **Settings → Pages → Build and deployment → Source → GitHub Actions**.
2. Push any change to `main` (or re-run the workflow from the **Actions** tab).
3. After it finishes, your site is live at `https://<username>.github.io/CodeAlpha_Ecommerce/`.

### 8c. Point the frontend at the deployed backend

Edit `client/js/config.js`:

```js
const API_BASE_URL = 'https://codealpha-ecommerce.onrender.com/api';
```

Commit and push — the GitHub Action redeploys automatically.

```powershell
git add .
git commit -m "Point frontend to deployed backend"
git push
```

> Free Render web services "sleep" after inactivity — the first request after a while can take ~30–50 seconds to wake up. That's expected, not a bug.

---

## 9. Quick troubleshooting

| Symptom | Likely cause |
|---|---|
| GitHub Pages shows your README instead of the store | Pages source isn't set to GitHub Actions, or the workflow hasn't run yet — check the **Actions** tab |
| Frontend loads but products never appear, console shows a network/CORS error | `CLIENT_ORIGIN` in the backend's `.env`/Render settings doesn't exactly match the frontend's URL |
| "Could not reach the server" toast | `API_BASE_URL` in `client/js/config.js` is wrong, or the backend isn't running/deployed |
| Login/checkout fails with 401 | JWT token expired (7-day expiry) or `JWT_SECRET` changed after the token was issued — just log in again |
| `npm` not recognized in PowerShell | Node.js isn't installed, or you need to open a new terminal window after installing it |
| Zip extraction shows old/missing files on Windows | Windows lets you "preview" a zip's contents without extracting — right-click → **Extract All** first, then open the extracted folder, not the zip itself |

---

## 10. Submitting to CodeAlpha

1. Push everything to `https://github.com/<your-username>/CodeAlpha_Ecommerce`.
2. Record a short screen recording walking through: product listing → product detail → add to cart → register/login → checkout → order confirmation → order history.
3. Post on LinkedIn tagging `@CodeAlpha`, linking your GitHub repo and demo video.
4. Submit the repo link + LinkedIn post link via CodeAlpha's submission form.
