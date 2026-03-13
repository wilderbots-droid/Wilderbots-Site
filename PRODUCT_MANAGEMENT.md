# Dynamic Product Management Setup

This guide explains the dynamic product management system that was implemented for your ProductSection component.

## Overview

Your `ProductSection.jsx` component now fetches product details dynamically from your MongoDB database through an API endpoint. This means any changes made in the Admin panel will automatically reflect on the frontend without code changes.

## What Was Created

### 1. **Product Model** (`models/Product.js`)
MongoDB schema for storing product details:
- `title` - Main product title (e.g., "Not just a Watch. It's a Workshop.")
- `subtitle` - Product subtitle/tagline
- `edition` - Edition name (e.g., "Development Kit Edition")
- `engineeredBy` - Secondary heading text
- `description` - Detailed product description
- `price` - Product price (numeric)
- `image` - Image URL/path
- `isActive` - Boolean to enable/disable the product

### 2. **API Endpoints**

#### Public Endpoint
**`GET /api/product`**
- Fetches the active product details
- Returns the first active product from the database
- Used by the frontend to display product information
- No authentication required

#### Admin Endpoint
**`GET/POST/PUT/DELETE /api/admin/products`**
- Full CRUD operations for managing products
- Requires admin authentication (Bearer token)
- Admin-only access

### 3. **Frontend Component Updates** (`views/components/ProductSection.jsx`)
Updated to:
- Import `useEffect` hook for data fetching
- Create `product` state to store fetched data
- Fetch product details on component mount
- Display product data dynamically with fallback values
- All hardcoded values replaced with dynamic ones

### 4. **Admin Components**

#### AdminProducts (`views/components/AdminProducts.jsx`)
New admin interface for managing products:
- View all products in a table
- Add new products
- Edit existing products
- Delete products
- Toggle product active status
- Search/filter products

#### Updated AdminDashboard (`views/components/AdminDashboard.jsx`)
- Added "Products" tab in the admin navigation
- Integrated AdminProducts component
- Added menu item with proper styling

## Setup Instructions

### Step 1: Seed the Default Product

Run the seed script to create a default product in your database:

```bash
node scripts/seed-product.js
```

This will create a default product with the original hardcoded values.

### Step 2: Verify the API Works

Test the public API endpoint:

```bash
curl http://localhost:3000/api/product
```

You should receive a JSON response with the product details.

### Step 3: Access the Admin Panel

1. Log in to your admin panel
2. Navigate to the new "Products" tab in the sidebar
3. You should see the default product listed
4. You can now edit, add, or delete products

## How to Use the Admin Panel

### Adding a New Product

1. Click the "Add Product" button
2. Fill in all required fields:
   - **Title**: Main product heading
   - **Subtitle**: Product tagline
   - **Edition**: Edition name (optional)
   - **Engineered By**: Secondary heading (optional)
   - **Description**: Detailed description
   - **Price**: Product price in dollars
   - **Image**: Path/URL to product image
3. Toggle "Active" to enable/disable
4. Click "Save Product"

### Editing a Product

1. Find the product in the table
2. Click the Edit (pencil) icon
3. Modify the fields
4. Click "Save Product"

### Deleting a Product

1. Find the product in the table
2. Click the Delete (trash) icon
3. Confirm the deletion

## How the Frontend Works

The ProductSection component follows these steps:

1. **Component Mount**: When the page loads, `useEffect` triggers
2. **API Call**: Fetches product data from `/api/product`
3. **State Update**: Stores fetched data in `product` state
4. **Render**: Displays product details with fallback values if data isn't loaded

### Example Flow

```javascript
// When component loads:
useEffect(() => {
  fetchProductDetails()
}, [])

// Fetch function:
const fetchProductDetails = async () => {
  try {
    const response = await fetch('/api/product')
    const data = await response.json()
    setProduct(data)
  } catch (error) {
    console.error('Error fetching product details:', error)
    // Falls back to default values
  }
}

// Rendering with fallback:
<h2>{product.title || 'Not just a Watch.<br/>It\'s a Workshop.'}</h2>
<Image src={product.image || '/kit.png'} alt="..." />
<button>Pre-order Kit (${product.price || '299'})</button>
```

## File Structure

```
models/
  └── Product.js (NEW)

pages/api/
  ├── product.js (NEW)
  └── admin/
      └── products.js (NEW)

views/components/
  ├── ProductSection.jsx (UPDATED)
  ├── AdminProducts.jsx (NEW)
  └── AdminDashboard.jsx (UPDATED)

scripts/
  └── seed-product.js (NEW)
```

## Important Notes

1. **Image URLs**: Make sure to use valid image URLs. For local images, use paths like `/kit.png` (from public folder)

2. **HTML in Text**: The `engineeredBy` field supports HTML (like `<br/>`), but be careful with user input

3. **Active Products**: The API only returns the first active product. If you need multiple products, modify the API endpoint accordingly

4. **Fallback Values**: If data fails to load, the component uses sensible defaults (the original hardcoded values)

5. **Admin Authentication**: The admin endpoints require a valid admin token in the Authorization header

## Future Enhancements

If you want to expand this system:

1. **Multiple Products**: Change the API to return multiple products
2. **Product Categories**: Add category field to organize products
3. **Variants**: Add size/color variants
4. **Inventory**: Track stock levels
5. **Featured Products**: Add a "featured" flag to highlight products
6. **Image Upload**: Add image upload functionality instead of URL inputs

## Troubleshooting

### Product not showing on frontend
- Check browser console for fetch errors
- Verify the API endpoint is returning data: `GET /api/product`
- Ensure at least one product is marked as "active" in the admin panel

### Admin panel not loading products
- Verify you're logged in as an admin
- Check that your admin token is valid
- Check browser console for authentication errors

### Changes not reflecting immediately
- Refresh the page to fetch latest data
- Check browser cache (may need to clear)
- Verify the database update was successful

## Support

For questions or issues with this setup, check:
1. Browser console (F12) for error messages
2. Server logs for API errors
3. MongoDB database to verify data is being saved
