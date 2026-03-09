# Quick Start: Dynamic Products Setup

## 🚀 Quick Start (5 minutes)

### 1. Initialize Database
```bash
node scripts/seed-product.js
```
✅ Creates default product with your existing content

### 2. Verify It Works
Visit: `http://localhost:3000` (your product page should load normally)

### 3. Update Products via Admin
- Go to Admin Panel → Login
- Click **"Products"** in the sidebar
- Edit the product details
- Click **"Save Product"**
- Refresh the product page to see changes

---

## 📝 What Changed?

| Field | Frontend | Admin Panel |
|-------|----------|-------------|
| Title | `{product.title}` | Text input |
| Subtitle | `{product.subtitle}` | Text input |
| Edition | `{product.edition}` | Text input |
| Engineered By | `{product.engineeredBy}` | Text input |
| Description | `{product.description}` | Textarea |
| Price | `${product.price}` | Number input |
| Image | `src={product.image}` | URL input |

---

## 🔧 API Reference

### Get Product Data (Frontend)
```bash
GET /api/product
```
Returns:
```json
{
  "_id": "...",
  "title": "Not just a Watch. It's a Workshop.",
  "subtitle": "The Wilder Watch Development Kit...",
  "edition": "Development Kit Edition",
  "engineeredBy": "Engineered by You.",
  "description": "...",
  "price": 299,
  "image": "/kit.png"
}
```

### Manage Products (Admin Only)
```bash
GET /api/admin/products          # List all
POST /api/admin/products         # Create
PUT /api/admin/products?id=ID    # Update
DELETE /api/admin/products?id=ID # Delete
```
*Requires: Authorization header with admin token*

---

## 🎯 Common Tasks

### Change Product Price
1. Admin Panel → Products
2. Edit the product
3. Change "Price ($)" field
4. Save Product
5. Refresh frontend

### Change Product Image
1. Admin Panel → Products
2. Edit the product
3. Change "Image URL" field (e.g., `/watch.png`)
4. Save Product
5. Refresh frontend

### Add New Product
1. Admin Panel → Products
2. Click "Add Product"
3. Fill all fields
4. Click "Save Product"
5. (Optional) Change which product is "Active" if you want to switch displayed product

---

## ❓ FAQ

**Q: Do I need to restart the server?**
A: No! Changes are live in the database. Just refresh the page.

**Q: Can I have multiple products?**
A: Yes, but the frontend displays only the first "Active" product. You can toggle which one is active in the admin panel.

**Q: What if the product doesn't load?**
A: Check browser console (F12). Common issues:
- No active product in database
- Typo in image URL
- API connection error

**Q: Can I add HTML formatting?**
A: The `engineeredBy` field supports HTML like `<br/>`, but regular description is plain text.

---

## 📂 Files Created

```
✓ models/Product.js
✓ pages/api/product.js
✓ pages/api/admin/products.js
✓ views/components/AdminProducts.jsx
✓ scripts/seed-product.js
✓ PRODUCT_MANAGEMENT.md (detailed docs)
✓ PRODUCT_DYNAMIC_SETUP.md (this guide)
```

---

## ✅ You're All Set!

Your ProductSection is now fully dynamic. The hardcoded content:
```javascript
"Not just a Watch… Wilder Watch Development Kit… Pre-order Kit ($299)"
```

...is now managed from your Admin Panel! 🎉

Go to **Admin Panel → Products** to start editing!
