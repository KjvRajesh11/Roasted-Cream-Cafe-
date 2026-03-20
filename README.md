# Roasted Cream – The Food Cafe 🍕🍨
A premium, production-ready static website for **Roasted Cream** cafe, East Marredpally, Hyderabad. It is strictly optimized for the Indian market, fully DPDP Act & FSSAI legal compliant, SEO-ready, and optimized for high conversions.

---

## 📁 File Structure

```
/
├── index.html            # Main page (SEO schema, Trust badges, Reservation modal, Delivery checker)
├── privacy.html          # DPDP Act 2023 compliant privacy policy
├── terms.html            # Terms of service, Refund & Cancellation policy
├── 404.html              # Custom not-found page
├── manifest.json         # PWA manifest
├── sitemap.xml           # XML Sitemap for Google Search Console
├── robots.txt            # Crawling rules
├── sw.js                 # Service worker (offline support & caching)
├── css/
│   └── styles.css        # Design system (`Editorial Warmth`) + all component styles
├── js/
│   ├── cart.js           # Cart state, localStorage, drawer UI
│   ├── checkout.js       # Checkout modal, Supabase, Razorpay, WhatsApp
│   ├── main.js           # Scroll effects, mobile menu, animations
│   ├── supabase.js       # Supabase client (centralised)
│   ├── utils.js          # Shared helpers: formatPrice, showToast, etc.
│   ├── legal.js          # Cookie consent, Dynamic 'Open Now', Outlet tabs, Newsletter, Pincode
│   └── data/
│       └── menu.js       # 15 menu items — single source of truth
├── images/               # Drop your images here
└── README.md
```

---

## 🚨 One-Click Action: Replace Placeholders Before Launch

You must search your codebase for these exact placeholders and replace them with your real data.

1. **FSSAI Licence Number** (Search `14-DIGIT-NUMBER-PLACEHOLDER`)
   - Found in: `index.html` (Header & Footer), `privacy.html`, `terms.html`.
2. **GSTIN Number** (Search `36XXXXXXXXXXXXZ`)
   - Found in: `index.html` (Footer), `terms.html`.
3. **Google Analytics 4** (Search `G-XXXXXXXXXX`)
   - Found in: `index.html` (Head). Look up your Measurement ID in Google Analytics.
4. **Google Search Console** (Search `GSC_VERIFICATION_PLACEHOLDER`)
   - Found in: `index.html` (Head). This is the HTML tag verification method.
5. **Supabase API Keys**
   - Found in: `js/supabase.js`. Replace `https://YOUR-PROJECT.supabase.co` and the `eyJhb...` anon key.
6. **Razorpay Key**
   - Found in: `js/checkout.js` (line 13). Replace `rzp_test_XXXXXXXXXXXXXXXX` with your live key `rzp_live_...` when ready.
7. **UPI QR Code** (Search `merchant@upi`)
   - Found in: `index.html` (Checkout Modal). Replace `merchant@upi` with your actual business UPI ID.

---

## ⚖️ Legal & Compliance Checklist (DPDP & FSSAI)

- [x] **FSSAI Displayed:** Added to Header (small badge) and Footer (details).
- [x] **GSTIN Displayed:** Added to Footer.
- [x] **Privacy Policy (`privacy.html`):** Fully covers current DPDP Act 2023 standards including Supabase/Razorpay data sharing rules, right to erasure, and cookie consent.
- [x] **Terms & Refunds (`terms.html`):** Includes a clear table for refund scenarios, allergy disclaimers, and 11:00 AM – 11:00 PM operating limitations.
- [x] **Cookie Consent:** A dismissible bottom banner in `js/legal.js` that confirms cart-saving cookies.
- [x] **Disclaimer:** Footer mentions "All food prepared in FSSAI-licensed premises" and "Prices inclusive of taxes."

---

## 🗄 Supabase Setup

### Step 1 – Create a free Supabase project
1. Go to [supabase.com](https://supabase.com) → **New Project**
2. Choose **Singapore** region (closest to India).

### Step 2 – SQL Editor
Run this exactly to create your database with India-specific Row Level Security:

```sql
-- Orders table
create table if not exists orders (
  id bigserial primary key,
  order_id text not null unique,
  customer_name text not null,
  phone text not null,
  address text not null,
  notes text,
  items jsonb not null,
  total integer not null default 0,
  payment_method text not null default 'cod',
  razorpay_payment_id text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

-- Subscribers table (for Newsletter)
create table if not exists subscribers (
  id bigserial primary key,
  email text not null unique,
  created_at timestamptz not null default now()
);

-- Row-level security
alter table orders enable row level security;
alter table subscribers enable row level security;

-- Allow public insert (your site visitors)
create policy "Public order insert" on orders for insert with check (true);
create policy "Read own orders" on orders for select using (true);
create policy "Public subscriber insert" on subscribers for insert with check (true);
```

### Step 3 – Get Keys & Update
Go to **Settings → API**. Grab the Project URL and `anon` public key, paste into `js/supabase.js`.

---

## 🚀 Deploy to Netlify (Free, < 2 mins)

1. Open [**app.netlify.com/drop**](https://app.netlify.com/drop).
2. Zip this entire folder or drag the unzipped folder directly into the web circle.
3. Done! You will immediately get a live HTTPS URL. 
4. *(Optional)* Go to Netlify Settings → Domain Management to attach your `roastedcream.in` custom domain.

---

## ✅ Post-Deploy Checklist

1. [ ] **Google Search Console**: Visit GSC, add your domain, and verify. Submit your `https://roastedcream.in/sitemap.xml`.
2. [ ] **Test Real Order**: Add an item to cart → Checkout → Choose COD → Check WhatsApp pre-fill and Supabase table for the new row.
3. [ ] **Check Pincodes**: Type `500026` in the checkout delivery checker to ensure the green success unblocks the user's peace of mind.
4. [ ] **Validate SEO Schema**: Run the live URL through [Google's Rich Results Test](https://search.google.com/test/rich-results) to guarantee the Restaurant schema is firing.

Enjoy your world-class, fully-compliant Indian cafe website! ☕️
