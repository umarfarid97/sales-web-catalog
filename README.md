# Lumina - Modern E-Commerce & Store Operations Platform

A modern e-commerce storefront and store management portal built with **React 19**, **Vite**, **Supabase (PostgreSQL)**, and **Render**.

---

## ✨ Features

- 🛍️ **Customer Storefront**:
  - Dynamic catalog with category filtering, search, and price slider
  - Color variant selector and interactive product detail modals
  - Cart drawer with promo code validation and free shipping threshold progress
  - Interactive multi-step checkout with animated confetti confirmation
  - Live order tracking modal by Tracking Number or Order ID
  - Wishlist / Favorites persistence

- ⚙️ **Admin & Operations Dashboard**:
  - Executive KPI analytics (Total Revenue, Orders, Low Stock alerts, Average Order Value)
  - Full Product Catalog CRUD (Add, Edit, Delete, Restock inventory)
  - Live Order Fulfillment management with status progression
  - CSV Order export utility

- ☁️ **Supabase Cloud Database & Realtime**:
  - Powered by Supabase PostgreSQL
  - Real-time bi-directional synchronization across multiple devices/tabs
  - Automatic fallback to browser `localStorage` when offline or in standalone mode

---

## 🚀 Quick Start (Local Development)

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run dev server**:
   ```bash
   npm run dev
   ```

---

## 🗄️ Supabase Cloud Database Setup

### Step 1: Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a free project.
2. In your Supabase dashboard, open the **SQL Editor** -> **New query**.

### Step 2: Run SQL Schema
Paste and run the following script:

```sql
-- 1. Create Products Table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  sku TEXT,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  discount_percent NUMERIC DEFAULT 0,
  stock INTEGER DEFAULT 0,
  rating NUMERIC DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 0,
  badge TEXT,
  is_featured BOOLEAN DEFAULT false,
  colors JSONB DEFAULT '[]'::jsonb,
  features JSONB DEFAULT '[]'::jsonb,
  specs JSONB DEFAULT '{}'::jsonb,
  images JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  customer JSONB NOT NULL,
  items JSONB NOT NULL,
  subtotal NUMERIC NOT NULL,
  discount NUMERIC DEFAULT 0,
  discount_code TEXT,
  shipping NUMERIC DEFAULT 0,
  total NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending',
  payment_method TEXT,
  placed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  delivered_at TIMESTAMP WITH TIME ZONE,
  tracking_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 4. Enable Public Store Access Policies
CREATE POLICY "Allow public read on products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public insert on products" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on products" ON products FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on products" ON products FOR DELETE USING (true);

CREATE POLICY "Allow public read on orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Allow public insert on orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on orders" ON orders FOR UPDATE USING (true);

-- 5. Enable Realtime Replication
ALTER PUBLICATION supabase_realtime ADD TABLE products;
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
```

### Step 3: Configure Environment Variables
Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-public-key
```
*(You can find these in Supabase under **Project Settings** -> **API**).*

---

## 🌐 Deploy to Render

1. Go to [render.com](https://render.com) and click **New +** -> **Static Site**.
2. Connect your GitHub repository (`sales-web`).
3. Set configuration:
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Under **Environment**, add:
   - `VITE_SUPABASE_URL` = `<your_supabase_url>`
   - `VITE_SUPABASE_ANON_KEY` = `<your_supabase_anon_key>`
5. Click **Create Static Site**.
