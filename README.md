# MAISON VALENSZO — Haute Parfumerie Malaysia

> **Artisanal Fragrance Formulations Inspired by the World’s Greatest Icons.**  
> Crafted with European perfume essences, master-blended in Malaysia, and delivered through an ultra-responsive luxury digital boutique.

[![Live Demo](https://img.shields.io/badge/Live%20Boutique-Render-000000?style=for-the-badge&logo=render&logoColor=white)](https://sales-web-un6x.onrender.com/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20Realtime-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

---

## 🌟 Overview

**VALENSZO** is an artisanal Haute Parfumerie digital platform featuring a portfolio of **345 mastercrafted creations** (116 Men's creations, 229 Women's creations, including 23 prestigious Unisex icons). 

The platform blends a high-fashion editorial aesthetic (inspired by Dior and Parisian couture) with modern e-commerce engineering, live cloud synchronization, an automated **10-Question Olfactory Diagnostic Engine**, and real-time operations management.

---

## ✨ Key Features & Enhancements

### 1. 🧪 10-Question Olfactory Diagnostic Engine (`FragranceDiagnostic.jsx`)
* **Interactive Scent Consultation:** Step-by-step diagnostic assessing scent family preferences, season/climate, day vs. evening wear, longevity & sillage goals, and personality traits.
* **Algorithmic Match Scoring:** Evaluates all 345 creations against user responses using olfactory notes, character families, and projection profiles.
* **Bespoke Presentation Card:** Unveils the shopper's **#1 Signature Fragrance Match** with match score percentage, personalized rationale, format picker (30ml, 50ml, 100ml), and 1-Click "Add to Bag", alongside **Top 3 Curated Alternatives**.

### 2. 💎 345 Individual Authentic Product Pictures
* **100% Unique Product Imagery:** Every single one of the 345 products has its own individual high-definition flacon picture matching its inspiration, bottle silhouette, and color palette.
* **Zero Duplicates:** Replaced placeholder images with authentic studio imagery for iconic fragrances including:
  * **Men:** *Sauvage (`No. 63`)*, *Aventus (`No. 12`)*, *Bleu de Chanel (`No. 49`)*, *Acqua Di Gio Profumo (`No. 2`)*, *Eros (`No. 28`)*, *1 Million (`No. 25`)*, *Tobacco Vanille (`No. 83`)*, *Imagination (`No. 105`)*, and more.
  * **Women:** *Baccarat Rouge 540 (`No. 68`)*, *Good Girl (`No. 12`)*, *Black Opium (`No. 9`)*, *Libre (`No. 10`)*, *Delina (`No. 14`)*, *J'adore (`No. 43`)*, *Angels' Share (`No. 227`)*, *Bright Crystal (`No. 2`)*, and more.

### 3. 🇲🇾 Standard Malaysian English Localization
* **Culturally Tailored Naming:** Replaced obsolete French terms (*"Pour Homme"*, *"Pour Femme"*) with standard Malaysian English wording:
  * `Men's Collection` / `Men (Lelaki)`
  * `Women's Collection` / `Women (Wanita)`
* Clean, intuitive navigation designed for local shoppers and international collectors alike.

### 4. 🧭 Streamlined Navigation & Dynamic Categorization
* **Focused Mobile Drawer:** Streamlined to primary entry points:
  * 🪄 *Find Your Scent (Olfactory Diagnostic)*
  * 👔 *Men's Collection* (Live count)
  * 👗 *Women's Collection* (Live count)
* **Dynamic Olfactory Lineup Tabs:** The main storefront dynamically renders 10 tailored scent clusters per gender:
  * **Men:** *Fresh/Aquatic/Citrus*, *Blue/Aromatic*, *Sweet/Vanilla*, *Warm Spices/Leather*, *Dark/Smoky*, *Woody/Green*, *Clean/Powdery*, *Oud/Oriental*, *Classic/Barbershop*, *Tier S Launch Icons*.
  * **Women:** *Fruity/Juicy/Tropical*, *Rose/Floral*, *Sweet/Gourmand*, *White Floral/Tuberose*, *Citrus/Fresh*, *Powdery/Clean Musk*, *Amber/Vanilla/Warm*, *Woody/Earth/Green*, *Warm Floral/Night*, *Tier S Launch Icons*.
* **100% Dynamic Counters:** Header badges and counts are dynamically computed from live inventory data (`menCount`, `womenCount`).

### 5. 🛍️ Luxury Customer Experience
* **Interactive Product Detail Modal:** Visual olfactory pyramid (Top, Heart, Base notes), longevity/sillage metrics, size selectors (30ml travel, 50ml flacon, 100ml collector), and live stock indicators.
* **Smart Couture Cart & Drawer:** Dynamic free shipping progress bar (RM200 threshold), promo code discounts (`VALENSZO10`, `VIP15`, `MAISON20`), and localized Malaysian Ringgit (`RM`) pricing.
* **Multi-Step Checkout & Live Tracking:** Order placement with simulated tracking numbers and live order lookup modal.

### 6. ⚙️ Admin & Executive Operations Portal
* **Executive KPI Dashboard:** Real-time metrics for Total Revenue, Total Orders, Pending Deliveries, Low Stock alerts, and Average Order Value (AOV).
* **Full Catalog CRUD:** Add new bespoke formulations, edit fragrance notes and pricing, restock inventory, or archive creations.
* **Order Fulfillment Pipeline:** Live status transition (`Pending` -> `Processing` -> `Shipped` -> `Delivered` -> `Cancelled`) with CSV export capabilities.

### 7. ☁️ Supabase Cloud Database & Offline Fallback
* Full persistence on **Supabase PostgreSQL** with real-time replication across devices.
* Automatic fallback to browser `localStorage` when running offline or standalone.

---

## 🛠️ Tech Stack

* **Frontend:** React 19, Vite 8.2, Lucide React, Canvas Confetti
* **State Management:** React Context API (`StoreContext.jsx`) with dynamic selectors and automated versioned caching (`v4_portfolio_345_authentic_images`)
* **Backend / Database:** Supabase (PostgreSQL), Realtime Subscriptions, Row Level Security (RLS)
* **Styling:** Bespoke Couture CSS (`dior-luxury` theme, Bodoni Moda, Cinzel, Montserrat typography)
* **Hosting:** Render (Automated CI/CD from `main` branch)

---

## 🚀 Quick Start (Local Development)

### 1. Clone the Repository
```bash
git clone https://github.com/umarfarid97/sales-web.git
cd sales-web
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=https://tzrmbinkjkaewdnokqlo.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Build for Production
```bash
npm run build
```

---

## 🗄️ Supabase Cloud Database Schema

To initialize or verify the PostgreSQL database on Supabase:

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

-- 4. Access Policies
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

---

## 🌐 Deployment to Render

The boutique is deployed on **Render** with continuous deployment on push to `main`:

1. **Service Type:** Static Site
2. **Build Command:** `npm install && npm run build`
3. **Publish Directory:** `dist`
4. **Environment Variables:**
   * `VITE_SUPABASE_URL`
   * `VITE_SUPABASE_ANON_KEY`
5. **Live Production URL:** **[https://sales-web-un6x.onrender.com/](https://sales-web-un6x.onrender.com/)**

---

## 🏛️ Brand & Copyright Notice

All formulations and brand presentations are artisanal interpretations created for **Maison VALENSZO (Malaysia)**. Original designer trademarks and brand names are referenced strictly for comparative and olfactory guidance.
